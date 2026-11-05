/**
 * CraftsVeda™ FlippingBook-Style 3D PageFlip Viewer Engine
 * 100% In-Browser Private Processing (Zero Server Storage)
 * Features:
 *   - Audio Page-Turn Sound Synthesizer (Web Audio API)
 *   - Side Floating FlippingBook Navigation (< and >) & Jump to ends (|< and >|)
 *   - Dynamic Aspect Ratio (A4, A5, A3, 8.5x11", 9x11", Square, Custom + Auto PDF Detect)
 *   - 3 Bindings: Center Pin (Staples), Hard Case Silai (Thread), Back-to-Back Layflat
 *   - Slide-up Thumbnails Drawer & Slide-out Table of Contents
 *   - Zoom In / Fit & Fullscreen Controls
 *   - Auto-Play Slideshow
 */

(function () {
  'use strict';

  // Configure PDF.js Worker
  if (window.pdfjsLib) {
    window.pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  }

  // --- AUDIO SYNTHESIZER FOR REALISTIC PAGE FLIP ---
  let audioCtx = null;
  function playPageFlipSound() {
    if (!state.soundEnabled) return;
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const bufferSize = audioCtx.sampleRate * 0.15; // 150ms swoosh
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);

      // Pinkish noise for paper rustle
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        data[i] = (b0 + b1 + b2) * 0.18;
      }

      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, audioCtx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(2400, audioCtx.currentTime + 0.12);
      filter.Q.value = 1.2;

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.35, audioCtx.currentTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.14);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      noise.start();
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  // --- STATE ---
  const state = {
    pages: [],
    totalPages: 20,
    currentSpread: 1,
    totalSpreads: 10,
    sizePreset: 'a4',
    orientation: 'portrait',
    binding: 'center-pin',
    autoDetectedRatio: null,
    isFlipping: false,
    soundEnabled: true,
    isZoomed: false,
    autoPlayTimer: null,
    pdfDoc: null
  };

  const PRESET_DIMENSIONS = {
    a4: { w: 210, h: 297, name: 'A4' },
    a5: { w: 148, h: 210, name: 'A5' },
    a3: { w: 297, h: 420, name: 'A3' },
    letter: { w: 8.5, h: 11, name: '8.5" × 11"' },
    album: { w: 9, h: 11, name: '9" × 11"' },
    square: { w: 8, h: 8, name: 'Square' }
  };

  // --- DOM ELEMENTS ---
  const el = {
    container: document.getElementById('fullscreenContainer'),
    assembly: document.getElementById('handbookAssembly'),
    pageLeft: document.getElementById('pageLeft'),
    pageRight: document.getElementById('pageRight'),
    leftArt: document.getElementById('leftInnerArt'),
    rightArt: document.getElementById('rightInnerArt'),
    leftPageNum: document.getElementById('leftPageNum'),
    rightPageNum: document.getElementById('rightPageNum'),
    stackLeft: document.getElementById('stackLeft'),
    stackRight: document.getElementById('stackRight'),
    docTitle: document.getElementById('fbDocTitle'),
    pageCounter: document.getElementById('fbPageCounter'),
    fileInput: document.getElementById('pdfFileInput'),
    btnUpload: document.getElementById('btnUploadTrigger'),
    btnDemo: document.getElementById('btnLoadA4Demo'),
    sizeSelect: document.getElementById('sizePresetSelect'),
    btnPortrait: document.getElementById('btnPortrait'),
    btnLandscape: document.getElementById('btnLandscape'),
    bindingChips: document.querySelectorAll('.chip-binding'),
    btnSidePrev: document.getElementById('btnSidePrev'),
    btnSideNext: document.getElementById('btnSideNext'),
    btnJumpFirst: document.getElementById('btnJumpFirst'),
    btnJumpLast: document.getElementById('btnJumpLast'),
    scrubber: document.getElementById('fbPageScrubber'),
    btnSound: document.getElementById('btnToggleSound'),
    soundIcon: document.getElementById('soundIcon'),
    btnZoom: document.getElementById('btnToggleZoom'),
    zoomIcon: document.getElementById('zoomIcon'),
    btnFullscreen: document.getElementById('btnToggleFullscreen'),
    btnAutoPlay: document.getElementById('btnAutoPlay'),
    autoPlayIcon: document.getElementById('autoPlayIcon'),
    btnToggleThumbnails: document.getElementById('btnToggleThumbnails'),
    drawerThumbnails: document.getElementById('thumbnailsDrawer'),
    gridThumbnails: document.getElementById('thumbnailsGrid'),
    btnCloseThumbnails: document.getElementById('btnCloseThumbnails'),
    btnToggleToc: document.getElementById('btnToggleToc'),
    drawerToc: document.getElementById('tocDrawer'),
    listToc: document.getElementById('tocList'),
    btnCloseToc: document.getElementById('btnCloseToc')
  };

  // --- COMPUTE SPREAD ASPECT RATIO ---
  function computeSpreadRatio() {
    if (state.sizePreset === 'auto' && state.autoDetectedRatio) {
      return state.autoDetectedRatio;
    }

    const dims = PRESET_DIMENSIONS[state.sizePreset] || PRESET_DIMENSIONS.a4;
    let singleW, singleH;

    if (state.orientation === 'portrait') {
      singleW = Math.min(dims.w, dims.h);
      singleH = Math.max(dims.w, dims.h);
    } else {
      singleW = Math.max(dims.w, dims.h);
      singleH = Math.min(dims.w, dims.h);
    }

    // Two pages open side-by-side
    return (2 * singleW) / singleH;
  }

  function applyGeometry() {
    const ratio = computeSpreadRatio();
    el.assembly.style.setProperty('--spread-aspect-ratio', ratio.toFixed(3));

    if (ratio > 2.2) {
      el.assembly.style.maxWidth = '1120px';
    } else {
      el.assembly.style.maxWidth = '980px';
    }
  }

  // --- DYNAMIC PAGE STACK DEPTH ---
  function updateStackDepth() {
    const currentLeftPage = (state.currentSpread - 1) * 2;
    const total = state.totalPages || 20;

    const maxDepth = 18;
    const leftFraction = Math.max(0, Math.min(1, currentLeftPage / total));
    const rightFraction = Math.max(0, Math.min(1, (total - currentLeftPage) / total));

    const leftDepth = Math.max(2, Math.round(leftFraction * maxDepth));
    const rightDepth = Math.max(2, Math.round(rightFraction * maxDepth));

    el.assembly.style.setProperty('--stack-l-depth', `${leftDepth}px`);
    el.assembly.style.setProperty('--stack-r-depth', `${rightDepth}px`);
  }

  // --- 20-PAGE SAMPLE HANDBOOK DATA ---
  const DEMO_PAGES_META = [
    { title: "CraftsVeda Atelier Mumbai", sub: "Master Handbook of Haute Impression & Fine Bookbinding", type: "cover" },
    { ch: "Chapter 01", title: "Philosophy of Bespoke Print", p1: "At CraftsVeda, print is an architectural expression of luxury brand identity.", p2: "Every GSM rating and foil micron depth is calibrated with micron precision in Lower Parel.", box: "Standard: 100% Pantone solid ink matching under D50 daylight." },
    { ch: "Chapter 02", title: "Curated European Stocks", p1: "Imported virgin pulp stocks from century-old Italian and German mills.", p2: "Gmund, Fedrigoni Materica, and Arjowiggins Conqueror up to 1200 GSM duplexed sheets.", box: "Finishes: Rough Felt, Linen, Laid, Smooth Vellum, Suede." },
    { ch: "Chapter 03", title: "Center Pin (Saddle Stitch)", p1: "The timeless booklet finishing: dual electro-plated silver staples through the center fold.", p2: "Ideal for lookbooks, catalogues, and corporate profiles from 8 to 48 pages.", box: "Staples: Stainless Chrome, Matte Black Wire, or Copper-Brass." },
    { ch: "Chapter 04", title: "Center Pin Gutter Physics", p1: "We apply automatic page creep compensation so that outer trims remain flush without margin shear.", p2: "Each signature folds naturally with zero spine cracking.", box: "Creep Compensation: 0.12mm stepped trim per 4-page signature." },
    { ch: "Chapter 05", title: "Hard Case Section Silai", p1: "The gold standard of heirloom archival books. Signatures are physically sewn with cotton-linen thread.", p2: "Bound within rigid 3.5mm Dutch kappa board with head & tail bands and silk ribbons.", box: "Structure: Smyth sewn sections or French link stitch." },
    { ch: "Chapter 06", title: "Section Silai Valley Crease", p1: "Notice the deep valley fold in the center gutter. Each signature holds its own tension comfortably.", p2: "Rated for 100+ years of library archival life without glue brittleness.", box: "Spine Hinge: Precision scored joint groove for smooth turning." },
    { ch: "Chapter 07", title: "Back-to-Back Pasting Layflat", p1: "For panoramic spreads, luxury dossiers, and bridal archives where zero detail can be lost.", p2: "Each sheet is printed single-side and bonded back-to-back with archival adhesive.", box: "Key Advantage: 100% Flat 180° spread with ZERO center pin & ZERO silai visible." },
    { ch: "Chapter 08", title: "Seamless Panoramic Transition", p1: "Architectural blueprints and wide-angle photography flow across both pages seamlessly.", p2: "Virtually invisible gutter join provides an uninterrupted double-page canvas.", box: "Substrate: 300 GSM Art Card bonded into an ultra-rigid 600 GSM leaf." },
    { ch: "Chapter 09", title: "Artisanal Hot Foil Gilding", p1: "Heated magnesium and brass dies under 2.5 tons of mechanical pressure for deep bite.", p2: "Available in Kurz Luxor gold, champagne, deep copper, and security foils.", box: "Precision: 0.1pt ultra-fine hairline foil stamping capability." },
    { ch: "Chapter 10", title: "Blind Debossing & Letterpress", p1: "Crisp tactile indentation catching natural light and shadow without pigment.", p2: "Ideal for monograms, architectural emblems, and luxury brand crests.", box: "Impression: Up to 0.45mm deep sculptural bite." },
    { ch: "Chapter 11", title: "Specialty Screen Embellishments", p1: "High-build tactile UV varnish and pearlescent screen inks.", p2: "Irresistible contrast against velvet soft-touch laminate coatings.", box: "UV Height: Up to 60-micron raised gloss polymer." },
    { ch: "Chapter 12", title: "Pantone Ink Laboratory", p1: "Custom Pantone inks mixed by weight on Sartorius analytical scales.", p2: "Identical corporate color rendition across coated, uncoated, and kraft stocks.", box: "Delta-E Tolerance: ΔE < 1.5 color deviation under spectrophotometer." },
    { ch: "Chapter 13", title: "Hardcover Bookcloth & Leathers", p1: "Wrapped with premium bookcloths from Winter & Company, Buckram, and Italian bonded leather.", p2: "Water-resistant, stain-resistant, and foil-stamp receptive.", box: "Spines: Square spine, rounded library spine, or exposed Swiss binding." },
    { ch: "Chapter 14", title: "Endpapers & Dust Jackets", p1: "Reinforced 180 GSM unprinted or custom illustrated endpapers connecting book block to board.", p2: "Optional French-fold dust jackets with matte scratch-resistant lamination.", box: "Options: Keaykolour or metallic Sirio Pearl." },
    { ch: "Chapter 15", title: "Sustainability & FSC", p1: "Sourced from responsibly managed forests adhering to FSC Mix protocols.", p2: "Soy-based vegetable printing inks with zero VOC emissions.", box: "Eco Standard: 100% biodegradable and acid-free." },
    { ch: "Chapter 16", title: "Turnaround & Atelier Dispatch", p1: "Rush prototypes crafted in 24 to 48 hours for brand director approvals.", p2: "Delivered across Mumbai, BKC, and global destinations in archival boxes.", box: "Direct WhatsApp hotline with master bindery supervisors." },
    { ch: "Chapter 17", title: "Handbook Specifications", p1: "Formats: A4 / A5 / A3 / Letter / Album / Square.", p2: "Bindings: Center Pin, Section Silai Hard Case, Back-to-Back Layflat.", box: "File Format: 300 DPI PDF with 3mm bleed." },
    { ch: "Chapter 18", title: "Atelier Consultations", p1: "Review paper dummies, foil test cards, and binding samples in Lower Parel or Fort.", p2: "Tailored quote and finishing advice from master craftsmen.", box: "Contact: +91 8840035249 | vkzway2@gmail.com" },
    { title: "CraftsVeda™ Atelier Guild", sub: "Mumbai • Established 2026 • Master Printing & Fine Bookbinding", type: "backcover" }
  ];

  function generateA4DemoPages() {
    const pages = [];
    DEMO_PAGES_META.forEach((item, index) => {
      const pageNum = index + 1;
      pages.push({
        type: 'html',
        pageNum: pageNum,
        title: item.title,
        render: (container) => {
          if (item.type === 'cover' || item.type === 'backcover') {
            container.innerHTML = `
              <div class="sample-page-sheet cover">
                <span class="sample-cover-badge">CRAFTSVEDA ATELIER</span>
                <h1 class="sample-cover-title">${item.title}</h1>
                <p class="sample-cover-sub">${item.sub}</p>
                <div style="font-size:0.75rem; letter-spacing:0.1em; color:var(--fb-accent);">
                  ${item.type === 'cover' ? 'PAGE 01 • MASTER EDITION' : 'LOWER PAREL & FORT • MUMBAI'}
                </div>
              </div>
            `;
          } else {
            container.innerHTML = `
              <div class="sample-page-sheet">
                <div class="sample-sheet-header">
                  <span class="sample-chapter">${item.ch || 'CRAFTSVEDA'}</span>
                  <span class="sample-folio">${pageNum}</span>
                </div>
                <div class="sample-sheet-body">
                  <h2 class="sample-h2">${item.title}</h2>
                  <p class="sample-p">${item.p1}</p>
                  <p class="sample-p">${item.p2}</p>
                  <div class="sample-feature-card">${item.box}</div>
                </div>
                <div class="sample-sheet-footer">
                  <span>CraftsVeda Atelier Guild</span>
                  <span>A4 Handbook Preview</span>
                </div>
              </div>
            `;
          }
        }
      });
    });

    state.pages = pages;
    state.totalPages = pages.length;
    state.totalSpreads = Math.ceil(pages.length / 2);
    state.currentSpread = 1;
    el.docTitle.textContent = "CraftsVeda Master Handbook";

    buildDrawers();
    renderSpread(1);
  }

  // --- BUILD THUMBNAILS & TOC DRAWERS ---
  function buildDrawers() {
    // Thumbnails Grid
    el.gridThumbnails.innerHTML = '';
    for (let s = 1; s <= state.totalSpreads; s++) {
      const p1 = (s - 1) * 2 + 1;
      const p2 = Math.min(p1 + 1, state.totalPages);
      const card = document.createElement('div');
      card.className = `thumb-card ${s === state.currentSpread ? 'active' : ''}`;
      card.innerHTML = `
        <span style="font-size:1.2rem; opacity:0.6;">📖</span>
        <span class="thumb-mini-label">${p1}-${p2}</span>
      `;
      card.addEventListener('click', () => {
        renderSpread(s);
        el.drawerThumbnails.classList.remove('open');
      });
      el.gridThumbnails.appendChild(card);
    }

    // TOC List
    el.listToc.innerHTML = '';
    state.pages.forEach((p, idx) => {
      const spreadIdx = Math.floor(idx / 2) + 1;
      const item = document.createElement('div');
      item.className = `toc-item ${spreadIdx === state.currentSpread ? 'active' : ''}`;
      item.innerHTML = `
        <span>${p.title || `Page ${p.pageNum}`}</span>
        <span class="toc-page-num">p. ${p.pageNum}</span>
      `;
      item.addEventListener('click', () => {
        renderSpread(spreadIdx);
        el.drawerToc.classList.remove('open');
      });
      el.listToc.appendChild(item);
    });
  }

  function updateActiveThumbnails() {
    const cards = el.gridThumbnails.querySelectorAll('.thumb-card');
    cards.forEach((c, idx) => {
      if (idx + 1 === state.currentSpread) {
        c.classList.add('active');
        c.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } else {
        c.classList.remove('active');
      }
    });

    const tocItems = el.listToc.querySelectorAll('.toc-item');
    tocItems.forEach((t, idx) => {
      const spreadIdx = Math.floor(idx / 2) + 1;
      if (spreadIdx === state.currentSpread) {
        t.classList.add('active');
      } else {
        t.classList.remove('active');
      }
    });
  }

  // --- RENDER SPREAD ---
  function renderSpread(spreadIdx) {
    state.currentSpread = Math.max(1, Math.min(spreadIdx, state.totalSpreads));
    const leftPageIdx = (state.currentSpread - 1) * 2;
    const rightPageIdx = leftPageIdx + 1;

    el.leftArt.innerHTML = '';
    el.rightArt.innerHTML = '';

    // Left Page
    if (leftPageIdx < state.pages.length) {
      const leftPageData = state.pages[leftPageIdx];
      el.leftPageNum.textContent = leftPageData.pageNum || (leftPageIdx + 1);
      leftPageData.render(el.leftArt);
      el.pageLeft.style.visibility = 'visible';
    } else {
      el.leftPageNum.textContent = '';
      el.pageLeft.style.visibility = 'hidden';
    }

    // Right Page
    if (rightPageIdx < state.pages.length) {
      const rightPageData = state.pages[rightPageIdx];
      el.rightPageNum.textContent = rightPageData.pageNum || (rightPageIdx + 1);
      rightPageData.render(el.rightArt);
      el.pageRight.style.visibility = 'visible';
    } else {
      el.rightPageNum.textContent = '';
      el.pageRight.style.visibility = 'hidden';
    }

    // FlippingBook Counter format: "pages 1 - 2 of 20"
    const p1 = leftPageIdx + 1;
    const p2 = Math.min(p1 + 1, state.totalPages);
    el.pageCounter.textContent = `pages ${p1} - ${p2} of ${state.totalPages}`;

    // Scrubber
    el.scrubber.min = 1;
    el.scrubber.max = state.totalSpreads;
    el.scrubber.value = state.currentSpread;

    // Disabled states
    const isAtStart = (state.currentSpread <= 1);
    const isAtEnd = (state.currentSpread >= state.totalSpreads);

    el.btnSidePrev.disabled = isAtStart;
    el.btnJumpFirst.disabled = isAtStart;
    el.btnSideNext.disabled = isAtEnd;
    el.btnJumpLast.disabled = isAtEnd;

    updateStackDepth();
    updateActiveThumbnails();
  }

  // --- FLIP ANIMATIONS WITH AUDIO ---
  function flipNext() {
    if (state.isFlipping || state.currentSpread >= state.totalSpreads) return;
    state.isFlipping = true;
    playPageFlipSound();

    el.pageRight.classList.add('flipping-forward');
    setTimeout(() => {
      renderSpread(state.currentSpread + 1);
      el.pageRight.classList.remove('flipping-forward');
      state.isFlipping = false;
    }, 280);
  }

  function flipPrev() {
    if (state.isFlipping || state.currentSpread <= 1) return;
    state.isFlipping = true;
    playPageFlipSound();

    el.pageLeft.classList.add('flipping-backward');
    setTimeout(() => {
      renderSpread(state.currentSpread - 1);
      el.pageLeft.classList.remove('flipping-backward');
      state.isFlipping = false;
    }, 280);
  }

  // --- PDF LOADER (IN-BROWSER) ---
  async function loadPdfFile(file) {
    if (!window.pdfjsLib) {
      alert('PDF Engine is initializing. Please retry in a few moments.');
      return;
    }

    try {
      el.pageCounter.textContent = 'Rendering PDF...';
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      state.pdfDoc = pdf;

      const numPages = pdf.numPages;
      const pages = [];

      // Auto aspect ratio from first page
      const firstPage = await pdf.getPage(1);
      const vp = firstPage.getViewport({ scale: 1.0 });
      const pageWidth = vp.width;
      const pageHeight = vp.height;

      state.autoDetectedRatio = (2 * pageWidth) / pageHeight;

      if (pageWidth > pageHeight) {
        state.orientation = 'landscape';
        el.btnLandscape.classList.add('active');
        el.btnPortrait.classList.remove('active');
      } else {
        state.orientation = 'portrait';
        el.btnPortrait.classList.add('active');
        el.btnLandscape.classList.remove('active');
      }

      state.sizePreset = 'auto';
      el.sizeSelect.value = 'auto';
      applyGeometry();

      for (let i = 1; i <= numPages; i++) {
        const pageNumber = i;
        pages.push({
          type: 'canvas',
          pageNum: pageNumber,
          title: `Page ${pageNumber}`,
          render: async (container) => {
            const page = await pdf.getPage(pageNumber);
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const scale = 1.8;
            const viewport = page.getViewport({ scale: scale });

            canvas.width = viewport.width;
            canvas.height = viewport.height;
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            canvas.style.objectFit = 'contain';

            await page.render({ canvasContext: ctx, viewport: viewport }).promise;
            container.appendChild(canvas);
          }
        });
      }

      state.pages = pages;
      state.totalPages = numPages;
      state.totalSpreads = Math.ceil(numPages / 2);
      state.currentSpread = 1;

      el.docTitle.textContent = file.name.replace(/\.[^/.]+$/, "");
      buildDrawers();
      renderSpread(1);

    } catch (err) {
      console.error('Error rendering PDF:', err);
      alert('Unable to render PDF. Please ensure the file is valid and unencrypted.');
      el.pageCounter.textContent = 'Error Loading PDF';
    }
  }

  // --- MULTIPLE IMAGES TO BOOK ---
  function loadImages(files) {
    const validImages = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (!validImages.length) return;

    validImages.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));

    const pages = [];
    validImages.forEach((imgFile, index) => {
      const pageNum = index + 1;
      const objectUrl = URL.createObjectURL(imgFile);

      pages.push({
        type: 'image',
        pageNum: pageNum,
        title: imgFile.name,
        render: (container) => {
          const img = document.createElement('img');
          img.src = objectUrl;
          img.alt = `Page ${pageNum}`;
          img.style.width = '100%';
          img.style.height = '100%';
          img.style.objectFit = 'contain';
          container.appendChild(img);
        }
      });
    });

    state.pages = pages;
    state.totalPages = pages.length;
    state.totalSpreads = Math.ceil(pages.length / 2);
    state.currentSpread = 1;
    el.docTitle.textContent = `Portfolio (${validImages.length} Images)`;

    buildDrawers();
    renderSpread(1);
  }

  // --- BINDING SWITCHER ---
  function setBinding(bindingName) {
    state.binding = bindingName;
    el.assembly.setAttribute('data-binding', bindingName);

    el.bindingChips.forEach(chip => {
      if (chip.getAttribute('data-binding') === bindingName) {
        chip.classList.add('active');
      } else {
        chip.classList.remove('active');
      }
    });
  }

  window.selectBindingPreset = function (bindingName) {
    setBinding(bindingName);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- EVENT LISTENERS ---
  function initEvents() {
    // Upload Triggers
    el.btnUpload.addEventListener('click', () => el.fileInput.click());
    el.fileInput.addEventListener('change', (e) => {
      const files = e.target.files;
      if (!files || !files.length) return;
      if (files[0].type === 'application/pdf') {
        loadPdfFile(files[0]);
      } else {
        loadImages(files);
      }
    });

    // Demo Button
    el.btnDemo.addEventListener('click', () => {
      state.sizePreset = 'a4';
      state.orientation = 'portrait';
      el.sizeSelect.value = 'a4';
      el.btnPortrait.classList.add('active');
      el.btnLandscape.classList.remove('active');
      applyGeometry();
      generateA4DemoPages();
    });

    // Drag and Drop
    ['dragenter', 'dragover'].forEach(name => {
      document.body.addEventListener(name, (e) => {
        e.preventDefault();
        e.stopPropagation();
      }, false);
    });

    document.body.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const files = e.dataTransfer.files;
      if (!files || !files.length) return;
      if (files[0].type === 'application/pdf') {
        loadPdfFile(files[0]);
      } else {
        loadImages(files);
      }
    });

    // Size Preset change
    el.sizeSelect.addEventListener('change', (e) => {
      state.sizePreset = e.target.value;
      applyGeometry();
    });

    // Orientation toggle
    el.btnPortrait.addEventListener('click', () => {
      state.orientation = 'portrait';
      el.btnPortrait.classList.add('active');
      el.btnLandscape.classList.remove('active');
      applyGeometry();
    });

    el.btnLandscape.addEventListener('click', () => {
      state.orientation = 'landscape';
      el.btnLandscape.classList.add('active');
      el.btnPortrait.classList.remove('active');
      applyGeometry();
    });

    // Binding Chips
    el.bindingChips.forEach(chip => {
      chip.addEventListener('click', () => {
        setBinding(chip.getAttribute('data-binding'));
      });
    });

    // Page Flips
    el.btnSidePrev.addEventListener('click', flipPrev);
    el.btnSideNext.addEventListener('click', flipNext);
    el.pageLeft.addEventListener('click', flipPrev);
    el.pageRight.addEventListener('click', flipNext);

    // Jump to ends
    el.btnJumpFirst.addEventListener('click', () => {
      if (state.currentSpread > 1) {
        playPageFlipSound();
        renderSpread(1);
      }
    });

    el.btnJumpLast.addEventListener('click', () => {
      if (state.currentSpread < state.totalSpreads) {
        playPageFlipSound();
        renderSpread(state.totalSpreads);
      }
    });

    // Keyboard Arrow Keys
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        flipNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        flipPrev();
      } else if (e.key === 'Home') {
        renderSpread(1);
      } else if (e.key === 'End') {
        renderSpread(state.totalSpreads);
      }
    });

    // Scrubber
    el.scrubber.addEventListener('input', (e) => {
      renderSpread(parseInt(e.target.value, 10));
    });

    // Sound toggle
    el.btnSound.addEventListener('click', () => {
      state.soundEnabled = !state.soundEnabled;
      el.btnSound.classList.toggle('active', state.soundEnabled);
      if (state.soundEnabled) {
        el.soundIcon.innerHTML = `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>`;
        playPageFlipSound();
      } else {
        el.soundIcon.innerHTML = `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>`;
      }
    });

    // Zoom Toggle
    el.btnZoom.addEventListener('click', () => {
      state.isZoomed = !state.isZoomed;
      el.btnZoom.classList.toggle('active', state.isZoomed);
      el.assembly.style.setProperty('--zoom-level', state.isZoomed ? '1.2' : '1');
      if (state.isZoomed) {
        el.zoomIcon.innerHTML = `<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/>`;
      } else {
        el.zoomIcon.innerHTML = `<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>`;
      }
    });

    // Fullscreen Toggle
    el.btnFullscreen.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        el.container.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    });

    // Auto-Play Slideshow
    el.btnAutoPlay.addEventListener('click', () => {
      if (state.autoPlayTimer) {
        clearInterval(state.autoPlayTimer);
        state.autoPlayTimer = null;
        el.btnAutoPlay.classList.remove('active');
        el.autoPlayIcon.innerHTML = `<polygon points="5 3 19 12 5 21 5 3"/>`;
      } else {
        el.btnAutoPlay.classList.add('active');
        el.autoPlayIcon.innerHTML = `<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>`;
        state.autoPlayTimer = setInterval(() => {
          if (state.currentSpread >= state.totalSpreads) {
            renderSpread(1);
          } else {
            flipNext();
          }
        }, 3200);
      }
    });

    // Drawers (Thumbnails & TOC)
    el.btnToggleThumbnails.addEventListener('click', () => {
      el.drawerToc.classList.remove('open');
      el.drawerThumbnails.classList.toggle('open');
    });

    el.btnCloseThumbnails.addEventListener('click', () => {
      el.drawerThumbnails.classList.remove('open');
    });

    el.btnToggleToc.addEventListener('click', () => {
      el.drawerThumbnails.classList.remove('open');
      el.drawerToc.classList.toggle('open');
    });

    el.btnCloseToc.addEventListener('click', () => {
      el.drawerToc.classList.remove('open');
    });
  }

  // --- INITIALIZE ---
  function init() {
    applyGeometry();
    setBinding('center-pin');
    generateA4DemoPages();
    initEvents();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
