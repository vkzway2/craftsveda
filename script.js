/**
 * CraftsVeda — Premium Printing Studio
 * Saki Naka, Mumbai
 * Interactive Engine & WhatsApp Quotation Builder
 */

// Finish Data Matrix for Interactive Finishes Explorer
const FINISH_DATA = {
  foil: {
    badge: "HOT FOIL STAMPING",
    title: "24K Metallic Foil Stamping",
    desc: "Using precision heated brass dies, metallic pigment is transferred directly under extreme pressure into the fibers of the card stock. Creates an unmissable mirror-like reflection that never chips or dulls over time.",
    val1: "Gold, Rose Gold, Silver, Copper, Hologram",
    val2: "Soft-Touch Velvet, 600 GSM Cotton, Black Board",
    val3: "100 pieces (Custom Dies included)",
    img: "assets/finishes-mockup.jpg",
  },
  spotuv: {
    badge: "DIMENSIONAL COATING",
    title: "Raised 3D Spot UV Varnish",
    desc: "An ultra-glossy, high-viscosity liquid polymer applied selectively to logotypes, patterns, or typography. When cured under UV light, it forms a tangible 3D raised tactile glaze contrasting dramatically with a matte backdrop.",
    val1: "High-Gloss Clear Polymer (Up to 50 microns raise)",
    val2: "Velvet Soft-Touch & Ultra-Matte Lamination",
    val3: "250 pieces",
    img: "assets/hero-mockup.jpg",
  },
  emboss: {
    badge: "TACTILE IMPRESSION",
    title: "Blind Embossing & Sculpted Debossing",
    desc: "Deep multi-level sculptural relief stamped directly into heavyweight fibrous papers without ink. Gives a subtle, royal architectural presence where light and shadow create the brand imprint.",
    val1: "Single-level, Multi-level & Sculpted 3D Brass Dies",
    val2: "500+ GSM Heavyweight Cotton & Textured Linen",
    val3: "100 pieces",
    img: "assets/cards-mockup.jpg",
  },
  velvet: {
    badge: "SURFACE PROTECTION",
    title: "Velvet Soft-Touch Lamination",
    desc: "An ultra-matte biaxially oriented film that imparts an irresistible, velvety peach-skin feel upon first touch. Highly fingerprint-resistant and protects packaging boxes from scuffs and abrasions during transit.",
    val1: "Matte Velvet Soft-Touch & Anti-Scratch Finish",
    val2: "Rigid Boxes, Pocket Folders, Book Covers & Cards",
    val3: "100 pieces",
    img: "assets/packaging-mockup.jpg",
  },
  gilding: {
    badge: "ARTISANAL DETAIL",
    title: "Edge Gilding & Painted Edges",
    desc: "The thick edges of stacked business cards and royal invitation cards are beveled, burnished, and foiled with genuine metallic foil or custom mixed Pantone pigments for an unmistakable luxury side-profile.",
    val1: "Mirror Gold, Rose Gold, Silver, Black Gloss & Custom Ink",
    val2: "600 to 900 GSM Triplex Sandwich & Cotton Boards",
    val3: "100 pieces",
    img: "assets/cards-mockup.jpg",
  },
  diecut: {
    badge: "CUSTOM SILHOUETTES",
    title: "Precision Laser & Steel Rule Die-Cutting",
    desc: "Custom steel rule dies or high-speed lasers cut intricate custom curves, viewing windows, interlocking tabs, and irregular brand contours into packaging and bespoke presentation pieces.",
    val1: "Complex Contours, Window Cutouts & Perforations",
    val2: "Stickers, Rigid Sleeves, Hangtags & Folders",
    val3: "200 pieces",
    img: "assets/invitation-mockup.jpg",
  },
};

// Initialize on DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  initLuxuryBackgroundAnimation();
  initMobileNav();
  initPortfolioFilters();
  initPortfolioCard3DTilt();
  initInteractiveCardSpotlights();
  initScrollDrivenTimeline();
  initTestimonialsMobileSwipe();
  initQuoteCalculator();
  initHeroGSAPReveal();
  initHero3DTilt();
  initHeroSlider();
  initScrollSpy();
  initSmoothScroll();
  // Phase 4: Micro-interactions
  initScrollProgressBar();
  initScrollReveal();
  initMagneticButtons();
  initButtonRipple();
  initSectionTitleLineWipe();
});

/* ==========================================================================
   01. MOBILE NAVIGATION
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById("mobileToggle");
  const nav = document.getElementById("mainNav");

  if (!toggleBtn || !nav) return;

  toggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = nav.classList.toggle("open");
    toggleBtn.classList.toggle("active", isOpen);
  });

  // Close nav when clicking any link
  nav.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggleBtn.classList.remove("active");
    });
  });

  // Close nav when clicking outside on mobile
  document.addEventListener("click", (e) => {
    if (
      nav.classList.contains("open") &&
      !nav.contains(e.target) &&
      !toggleBtn.contains(e.target)
    ) {
      nav.classList.remove("open");
      toggleBtn.classList.remove("active");
    }
  });
}

/* ==========================================================================
   02. SPECIAL FINISHES SWITCHER
   ========================================================================== */
function switchFinish(finishKey) {
  const data = FINISH_DATA[finishKey];
  if (!data) return;

  // Update Nav Buttons
  document.querySelectorAll(".finish-nav-item").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.finish === finishKey);
  });

  // Update Details with smooth transition
  const badge = document.getElementById("finishBadge");
  const title = document.getElementById("finishTitle");
  const desc = document.getElementById("finishDesc");
  const val1 = document.getElementById("finishVal1");
  const val2 = document.getElementById("finishVal2");
  const val3 = document.getElementById("finishVal3");
  const img = document.getElementById("finishImg");
  const sheen = document.getElementById("finishSheen");

  if (badge) badge.textContent = data.badge;
  if (title) title.textContent = data.title;
  if (desc) desc.textContent = data.desc;
  if (val1) val1.textContent = data.val1;
  if (val2) val2.textContent = data.val2;
  if (val3) val3.textContent = data.val3;
  if (img) img.src = data.img;

  // Retrigger sheen animation
  if (sheen) {
    sheen.style.animation = "none";
    sheen.offsetHeight; /* trigger reflow */
    sheen.style.animation = "light-sheen 4s ease-in-out";
  }

  // Subtle tactile pulse on finish box
  const detailBox = document.getElementById("finishDetailBox");
  if (detailBox) {
    detailBox.style.transition =
      "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)";
    detailBox.style.transform = "scale(0.99)";
    setTimeout(() => {
      detailBox.style.transform = "";
    }, 200);
  }
}

/* ==========================================================================
   03. PORTFOLIO FILTERING
   ========================================================================== */
function initPortfolioFilters() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".portfolio-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filterValue = btn.getAttribute("data-filter");

      cards.forEach((card) => {
        const cat = card.getAttribute("data-cat");
        const matches = filterValue === "all" || cat === filterValue;

        if (matches) {
          card.style.display = "flex";
          requestAnimationFrame(() => {
            card.style.opacity = "1";
            card.style.transform = "translateY(0) scale(1)";
          });
        } else {
          card.style.opacity = "0";
          card.style.transform = "translateY(8px) scale(0.98)";
          setTimeout(() => {
            if (card.style.opacity === "0") {
              card.style.display = "none";
            }
          }, 240);
        }
      });
    });
  });
}

