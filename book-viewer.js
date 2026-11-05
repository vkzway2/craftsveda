/**
 * CraftsVeda™ 3D PageFlip Handbook & Book Viewer
 * 100% In-Browser Private Processing (Zero Server Storage)
 * Supports: A4, A5, A3, 8.5x11", 9x11", Square (Portrait & Landscape)
 * Auto Aspect Ratio Detection from Uploaded PDF / Images
 * 3 Binding Finishes:
 *   1. Center Pin (Saddle Stitch with Staples)
 *   2. Hard Case Section Silai (Hardcover with Sewn Thread)
 *   3. Hard Case Back-to-Back Pasting (Layflat - Zero Pin / Zero Silai)
 */

(function () {
  'use strict';

  // Configure PDF.js Worker if available
  if (window.pdfjsLib) {
    window.pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  }

  // --- STATE ---
  const state = {
    pages: [],               // Array of page rendering descriptors { type: 'canvas'|'html', render: fn, label: string }
    totalPages: 20,
    currentSpread: 1,        // 1-based index: Spread 1 shows page 1 & 2
    totalSpreads: 10,
    sizePreset: 'a4',        // 'auto', 'a4', 'a5', 'a3', 'letter', 'album', 'square'
    orientation: 'portrait', // 'portrait' | 'landscape'
    binding: 'center-pin',   // 'center-pin' | 'hardcase-silai' | 'hardcase-layflat'
    autoDetectedRatio: null, // Spread aspect ratio (2 * W / H) if detected from file
    pdfDoc: null,
    isFlipping: false
  };

  // Dimensions in points/units (Width, Height in Portrait)
  const PRESET_DIMENSIONS = {
    a4: { w: 210, h: 297, name: 'A4 (210 × 297 mm)' },
    a5: { w: 148, h: 210, name: 'A5 (148 × 210 mm)' },
    a3: { w: 297, h: 420, name: 'A3 (297 × 420 mm)' },
    letter: { w: 8.5, h: 11, name: '8.5" × 11" (Letter)' },
    album: { w: 9, h: 11, name: '9" × 11" (Photo Book)' },
    square: { w: 8, h: 8, name: 'Square (8" × 8")' }
  };

  // --- DOM ELEMENTS ---
  const el = {
    assembly: document.getElementById('handbookAssembly'),
    pageLeft: document.getElementById('pageLeft'),
    pageRight: document.getElementById('pageRight'),
    leftArt: document.getElementById('leftInnerArt'),
    rightArt: document.getElementById('rightInnerArt'),
    leftPageNum: document.getElementById('leftPageNum'),
    rightPageNum: document.getElementById('rightPageNum'),
    stackLeft: document.getElementById('stackLeft'),
    stackRight: document.getElementById('stackRight'),
    fileInput: document.getElementById('pdfFileInput'),
    btnUpload: document.getElementById('btnUploadTrigger'),
    btnDemo: document.getElementById('btnLoadA4Demo'),
    fileBadge: document.getElementById('fileInfoBadge'),
    sizeSelect: document.getElementById('sizePresetSelect'),
    btnPortrait: document.getElementById('btnPortrait'),
    btnLandscape: document.getElementById('btnLandscape'),
    bindingButtons: document.querySelectorAll('.btn-binding'),
    dragDropZone: document.getElementById('dragDropZone'),
    btnPrev: document.getElementById('btnPrevPage'),
    btnNext: document.getElementById('btnNextPage'),
    scrubber: document.getElementById('pageScrubber'),
    scrubberText: document.getElementById('scrubberText'),
    ratioIndicator: document.getElementById('ratioIndicatorBadge')
  };

  // --- ASPECT RATIO & GEOMETRY CALCULATOR ---
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

    // Two single pages open side-by-side: Spread Width = 2 * singleW
    const spreadRatio = (2 * singleW) / singleH;
    return spreadRatio;
  }

  function applyGeometry() {
    const ratio = computeSpreadRatio();
    el.assembly.style.setProperty('--spread-aspect-ratio', ratio.toFixed(3));

    // Update ratio label badge
    let label = '';
    if (state.sizePreset === 'auto') {
      label = `Auto Detected (${ratio.toFixed(2)} : 1 Spread)`;
    } else {
      const preset = PRESET_DIMENSIONS[state.sizePreset];
      const orientLabel = state.orientation.charAt(0).toUpperCase() + state.orientation.slice(1);
      label = `${preset.name} - ${orientLabel} (${ratio.toFixed(2)} : 1 Spread)`;
    }
    el.ratioIndicator.textContent = label;

    // Adjust max width based on landscape vs portrait
    if (ratio > 2.2) {
      el.assembly.style.maxWidth = '1120px';
    } else {
      el.assembly.style.maxWidth = '920px';
    }
  }

  // --- DYNAMIC PAGE STACK DEPTH PHYSICS ---
  function updateStackDepth() {
    const currentLeftPage = (state.currentSpread - 1) * 2;
    const total = state.totalPages || 20;

    const maxDepth = 18; // px
    const leftFraction = Math.max(0, Math.min(1, currentLeftPage / total));
    const rightFraction = Math.max(0, Math.min(1, (total - currentLeftPage) / total));

    const leftDepth = Math.max(2, Math.round(leftFraction * maxDepth));
    const rightDepth = Math.max(2, Math.round(rightFraction * maxDepth));

    el.assembly.style.setProperty('--stack-l-depth', `${leftDepth}px`);
    el.assembly.style.setProperty('--stack-r-depth', `${rightDepth}px`);
  }

  // --- 20-PAGE A4 DEMO HANDBOOK GENERATOR ---
  function generateA4DemoPages() {
    const pages = [];
    const chapters = [
      {
        title: "CraftsVeda Atelier Mumbai",
        sub: "Master Handbook of Haute Impression & Bookbinding",
        type: "cover"
      },
      {
        ch: "Chapter 01",
        title: "Philosophy of Bespoke Print",
        p1: "At CraftsVeda, print is not merely ink transferred to wood pulp; it is an architectural expression of brand identity.",
        p2: "Every GSM rating, tooth grain texture, and foil micron depth is calibrated with micron precision in our Lower Parel atelier.",
        box: "Standard Calibration: 100% Pantone solid ink matching under D50 5000K daylight simulation."
      },
      {
        ch: "Chapter 02",
        title: "Curated European Paper Stocks",
        p1: "We import virgin pulp stocks directly from century-old Italian and German paper mills.",
        p2: "Explore cotton-rich Gmund, Fedrigoni Materica, and wild textured Arjowiggins Conqueror up to 1200 GSM duplexed sheets.",
        box: "Available Finishes: Rough Felt, Linen, Laid, Smooth Vellum, and Ultra-Matt Suede."
      },
      {
        ch: "Chapter 03",
        title: "Center Pin (Saddle Stitch) Engineering",
        p1: "The timeless booklet finishing: dual electro-plated silver staples pierced through the structural center crease.",
        p2: "Ideal for lookbooks, catalogues, and annual profiles from 8 to 48 pages. Ultra-light, economical, and razor-sharp.",
        box: "Pin Options: Stainless Chrome, Matte Black Wire, or Artisanal Copper-Brass."
      },
      {
        ch: "Chapter 04",
        title: "Center Pin Gutter Specifications",
        p1: "We apply automatic page creep compensation so that outer trims remain flush without shearing interior margins.",
        p2: "Each sheet folds naturally into the saddle fold with zero spine buckling or cracking.",
        box: "Creep Compensation: 0.12mm stepped trim per 4-page signature."
      },
      {
        ch: "Chapter 05",
        title: "Hard Case Section Silai (Sewn)",
        p1: "The gold standard of heirloom archival books. Folded signatures are physically sewn with high-tensile cotton-linen thread.",
        p2: "Bound within rigid 3.5mm Dutch kappa board with head & tail bands and silk ribbon bookmarks.",
        box: "Sewing Structure: French link stitch or Smyth sewn section signatures."
      },
      {
        ch: "Chapter 06",
        title: "Section Silai Valley Crease Dynamics",
        p1: "Notice the deep valley fold in the center gutter. Each signature holds its own tension, allowing the book to open comfortably.",
        p2: "Rated for 100+ years of library shelf archival life without glue brittleness.",
        box: "Spine Hinge: Precision scored joint groove for smooth page turning."
      },
      {
        ch: "Chapter 07",
        title: "Back-to-Back Pasting (Layflat)",
        p1: "For panoramic spreads, luxury real estate dossiers, and bridal archives where zero image detail can be lost in the fold.",
        p2: "Each sheet is printed single-side and bonded back-to-back with neutral pH archival adhesive.",
        box: "Key Benefit: 100% Flat 180° spread with ZERO center pin and ZERO thread silai visible."
      },
      {
        ch: "Chapter 08",
        title: "Seamless Panoramic Transition",
        p1: "Architectural blueprints, wide-angle photography, and horizontal timeline spreads flow across both pages seamlessly.",
        p2: "The center gutter is virtually invisible, giving an uninterrupted double-page canvas.",
        box: "Substrate: 300 GSM Art Card bonded back-to-back into an ultra-rigid 600 GSM leaf."
      },
      {
        ch: "Chapter 09",
        title: "Artisanal Hot Foil Gilding",
        p1: "Applied with heated magnesium and brass dies under 2.5 tons of mechanical pressure for deep dimensional bite.",
        p2: "Available in Kurz Luxor gold, brushed champagne, deep copper, and holographic security foils.",
        box: "Die Precision: 0.1pt ultra-fine hairline foil stamping capability."
      },
      {
        ch: "Chapter 10",
        title: "Blind Debossing & Letterpress",
        p1: "Crisp tactile indentation that catches light and shadow without relying on pigment.",
        p2: "Ideal for monograms, architectural emblems, and luxury brand crests.",
        box: "Bite Depth: Up to 0.45mm deep sculptural impression."
      },
      {
        ch: "Chapter 11",
        title: "Specialty Screen Embellishments",
        p1: "High-build tactile UV varnish, sand texture tactile effects, and pearlescent screen inks.",
        p2: "Adds irresistible touch-and-feel contrast against velvet soft-touch laminate coatings.",
        box: "UV Height: Up to 60-micron raised gloss polymer."
      },
      {
        ch: "Chapter 12",
        title: "Color Fidelity & Pantone Labs",
        p1: "Our ink laboratory mixes custom Pantone inks by weight on certified Sartorius analytical scales.",
        p2: "Guarantees identical corporate color rendition across coated, uncoated, and kraft stocks.",
        box: "Delta-E Tolerance: ΔE < 1.5 color deviation under spectrophotometer testing."
      },
      {
        ch: "Chapter 13",
        title: "Hardcover Exterior Cloth & Leathers",
        p1: "Wrapped with premium bookcloths from Winter & Company, Buckram, and Italian bonded leather.",
        p2: "Water-resistant, stain-resistant, and foil-stamp receptive.",
        box: "Spine Styles: Square spine, rounded library spine, or exposed Swiss binding."
      },
      {
        ch: "Chapter 14",
        title: "Endpapers & Dust Jackets",
        p1: "Reinforced 180 GSM unprinted or custom illustrated endpapers connecting book block to kappa board.",
        p2: "Optional French-fold dust jackets with matte scratch-resistant lamination.",
        box: "Endpaper Options: Color-matched Keaykolour or metallic Sirio Pearl."
      },
      {
        ch: "Chapter 15",
        title: "Sustainability & FSC Certification",
        p1: "All paper stocks sourced from responsibly managed forests adhering to FSC Mix and PEFC protocols.",
        p2: "Soy-based vegetable printing inks with zero VOC emissions.",
        box: "Eco Standard: 100% biodegradable, acid-free, and chlorine-free."
      },
      {
        ch: "Chapter 16",
        title: "Turnaround & Mumbai Atelier Dispatch",
        p1: "Rush prototypes crafted in 24 to 48 hours for brand director approvals.",
        p2: "Full production runs hand-inspected, wrapped in archival tissue, and delivered across Mumbai, BKC, and global destinations.",
        box: "Direct WhatsApp hotline with master bindery supervisors."
      },
      {
        ch: "Chapter 17",
        title: "Handbook Specification Summary",
        p1: "Dimensions: A4 / A5 / A3 / 8.5x11 / 9x11 / Square Custom.",
        p2: "Bindings: Center Pin, Section Silai Hard Case, Back-to-Back Pasting Layflat.",
        box: "File Requirements: High-Res 300 DPI PDF with 3mm bleed."
      },
      {
        ch: "Chapter 18",
        title: "Custom Atelier Consultations",
        p1: "Bring your design files or meet our print masters in Lower Parel or Fort.",
        p2: "We review paper samples, dummy mockups, and foil test cards before you commit to final print.",
        box: "Contact: +91 8840035249 | vkzway2@gmail.com"
      },
      {
        title: "CraftsVeda™ Atelier Guild",
        sub: "Mumbai • Established 2026 • Master Printing & Fine Bookbinding",
        type: "backcover"
      }
    ];

    chapters.forEach((item, index) => {
      const pageNum = index + 1;
      pages.push({
        type: 'html',
        pageNum: pageNum,
        render: (container) => {
          if (item.type === 'cover' || item.type === 'backcover') {
            container.innerHTML = `
              <div class="sample-page-sheet cover">
                <span class="sample-cover-badge">CRAFTSVEDA ATELIER</span>
                <h1 class="sample-cover-title">${item.title}</h1>
                <p class="sample-cover-sub">${item.sub}</p>
                <div style="font-size:0.75rem; letter-spacing:0.1em; color:var(--gold-accent);">
                  ${item.type === 'cover' ? 'PAGE 01 • HANDBOOK EDITION' : 'LOWER PAREL & FORT • MUMBAI'}
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
                  <span>CraftsVeda Bookbinding Guild</span>
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
    updateNavigationControls();
    renderSpread(1);
    el.fileBadge.textContent = 'Demo 20-Page A4 Handbook';
  }

  // --- RENDER CURRENT SPREAD ---
  function renderSpread(spreadIdx) {
    state.currentSpread = Math.max(1, Math.min(spreadIdx, state.totalSpreads));
    const leftPageIdx = (state.currentSpread - 1) * 2;
    const rightPageIdx = leftPageIdx + 1;

    el.leftArt.innerHTML = '';
    el.rightArt.innerHTML = '';

    // Render Left Page
    if (leftPageIdx < state.pages.length) {
      const leftPageData = state.pages[leftPageIdx];
      el.leftPageNum.textContent = leftPageData.pageNum || (leftPageIdx + 1);
      leftPageData.render(el.leftArt);
      el.pageLeft.style.visibility = 'visible';
    } else {
      el.leftPageNum.textContent = '';
      el.pageLeft.style.visibility = 'hidden';
    }

    // Render Right Page
    if (rightPageIdx < state.pages.length) {
      const rightPageData = state.pages[rightPageIdx];
      el.rightPageNum.textContent = rightPageData.pageNum || (rightPageIdx + 1);
      rightPageData.render(el.rightArt);
      el.pageRight.style.visibility = 'visible';
    } else {
      el.rightPageNum.textContent = '';
      el.pageRight.style.visibility = 'hidden';
    }

    // Update Stack Depth & UI
    updateStackDepth();
    updateNavigationControls();
  }

  function updateNavigationControls() {
    const leftNum = (state.currentSpread - 1) * 2 + 1;
    const rightNum = Math.min(leftNum + 1, state.totalPages);
    el.scrubberText.textContent = `Pages ${leftNum}-${rightNum} of ${state.totalPages}`;

    el.scrubber.min = 1;
    el.scrubber.max = state.totalSpreads;
    el.scrubber.value = state.currentSpread;

    el.btnPrev.disabled = (state.currentSpread <= 1);
    el.btnNext.disabled = (state.currentSpread >= state.totalSpreads);
  }

  // --- PAGE FLIP ANIMATIONS ---
  function flipNext() {
    if (state.isFlipping || state.currentSpread >= state.totalSpreads) return;
    state.isFlipping = true;

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

    el.pageLeft.classList.add('flipping-backward');
    setTimeout(() => {
      renderSpread(state.currentSpread - 1);
      el.pageLeft.classList.remove('flipping-backward');
      state.isFlipping = false;
    }, 280);
  }

  // --- PDF FILE PARSER (100% IN-BROWSER VIA PDF.JS) ---
  async function loadPdfFile(file) {
    if (!window.pdfjsLib) {
      alert('PDF viewer engine is initializing. Please try again in a few seconds.');
      return;
    }

    try {
      el.fileBadge.textContent = 'Rendering PDF...';
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      state.pdfDoc = pdf;

      const numPages = pdf.numPages;
      const pages = [];

      // Detect Aspect Ratio from Page 1
      const firstPage = await pdf.getPage(1);
      const vp = firstPage.getViewport({ scale: 1.0 });
      const pageWidth = vp.width;
      const pageHeight = vp.height;

      // Single page ratio = W / H. Open spread ratio = (2 * W) / H
      const detectedSpreadRatio = (2 * pageWidth) / pageHeight;
      state.autoDetectedRatio = detectedSpreadRatio;

      // Auto detect orientation
      if (pageWidth > pageHeight) {
        state.orientation = 'landscape';
        el.btnLandscape.classList.add('active');
        el.btnPortrait.classList.remove('active');
      } else {
        state.orientation = 'portrait';
        el.btnPortrait.classList.add('active');
        el.btnLandscape.classList.remove('active');
      }

      // Set size select to Auto
      state.sizePreset = 'auto';
      el.sizeSelect.value = 'auto';
      applyGeometry();

      for (let i = 1; i <= numPages; i++) {
        const pageNumber = i;
        pages.push({
          type: 'canvas',
          pageNum: pageNumber,
          render: async (container) => {
            const page = await pdf.getPage(pageNumber);
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Render at high crispness for retina displays
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

      el.fileBadge.textContent = `${file.name} (${numPages} Pages)`;
      renderSpread(1);

    } catch (err) {
      console.error('Error rendering PDF:', err);
      alert('Could not render PDF. Please ensure the file is not password protected.');
      el.fileBadge.textContent = 'Error Loading PDF';
    }
  }

  // --- IMAGE FILES PARSER (Multiple Images to Book) ---
  function loadImages(files) {
    const validImages = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (!validImages.length) return;

    el.fileBadge.textContent = `Loading ${validImages.length} Images...`;
    const pages = [];

    // Sort files by name naturally
    validImages.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));

    validImages.forEach((imgFile, index) => {
      const pageNum = index + 1;
      const objectUrl = URL.createObjectURL(imgFile);

      pages.push({
        type: 'image',
        pageNum: pageNum,
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

    el.fileBadge.textContent = `${validImages.length} Images Loaded`;
    renderSpread(1);
  }

  // --- BINDING SWITCHER ---
  function setBinding(bindingName) {
    state.binding = bindingName;
    el.assembly.setAttribute('data-binding', bindingName);

    el.bindingButtons.forEach(btn => {
      if (btn.getAttribute('data-binding') === bindingName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // Global helper for footer links
  window.selectBindingPreset = function (bindingName) {
    setBinding(bindingName);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- EVENT LISTENERS ---
  function initEvents() {
    // Upload triggers
    el.btnUpload.addEventListener('click', () => el.fileInput.click());
    el.dragDropZone.addEventListener('click', () => el.fileInput.click());

    el.fileInput.addEventListener('change', (e) => {
      const files = e.target.files;
      if (!files || !files.length) return;

      if (files[0].type === 'application/pdf') {
        loadPdfFile(files[0]);
      } else {
        loadImages(files);
      }
    });

    // Demo button
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
    ['dragenter', 'dragover'].forEach(eventName => {
      document.body.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        el.dragDropZone.classList.add('dragover');
      }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      document.body.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        el.dragDropZone.classList.remove('dragover');
      }, false);
    });

    document.body.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const files = dt.files;
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

    // Binding selection
    el.bindingButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const binding = btn.getAttribute('data-binding');
        setBinding(binding);
      });
    });

    // Page flip clicks
    el.pageLeft.addEventListener('click', flipPrev);
    el.pageRight.addEventListener('click', flipNext);
    el.btnPrev.addEventListener('click', flipPrev);
    el.btnNext.addEventListener('click', flipNext);

    // Keyboard navigation (Arrow keys)
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        flipNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        flipPrev();
      }
    });

    // Scrubber
    el.scrubber.addEventListener('input', (e) => {
      renderSpread(parseInt(e.target.value, 10));
    });
  }

  // --- INITIALIZATION ---
  function init() {
    applyGeometry();
    setBinding('center-pin');
    generateA4DemoPages();
    initEvents();
  }

  // Start on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
