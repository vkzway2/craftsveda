/**
 * CraftsVeda 3D PageFlip Book & Album Studio (book-viewer.js)
 * 100% Client-Side In-Browser PDF & Image Flip Engine
 * Privacy Guarantee: Files are rendered locally in RAM, never sent to server.
 */

(function () {
  "use strict";

  // State Management
  const state = {
    bindingMode: "layflat", // 'centerpin', 'hardcase', 'layflat'
    currentPage: 1, // 1-indexed (spread: left = currentPage, right = currentPage + 1)
    totalPages: 0,
    pages: [], // Array of Canvas/Image elements
    isFlipping: false,
    autoplayTimer: null,
    zoomLevel: 1.0,
    soundEnabled: true
  };

  // DOM Elements
  const casingWrapper = document.getElementById("bookCasingWrapper");
  const stageInner = document.getElementById("bookStageInner");
  const leftPageEl = document.getElementById("leftPageContainer");
  const rightPageEl = document.getElementById("rightPageContainer");
  const leftPageNum = document.getElementById("leftPageNum");
  const rightPageNum = document.getElementById("rightPageNum");
  const pageCounterBadge = document.getElementById("pageCounterBadge");

  const btnPrev = document.getElementById("btnPrevPage");
  const btnNext = document.getElementById("btnNextPage");
  const btnFirst = document.getElementById("btnFirstPage");
  const btnLast = document.getElementById("btnLastPage");
  const btnAutoplay = document.getElementById("btnAutoplay");
  const btnFullscreen = document.getElementById("btnFullscreen");
  const btnSound = document.getElementById("btnSoundToggle");
  const pdfFileInput = document.getElementById("pdfFileInput");
  const dropzoneModal = document.getElementById("uploadDropzoneModal");
  const dropzoneBox = document.getElementById("dropzoneBox");
  const dropzoneCloseBtn = document.getElementById("dropzoneCloseBtn");
  const btnOpenUpload = document.getElementById("btnOpenUpload");
  const btnLoadDemo = document.getElementById("btnLoadDemo");
  const viewerStatusText = document.getElementById("viewerStatusText");

  // Spec Info Elements
  const specBindingTitle = document.getElementById("specBindingTitle");
  const specBindingDesc = document.getElementById("specBindingDesc");
  const specPagesCount = document.getElementById("specPagesCount");
  const specGsmRec = document.getElementById("specGsmRec");
  const specSpineEst = document.getElementById("specSpineEst");
  const btnWaInquire = document.getElementById("btnWaInquire");

  // 1. SYNTHESIZED PAGE TURN AUDIO (Web Audio API)
  let audioCtx = null;
  function playPageTurnSound() {
    if (!state.soundEnabled) return;
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === "suspended") {
        audioCtx.resume();
      }
      const bufferSize = audioCtx.sampleRate * 0.15;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35));
      }
      const whiteNoise = audioCtx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(800, audioCtx.currentTime);
      filter.Q.setValueAtTime(1.2, audioCtx.currentTime);

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.35, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.14);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      whiteNoise.start();
    } catch (e) {
      // Audio not permitted or supported
    }
  }

  // 2. BINDING MODE SELECTION
  const BINDING_SPECS = {
    centerpin: {
      title: "Center Pin (Saddle Stitch / Staple Binding)",
      desc: "Flexible soft-cover binding with dual metallic wire staples along the central spine fold. Best suited for high-end lookbooks, event programs, and catalogs up to 48–64 pages. Shows natural curved gutter fold with metallic staples.",
      gsm: "130 GSM to 250 GSM Art Paper",
      spine: "~1.5mm - 3.5mm",
      badge: "Center Pin Active",
      className: "mode-centerpin"
    },
    hardcase: {
      title: "Hard Case Binding (Section Sewn / Section Silai)",
      desc: "Architectural rigid hardcover board casing with traditional bookbinding thread sewing (section silai) along the gutter. Includes deep valley crease and satin ribbon bookmark. Built for coffee-table books, luxury corporate archives, and heavy volumes.",
      gsm: "170 GSM to 300 GSM Art Card + 3mm Rigid Board",
      spine: "~12mm - 35mm (Square Spine)",
      badge: "Hardcase Silai Active",
      className: "mode-hardcase"
    },
    layflat: {
      title: "Hard Case Seamless (Back to Back Pasting Layflat)",
      desc: "The gold standard for luxury wedding albums and panoramic fine-art photobooks. Each spread is mounted back-to-back with composite core substrate, opening 180° completely flat. No staples, no stitching thread, zero image lost in the center gutter fold.",
      gsm: "250 to 350 GSM Photographic Board Core",
      spine: "~15mm - 40mm (Flush Layflat)",
      badge: "Seamless Layflat Active",
      className: "mode-layflat"
    }
  };

  function setBindingMode(mode) {
    if (!BINDING_SPECS[mode]) return;
    state.bindingMode = mode;

    // Update active card class
    document.querySelectorAll(".binding-card").forEach((card) => {
      card.classList.toggle("active", card.dataset.binding === mode);
    });

    // Update 3D Casing element classes
    casingWrapper.classList.remove("mode-centerpin", "mode-hardcase", "mode-layflat");
    casingWrapper.classList.add(BINDING_SPECS[mode].className);

    // Update Spec Details
    const spec = BINDING_SPECS[mode];
    if (specBindingTitle) specBindingTitle.textContent = spec.title;
    if (specBindingDesc) specBindingDesc.textContent = spec.desc;
    if (specGsmRec) specGsmRec.textContent = spec.gsm;
    if (specSpineEst) specSpineEst.textContent = spec.spine;

    // Update WhatsApp inquiry URL
    updateWhatsAppLink();
  }

  function updateWhatsAppLink() {
    if (!btnWaInquire) return;
    const spec = BINDING_SPECS[state.bindingMode];
    const pageCount = state.totalPages || 12;
    const message = `Namaste CraftsVeda! I checked the 3D Book Viewer and would like an estimate for:\n• Binding Style: ${spec.title}\n• Estimated Pages: ${pageCount} pages\n• Preferred Paper: ${spec.gsm}\nPlease share quotation and sample pictures.`;
    btnWaInquire.href = `https://wa.me/918840035249?text=${encodeURIComponent(message)}`;
  }

  // 3. RENDER PAGES TO SPREAD
  function renderSpread() {
    if (!state.pages || state.pages.length === 0) return;

    const leftIdx = state.currentPage - 1;
    const rightIdx = state.currentPage;

    // Left Page
    leftPageEl.innerHTML = "";
    if (leftIdx >= 0 && leftIdx < state.pages.length) {
      const leftCanvas = cloneOrWrapPage(state.pages[leftIdx]);
      leftPageEl.appendChild(leftCanvas);
      leftPageNum.textContent = leftIdx + 1;
      leftPageEl.style.visibility = "visible";
    } else {
      leftPageEl.style.visibility = "hidden";
      leftPageNum.textContent = "";
    }

    // Right Page
    rightPageEl.innerHTML = "";
    if (rightIdx >= 0 && rightIdx < state.pages.length) {
      const rightCanvas = cloneOrWrapPage(state.pages[rightIdx]);
      rightPageEl.appendChild(rightCanvas);
      rightPageNum.textContent = rightIdx + 1;
      rightPageEl.style.visibility = "visible";
    } else {
      rightPageEl.style.visibility = "hidden";
      rightPageNum.textContent = "";
    }

    // Counter badge
    const curEnd = Math.min(state.currentPage + 1, state.totalPages);
    pageCounterBadge.textContent = `Pages ${state.currentPage}–${curEnd} of ${state.totalPages}`;

    if (specPagesCount) specPagesCount.textContent = `${state.totalPages} Pages`;

    // Button states
    btnPrev.disabled = state.currentPage <= 1;
    btnFirst.disabled = state.currentPage <= 1;
    btnNext.disabled = state.currentPage + 1 >= state.totalPages;
    btnLast.disabled = state.currentPage + 1 >= state.totalPages;

    updateWhatsAppLink();
  }

  function cloneOrWrapPage(pageItem) {
    if (pageItem instanceof HTMLCanvasElement) {
      const copyCanvas = document.createElement("canvas");
      copyCanvas.width = pageItem.width;
      copyCanvas.height = pageItem.height;
      copyCanvas.className = "page-content-canvas";
      const ctx = copyCanvas.getContext("2d");
      ctx.drawImage(pageItem, 0, 0);
      return copyCanvas;
    } else if (pageItem instanceof HTMLImageElement) {
      const img = document.createElement("img");
      img.src = pageItem.src;
      img.className = "page-content-canvas";
      return img;
    }
    const div = document.createElement("div");
    div.className = "page-content-canvas";
    return div;
  }

  // 4. 3D FLIP ANIMATIONS
  function flipNext() {
    if (state.isFlipping || state.currentPage + 1 >= state.totalPages) return;
    state.isFlipping = true;
    playPageTurnSound();

    const currentRightPage = state.pages[state.currentPage];
    const upcomingLeftPage = state.pages[state.currentPage + 1];

    // Create 3D flipping leaf
    const leaf = document.createElement("div");
    leaf.className = "flipping-leaf flip-forward";

    const frontFace = document.createElement("div");
    frontFace.className = "leaf-face leaf-front";
    if (currentRightPage) frontFace.appendChild(cloneOrWrapPage(currentRightPage));

    const backFace = document.createElement("div");
    backFace.className = "leaf-face leaf-back";
    if (upcomingLeftPage) backFace.appendChild(cloneOrWrapPage(upcomingLeftPage));

    leaf.appendChild(frontFace);
    leaf.appendChild(backFace);
    stageInner.appendChild(leaf);

    // Trigger turn
    requestAnimationFrame(() => {
      leaf.style.transform = "rotateY(-180deg)";
    });

    setTimeout(() => {
      state.currentPage += 2;
      renderSpread();
      if (leaf.parentNode) leaf.parentNode.removeChild(leaf);
      state.isFlipping = false;
    }, 650);
  }

  function flipPrev() {
    if (state.isFlipping || state.currentPage <= 1) return;
    state.isFlipping = true;
    playPageTurnSound();

    const previousRightPage = state.pages[state.currentPage - 1];
    const currentLeftPage = state.pages[state.currentPage - 2];

    const leaf = document.createElement("div");
    leaf.className = "flipping-leaf flip-backward";

    const frontFace = document.createElement("div");
    frontFace.className = "leaf-face leaf-front";
    if (currentLeftPage) frontFace.appendChild(cloneOrWrapPage(currentLeftPage));

    const backFace = document.createElement("div");
    backFace.className = "leaf-face leaf-back";
    if (previousRightPage) backFace.appendChild(cloneOrWrapPage(previousRightPage));

    leaf.appendChild(frontFace);
    leaf.appendChild(backFace);
    stageInner.appendChild(leaf);

    // Start rotated
    leaf.style.transform = "rotateY(-180deg)";

    requestAnimationFrame(() => {
      leaf.style.transform = "rotateY(0deg)";
    });

    setTimeout(() => {
      state.currentPage = Math.max(1, state.currentPage - 2);
      renderSpread();
      if (leaf.parentNode) leaf.parentNode.removeChild(leaf);
      state.isFlipping = false;
    }, 650);
  }

  function goToFirst() {
    if (state.currentPage === 1) return;
    state.currentPage = 1;
    playPageTurnSound();
    renderSpread();
  }

  function goToLast() {
    const target = state.totalPages % 2 === 0 ? state.totalPages - 1 : state.totalPages;
    if (state.currentPage >= target) return;
    state.currentPage = Math.max(1, target);
    playPageTurnSound();
    renderSpread();
  }

  // 5. BUILT-IN LUXURY SAMPLE BOOK GENERATOR (0 Dependencies, Instant)
  function generateDemoBook() {
    const demoPages = [];
    const titles = [
      { t: "CRAFTSVEDA", st: "PREMIUM PRINTING STUDIO • SAKI NAKA, MUMBAI", bg: "#0d131f", gold: true },
      { t: "WEDDING MONOGRAM", st: "24K Gold Foil & Raised Spot UV Finish", bg: "#fbf9f4", gold: false },
      { t: "PANORAMIC LAYFLAT", st: "Continuous 180° Seamless Spread across Spine", bg: "#161b26", gold: true },
      { t: "NO GUTTER LOSS", st: "Karizma Back-to-Back Pasted Substrate Core", bg: "#f8f5ee", gold: false },
      { t: "SECTION SILAI", st: "Section Sewn Threads & Rigid Case Binding", bg: "#111827", gold: true },
      { t: "CENTRE PIN FINISH", st: "Saddle-Stitched Double Wire Staples", bg: "#faf8f5", gold: false },
      { t: "HAUTE HORLOGERIE", st: "Velvet Soft-Touch Lamination 350 GSM", bg: "#090d16", gold: true },
      { t: "SCULPTED EMBOSSING", st: "Tactile Multi-Level Brass Plate Die", bg: "#f5f2e9", gold: false },
      { t: "COFFEE TABLE BOOKS", st: "Artisanal Hardcover Casing & Gilding", bg: "#1c140c", gold: true },
      { t: "LUXURY PACKAGING", st: "Handcrafted Rigid Boxes & Drawers", bg: "#faf6ed", gold: false },
      { t: "CLIENT TESTIMONIALS", st: "Mumbai's Trusted Studio for Premium Print", bg: "#0f172a", gold: true },
      { t: "CRAFTSVEDA STUDIO", st: "+91 88400 35249 • vkzway2@gmail.com", bg: "#0a0f1d", gold: true }
    ];

    titles.forEach((item, index) => {
      const canvas = document.createElement("canvas");
      canvas.width = 900;
      canvas.height = 1120;
      const ctx = canvas.getContext("2d");

      // Background
      ctx.fillStyle = item.bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Ornate Border
      ctx.strokeStyle = item.gold ? "#d4af37" : "#c4b58c";
      ctx.lineWidth = 4;
      ctx.strokeRect(36, 36, canvas.width - 72, canvas.height - 72);

      ctx.lineWidth = 1;
      ctx.strokeRect(44, 44, canvas.width - 88, canvas.height - 88);

      // Studio Crest / Watermark
      ctx.textAlign = "center";
      ctx.fillStyle = item.gold ? "rgba(212, 175, 55, 0.15)" : "rgba(180, 160, 120, 0.15)";
      ctx.font = "bold 90px Cinzel, Georgia, serif";
      ctx.fillText("CV", canvas.width / 2, canvas.height / 2 - 40);

      // Header Tag
      ctx.fillStyle = item.gold ? "#f5e6a8" : "#8c7e68";
      ctx.font = "600 22px Cinzel, Georgia, serif";
      ctx.fillText(`CRAFTSVEDA • PAGE ${index + 1}`, canvas.width / 2, 110);

      // Main Title
      ctx.fillStyle = item.gold ? "#ffffff" : "#1a1612";
      ctx.font = "bold 44px 'Playfair Display', Georgia, serif";
      ctx.fillText(item.t, canvas.width / 2, canvas.height / 2 + 30);

      // Subtitle
      ctx.fillStyle = item.gold ? "#d4af37" : "#6b5d49";
      ctx.font = "500 24px 'Plus Jakarta Sans', sans-serif";
      ctx.fillText(item.st, canvas.width / 2, canvas.height / 2 + 80);

      // Decorative Rule
      ctx.strokeStyle = item.gold ? "#d4af37" : "#c4b58c";
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2 - 120, canvas.height / 2 + 120);
      ctx.lineTo(canvas.width / 2 + 120, canvas.height / 2 + 120);
      ctx.stroke();

      // Footer note
      ctx.fillStyle = item.gold ? "#9ba1b0" : "#8a8175";
      ctx.font = "18px 'Plus Jakarta Sans', sans-serif";
      ctx.fillText("Client-Side 3D Photobook Viewer • Zero Server Upload Required", canvas.width / 2, canvas.height - 70);

      demoPages.push(canvas);
    });

    state.pages = demoPages;
    state.totalPages = demoPages.length;
    state.currentPage = 1;
    if (viewerStatusText) {
      viewerStatusText.textContent = `Demo Photobook loaded (${demoPages.length} Pages)`;
    }
    renderSpread();
  }

  // 6. CLIENT-SIDE PDF PARSER (Mozilla PDF.js)
  async function loadPdfFile(file) {
    if (!file || file.type !== "application/pdf") {
      alert("Kripya valid PDF file select karein.");
      return;
    }

    if (viewerStatusText) {
      viewerStatusText.textContent = `Loading "${file.name}" locally in browser...`;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();

      // Ensure PDF.js is available
      if (typeof pdfjsLib === "undefined") {
        throw new Error("PDF.js library could not be loaded. Please check your internet connection.");
      }

      pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;

      const loadedPages = [];

      for (let i = 1; i <= numPages; i++) {
        if (viewerStatusText) {
          viewerStatusText.textContent = `Rendering page ${i} of ${numPages} in RAM...`;
        }
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });

        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d");

        await page.render({ canvasContext: ctx, viewport: viewport }).promise;
        loadedPages.push(canvas);
      }

      state.pages = loadedPages;
      state.totalPages = loadedPages.length;
      state.currentPage = 1;

      if (viewerStatusText) {
        viewerStatusText.textContent = `Loaded "${file.name}" (${numPages} pages) • 100% In-Browser`;
      }
      renderSpread();
    } catch (err) {
      console.error("PDF Parsing Error:", err);
      alert("PDF load karne me samasya aayi: " + err.message);
      if (viewerStatusText) {
        viewerStatusText.textContent = "Error loading PDF. Please try another file.";
      }
    }
  }

  // 7. MULTI-IMAGE UPLOADER
  async function loadImages(fileList) {
    const loadedPages = [];
    const files = Array.from(fileList).filter((f) => f.type.startsWith("image/"));
    if (files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      await new Promise((resolve) => {
        img.onload = resolve;
        img.src = objectUrl;
      });
      loadedPages.push(img);
    }

    state.pages = loadedPages;
    state.totalPages = loadedPages.length;
    state.currentPage = 1;

    if (viewerStatusText) {
      viewerStatusText.textContent = `Loaded ${loadedPages.length} images as pages • 100% In-Browser`;
    }
    renderSpread();
  }

  // 8. EVENT LISTENERS SETUP
  function setupListeners() {
    // Binding Card Selection
    document.querySelectorAll(".binding-card").forEach((card) => {
      card.addEventListener("click", () => {
        setBindingMode(card.dataset.binding);
      });
    });

    // Navigation Controls
    btnNext.addEventListener("click", flipNext);
    btnPrev.addEventListener("click", flipPrev);
    btnFirst.addEventListener("click", goToFirst);
    btnLast.addEventListener("click", goToLast);

    // Click on Left/Right page to flip
    leftPageEl.addEventListener("click", flipPrev);
    rightPageEl.addEventListener("click", flipNext);

    // Keyboard navigation
    window.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        flipNext();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        flipPrev();
      } else if (e.key === "Home") {
        goToFirst();
      } else if (e.key === "End") {
        goToLast();
      }
    });

    // Sound toggle
    btnSound.addEventListener("click", () => {
      state.soundEnabled = !state.soundEnabled;
      btnSound.style.opacity = state.soundEnabled ? "1" : "0.4";
      btnSound.setAttribute("title", state.soundEnabled ? "Mute Page Flip Sound" : "Enable Page Flip Sound");
    });

    // Autoplay toggle
    btnAutoplay.addEventListener("click", () => {
      if (state.autoplayTimer) {
        clearInterval(state.autoplayTimer);
        state.autoplayTimer = null;
        btnAutoplay.style.background = "";
        btnAutoplay.setAttribute("title", "Start Auto Flip");
      } else {
        btnAutoplay.style.background = "var(--gold-primary)";
        btnAutoplay.style.color = "#07090e";
        btnAutoplay.setAttribute("title", "Pause Auto Flip");
        state.autoplayTimer = setInterval(() => {
          if (state.currentPage + 1 >= state.totalPages) {
            goToFirst();
          } else {
            flipNext();
          }
        }, 3600);
      }
    });

    // Fullscreen toggle
    btnFullscreen.addEventListener("click", () => {
      if (!document.fullscreenElement) {
        casingWrapper.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    });

    // File Input change
    pdfFileInput.addEventListener("change", (e) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;
      if (files[0].type === "application/pdf") {
        loadPdfFile(files[0]);
      } else {
        loadImages(files);
      }
      closeDropzone();
    });

    // Demo button
    btnLoadDemo.addEventListener("click", generateDemoBook);

    // Dropzone Modal controls
    if (btnOpenUpload) {
      btnOpenUpload.addEventListener("click", () => {
        dropzoneModal.classList.add("active");
      });
    }

    if (dropzoneCloseBtn) {
      dropzoneCloseBtn.addEventListener("click", closeDropzone);
    }

    dropzoneModal.addEventListener("click", (e) => {
      if (e.target === dropzoneModal) closeDropzone();
    });

    function closeDropzone() {
      dropzoneModal.classList.remove("active");
    }

    // Drag and Drop on Dropzone
    ["dragenter", "dragover"].forEach((evt) => {
      dropzoneBox.addEventListener(evt, (e) => {
        e.preventDefault();
        dropzoneBox.classList.add("dragover");
      });
    });

    ["dragleave", "drop"].forEach((evt) => {
      dropzoneBox.addEventListener(evt, (e) => {
        e.preventDefault();
        dropzoneBox.classList.remove("dragover");
      });
    });

    dropzoneBox.addEventListener("drop", (e) => {
      const files = e.dataTransfer.files;
      if (!files || files.length === 0) return;
      if (files[0].type === "application/pdf") {
        loadPdfFile(files[0]);
      } else {
        loadImages(files);
      }
      closeDropzone();
    });
  }

  // 9. INITIALIZATION
  function init() {
    setupListeners();
    setBindingMode("layflat"); // Default to the requested Back to Back Pasting
    generateDemoBook(); // Pre-load high quality demo album
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