/* ==========================================================================
   04. LIGHTBOX MODAL
   ========================================================================== */
function openLightbox(imgSrc, title, desc) {
  const modal = document.getElementById("lightboxModal");
  const lbImg = document.getElementById("lightboxImg");
  const lbTitle = document.getElementById("lightboxTitle");
  const lbDesc = document.getElementById("lightboxDesc");

  if (!modal) return;

  lbImg.src = imgSrc;
  lbTitle.textContent = title;
  lbDesc.textContent = desc;

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  const modal = document.getElementById("lightboxModal");
  if (!modal) return;

  modal.classList.remove("active");
  document.body.style.overflow = "";
}

// ESC Key listener for Lightbox
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeLightbox();
  }
});

/* ==========================================================================
   05. INTERACTIVE QUOTE BUILDER & LIVE SUMMARY
   ========================================================================== */
let currentLeadMode = "custom"; // 'custom' or 'sample'

function initQuoteCalculator() {
  updateQuoteSummary();
}

// Quick Switcher: Custom Print Quote vs Sample Kit
function setLeadMode(mode) {
  currentLeadMode = mode;
  const tabCustom = document.getElementById("tabCustomQuote");
  const tabSample = document.getElementById("tabSampleKit");
  const sampleBanner = document.getElementById("sampleKitBanner");
  const productSelect = document.getElementById("productSelect");
  const paperStock = document.getElementById("paperStock");
  const qtySelect = document.getElementById("qtySelect");
  const submitBtnLabel = document.getElementById("submitBtnLabel");
  const summaryModeLabel = document.getElementById("summaryModeLabel");
  const summaryTipText = document.getElementById("summaryTipText");
  const leadTypeHidden = document.getElementById("leadTypeHidden");
  const web3Subject = document.getElementById("web3Subject");

  if (mode === "sample") {
    if (tabCustom) {
      tabCustom.classList.remove("active");
      tabCustom.setAttribute("aria-selected", "false");
    }
    if (tabSample) {
      tabSample.classList.add("active");
      tabSample.setAttribute("aria-selected", "true");
    }
    if (sampleBanner) sampleBanner.style.display = "flex";

    if (productSelect) {
      productSelect.value = "Physical Sample Kit (₹499 / Studio Swatch Deck)";
    }
    if (paperStock) {
      paperStock.value =
        "Curated Swatch Deck (15+ Luxury Papers & Foil Catalog)";
    }
    if (qtySelect) {
      qtySelect.value = "1 Sample Kit (₹499)";
    }
    if (submitBtnLabel) {
      submitBtnLabel.textContent = "Order Sample Kit (₹499)";
    }
    if (summaryModeLabel) {
      summaryModeLabel.textContent = "PHYSICAL SAMPLE KIT REQUEST";
    }
    if (summaryTipText) {
      summaryTipText.innerHTML =
        '<span class="tip-sparkle">✦</span> ₹499 fee is 100% credited back toward your first production order!';
    }
    if (leadTypeHidden)
      leadTypeHidden.value = "Physical Sample Kit Request (₹499)";
    if (web3Subject)
      web3Subject.value = "Sample Kit Request (₹499) — CraftsVeda Studio";
  } else {
    // Custom Print Quote mode
    if (tabCustom) {
      tabCustom.classList.add("active");
      tabCustom.setAttribute("aria-selected", "true");
    }
    if (tabSample) {
      tabSample.classList.remove("active");
      tabSample.setAttribute("aria-selected", "false");
    }
    if (sampleBanner) sampleBanner.style.display = "none";

    if (productSelect && productSelect.value.includes("Sample Kit")) {
      productSelect.value = "Luxury Business Cards";
    }
    if (paperStock && paperStock.value.includes("Curated Swatch")) {
      paperStock.value = "600 GSM Natural Cotton Stock";
    }
    if (qtySelect && qtySelect.value.includes("Sample Kit")) {
      qtySelect.value = "500 pcs";
    }
    if (submitBtnLabel) {
      submitBtnLabel.textContent = "Get Instant Quote";
    }
    if (summaryModeLabel) {
      summaryModeLabel.textContent = "LIVE INQUIRY SPECIFICATION";
    }
    if (summaryTipText) {
      summaryTipText.innerHTML =
        '<span class="tip-sparkle">✦</span> Instant 30-minute response guaranteed during studio hours.';
    }
    if (leadTypeHidden) leadTypeHidden.value = "Custom Print Quote";
    if (web3Subject)
      web3Subject.value = "New Print Quote Inquiry — CraftsVeda Studio";
  }

  updateQuoteSummary();
}

function onProductChange() {
  const productSelect = document.getElementById("productSelect");
  if (!productSelect) return;

  if (productSelect.value.includes("Sample Kit")) {
    setLeadMode("sample");
  } else if (currentLeadMode === "sample") {
    setLeadMode("custom");
  } else {
    updateQuoteSummary();
  }
}

function updateQuoteSummary() {
  const productSelect = document.getElementById("productSelect");
  const paperStock = document.getElementById("paperStock");
  const qtySelect = document.getElementById("qtySelect");
  const turnaround = document.getElementById("turnaround");
  const clientCity = document.getElementById("clientCity");

  const sumProduct = document.getElementById("sumProduct");
  const sumStock = document.getElementById("sumStock");
  const sumFinishes = document.getElementById("sumFinishes");
  const sumQty = document.getElementById("sumQty");
  const sumTurnaround = document.getElementById("sumTurnaround");
  const sumCity = document.getElementById("sumCity");
  const sumCityRow = document.getElementById("sumCityRow");

  if (productSelect && sumProduct) {
    sumProduct.textContent = productSelect.value;
  }

  if (paperStock && sumStock) {
    sumStock.textContent = paperStock.value;
  }

  if (qtySelect && sumQty) {
    sumQty.textContent = qtySelect.value;
  }

  if (turnaround && sumTurnaround) {
    sumTurnaround.textContent = turnaround.value;
  }

  if (clientCity && sumCity && sumCityRow) {
    if (clientCity.value.trim().length > 0) {
      sumCity.textContent = clientCity.value.trim();
      sumCityRow.style.display = "flex";
    } else {
      sumCityRow.style.display = "none";
    }
  }

  // Selected Finishes Chips
  const selectedFinishes = [];
  document.querySelectorAll('input[name="finish"]:checked').forEach((cb) => {
    selectedFinishes.push(cb.value);
  });

  if (sumFinishes) {
    if (selectedFinishes.length > 0) {
      sumFinishes.textContent = selectedFinishes.join(", ");
    } else {
      sumFinishes.textContent = "Standard Print (No Specialty Finish)";
    }
  }
}

// Preselection helpers from What We Print & Finishes sections
function preselectQuoteProduct(productName) {
  const select = document.getElementById("productSelect");
  if (!select) return;

  if (productName.includes("Sample Kit")) {
    setLeadMode("sample");
  } else {
    setLeadMode("custom");
    const targetNorm = productName.toLowerCase();
    for (let i = 0; i < select.options.length; i++) {
      const optNorm = select.options[i].value.toLowerCase();
      if (optNorm.includes(targetNorm) || targetNorm.includes(optNorm)) {
        select.selectedIndex = i;
        break;
      }
    }
  }

  updateQuoteSummary();
  const quoteTarget = document.getElementById("quote-generator");
  if (quoteTarget) {
    scrollToTarget(quoteTarget);
  }
}

function preselectQuoteFinish(finishName) {
  setLeadMode("custom");

  // Check corresponding checkbox
  const foilCb = document.getElementById("checkFoil");
  const uvCb = document.getElementById("checkSpotUV");
  const embossCb = document.getElementById("checkEmboss");
  const velvetCb = document.getElementById("checkVelvet");
  const gildCb = document.getElementById("checkGilding");
  const dieCb = document.getElementById("checkDieCut");

  if (finishName.includes("Foil") && foilCb) foilCb.checked = true;
  if (finishName.includes("Spot UV") && uvCb) uvCb.checked = true;
  if (finishName.includes("Emboss") && embossCb) embossCb.checked = true;
  if (finishName.includes("Velvet") && velvetCb) velvetCb.checked = true;
  if (finishName.includes("Gild") && gildCb) gildCb.checked = true;
  if (finishName.includes("Die") && dieCb) dieCb.checked = true;

  updateQuoteSummary();
  const quoteTarget = document.getElementById("quote-generator");
  if (quoteTarget) {
    scrollToTarget(quoteTarget);
  }
}

/* ==========================================================================
   06. UNIFIED LEAD SUBMISSION (WEB3FORMS SILENT POST + DIRECT WHATSAPP)
   ========================================================================== */
function handleUnifiedLeadSubmit(e) {
  e.preventDefault();

  const clientName = document.getElementById("clientName")?.value.trim();
  const clientPhone = document.getElementById("clientPhone")?.value.trim();
  const clientCity =
    document.getElementById("clientCity")?.value.trim() || "Mumbai / Pan-India";
  const clientEmail =
    document.getElementById("clientEmail")?.value.trim() || "Not Provided";
  const product =
    document.getElementById("productSelect")?.value || "Luxury Printing";
  const paper = document.getElementById("paperStock")?.value || "Premium Stock";
  const qty = document.getElementById("qtySelect")?.value || "500 pcs";
  const turnaround = document.getElementById("turnaround")?.value || "Standard";
  const notes = document.getElementById("clientNotes")?.value.trim() || "None";

  if (!clientName || !clientPhone) {
    alert(
      "Please provide your Name and Phone / WhatsApp number so our studio team can connect with you.",
    );
    return;
  }

  // Finishes List
  const finishes = [];
  document.querySelectorAll('input[name="finish"]:checked').forEach((cb) => {
    finishes.push(cb.value);
  });
  const finishesText =
    finishes.length > 0
      ? finishes.join(", ")
      : "Standard Print (No Specialty Finish)";

  // 1. Asynchronously send form to Web3Forms in background for inbox logging (vkzway2@gmail.com)
  const formElement = document.getElementById("quoteCalculatorForm");
  if (formElement) {
    const formData = new FormData(formElement);
    formData.append("selected_finishes_list", finishesText);
    formData.append("submission_timestamp", new Date().toLocaleString());

    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    }).catch(() => {
      // Non-blocking catch to ensure WhatsApp and user flow are never interrupted
    });
  }

  // 2. Format Structured WhatsApp Specification Message
  const isSampleKit =
    currentLeadMode === "sample" || product.includes("Sample Kit");
  let message = "";

  if (isSampleKit) {
    message = `📦 *PHYSICAL SAMPLE KIT REQUEST — CRAFTSVEDA STUDIO* 📦
-----------------------------------------
👤 *Client / Brand:* ${clientName}
📞 *Contact No:* ${clientPhone}
📍 *Delivery City:* ${clientCity}
✉️ *Email:* ${clientEmail}

📦 *Request Type:* CraftsVeda Master Swatch Deck (₹499)
📄 *Kit Contents:* 15+ Paper Stocks (Cotton, Velvet, Handmade) + Foil Stamping & 3D UV Samples
🔢 *Quantity:* 1 Physical Kit
💡 *Credit Note:* ₹499 fee 100% credited toward first production order
📝 *Special Notes:* ${notes}

📍 *Studio Production Hub:* Saki Naka, Mumbai
-----------------------------------------
_Please dispatch sample kit details and payment link._`;
  } else {
    message = `✨ *NEW PRINT INQUIRY — CRAFTSVEDA STUDIO* ✨
-----------------------------------------
👤 *Client / Brand:* ${clientName}
📞 *Contact No:* ${clientPhone}
📍 *City / Area:* ${clientCity}
✉️ *Email:* ${clientEmail}

📦 *Product Required:* ${product}
📄 *Paper Stock:* ${paper}
✨ *Special Finishes:* ${finishesText}
🔢 *Quantity:* ${qty}
⏱️ *Turnaround Needed:* ${turnaround}
📝 *Project Notes / Sizing:* ${notes}

📍 *Studio Production Hub:* Saki Naka, Mumbai
-----------------------------------------
_Inquiry sent to vkzway2@gmail.com. Please confirm formal quotation & production schedule._`;
  }

  const encodedUrl = `https://wa.me/918840035249?text=${encodeURIComponent(message)}`;

  // 3. User Feedback Toast
  showToast(
    "Inquiry Sent! Opening WhatsApp with our print specialist at Saki Naka, Mumbai...",
  );

  // 4. Launch WhatsApp in new tab
  setTimeout(() => {
    window.open(encodedUrl, "_blank");
  }, 400);
}

function showToast(text) {
  const toast = document.getElementById("toastNotification");
  const toastText = document.getElementById("toastText");
  if (!toast || !toastText) return;

  toastText.textContent = text;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 5000);
}

/**
 * Cross-Browser Email Copy with Clipboard API, execCommand, and mailto fallback
 */
function copyEmailToClipboard(email, e) {
  if (e && typeof e.preventDefault === "function") e.preventDefault();

  if (
    navigator.clipboard &&
    typeof navigator.clipboard.writeText === "function"
  ) {
    navigator.clipboard
      .writeText(email)
      .then(() => {
        showToast("✉ Email copied to clipboard!");
      })
      .catch(() => {
        copyViaExecCommand(email);
      });
  } else {
    copyViaExecCommand(email);
  }
}

function copyViaExecCommand(text) {
  try {
    const tempInput = document.createElement("textarea");
    tempInput.value = text;
    tempInput.setAttribute("readonly", "");
    tempInput.style.position = "fixed";
    tempInput.style.opacity = "0";
    tempInput.style.left = "-9999px";
    document.body.appendChild(tempInput);
    tempInput.select();
    tempInput.setSelectionRange(0, 99999);
    const successful = document.execCommand("copy");
    document.body.removeChild(tempInput);
    if (successful) {
      showToast("✉ Email copied to clipboard!");
      return;
    }
  } catch (_) {}
  // Final fallback to native mailto link
  window.location.href = "mailto:" + text;
}

/* ==========================================================================
   07. HERO 3D TILT WITH LERP SMOOTHING & PARALLAX FOIL SWEEP
   ========================================================================== */
function initHero3DTilt() {
  const card = document.getElementById("heroGoldCard");
  const stage = document.getElementById("heroStage3d");
  const foilSweep = document.getElementById("foilLightSweep");
  if (!card || !stage) return;

  const prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let targetFoilX = 50;
  let targetFoilY = 50;
  let currentFoilX = 50;
  let currentFoilY = 50;
  let isHovered = false;

  // On touch devices / screens < 992px: gentle continuous ambient floating motion
  if (window.innerWidth < 992 || "ontouchstart" in window) {
    let floatAngle = 0;
    function floatLoop() {
      floatAngle += 0.02;
      const fX = Math.sin(floatAngle) * 2.5;
      const fY = Math.cos(floatAngle * 0.8) * 2.5;
      card.style.transform = `perspective(1400px) rotateX(${fX.toFixed(2)}deg) rotateY(${fY.toFixed(2)}deg)`;
      requestAnimationFrame(floatLoop);
    }
    requestAnimationFrame(floatLoop);
    return;
  }

  function onMouseMove(e) {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const normX = (x / rect.width) * 2 - 1; // -1 to 1
    const normY = (y / rect.height) * 2 - 1; // -1 to 1

    // Strict clamp: max ±8 degrees
    targetX = Math.max(-8, Math.min(8, -normY * 7.5));
    targetY = Math.max(-8, Math.min(8, normX * 7.5));

    targetFoilX = (x / rect.width) * 100;
    targetFoilY = (y / rect.height) * 100;
  }

  function update() {
    // Lerp damping (0.08 factor for silky smooth motion)
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;
    currentFoilX += (targetFoilX - currentFoilX) * 0.08;
    currentFoilY += (targetFoilY - currentFoilY) * 0.08;

    card.style.transform = `perspective(1400px) rotateX(${currentX.toFixed(2)}deg) rotateY(${currentY.toFixed(2)}deg)`;

    if (foilSweep && isHovered) {
      foilSweep.style.background = `radial-gradient(circle at ${currentFoilX.toFixed(1)}% ${currentFoilY.toFixed(1)}%, rgba(245, 230, 168, 0.28) 0%, transparent 60%)`;
    }

    requestAnimationFrame(update);
  }

  stage.addEventListener("mouseenter", () => {
    isHovered = true;
  });

  stage.addEventListener("mousemove", onMouseMove);

  stage.addEventListener("mouseleave", () => {
    isHovered = false;
    targetX = 0;
    targetY = 0;
    targetFoilX = 50;
    targetFoilY = 50;
  });

  requestAnimationFrame(update);
}

/* ==========================================================================
   07B. HERO LUXURY PHOTO SHOWCASE SLIDER (3D DEPTH TRANSITIONS & FULL METRICS)
   ========================================================================== */
const HERO_SLIDES_DATA = [
  {
    badge: "✦ SIGNATURE DUAL FINISH",
    title: "Metallic Gold Foil & Spot UV",
    specs: "24K Heated Brass Stamping • Raised Gloss Droplets • 600 GSM Cotton",
  },
  {
    badge: "✦ 3D TACTILE COATING",
    title: "Raised Spot UV & 3D Gloss",
    specs:
      "AccurioShine Dimensional Polymer • 50µm Tactile Raise • Matte Black",
  },
  {
    badge: "✦ PRISMATIC FOIL",
    title: "Holographic Rainbow Foil",
    specs:
      "Multi-Angle Iridescent Shimmer • Micro-Foil Detailing • Deep Contrast",
  },
  {
    badge: "✦ ARTISANAL CARDS",
    title: "24K Gold Edge Gilding & Deboss",
    specs:
      "Mirror Foil Side Profile • Blind Letterpress Relief • 700 GSM Wild Cotton",
  },
  {
    badge: "✦ BESPOKE PACKAGING",
    title: "Luxury Rigid Boxes & Packaging",
    specs:
      "Magnetic Closure & Drawer • Velvet Soft-Touch • 1200 GSM Kappa Board",
  },
];

function initHeroSlider() {
  const viewport = document.getElementById("showcaseViewport");
  const deck = document.getElementById("showcaseDeck");
  const slides = document.querySelectorAll("#showcaseDeck .showcase-slide");
  const dashes = document.querySelectorAll("#heroSliderDots .dash-btn");
  const prevBtn = document.getElementById("heroPrevBtn");
  const nextBtn = document.getElementById("heroNextBtn");
  const currentNumEl = document.getElementById("slideCurrentNum");
  const badgePill = document.getElementById("slideBadgePill");
  const finishTitle = document.getElementById("slideFinishTitle");
  const specsLine = document.getElementById("slideSpecsLine");
  const glassBar = document.getElementById("showcaseGlassBar");

  if (!viewport || slides.length === 0) return;

  if (deck) {
    deck.classList.add("showcase-deck-ready");
  }

  let currentIndex = 0;
  let autoplayTimer = null;
  const AUTOPLAY_INTERVAL = 5000;
  let isPaused = false;
  let isTransitioning = false;

  function ensureSlideLoaded(slideEl) {
    if (!slideEl) return;
    const img = slideEl.querySelector("img[data-src]");
    if (img) {
      img.src = img.getAttribute("data-src");
      img.removeAttribute("data-src");
    }
  }

  // Preload remaining slides lazily during idle time
  const preloadRemaining = () => {
    slides.forEach(ensureSlideLoaded);
  };
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(preloadRemaining, { timeout: 2000 });
  } else {
    setTimeout(preloadRemaining, 1200);
  }

  function goToSlide(newIndex) {
    if (newIndex === currentIndex || isTransitioning) return;

    if (newIndex < 0) {
      newIndex = slides.length - 1;
    } else if (newIndex >= slides.length) {
      newIndex = 0;
    }

    isTransitioning = true;
    const oldSlide = slides[currentIndex];
    const newSlide = slides[newIndex];
    const data = HERO_SLIDES_DATA[newIndex];

    // Ensure new slide image is loaded
    if (newSlide) {
      ensureSlideLoaded(newSlide);
    }

    // 1. 3D Slide Transition: Exit Old Slide with -25deg Rotation
    if (oldSlide) {
      oldSlide.classList.remove("active");
      oldSlide.classList.add("exit-3d");
      setTimeout(() => {
        oldSlide.classList.remove("exit-3d");
      }, 750);
    }

    // 2. Enter New Slide with 0deg Rotation
    if (newSlide) {
      newSlide.classList.add("active");
    }

    currentIndex = newIndex;

    // 3. Update Numerical Counter
    if (currentNumEl) {
      currentNumEl.textContent = String(currentIndex + 1).padStart(2, "0");
    }

    // 4. Update Badge Pill with subtle micro-fade
    if (badgePill && data) {
      badgePill.style.opacity = "0.4";
      badgePill.style.transform = "translateY(-2px)";
      setTimeout(() => {
        badgePill.textContent = data.badge;
        badgePill.style.opacity = "1";
        badgePill.style.transform = "translateY(0)";
      }, 150);
    }

    // 5. Update Glass Caption Bar with smooth fade
    if (glassBar && data) {
      glassBar.style.opacity = "0.5";
      setTimeout(() => {
        if (finishTitle) finishTitle.textContent = data.title;
        if (specsLine) specsLine.textContent = data.specs;
        glassBar.style.opacity = "1";
      }, 150);
    }

    // 6. Update Progress Dashes & restart timer fill
    dashes.forEach((dash, idx) => {
      if (idx === currentIndex) {
        dash.classList.add("active");
        const fill = dash.querySelector(".dash-fill");
        if (fill) {
          fill.style.animation = "none";
          void fill.offsetWidth; // Reflow
          fill.style.animation = `dashProgress ${AUTOPLAY_INTERVAL}ms linear forwards`;
        }
      } else {
        dash.classList.remove("active");
        const fill = dash.querySelector(".dash-fill");
        if (fill) {
          fill.style.animation = "none";
        }
      }
    });

    setTimeout(() => {
      isTransitioning = false;
    }, 600);

    resetAutoplay();
  }

  function resetAutoplay() {
    if (autoplayTimer) {
      clearTimeout(autoplayTimer);
      autoplayTimer = null;
    }
    if (!isPaused) {
      autoplayTimer = setTimeout(() => {
        goToSlide(currentIndex + 1);
      }, AUTOPLAY_INTERVAL);
    }
  }

  function pauseAutoplay() {
    isPaused = true;
    if (autoplayTimer) {
      clearTimeout(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function resumeAutoplay() {
    isPaused = false;
    resetAutoplay();
  }

  // Navigation Arrow Handlers
  if (prevBtn) {
    prevBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      goToSlide(currentIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      goToSlide(currentIndex + 1);
    });
  }

  // Progress Dash Buttons Click
  dashes.forEach((dash, idx) => {
    dash.addEventListener("click", (e) => {
      e.stopPropagation();
      goToSlide(idx);
    });
  });

  // Hover & Focus Pause
  viewport.addEventListener("mouseenter", pauseAutoplay);
  viewport.addEventListener("mouseleave", resumeAutoplay);
  viewport.addEventListener("focusin", pauseAutoplay);
  viewport.addEventListener("focusout", resumeAutoplay);

  // Keyboard Arrow Navigation
  window.addEventListener("keydown", (e) => {
    const heroEl = document.getElementById("hero");
    if (!heroEl) return;
    const rect = heroEl.getBoundingClientRect();
    const isInView = rect.top < window.innerHeight && rect.bottom > 0;
    if (!isInView) return;

    if (e.key === "ArrowLeft") {
      goToSlide(currentIndex - 1);
    } else if (e.key === "ArrowRight") {
      goToSlide(currentIndex + 1);
    }
  });

  // Touch Swipe Support
  let touchStartX = 0;
  let touchEndX = 0;
  viewport.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
    },
    { passive: true },
  );

  viewport.addEventListener(
    "touchend",
    (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchEndX - touchStartX;
      if (Math.abs(diff) > 40) {
        if (diff < 0) {
          goToSlide(currentIndex + 1);
        } else {
          goToSlide(currentIndex - 1);
        }
      }
    },
    { passive: true },
  );

  // Tab Visibility Change: pause when tab hidden
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      pauseAutoplay();
    } else {
      resumeAutoplay();
    }
  });

  // Initialize initial dash animation
  const initialDash = dashes[0];
  if (initialDash) {
    initialDash.classList.add("active");
    const fill = initialDash.querySelector(".dash-fill");
    if (fill) {
      fill.style.animation = `dashProgress ${AUTOPLAY_INTERVAL}ms linear forwards`;
    }
  }

  resetAutoplay();
}

/* ==========================================================================
   08. SCROLL SPY FOR NAVIGATION
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  window.addEventListener("scroll", () => {
    let current = "";
    const header =
      document.getElementById("headerMaster") ||
      document.getElementById("siteHeader");
    const headerHeight = header ? header.offsetHeight : 100;
    const scrollPos = window.pageYOffset + headerHeight + 50;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });
}

/* ==========================================================================
   09. FIXED HEADER SMOOTH SCROLLING ENGINE
   ========================================================================== */
function scrollToTarget(target) {
  const element =
    typeof target === "string" ? document.querySelector(target) : target;
  if (!element) return;

  const header =
    document.getElementById("headerMaster") ||
    document.getElementById("siteHeader");
  const headerHeight = header ? header.offsetHeight : 100;
  const elementPosition =
    element.getBoundingClientRect().top + window.pageYOffset;
  const offsetPosition = Math.max(0, elementPosition - headerHeight - 10);

  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth",
  });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (!targetId || targetId === "#" || targetId.length <= 1) return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        scrollToTarget(targetElement);

        // Close mobile nav if open
        const nav = document.getElementById("mainNav");
        const toggleBtn = document.getElementById("mobileToggle");
        if (nav && nav.classList.contains("open")) {
          nav.classList.remove("open");
          if (toggleBtn) toggleBtn.classList.remove("active");
        }

        try {
          history.pushState(null, null, targetId);
        } catch (err) {
          // Ignore state push error on local file protocol if restricted
        }
      }
    });
  });
}

/* ==========================================================================
   10. GSAP ENTRANCE TIMELINE, SVG STROKE DRAWINGS & NUMBER COUNTERS
   ========================================================================== */
function initHeroGSAPReveal() {
  const prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pantoneRing = document.getElementById("pantoneRing");
  const clockArc = document.getElementById("clockArc");
  const statGsm = document.getElementById("statGsm");
  const statPantone = document.getElementById("statPantone");
  const statRush = document.getElementById("statRush");

  function triggerSvgStrokes() {
    if (pantoneRing) pantoneRing.style.strokeDashoffset = "0";
    if (clockArc) clockArc.style.strokeDashoffset = "0";
  }

  function runCounterInterpolation() {
    const duration = 1400; // ms
    const startTime = performance.now();

    function easeOutExpo(t) {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function updateCounters(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutExpo(progress);

      if (statGsm) {
        statGsm.textContent = Math.floor(eased * 600);
      }
      if (statPantone) {
        statPantone.textContent = Math.floor(eased * 100);
      }
      if (statRush) {
        const v1 = Math.floor(eased * 24);
        const v2 = Math.floor(eased * 48);
        statRush.textContent = `${v1}-${v2}`;
      }

      if (progress < 1) {
        requestAnimationFrame(updateCounters);
      } else {
        if (statGsm) statGsm.textContent = "600";
        if (statPantone) statPantone.textContent = "100";
        if (statRush) statRush.textContent = "24-48";
      }
    }

    requestAnimationFrame(updateCounters);
  }

  if (prefersReduced) {
    if (statGsm) statGsm.textContent = "600";
    if (statPantone) statPantone.textContent = "100";
    if (statRush) statRush.textContent = "24-48";
    triggerSvgStrokes();
    return;
  }

  // Check if GSAP is available
  if (typeof gsap !== "undefined") {
    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      onStart: () => {
        setTimeout(triggerSvgStrokes, 250);
        setTimeout(runCounterInterpolation, 300);
      },
    });

    tl.from(
      "#heroBadge",
      {
        opacity: 0,
        y: -10,
        duration: 0.3,
      },
      0.05,
    )
      .from(
        ".title-line",
        {
          y: "100%",
          opacity: 0,
          duration: 0.45,
          stagger: 0.08,
        },
        0.1,
      )
      .from(
        "#heroDesc",
        {
          opacity: 0,
          y: 10,
          duration: 0.3,
        },
        0.25,
      )
      .from(
        "#heroCta",
        {
          opacity: 0,
          y: 10,
          duration: 0.3,
        },
        0.35,
      )
      .from(
        "#heroInfographics",
        {
          opacity: 0,
          y: 12,
          duration: 0.35,
        },
        0.4,
      );

    // Subtle scroll parallax
    if (typeof ScrollTrigger !== "undefined" && window.innerWidth > 991) {
      gsap.registerPlugin(ScrollTrigger);
      gsap.to("#heroVisualCol", {
        y: 35,
        ease: "none",
        scrollTrigger: {
          trigger: "#hero",
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
        },
      });
      gsap.to("#heroContent", {
        y: 18,
        ease: "none",
        scrollTrigger: {
          trigger: "#hero",
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
        },
      });
    }
  } else {
    // Graceful fallback without GSAP
    triggerSvgStrokes();
    runCounterInterpolation();
  }
}

/* ==========================================================================
   10. LUXURY BACKGROUND ANIMATION (GOLD PARTICLES & AMBIENT SHIMMER)
   ========================================================================== */
function initLuxuryBackgroundAnimation() {
  const canvas = document.getElementById("luxuryBgCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let dpr = 1;
  let particles = [];
  let animFrameId = null;
  let isPaused = false;

  const pointer = {
    x: -9999,
    y: -9999,
    radius: 90,
    active: false,
  };

  const goldColors = [
    { r: 212, g: 175, b: 55 }, // Primary 24K Gold
    { r: 243, g: 229, b: 171 }, // Pale Gold
    { r: 255, g: 215, b: 0 }, // Bright Gold
    { r: 197, g: 160, b: 89 }, // Champagne
    { r: 255, g: 255, b: 255 }, // Diamond Sparkle Speck
  ];

  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + Math.random() * 20;

      // Select particle type:
      // - 'registration': CMYK alignment registration target crosshairs (12%)
      // - 'paper': Miniature luxury paper swatch sheets drifting in 3D (12%)
      // - 'cropmark': Printer dieline corner trim marks (8%)
      // - 'bokeh': Soft ambient glowing disks (8%)
      // - 'goldDust': Shimmering 24K gold dust specks (60%)
      const rand = Math.random();
      if (rand < 0.12) {
        this.type = "registration";
        this.radius = 6 + Math.random() * 5;
        this.baseAlpha = 0.08 + Math.random() * 0.14;
        this.speedY = 0.15 + Math.random() * 0.25;
        this.speedX = (Math.random() - 0.5) * 0.2;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.008;
      } else if (rand < 0.24) {
        this.type = "paper";
        this.cardW = 10 + Math.random() * 7;
        this.cardH = 14 + Math.random() * 8;
        this.radius = Math.max(this.cardW, this.cardH);
        this.baseAlpha = 0.06 + Math.random() * 0.12;
        this.speedY = 0.18 + Math.random() * 0.3;
        this.speedX = (Math.random() - 0.5) * 0.25;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.01;
        this.flipAngle = Math.random() * Math.PI * 2;
        this.flipSpeed = 0.012 + Math.random() * 0.015;
      } else if (rand < 0.32) {
        this.type = "cropmark";
        this.radius = 5 + Math.random() * 4;
        this.baseAlpha = 0.08 + Math.random() * 0.14;
        this.speedY = 0.16 + Math.random() * 0.3;
        this.speedX = (Math.random() - 0.5) * 0.2;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.006;
      } else if (rand < 0.4) {
        this.type = "bokeh";
        this.radius = 14 + Math.random() * 22;
        this.baseAlpha = 0.015 + Math.random() * 0.03;
        this.speedY = 0.12 + Math.random() * 0.2;
        this.speedX = (Math.random() - 0.5) * 0.18;
      } else {
        this.type = "goldDust";
        this.radius = 0.6 + Math.random() * 1.8;
        this.baseAlpha = 0.1 + Math.random() * 0.35;
        this.speedY = 0.2 + Math.random() * 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
      }

      this.color = goldColors[Math.floor(Math.random() * goldColors.length)];
      this.shimmerSpeed = 0.02 + Math.random() * 0.04;
      this.shimmerPhase = Math.random() * Math.PI * 2;
      this.angle = Math.random() * Math.PI * 2;
      this.angleSpeed = 0.01 + Math.random() * 0.02;
    }

    update() {
      this.angle += this.angleSpeed;
      this.shimmerPhase += this.shimmerSpeed;
      if (this.rotation !== undefined) this.rotation += this.rotSpeed;
      if (this.flipAngle !== undefined) this.flipAngle += this.flipSpeed;

      // Natural floating upwards with harmonic sine wave drift
      this.y -= this.speedY;
      const swayScale =
        this.type === "bokeh" || this.type === "paper" ? 0.35 : 0.6;
      this.x += Math.sin(this.angle) * swayScale + this.speedX;

      // Cursor / touch interaction
      if (pointer.active) {
        const dx = this.x - pointer.x;
        const dy = this.y - pointer.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < pointer.radius && dist > 0) {
          const force = (pointer.radius - dist) / pointer.radius;
          const angle = Math.atan2(dy, dx);
          this.x += Math.cos(angle) * force * 3;
          this.y += Math.sin(angle) * force * 3;
        }
      }

      // Recycle off-screen particles
      const bound = (this.radius || 15) * 2;
      if (this.y < -bound || this.x < -bound || this.x > width + bound) {
        this.reset(false);
      }
    }

    draw() {
      const shimmer = Math.sin(this.shimmerPhase);
      let currentAlpha = this.baseAlpha + shimmer * 0.12;
      currentAlpha = Math.max(0.01, Math.min(0.85, currentAlpha));

      ctx.save();

      if (this.type === "registration") {
        // Subtle CMYK Registration Crosshair target mark
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.strokeStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${currentAlpha})`;
        ctx.lineWidth = 0.8;

        // Alignment circle
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.stroke();

        // Crosshair lines
        ctx.beginPath();
        ctx.moveTo(-this.radius * 1.5, 0);
        ctx.lineTo(this.radius * 1.5, 0);
        ctx.moveTo(0, -this.radius * 1.5);
        ctx.lineTo(0, this.radius * 1.5);
        ctx.stroke();

        // Center dot
        ctx.beginPath();
        ctx.arc(0, 0, 1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${currentAlpha * 1.2})`;
        ctx.fill();
      } else if (this.type === "paper") {
        // Miniature luxury paper card swatch drifting in 3D perspective
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.scale(Math.cos(this.flipAngle), 1); // 3D paper rotation in wind

        ctx.strokeStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${currentAlpha * 0.8})`;
        ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${currentAlpha * 0.12})`;
        ctx.lineWidth = 0.75;

        ctx.beginPath();
        ctx.rect(-this.cardW / 2, -this.cardH / 2, this.cardW, this.cardH);
        ctx.fill();
        ctx.stroke();

        // Faint inner watermark / deckle line
        ctx.beginPath();
        ctx.rect(
          -this.cardW / 2 + 2,
          -this.cardH / 2 + 2,
          this.cardW - 4,
          this.cardH - 4,
        );
        ctx.strokeStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${currentAlpha * 0.4})`;
        ctx.stroke();
      } else if (this.type === "cropmark") {
        // Printer dieline / bleed corner crop mark ( ┌ )
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.strokeStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${currentAlpha * 0.9})`;
        ctx.lineWidth = 0.85;

        ctx.beginPath();
        ctx.moveTo(-this.radius, this.radius);
        ctx.lineTo(-this.radius, -this.radius);
        ctx.lineTo(this.radius, -this.radius);
        ctx.stroke();
      } else if (this.type === "bokeh") {
        // Soft ambient bokeh disc
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        const grad = ctx.createRadialGradient(
          this.x,
          this.y,
          0,
          this.x,
          this.y,
          this.radius,
        );
        grad.addColorStop(
          0,
          `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${currentAlpha})`,
        );
        grad.addColorStop(
          1,
          `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0)`,
        );
        ctx.fillStyle = grad;
        ctx.fill();
      } else {
        // Shimmering 24K Gold Dust speck
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${currentAlpha})`;
        if (this.radius > 1.8) {
          ctx.shadowBlur = 6;
          ctx.shadowColor = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0.8)`;
        }
        ctx.fill();
      }

      ctx.restore();
    }
  }

  function resize() {
    dpr = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Refined luxury density: reduced by 50% for optimal contrast (16 on mobile, 32 on desktop)
    const targetCount = width < 768 ? 16 : 32;
    particles = [];
    for (let i = 0; i < targetCount; i++) {
      particles.push(new Particle());
    }
  }

  function animate() {
    if (isPaused) return;

    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }

    animFrameId = requestAnimationFrame(animate);
  }

  // Pointer & Touch Events
  window.addEventListener(
    "resize",
    () => {
      resize();
    },
    { passive: true },
  );

  window.addEventListener(
    "mousemove",
    (e) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
    },
    { passive: true },
  );

  window.addEventListener(
    "mouseleave",
    () => {
      pointer.active = false;
    },
    { passive: true },
  );

  window.addEventListener(
    "touchmove",
    (e) => {
      if (e.touches.length > 0) {
        pointer.x = e.touches[0].clientX;
        pointer.y = e.touches[0].clientY;
        pointer.active = true;
      }
    },
    { passive: true },
  );

  window.addEventListener(
    "touchend",
    () => {
      pointer.active = false;
    },
    { passive: true },
  );

  // Battery & CPU saving: auto-pause animation loop when tab is in background
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      isPaused = true;
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
        animFrameId = null;
      }
    } else {
      if (isHeroInView) {
        isPaused = false;
        if (!animFrameId) animFrameId = requestAnimationFrame(animate);
      }
    }
  });

  // Performance: Pause particle loop when hero section is scrolled out of viewport
  let isHeroInView = true;
  const heroSectionEl = document.getElementById("hero");
  if (heroSectionEl && "IntersectionObserver" in window) {
    const heroObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isHeroInView = entry.isIntersecting;
          if (!isHeroInView) {
            isPaused = true;
            if (animFrameId) {
              cancelAnimationFrame(animFrameId);
              animFrameId = null;
            }
          } else if (!document.hidden) {
            isPaused = false;
            if (!animFrameId) {
              animFrameId = requestAnimationFrame(animate);
            }
          }
        });
      },
      { threshold: 0.02 },
    );
    heroObserver.observe(heroSectionEl);
  }

  resize();
  animFrameId = requestAnimationFrame(animate);
}

/* ==========================================================================
   PHASE 2: SYNCHRONIZED GOLD CONIC ROTATOR & 3D INTERACTIVE CARD ARCHITECTURE
   ========================================================================== */

/**
 * 1. Synchronized Gold Conic Angle Engine
 * Provides fluid 60fps fallback rotation for browsers lacking CSS @property support
 */
(function initGoldConicFallbackEngine() {
  if (window.CSS && CSS.registerProperty) return;
  document.documentElement.classList.add("gold-conic-js-fallback");

  let angle = 0;
  let lastTime = performance.now();
  let rafId = null;

  function step(currentTime) {
    const delta = (currentTime - lastTime) / 1000;
    lastTime = currentTime;
    // 60 deg/sec = 6 seconds for a full luxury rotation
    angle = (angle + delta * 60) % 360;
    document.documentElement.style.setProperty(
      "--gold-conic-angle",
      angle.toFixed(1) + "deg",
    );
    rafId = requestAnimationFrame(step);
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    } else {
      lastTime = performance.now();
      if (!rafId) rafId = requestAnimationFrame(step);
    }
  });

  rafId = requestAnimationFrame(step);
})();

/**
 * 2. Dynamic Cursor Spotlight Shimmer
 * Tracks cursor position across luxury cards and translates ambient gold radiance
 */
function initInteractiveCardSpotlights() {
  if (window.innerWidth < 992 || "ontouchstart" in window) return;

  const targetCards = document.querySelectorAll(
    ".portfolio-card, .finish-detail-box, .custom-print-banner, .gold-frame, .summary-card, .category-card",
  );

  targetCards.forEach((card) => {
    card.addEventListener(
      "mousemove",
      (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty("--mouse-x", `${x.toFixed(1)}%`);
        card.style.setProperty("--mouse-y", `${y.toFixed(1)}%`);
      },
      { passive: true },
    );
  });
}

/**
 * 3. Portfolio Card 3D Perspective Tilt
 * Adds smooth tactile 3D depth to showcase cards on desktop
 */
function initPortfolioCard3DTilt() {
  if (window.innerWidth < 992 || "ontouchstart" in window) return;

  const cards = document.querySelectorAll(".portfolio-card");
  cards.forEach((card) => {
    let rafId = null;
    let targetRx = 0;
    let targetRy = 0;
    let curRx = 0;
    let curRy = 0;

    function updateTilt() {
      curRx += (targetRx - curRx) * 0.12;
      curRy += (targetRy - curRy) * 0.12;
      card.style.transform = `perspective(1000px) rotateX(${curRx.toFixed(2)}deg) rotateY(${curRy.toFixed(2)}deg) translateY(-6px)`;
      if (
        Math.abs(targetRx - curRx) > 0.04 ||
        Math.abs(targetRy - curRy) > 0.04
      ) {
        rafId = requestAnimationFrame(updateTilt);
      } else {
        rafId = null;
      }
    }

    card.addEventListener(
      "mousemove",
      (e) => {
        const rect = card.getBoundingClientRect();
        const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const normY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
        targetRx = -normY * 5; // clamp to max ±5 deg
        targetRy = normX * 5;
        if (!rafId) rafId = requestAnimationFrame(updateTilt);
      },
      { passive: true },
    );

    card.addEventListener(
      "mouseleave",
      () => {
        targetRx = 0;
        targetRy = 0;
        card.style.transform = "";
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      },
      { passive: true },
    );
  });
}

/**
 * 4. Scroll-Driven Timeline Progress Line (#how-it-works)
 * Smoothly scales the gold line across the 5 process steps on scroll
 * Supports horizontal progression on desktop and vertical progression on mobile
 */
function initScrollDrivenTimeline() {
  const line = document.getElementById("timelineProgressLine");
  const section = document.getElementById("how-it-works");
  if (!line || !section) return;

  const steps = section.querySelectorAll(".process-step");

  function updateTimeline() {
    const rect = section.getBoundingClientRect();
    const windowH = window.innerHeight;
    const startOffset = windowH * 0.85;
    const endOffset = windowH * 0.15;
    const totalDist = rect.height + startOffset - endOffset;
    const currentPos = startOffset - rect.top;
    let progress = currentPos / totalDist;
    progress = Math.max(0, Math.min(1, progress));

    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      line.style.width = "100%";
      line.style.height = `${(progress * 100).toFixed(1)}%`;
    } else {
      line.style.height = "100%";
      line.style.width = `${(progress * 100).toFixed(1)}%`;
    }

    // Step milestone activations as the line reaches each step
    const thresholds = [0.05, 0.25, 0.5, 0.75, 0.95];
    steps.forEach((step, idx) => {
      const milestone =
        thresholds[idx] !== undefined
          ? thresholds[idx]
          : idx / (steps.length - 1);
      if (progress >= milestone) {
        step.classList.add("is-active");
      } else {
        step.classList.remove("is-active");
      }
    });
  }

  window.addEventListener("scroll", updateTimeline, { passive: true });
  window.addEventListener("resize", updateTimeline, { passive: true });
  updateTimeline();
}

/**
 * 5. Testimonials Mobile Swipe Support (#testimonials)
 * Touch events enable smooth horizontal swipe on mobile screens
 */
function initTestimonialsMobileSwipe() {
  const grid = document.querySelector(".testimonials-grid");
  if (!grid) return;

  let startX = 0;
  let scrollLeft = 0;
  let isDown = false;

  grid.addEventListener(
    "touchstart",
    (e) => {
      isDown = true;
      startX = e.touches[0].pageX - grid.offsetLeft;
      scrollLeft = grid.scrollLeft;
    },
    { passive: true },
  );

  grid.addEventListener(
    "touchmove",
    (e) => {
      if (!isDown) return;
      const x = e.touches[0].pageX - grid.offsetLeft;
      const walk = (x - startX) * 1.5;
      grid.scrollLeft = scrollLeft - walk;
    },
    { passive: true },
  );

  grid.addEventListener(
    "touchend",
    () => {
      isDown = false;
    },
    { passive: true },
  );
}

/* ==========================================================================
   PHASE 4: MICRO-INTERACTION ENGINES
   ========================================================================== */

/**
 * P4-1. Scroll Progress Bar
 * Thin gold bar at the top of the page showing reading progress
 */
function initScrollProgressBar() {
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
    return;

  const bar = document.createElement("div");
  bar.className = "scroll-progress-bar";
  bar.setAttribute("aria-hidden", "true");
  document.body.prepend(bar);

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = progress.toFixed(1) + "%";
  }

  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();
}

/**
 * P4-2. Scroll-Reveal Animation System
 * IntersectionObserver-based reveal for section headers and content blocks.
 * Also handles stagger-reveal for grid children with sequential delays.
 */
function initScrollReveal() {
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
    return;
  if (!("IntersectionObserver" in window)) return;

  // Tag section headers for reveal
  document.querySelectorAll(".section-header").forEach((h) => {
    if (!h.closest(".hero-section")) h.classList.add("scroll-reveal");
  });

  // Tag key content containers
  document
    .querySelectorAll(
      ".finishes-explorer, .quote-main-wrapper, .custom-print-banner, .finish-detail-box",
    )
    .forEach((el) => el.classList.add("scroll-reveal"));

  // Tag grid items for stagger
  const staggerContainers = document.querySelectorAll(
    ".categories-grid, .portfolio-filter-grid, .features-grid, .testimonials-grid",
  );
  staggerContainers.forEach((grid) => {
    Array.from(grid.children).forEach((child, i) => {
      child.classList.add("stagger-child");
      child.style.transitionDelay = `${i * 80}ms`;
    });
  });

  // Observe scroll-reveal elements
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
  );

  document
    .querySelectorAll(".scroll-reveal")
    .forEach((el) => revealObserver.observe(el));

  // Observe stagger children
  const staggerObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          staggerObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
  );

  document
    .querySelectorAll(".stagger-child")
    .forEach((el) => staggerObserver.observe(el));
}

/**
 * P4-3. Magnetic Button Effect
 * CTA buttons subtly pull toward cursor on hover (desktop only)
 */
function initMagneticButtons() {
  if (window.innerWidth < 992 || "ontouchstart" in window) return;
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
    return;

  const buttons = document.querySelectorAll(
    ".hero-cta-button, .cta-primary, .btn-submit-quote",
  );

  buttons.forEach((btn) => {
    btn.classList.add("magnetic-btn");

    btn.addEventListener(
      "mousemove",
      (e) => {
        const rect = btn.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) * 0.2;
        const dy = (e.clientY - cy) * 0.2;
        btn.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
      },
      { passive: true },
    );

    btn.addEventListener(
      "mouseleave",
      () => {
        btn.style.transform = "";
      },
      { passive: true },
    );
  });
}

/**
 * P4-4. Button Click Ripple
 * Material-style expanding ripple on CTA button clicks
 */
function initButtonRipple() {
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
    return;

  const buttons = document.querySelectorAll(
    ".hero-cta-button, .cta-primary, .btn-submit-quote, .lead-tab, .finish-nav-item",
  );

  buttons.forEach((btn) => {
    btn.style.position = btn.style.position || "relative";
    btn.style.overflow = "hidden";

    btn.addEventListener("click", (e) => {
      const ripple = document.createElement("span");
      ripple.className = "btn-ripple";

      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = e.clientX - rect.left - size / 2 + "px";
      ripple.style.top = e.clientY - rect.top - size / 2 + "px";

      btn.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove());
    });
  });
}

/**
 * P4-5. Section Title Gold Line Wipe
 * Animated gold underline appears under section titles as they enter viewport
 */
function initSectionTitleLineWipe() {
  const prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced || !("IntersectionObserver" in window)) {
    document
      .querySelectorAll(".section-title")
      .forEach((t) => t.classList.add("line-wipe-active"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("line-wipe-active");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5, rootMargin: "0px 0px -30px 0px" },
  );

  document.querySelectorAll(".section-title").forEach((title) => {
    observer.observe(title);
  });
}
