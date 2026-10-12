/**
 * CraftsVeda — Premium Printing Studio
 * Saki Naka, Mumbai
 * Interactive Engine & WhatsApp Quotation Builder
 */

// Global Campaign Configuration (Festival / Seasonal Discounts)
const CAMPAIGN_CONFIG = {
  isActive: true,                // Set to false after Diwali
  name: "Diwali Special",
  discountPercent: 15,
  badgeText: "🪔 Diwali Special: 15% Auto-Applied"
};

// Finish Data Matrix for Interactive Finishes Explorer
const FINISH_DATA = {
  foil: {
    badge: "HOT FOIL STAMPING",
    title: "24K Metallic Foil Stamping",
    desc: "Using precision heated brass dies, metallic pigment is transferred directly under extreme pressure into the fibers of the card stock. Creates an unmissable mirror-like reflection that never chips or dulls over time.",
    val1: "Gold, Rose Gold, Silver, Copper, Hologram",
    val2: "Soft-Touch Velvet, 600 GSM Cotton, Black Board",
    val3: "100 pieces (Custom Dies included)",
    img: "assets/product-packaging.jpg",
  },
  spotuv: {
    badge: "DIMENSIONAL COATING",
    title: "Raised 3D Spot UV Varnish",
    desc: "An ultra-glossy, high-viscosity liquid polymer applied selectively to logotypes, patterns, or typography. When cured under UV light, it forms a tangible 3D raised tactile glaze contrasting dramatically with a matte backdrop.",
    val1: "High-Gloss Clear Polymer (Up to 50 microns raise)",
    val2: "Velvet Soft-Touch & Ultra-Matte Lamination",
    val3: "250 pieces",
    img: "assets/finish-raised-uv.jpg",
  },
  emboss: {
    badge: "TACTILE IMPRESSION",
    title: "Blind Embossing & Sculpted Debossing",
    desc: "Deep multi-level sculptural relief stamped directly into heavyweight fibrous papers without ink. Gives a subtle, royal architectural presence where light and shadow create the brand imprint.",
    val1: "Single-level, Multi-level & Sculpted 3D Brass Dies",
    val2: "500+ GSM Heavyweight Cotton & Textured Linen",
    val3: "100 pieces",
    img: "assets/Emboss vs Deboss_ CraftsVeda Logo Mockup.png",
  },
  velvet: {
    badge: "SURFACE PROTECTION",
    title: "Velvet Soft-Touch Lamination",
    desc: "An ultra-matte biaxially oriented film that imparts an irresistible, velvety peach-skin feel upon first touch. Highly fingerprint-resistant and protects packaging boxes from scuffs and abrasions during transit.",
    val1: "Matte Velvet Soft-Touch & Anti-Scratch Finish",
    val2: "Rigid Boxes, Pocket Folders, Book Covers & Cards",
    val3: "100 pieces",
    img: "assets/Velvet Soft-Touch Card Showcase.png",
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
  initEnquiryForm();
  initQuoteModal();
  initCardCalculator();
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
  const goldCard = document.getElementById("heroGoldCard");

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

  // Whole Card / Viewport Click Navigation:
  // Left half click = Previous slide, Right half click = Next slide
  let isSwiping = false;

  const stageTarget = goldCard || viewport;
  stageTarget.addEventListener("click", (e) => {
    // If a touch swipe was just performed, suppress synthetic click
    if (isSwiping) {
      isSwiping = false;
      return;
    }
    // Let arrow buttons and dash buttons execute their dedicated listeners
    if (
      e.target.closest("#heroPrevBtn") ||
      e.target.closest("#heroNextBtn") ||
      e.target.closest(".dash-btn")
    ) {
      return;
    }

    const rect = viewport.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    if (clickX < rect.width / 2) {
      goToSlide(currentIndex - 1);
    } else {
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
        isSwiping = true;
        setTimeout(() => {
          isSwiping = false;
        }, 350);
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
          onComplete: () => {
            const masks = document.querySelectorAll(".title-line-mask");
            masks.forEach((m) => (m.style.overflow = "visible"));
          },
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
    ".hero-cta-button, .cta-primary, .btn-submit-quote, .lead-tab, .btn-enquiry-submit",
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

/* ==========================================================================
   15. DIRECT CONTACT ENQUIRY FORM (WEB3FORMS AJAX + 10-DIGIT VALIDATION)
   ========================================================================== */
function initEnquiryForm() {
  const form = document.getElementById("contactEnquiryForm");
  if (!form) return;

  const nameInput = document.getElementById("enquiryName");
  const phoneInput = document.getElementById("enquiryPhone");
  const nameError = document.getElementById("enquiryNameError");
  const phoneError = document.getElementById("enquiryPhoneError");
  const statusBox = document.getElementById("enquiryStatusBox");
  const submitBtn = document.getElementById("btnEnquirySubmit");
  const submitLabel = document.getElementById("btnEnquirySubmitLabel");

  // Real-time error clearance
  if (nameInput) {
    nameInput.addEventListener("input", () => {
      nameInput.classList.remove("input-error");
      if (nameError) nameError.textContent = "";
    });
  }

  if (phoneInput) {
    phoneInput.addEventListener("input", () => {
      phoneInput.classList.remove("input-error");
      if (phoneError) phoneError.textContent = "";
    });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Reset status & errors
    if (statusBox) {
      statusBox.style.display = "none";
      statusBox.className = "enquiry-status-box";
      statusBox.innerHTML = "";
    }
    if (nameError) nameError.textContent = "";
    if (phoneError) phoneError.textContent = "";
    if (nameInput) nameInput.classList.remove("input-error");
    if (phoneInput) phoneInput.classList.remove("input-error");

    let isValid = true;
    const nameVal = nameInput ? nameInput.value.trim() : "";
    const phoneVal = phoneInput ? phoneInput.value.trim() : "";

    // 1. Name validation
    if (!nameVal) {
      isValid = false;
      if (nameInput) nameInput.classList.add("input-error");
      if (nameError) nameError.textContent = "Kripya apna naam enter karein.";
      if (nameInput) nameInput.focus();
    }

    // 2. Phone 10-digit validation
    let cleanDigits = phoneVal.replace(/\D/g, "");
    if (cleanDigits.length === 12 && cleanDigits.startsWith("91")) {
      cleanDigits = cleanDigits.substring(2);
    } else if (cleanDigits.length === 11 && cleanDigits.startsWith("0")) {
      cleanDigits = cleanDigits.substring(1);
    }

    if (!phoneVal) {
      isValid = false;
      if (phoneInput) phoneInput.classList.add("input-error");
      if (phoneError) phoneError.textContent = "Kripya apna phone number enter karein.";
      if (isValid && phoneInput) phoneInput.focus();
    } else if (cleanDigits.length !== 10) {
      isValid = false;
      if (phoneInput) phoneInput.classList.add("input-error");
      if (phoneError) phoneError.textContent = "Kripya 10-digit phone number enter karein (e.g. 9820012345).";
      if (isValid && phoneInput) phoneInput.focus();
    }

    if (!isValid) return;

    // Prepare FormData
    const formData = new FormData(form);
    formData.set("phone", cleanDigits);
    formData.append("submission_time", new Date().toLocaleString());

    // UI: "Sending..." status with spinner
    const originalBtnHTML = submitLabel ? submitLabel.innerHTML : "Submit Enquiry";
    if (submitBtn) submitBtn.disabled = true;
    if (submitLabel) {
      submitLabel.innerHTML = `
        <svg class="btn-spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation: spinWa 0.8s linear infinite; vertical-align: -2px; margin-right: 6px;">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10"></path>
        </svg>
        Sending...
      `;
    }

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      const result = await response.json();

      if (response.ok && (result.success || result.status === 200)) {
        form.reset();
        if (statusBox) {
          statusBox.className = "enquiry-status-box status-success";
          statusBox.innerHTML = `
            <div class="status-content">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Thank you, hum jaldi sampark karenge</span>
            </div>
          `;
          statusBox.style.display = "block";
        }
      } else {
        throw new Error(result.message || "Submission failed");
      }
    } catch (err) {
      if (statusBox) {
        statusBox.className = "enquiry-status-box status-failure";
        statusBox.innerHTML = `
          <div class="status-content">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>Kuch galat hua, <a href="https://wa.me/918840035249?text=Hi%20CraftsVeda%2C%20mujhe%20printing%20ke%20baare%20me%20enquiry%20karni%20hai" target="_blank" rel="noopener noreferrer" class="status-wa-link">WhatsApp pe message karein →</a></span>
          </div>
        `;
        statusBox.style.display = "block";
      }
    } finally {
      if (submitBtn) submitBtn.disabled = false;
      if (submitLabel) submitLabel.innerHTML = originalBtnHTML;
    }
  });
}

/* ==========================================================================
   16. QUICK QUOTE MODAL CONTROLLER (ACCESSIBLE, SMOOTH & WEB3FORMS CONNECTED)
   ========================================================================== */
function initQuoteModal() {
  const modalWrap = document.getElementById("quoteModal");
  if (!modalWrap) return;

  const closeBtn = document.getElementById("quoteModalClose");
  const backdrop = document.getElementById("quoteModalBackdrop");
  const form = document.getElementById("quickQuoteForm");
  const nameInput = document.getElementById("quickQuoteName");
  const phoneInput = document.getElementById("quickQuotePhone");
  const notesInput = document.getElementById("quickQuoteNotes");
  const nameError = document.getElementById("quickQuoteNameError");
  const phoneError = document.getElementById("quickQuotePhoneError");
  const statusBox = document.getElementById("quickQuoteStatus");
  const submitBtn = document.getElementById("btnQuickQuoteSubmit");
  const submitLabel = document.getElementById("btnQuickQuoteSubmitLabel");

  function openModal(defaultNotes = "") {
    modalWrap.classList.add("active");
    modalWrap.setAttribute("aria-hidden", "false");
    document.body.classList.add("cv-modal-open");
    if (notesInput && defaultNotes) {
      notesInput.value = defaultNotes;
    }
    if (nameInput) {
      setTimeout(() => nameInput.focus(), 120);
    }
  }

  function closeModal() {
    modalWrap.classList.remove("active");
    modalWrap.setAttribute("aria-hidden", "true");
    document.body.classList.remove("cv-modal-open");
    if (nameError) nameError.textContent = "";
    if (phoneError) phoneError.textContent = "";
    if (nameInput) nameInput.classList.remove("input-error");
    if (phoneInput) phoneInput.classList.remove("input-error");
    if (statusBox) {
      statusBox.style.display = "none";
      statusBox.innerHTML = "";
    }
  }

  // Open modal triggers
  document.querySelectorAll('#headerGetQuoteBtn, #mobileNavGetQuoteBtn, [data-open-modal="quote"]').forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const customNotes = btn.getAttribute("data-quote-notes") || "";
      openModal(customNotes);
    });
  });

  window.openQuoteModal = openModal;
  window.closeQuoteModal = closeModal;

  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (backdrop) backdrop.addEventListener("click", closeModal);

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalWrap.classList.contains("active")) {
      closeModal();
    }
  });

  if (nameInput) {
    nameInput.addEventListener("input", () => {
      nameInput.classList.remove("input-error");
      if (nameError) nameError.textContent = "";
    });
  }

  if (phoneInput) {
    phoneInput.addEventListener("input", () => {
      phoneInput.classList.remove("input-error");
      if (phoneError) phoneError.textContent = "";
    });
  }

  // Web3Forms Form handler
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (statusBox) {
        statusBox.style.display = "none";
        statusBox.className = "enquiry-status-box";
        statusBox.innerHTML = "";
      }
      if (nameError) nameError.textContent = "";
      if (phoneError) phoneError.textContent = "";
      if (nameInput) nameInput.classList.remove("input-error");
      if (phoneInput) phoneInput.classList.remove("input-error");

      let isValid = true;
      const nameVal = nameInput ? nameInput.value.trim() : "";
      const phoneVal = phoneInput ? phoneInput.value.trim() : "";

      if (!nameVal) {
        isValid = false;
        if (nameInput) nameInput.classList.add("input-error");
        if (nameError) nameError.textContent = "Kripya apna naam enter karein.";
        if (nameInput) nameInput.focus();
      }

      let cleanDigits = phoneVal.replace(/\D/g, "");
      if (cleanDigits.length === 12 && cleanDigits.startsWith("91")) {
        cleanDigits = cleanDigits.substring(2);
      } else if (cleanDigits.length === 11 && cleanDigits.startsWith("0")) {
        cleanDigits = cleanDigits.substring(1);
      }

      if (!phoneVal) {
        isValid = false;
        if (phoneInput) phoneInput.classList.add("input-error");
        if (phoneError) phoneError.textContent = "Kripya apna phone number enter karein.";
        if (isValid && phoneInput) phoneInput.focus();
      } else if (cleanDigits.length !== 10) {
        isValid = false;
        if (phoneInput) phoneInput.classList.add("input-error");
        if (phoneError) phoneError.textContent = "Kripya 10-digit phone number enter karein (e.g. 9820012345).";
        if (isValid && phoneInput) phoneInput.focus();
      }

      if (!isValid) return;

      const formData = new FormData(form);
      formData.set("phone", cleanDigits);
      formData.append("submission_time", new Date().toLocaleString());

      const originalBtnHTML = submitLabel ? submitLabel.innerHTML : "Submit Enquiry";
      if (submitBtn) submitBtn.disabled = true;
      if (submitLabel) {
        submitLabel.innerHTML = `
          <svg class="btn-spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation: spinWa 0.8s linear infinite; vertical-align: -2px; margin-right: 6px;">
            <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
            <path d="M12 2a10 10 0 0 1 10 10"></path>
          </svg>
          Sending...
        `;
      }

      try {
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: formData,
          headers: { Accept: "application/json" }
        });

        const result = await response.json();
        if (response.ok && (result.success || result.status === 200)) {
          form.reset();
          if (statusBox) {
            statusBox.className = "enquiry-status-box status-success";
            statusBox.innerHTML = `
              <div class="status-content">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Thank you, hum jaldi sampark karenge</span>
              </div>
            `;
            statusBox.style.display = "block";
          }
          setTimeout(() => {
            closeModal();
          }, 3500);
        } else {
          throw new Error(result.message || "Submission failed");
        }
      } catch (err) {
        if (statusBox) {
          statusBox.className = "enquiry-status-box status-failure";
          statusBox.innerHTML = `
            <div class="status-content">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>Kuch galat hua, <a href="https://wa.me/918840035249?text=Hi%20CraftsVeda%2C%20mujhe%20printing%20ke%20baare%20me%20enquiry%20karni%20hai" target="_blank" rel="noopener noreferrer" class="status-wa-link">WhatsApp pe message karein →</a></span>
            </div>
          `;
          statusBox.style.display = "block";
        }
      } finally {
        if (submitBtn) submitBtn.disabled = false;
        if (submitLabel) submitLabel.innerHTML = originalBtnHTML;
      }
    });
  }
}

/* ==========================================================================
   17. LUXURY BUSINESS CARDS LIVE CALCULATOR & RATE MATRIX (+25% HIKE)
   ========================================================================== */
function initCardCalculator() {
  const calcContainer = document.getElementById("luxuryCardCalc");
  if (!calcContainer) return;

  // 1. Official Plain Card Base Rate Table
  const PLAIN_CARD_RATES = {
    "350_matt_one":   { 100: 240, 200: 456, 300: 648, 400: 816, 500: 960, 1000: 1680 },
    "400_matt_one":   { 100: 280, 200: 532, 300: 756, 400: 952, 500: 1120, 1000: 1960 },
    "350_matt_both":  { 100: 300, 200: 570, 300: 810, 400: 1020, 500: 1200, 1000: 2100 },
    "400_matt_both":  { 100: 340, 200: 646, 300: 918, 400: 1156, 500: 1360, 1000: 2380 },
    "350_velvet_one": { 100: 285, 200: 542, 300: 768, 400: 968, 500: 1140, 1000: 2000 },
    "400_velvet_one": { 100: 320, 200: 608, 300: 864, 400: 1088, 500: 1280, 1000: 2240 },
    "350_velvet_both":{ 100: 375, 200: 713, 300: 1013, 400: 1275, 500: 1500, 1000: 2625 },
    "400_velvet_both":{ 100: 415, 200: 789, 300: 1121, 400: 1411, 500: 1660, 1000: 2905 }
  };

  const PLAIN_SAVINGS = {
    100: 0,
    200: 5,
    300: 10,
    400: 15,
    500: 20,
    1000: 30
  };

  // 2. Add-on Pricing (Section 9)
  const CUSTOM_SHAPE_CUT_RATES = {
    100: 90,
    200: 140,
    300: 180,
    400: 220,
    500: 250,
    1000: 480
  };

  const DRIPOFF_RATES = {
    one_side: { 100: 125, 200: 225, 300: 325, 400: 425, 500: 525, 1000: 1050 },
    both_side: { 100: 250, 200: 450, 300: 650, 400: 850, 500: 1050, 1000: 2100 }
  };

  // 3. 2026 Finish Chart Selling Rates (BV-01..12 & BM-01..12)
  const FINISH_RATES = {
    velvet: {
      "01": { p350: { 100: 519, 200: 775, 300: 1006, 400: 1263, 500: 1488, 1000: 2806 }, p400: { 100: 544, 200: 825, 300: 1069, 400: 1350, 500: 1594, 1000: 3019 } },
      "02": { p350: { 100: 569, 200: 856, 300: 1119, 400: 1406, 500: 1669, 1000: 3163 }, p400: { 100: 594, 200: 906, 300: 1181, 400: 1494, 500: 1775, 1000: 3375 } },
      "03": { p350: { 100: 744, 200: 1175, 300: 1563, 400: 1994, 500: 2375, 1000: 4581 }, p400: { 100: 775, 200: 1225, 300: 1638, 400: 2081, 500: 2481, 1000: 4794 } },
      "04": { p350: { 100: 781, 200: 1244, 300: 1650, 400: 2106, 500: 2519, 1000: 4863 }, p400: { 100: 806, 200: 1288, 300: 1719, 400: 2194, 500: 2625, 1000: 5075 } },
      "05": { p350: { 100: 825, 200: 1319, 300: 1763, 400: 2250, 500: 2694, 1000: 5219 }, p400: { 100: 856, 200: 1369, 300: 1831, 400: 2344, 500: 2800, 1000: 5431 } },
      "06": { p350: { 100: 1188, 200: 1963, 300: 2656, 400: 3425, 500: 4113, 1000: 8056 }, p400: { 100: 1219, 200: 2013, 300: 2725, 400: 3513, 500: 4219, 1000: 8269 } },
      "07": { p350: { 100: 600, 200: 919, 300: 1206, 400: 1525, 500: 1806, 1000: 3444 }, p400: { 100: 625, 200: 969, 300: 1275, 400: 1613, 500: 1913, 1000: 3656 } },
      "08": { p350: { 100: 644, 200: 1000, 300: 1319, 400: 1669, 500: 1988, 1000: 3800 }, p400: { 100: 675, 200: 1050, 300: 1388, 400: 1763, 500: 2094, 1000: 4013 } },
      "09": { p350: { 100: 825, 200: 1319, 300: 1763, 400: 2250, 500: 2694, 1000: 5219 }, p400: { 100: 856, 200: 1369, 300: 1831, 400: 2344, 500: 2800, 1000: 5431 } },
      "10": { p350: { 100: 1013, 200: 1644, 300: 2225, 400: 2838, 500: 3400, 1000: 6638 }, p400: { 100: 1038, 200: 1688, 300: 2281, 400: 2925, 500: 3513, 1000: 6850 } },
      "11": { p350: { 100: 1056, 200: 1719, 300: 2325, 400: 2988, 500: 3581, 1000: 6988 }, p400: { 100: 1088, 200: 1769, 300: 2394, 400: 3075, 500: 3688, 1000: 7206 } },
      "12": { p350: { 100: 1056, 200: 1719, 300: 2325, 400: 2988, 500: 3581, 1000: 6988 }, p400: { 100: 1094, 200: 1769, 300: 2388, 400: 3075, 500: 3688, 1000: 7200 } }
    },
    matt: {
      "01": { p350: { 100: 494, 200: 725, 300: 938, 400: 1175, 500: 1381, 1000: 2594 }, p400: { 100: 519, 200: 775, 300: 1006, 400: 1263, 500: 1488, 1000: 2818 } },
      "02": { p350: { 100: 538, 200: 806, 300: 1056, 400: 1319, 500: 1563, 1000: 2950 }, p400: { 100: 569, 200: 856, 300: 1119, 400: 1406, 500: 1669, 1000: 3163 } },
      "03": { p350: { 100: 719, 200: 1125, 300: 1494, 400: 1906, 500: 2269, 1000: 4369 }, p400: { 100: 744, 200: 1175, 300: 1563, 400: 1994, 500: 2375, 1000: 4581 } },
      "04": { p350: { 100: 725, 200: 1144, 300: 1519, 400: 1931, 500: 2306, 1000: 4438 }, p400: { 100: 763, 200: 1219, 300: 1588, 400: 2019, 500: 2413, 1000: 4650 } },
      "05": { p350: { 100: 775, 200: 1225, 300: 1631, 400: 2081, 500: 2481, 1000: 4794 }, p400: { 100: 800, 200: 1275, 300: 1700, 400: 2169, 500: 2588, 1000: 5013 } },
      "06": { p350: { 100: 1138, 200: 1869, 300: 2525, 400: 3250, 500: 3900, 1000: 7625 }, p400: { 100: 1163, 200: 1913, 300: 2594, 400: 3338, 500: 4006, 1000: 7838 } },
      "07": { p350: { 100: 544, 200: 825, 300: 1069, 400: 1350, 500: 1594, 1000: 3019 }, p400: { 100: 575, 200: 875, 300: 1138, 400: 1438, 500: 1700, 1000: 3229 } },
      "08": { p350: { 100: 594, 200: 906, 300: 1181, 400: 1494, 500: 1775, 1000: 3375 }, p400: { 100: 619, 200: 950, 300: 1250, 400: 1581, 500: 1875, 1000: 3588 } },
      "09": { p350: { 100: 775, 200: 1225, 300: 1625, 400: 2081, 500: 2481, 1000: 4794 }, p400: { 100: 800, 200: 1275, 300: 1700, 400: 2169, 500: 2588, 1000: 5000 } },
      "10": { p350: { 100: 844, 200: 1544, 300: 2075, 400: 2663, 500: 3188, 1000: 6213 }, p400: { 100: 981, 200: 1594, 300: 2144, 400: 2750, 500: 3294, 1000: 6425 } },
      "11": { p350: { 100: 1000, 200: 1625, 300: 2188, 400: 2813, 500: 3369, 1000: 6563 }, p400: { 100: 1025, 200: 1675, 300: 2263, 400: 2900, 500: 3475, 1000: 6775 } },
      "12": { p350: { 100: 1088, 200: 1788, 300: 2413, 400: 3100, 500: 3725, 1000: 7275 }, p400: { 100: 1119, 200: 1831, 300: 2481, 400: 3188, 500: 3831, 1000: 7488 } }
    }
  };

  // CENTRAL PRICING ENGINE
  function calculateBusinessCardPrice(sel) {
    const qty = parseInt(sel.quantity, 10);
    const stock = sel.paperStock === "400" ? "400" : "350";
    const lam = (sel.lamination === "gloss" || sel.lamination === "matt") ? "matt" : "velvet";
    const side = sel.printSide === "one_side" ? "one" : "both";
    const isSpecialFoil = ["rose_gold", "copper", "red", "black", "pink", "blue", "rainbow"].includes(sel.foilColour);
    const hasFoil = sel.foil && sel.foil !== "none";
    const hasUv = sel.spotUv && sel.spotUv !== "none";

    // CASE A: Plain Card (No UV, No Foil)
    if (!hasFoil && !hasUv) {
      const key = stock + "_" + lam + "_" + side;
      const table = PLAIN_CARD_RATES[key];
      if (!table || table[qty] === undefined) {
        return { supported: false, confirmationRequired: true };
      }
      const cardSellingTotal = table[qty];
      const baseRate = table[100];
      const perCardRate = parseFloat((cardSellingTotal / qty).toFixed(2));
      const discountPercent = PLAIN_SAVINGS[qty] || 0;

      let dripCharge = 0;
      if (sel.dripOff) {
        dripCharge = side === "both" ? DRIPOFF_RATES.both_side[qty] : DRIPOFF_RATES.one_side[qty];
      }
      let customShapeCharge = 0;
      if (sel.customShapeCut) {
        customShapeCharge = CUSTOM_SHAPE_CUT_RATES[qty];
      }
      const finalTotal = cardSellingTotal + dripCharge + customShapeCharge;

      return {
        supported: true,
        rateSource: "plain_card_table",
        baseRate,
        cardSellingTotal,
        perCardRate,
        discountPercent,
        addonCharges: { drip: dripCharge, customShape: customShapeCharge, total: dripCharge + customShapeCharge },
        finalTotal,
        confirmationRequired: false
      };
    }

    // CASE B: Specialty Embellishment Combinations (BV/BM-01 to 12)
    let variantCode = null;

    if (hasUv && !hasFoil) {
      if (side === "one") {
        variantCode = "01";
      } else {
        variantCode = sel.spotUv === "both_side" ? "04" : "07";
      }
    } else if (hasFoil && !hasUv) {
      if (isSpecialFoil) {
        return { supported: false, confirmationRequired: true };
      }
      if (side === "one") {
        variantCode = "02";
      } else {
        variantCode = sel.foil === "both_side" ? "05" : "08";
      }
    } else if (hasFoil && hasUv) {
      if (isSpecialFoil) {
        if (side === "both" && sel.spotUv === "both_side" && sel.foil === "one_side") {
          variantCode = "12";
        } else {
          return { supported: false, confirmationRequired: true };
        }
      } else {
        if (side === "one") {
          variantCode = "03";
        } else {
          if (sel.foil === "both_side" && sel.spotUv === "both_side") {
            variantCode = "06";
          } else if (sel.foil === "one_side" && sel.spotUv === "one_side") {
            variantCode = "09";
          } else if (sel.foil === "one_side" && sel.spotUv === "both_side") {
            variantCode = "10";
          } else if (sel.foil === "both_side" && sel.spotUv === "one_side") {
            variantCode = "11";
          }
        }
      }
    }

    if (!variantCode) {
      return { supported: false, confirmationRequired: true };
    }

    const lamKey = lam;
    const stockKey = stock === "350" ? "p350" : "p400";
    const finishEntry = FINISH_RATES[lamKey] && FINISH_RATES[lamKey][variantCode];

    if (!finishEntry || !finishEntry[stockKey] || finishEntry[stockKey][qty] === undefined) {
      return { supported: false, confirmationRequired: true };
    }

    const cardSellingTotal = finishEntry[stockKey][qty];
    const perCardRate = parseFloat((cardSellingTotal / qty).toFixed(2));
    const baseRate = finishEntry[stockKey][100];

    let dripCharge = 0;
    if (sel.dripOff) {
      dripCharge = side === "both" ? DRIPOFF_RATES.both_side[qty] : DRIPOFF_RATES.one_side[qty];
    }
    let customShapeCharge = 0;
    if (sel.customShapeCut) {
      customShapeCharge = CUSTOM_SHAPE_CUT_RATES[qty];
    }
    const finalTotal = cardSellingTotal + dripCharge + customShapeCharge;

    return {
      supported: true,
      rateSource: "finish_chart_2026",
      variantCode: (lamKey === "velvet" ? "BV-" : "BM-") + variantCode,
      baseRate,
      cardSellingTotal,
      perCardRate,
      discountPercent: 0,
      addonCharges: { drip: dripCharge, customShape: customShapeCharge, total: dripCharge + customShapeCharge },
      finalTotal,
      confirmationRequired: false
    };
  }

  // State Management
  const state = {
    paperStock: "400",
    lamination: "velvet",
    printSide: "both_side",
    spotUv: "none",
    foil: "none",
    foilColour: "gold",
    dripOff: false,
    customShapeCut: false,
    quantity: 500,
    activeView: "front",
    uploadedFile: null
  };

  // Color name formatting helper
  const FOIL_NAMES = {
    gold: "Gold",
    silver: "Silver",
    rose_gold: "Rose Gold",
    copper: "Copper",
    red: "Red",
    black: "Black",
    pink: "Pink",
    blue: "Blue",
    rainbow: "Rainbow"
  };

  // Helper: Format Finish for display
  function getFinishDisplay(s) {
    const hasFoil = s.foil && s.foil !== "none";
    const hasUv = s.spotUv && s.spotUv !== "none";
    const foilName = "3D Digital Foil " + (FOIL_NAMES[s.foilColour] || "Gold");

    if (!hasFoil && !hasUv) {
      return "Plain (No Specialty Finish)";
    }
    if (hasFoil && !hasUv) {
      if (s.foil === "both_side") {
        return `${foilName} — Both Sides`;
      }
      if (s.printSide === "one_side") {
        return `${foilName} — One Side`;
      }
      return `Front — ${foilName} | Back — Plain`;
    }
    if (hasUv && !hasFoil) {
      if (s.spotUv === "both_side") {
        return "Raised 3D Spot UV — Both Sides";
      }
      if (s.printSide === "one_side") {
        return "Raised 3D Spot UV — One Side";
      }
      return "Front — Raised 3D Spot UV | Back — Plain";
    }
    if (hasFoil && hasUv) {
      if (s.foil === "both_side" && s.spotUv === "both_side") {
        return `${foilName} + Spot UV — Both Sides`;
      }
      if (s.foil === "one_side" && s.spotUv === "one_side") {
        if (s.printSide === "one_side") {
          return `${foilName} + Spot UV — One Side`;
        }
        return `Front — ${foilName} + Spot UV | Back — Plain`;
      }
      if (s.foil === "one_side" && s.spotUv === "both_side") {
        return `Front — ${foilName} + Spot UV | Back — Spot UV`;
      }
      if (s.foil === "both_side" && s.spotUv === "one_side") {
        return `Front — ${foilName} + Spot UV | Back — ${foilName}`;
      }
    }
    return "Custom Finishing";
  }

  const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbydv9ayz1vDhedta4BT9NWPT8hdw89FcxLWnO8slQvnTL_JUqK2gzeqDXM4YqDk2hTtZw/exec';

  function buildOrderText(orderId, customerName, phone, city, notes) {
    const pricing = calculateBusinessCardPrice(state);
    const lamName = state.lamination === "velvet" ? "Velvet" : state.lamination === "gloss" ? "Gloss" : "Matte";
    const printSideName = state.printSide === "one_side" ? "One Side" : "Both Sides";
    const finishLabel = getFinishDisplay(state);
    const activeAddons = [];
    if (state.dripOff) activeAddons.push("Drip-off");
    if (state.customShapeCut) activeAddons.push("Custom Shape Cut");
    let fileDesc = "Will share artwork file";
    if (state.uploadedFile) {
      fileDesc = isFileTooLarge
        ? `${state.uploadedFile.name} (Over 15MB — will share on WhatsApp)`
        : state.uploadedFile.name;
    }

    let waText = orderId
      ? `✨ LUXURY BUSINESS CARD ORDER CONFIRMATION — CRAFTSVEDA ✨\n\n`
      : `✨ LUXURY BUSINESS CARD ORDER — CRAFTSVEDA ✨\n\n`;

    if (orderId) waText += `Order ID: ${orderId}\n`;
    if (customerName) waText += `Customer: ${customerName}\n`;
    if (phone) waText += `Phone: ${phone}\n`;
    if (city) waText += `Delivery City/Pincode: ${city}\n`;
    if (orderId || customerName || phone || city) waText += `\n`;

    waText +=
      `Quantity: ${state.quantity} Cards\n` +
      `GSM: ${state.paperStock}\n` +
      `Lamination: ${lamName}\n` +
      `Print Side: ${printSideName}\n\n` +
      `Finish: ${finishLabel}\n`;

    if (activeAddons.length > 0) {
      waText += `Add-ons: ${activeAddons.join(", ")}\n`;
    }

    if (pricing.supported) {
      if (typeof CAMPAIGN_CONFIG !== "undefined" && CAMPAIGN_CONFIG.isActive) {
        const discountedTotal = Math.round(pricing.finalTotal * (1 - CAMPAIGN_CONFIG.discountPercent / 100));
        const discPerCard = (discountedTotal / state.quantity).toFixed(2);
        waText +=
          `\nRate: ₹${discPerCard} / Card (${CAMPAIGN_CONFIG.name} applied)\n` +
          `TOTAL: ₹${discountedTotal.toLocaleString("en-IN")} (Original: ₹${pricing.finalTotal.toLocaleString("en-IN")})\n\n`;
      } else {
        waText +=
          `\nRate: ₹${pricing.perCardRate.toFixed(2)} / Card\n` +
          `TOTAL: ₹${pricing.finalTotal.toLocaleString("en-IN")}\n\n`;
      }
    } else {
      waText += `\nRate: Custom Quote Required\n\n`;
    }

    if (notes) {
      waText += `Notes: ${notes}\n\n`;
    }

    waText += `Design: ${fileDesc}\n\n`;
    waText += orderId
      ? `Hi CraftsVeda, I've placed Order #${orderId}. Please confirm production.`
      : `Please confirm the order.`;

    return waText;
  }

  // Element Queries
  const stockButtons = calcContainer.querySelectorAll(".cfg-stock-btn");
  const lamButtons = calcContainer.querySelectorAll(".cfg-lam-btn");
  const sideButtons = calcContainer.querySelectorAll(".cfg-side-btn");
  const uvButtons = calcContainer.querySelectorAll(".cfg-spotuv-btn");
  const foilButtons = calcContainer.querySelectorAll(".cfg-foil-btn");
  const foilColourWrap = document.getElementById("stepFoilColour");
  const swatchButtons = calcContainer.querySelectorAll(".cfg-color-swatch-btn, .cfg-swatch-btn");
  const qtyButtons = calcContainer.querySelectorAll(".cfg-qty-pill, .cfg-qty-btn");
  const tileDrip = document.getElementById("tileDripOff");
  const tileShape = document.getElementById("tileCustomShape");
  const thumbButtons = calcContainer.querySelectorAll(".thumb-card-btn, .thumb-pill-btn");
  const btnFlipView = document.getElementById("btnFlipView");
  const flipBtnText = document.getElementById("flipBtnText");

  const btnSpotUvBoth = document.getElementById("btnSpotUvBoth");
  const btnFoilBoth = document.getElementById("btnFoilBoth");

  const previewFrame = document.getElementById("previewCardFrame");
  const cardPreviewImg = document.getElementById("cardPreviewImg");
  const previewSpecBadge = document.getElementById("previewSpecBadge");

  // Summary Elements (Right Column)
  const summaryStock = document.getElementById("summaryStock");
  const summaryLam = document.getElementById("summaryLam");
  const summarySide = document.getElementById("summarySide");
  const summarySpotUv = document.getElementById("summarySpotUv");
  const summaryFoil = document.getElementById("summaryFoil");
  const summaryRowFoilColour = document.getElementById("summaryRowFoilColour");
  const summaryFoilColour = document.getElementById("summaryFoilColour");
  const summaryDripoff = document.getElementById("summaryDripoff");
  const summaryShapeCut = document.getElementById("summaryShapeCut");
  const summaryFinish = document.getElementById("summaryFinish");
  const summaryAddons = document.getElementById("summaryAddons");
  const summaryQty = document.getElementById("summaryQty");
  const summaryMiniThumb = document.getElementById("summaryMiniThumb");

  // Pricing Elements
  const priceSupportedWrap = document.getElementById("priceSupportedWrap");
  const priceConfirmationWrap = document.getElementById("priceConfirmationWrap");
  const displayRatePerCard = document.getElementById("displayRatePerCard");
  const priceSavingSlot = document.getElementById("priceSavingSlot");
  const displayFinalTotal = document.getElementById("displayFinalTotal");
  const campaignOriginalPrice = document.getElementById("campaignOriginalPrice");
  const campaignPromoBadge = document.getElementById("campaignPromoBadge");

  // CTAs
  const calcWaOrderBtn = document.getElementById("calcWaOrderBtn");
  const btnOpenEmailQuote = document.getElementById("btnOpenEmailQuote");
  const btnOpenPlaceOrderModal = document.getElementById("btnOpenPlaceOrderModal");

  // Place Order Modal Elements
  const placeOrderModal = document.getElementById("placeOrderModal");
  const placeOrderModalClose = document.getElementById("placeOrderModalClose");
  const placeOrderModalBackdrop = document.getElementById("placeOrderModalBackdrop");
  const modalStripSpecs = document.getElementById("modalStripSpecs");
  const modalStripTotal = document.getElementById("modalStripTotal");
  const modalSpecChip = document.getElementById("modalSpecChip");
  const modalDirectWaBtn = document.getElementById("modalDirectWaBtn");

  // Upload elements
  const uploadDropzone = document.getElementById("uploadDropzone");
  const designFileInput = document.getElementById("designFileInput");
  const uploadEmptyState = document.getElementById("uploadEmptyState");
  const uploadSelectedState = document.getElementById("uploadSelectedState");
  const selectedFileName = document.getElementById("selectedFileName");
  const btnChangeFile = document.getElementById("btnChangeFile");
  const uploadFileWarning = document.getElementById("uploadFileWarning");

  // Order Submission & Confirmation elements
  const cfgOrderForm = document.getElementById("cfgOrderForm");
  const orderCustomerName = document.getElementById("orderCustomerName");
  const orderCustomerPhone = document.getElementById("orderCustomerPhone");
  const orderCustomerEmail = document.getElementById("orderCustomerEmail");
  const orderCustomerCity = document.getElementById("orderCustomerCity");
  const orderCustomerNotes = document.getElementById("orderCustomerNotes");
  const orderCustomerNameError = document.getElementById("orderCustomerNameError");
  const orderCustomerPhoneError = document.getElementById("orderCustomerPhoneError");
  const orderCustomerEmailError = document.getElementById("orderCustomerEmailError");
  const orderCustomerCityError = document.getElementById("orderCustomerCityError");
  const btnPlaceOrder = document.getElementById("btnPlaceOrder");
  const btnPlaceOrderSpinner = document.getElementById("btnPlaceOrderSpinner");
  const btnPlaceOrderText = document.getElementById("btnPlaceOrderText");
  const cfgOrderErrorBox = document.getElementById("cfgOrderErrorBox");
  const cfgErrorMsgText = document.getElementById("cfgErrorMsgText");
  const btnTryAgainOrder = document.getElementById("btnTryAgainOrder");
  const cfgErrorWaLink = document.getElementById("cfgErrorWaLink");
  const cfgOrderConfirmationPanel = document.getElementById("cfgOrderConfirmationPanel");
  const confirmedOrderId = document.getElementById("confirmedOrderId");
  const confirmedOrderTotal = document.getElementById("confirmedOrderTotal");
  const btnTrackOrder = document.getElementById("btnTrackOrder");
  const btnConfirmedWa = document.getElementById("btnConfirmedWa");

  // Update Visual Live Preview
  function updateLivePreview() {
    if (!cardPreviewImg || !previewFrame) return;

    previewFrame.className = "preview-card-frame";

    const hasFoil = state.foil && state.foil !== "none";
    const hasUv = state.spotUv && state.spotUv !== "none";
    const lamLabel = state.lamination === "velvet" ? "Velvet" : state.lamination === "gloss" ? "Gloss" : "Matte";

    if (state.activeView === "angle") {
      if (!hasFoil && !hasUv) {
        cardPreviewImg.src = "assets/Plain VC FB.jpg";
        cardPreviewImg.alt = "Plain Luxury Business Card Front & Back Showcase";
        if (flipBtnText) flipBtnText.textContent = "Front View";
        if (previewSpecBadge) {
          previewSpecBadge.textContent = `Plain Base FB • ${state.paperStock} GSM ${lamLabel}`;
        }
      } else {
        cardPreviewImg.src = "assets/Velvet Soft-Touch Card Showcase.png";
        cardPreviewImg.alt = "Velvet Soft-Touch Luxury Business Cards Perspective";
        if (flipBtnText) flipBtnText.textContent = "Front View";
        if (previewSpecBadge) {
          previewSpecBadge.textContent = "Luxury Studio Angle Perspective";
        }
      }
      return;
    }

    if (flipBtnText) flipBtnText.textContent = "Angle View";

    // Front View Mapping
    if (!hasFoil && !hasUv) {
      if (state.printSide === "one_side") {
        cardPreviewImg.src = "assets/One Side VC Plain.jpg";
        cardPreviewImg.alt = "One Side VC Plain Luxury Business Card";
        if (previewSpecBadge) {
          previewSpecBadge.textContent = `One Side VC Plain • ${state.paperStock} GSM ${lamLabel}`;
        }
      } else {
        cardPreviewImg.src = "assets/Both Side VC Plain.jpg";
        cardPreviewImg.alt = "Both Side VC Plain Luxury Business Card";
        if (previewSpecBadge) {
          previewSpecBadge.textContent = `Both Side VC Plain • ${state.paperStock} GSM ${lamLabel}`;
        }
      }
    } else if (hasUv && !hasFoil) {
      cardPreviewImg.src = "assets/luxury-business-card-spot-uv.webp";
      cardPreviewImg.alt = "Raised 3D Spot UV Business Card Preview";
      if (previewSpecBadge) {
        previewSpecBadge.textContent = `Raised 3D Spot UV • ${state.paperStock} GSM`;
      }
    } else if (hasFoil && !hasUv) {
      if (state.foilColour === "rainbow") {
        cardPreviewImg.src = "assets/luxury-business-card-finishing.webp";
      } else {
        cardPreviewImg.src = "assets/luxury-business-card-gold-foil.webp";
        if (state.foilColour !== "gold") {
          previewFrame.classList.add(`foil-shader-${state.foilColour}`);
        }
      }
      cardPreviewImg.alt = `3D Foil ${FOIL_NAMES[state.foilColour]} Luxury Business Card Preview`;
      if (previewSpecBadge) {
        previewSpecBadge.textContent = `3D Foil ${FOIL_NAMES[state.foilColour]} • ${state.paperStock} GSM`;
      }
    } else if (hasFoil && hasUv) {
      cardPreviewImg.src = "assets/craftsveda-luxury-mockup.jpg";
      if (state.foilColour !== "gold" && state.foilColour !== "rainbow") {
        previewFrame.classList.add(`foil-shader-${state.foilColour}`);
      }
      cardPreviewImg.alt = `3D Foil ${FOIL_NAMES[state.foilColour]} + Raised Spot UV Preview`;
      if (previewSpecBadge) {
        previewSpecBadge.textContent = `3D Foil ${FOIL_NAMES[state.foilColour]} + Spot UV • ${state.paperStock} GSM`;
      }
    }
  }

  // Update Thumbnail Strip Synchronization
  function updateThumbnailsSync() {
    const hasFoil = state.foil && state.foil !== "none";
    const hasUv = state.spotUv && state.spotUv !== "none";

    let activeCategory = "plain";
    if (state.activeView === "angle") {
      activeCategory = "showcase";
    } else if (hasFoil && hasUv) {
      activeCategory = "foil_uv";
    } else if (hasFoil && !hasUv) {
      activeCategory = "foil";
    } else if (hasUv && !hasFoil) {
      activeCategory = "spot_uv";
    } else {
      activeCategory = "plain";
    }

    thumbButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-thumb") === activeCategory);
    });
  }

  // Main UI Render & Recalculate
  function renderConfigurator() {
    // 1. Enforce side rules: if One Side print, disable both sides for finishes
    const isOneSide = state.printSide === "one_side";
    if (btnSpotUvBoth) {
      btnSpotUvBoth.disabled = isOneSide;
      btnSpotUvBoth.classList.toggle("disabled", isOneSide);
    }
    if (btnFoilBoth) {
      btnFoilBoth.disabled = isOneSide;
      btnFoilBoth.classList.toggle("disabled", isOneSide);
    }
    if (isOneSide) {
      if (state.spotUv === "both_side") state.spotUv = "one_side";
      if (state.foil === "both_side") state.foil = "one_side";
    }

    // 2. Toggle Foil Colour selector visibility
    const hasFoil = state.foil && state.foil !== "none";
    if (foilColourWrap) {
      foilColourWrap.style.display = hasFoil ? "flex" : "none";
    }

    // 3. Update active states on Option Buttons
    stockButtons.forEach((b) => b.classList.toggle("active", b.getAttribute("data-stock") === state.paperStock));
    lamButtons.forEach((b) => b.classList.toggle("active", b.getAttribute("data-lam") === state.lamination));
    sideButtons.forEach((b) => b.classList.toggle("active", b.getAttribute("data-side") === state.printSide));
    uvButtons.forEach((b) => b.classList.toggle("active", b.getAttribute("data-spotuv") === state.spotUv));
    foilButtons.forEach((b) => b.classList.toggle("active", b.getAttribute("data-foil") === state.foil));
    swatchButtons.forEach((b) => b.classList.toggle("active", b.getAttribute("data-color") === state.foilColour));
    qtyButtons.forEach((b) => b.classList.toggle("active", b.getAttribute("data-qty") === String(state.quantity)));

    // 4. Update Add-on Toggle Tiles & Dynamic Badges
    if (tileDrip) {
      tileDrip.classList.toggle("active", !!state.dripOff);
      tileDrip.setAttribute("aria-checked", state.dripOff ? "true" : "false");
    }
    if (tileShape) {
      tileShape.classList.toggle("active", !!state.customShapeCut);
      tileShape.setAttribute("aria-checked", state.customShapeCut ? "true" : "false");
    }

    const currentQtyNum = parseInt(state.quantity, 10);
    const dripTotal = state.printSide === "one_side" ? DRIPOFF_RATES.one_side[currentQtyNum] : DRIPOFF_RATES.both_side[currentQtyNum];
    const dripPerCard = (dripTotal / currentQtyNum).toFixed(2);
    const dripRateBadge = document.getElementById("dripRateBadge");
    if (dripRateBadge) {
      dripRateBadge.textContent = `+₹${dripPerCard} / card`;
    }

    const shapeCost = CUSTOM_SHAPE_CUT_RATES[currentQtyNum] || 250;
    const shapeRateBadge = document.getElementById("shapeRateBadge");
    const shapeSwitchStatus = document.getElementById("shapeSwitchStatus");
    if (shapeRateBadge) {
      shapeRateBadge.textContent = `${currentQtyNum} Cutting Cost ₹${shapeCost}`;
    }
    if (shapeSwitchStatus) {
      shapeSwitchStatus.textContent = state.customShapeCut ? "Included" : "Add";
    }

    // 5. Update Visual Preview & Thumbnails
    updateLivePreview();
    updateThumbnailsSync();

    // 6. Run Central Pricing Engine
    const pricing = calculateBusinessCardPrice(state);

    // 7. Update Order Summary Specifications (Right Column)
    const lamLabels = { velvet: "Velvet", matt: "Matte", gloss: "Gloss" };
    const lamName = lamLabels[state.lamination] || "Matte";
    const printSideName = state.printSide === "one_side" ? "One Side" : "Both Side";
    const finishLabel = getFinishDisplay(state);

    if (summaryStock) summaryStock.textContent = `${state.paperStock} GSM Art Card`;
    if (summaryLam) summaryLam.textContent = lamName;
    if (summarySide) summarySide.textContent = printSideName;
    if (summarySpotUv) summarySpotUv.textContent = state.spotUv === "none" ? "None" : (state.spotUv === "one_side" ? "One Side" : "Both Side");
    if (summaryFoil) summaryFoil.textContent = state.foil === "none" ? "None" : (state.foil === "one_side" ? "One Side (3D)" : "Both Side (3D)");
    if (summaryRowFoilColour) summaryRowFoilColour.style.display = hasFoil ? "flex" : "none";
    if (summaryFoilColour) summaryFoilColour.textContent = FOIL_NAMES[state.foilColour] || "Gold";
    if (summaryDripoff) summaryDripoff.textContent = state.dripOff ? `Yes (+₹${dripPerCard}/card)` : "No";
    if (summaryShapeCut) summaryShapeCut.textContent = state.customShapeCut ? `Yes (+₹${shapeCost})` : "No";
    if (summaryFinish) summaryFinish.textContent = finishLabel;

    const activeAddons = [];
    if (state.dripOff) activeAddons.push("Drip-off UV");
    if (state.customShapeCut) activeAddons.push("Custom Shape Cut");
    if (summaryAddons) {
      summaryAddons.textContent = activeAddons.length > 0 ? activeAddons.join(", ") : "Standard Trimming";
    }
    if (summaryQty) summaryQty.textContent = `${state.quantity} Cards`;
    if (summaryMiniThumb && cardPreviewImg) summaryMiniThumb.src = cardPreviewImg.src;

    // 8. Update Pricing Display (Pure Clean Customer Total — No Markup or Hike Exposed)
    if (pricing.supported) {
      if (priceSupportedWrap) priceSupportedWrap.style.display = "block";
      if (priceConfirmationWrap) priceConfirmationWrap.style.display = "none";

      const basePrice = pricing.finalTotal;
      const isOfferActive = typeof CAMPAIGN_CONFIG !== "undefined" && CAMPAIGN_CONFIG.isActive;

      if (isOfferActive) {
        const discountedPrice = Math.round(basePrice * (1 - CAMPAIGN_CONFIG.discountPercent / 100));

        if (campaignOriginalPrice) {
          campaignOriginalPrice.textContent = `₹${basePrice.toLocaleString("en-IN")}`;
          campaignOriginalPrice.style.display = "inline-block";
        }
        if (campaignPromoBadge) {
          campaignPromoBadge.textContent = CAMPAIGN_CONFIG.badgeText;
          campaignPromoBadge.style.display = "inline-flex";
        }
        if (displayFinalTotal) {
          displayFinalTotal.textContent = `₹${discountedPrice.toLocaleString("en-IN")}`;
        }
        if (displayRatePerCard) {
          displayRatePerCard.textContent = `₹${(discountedPrice / currentQtyNum).toFixed(2)}`;
        }
      } else {
        if (campaignOriginalPrice) {
          campaignOriginalPrice.textContent = "";
          campaignOriginalPrice.style.display = "none";
        }
        if (campaignPromoBadge) {
          campaignPromoBadge.textContent = "";
          campaignPromoBadge.style.display = "none";
        }
        if (displayFinalTotal) {
          displayFinalTotal.textContent = `₹${basePrice.toLocaleString("en-IN")}`;
        }
        if (displayRatePerCard) {
          displayRatePerCard.textContent = `₹${pricing.perCardRate.toFixed(2)}`;
        }
      }

      if (priceSavingSlot) {
        if (pricing.discountPercent > 0) {
          priceSavingSlot.innerHTML = `<span class="calc-save-pill">SAVE ${pricing.discountPercent}%</span>`;
        } else {
          priceSavingSlot.innerHTML = "";
        }
      }

      // WhatsApp Quick Button
      if (calcWaOrderBtn) {
        calcWaOrderBtn.href = `https://wa.me/918840035249?text=${encodeURIComponent(buildOrderText())}`;
      }

    } else {
      if (priceSupportedWrap) priceSupportedWrap.style.display = "none";
      if (priceConfirmationWrap) priceConfirmationWrap.style.display = "block";

      if (campaignOriginalPrice) {
        campaignOriginalPrice.textContent = "";
        campaignOriginalPrice.style.display = "none";
      }
      if (campaignPromoBadge) {
        campaignPromoBadge.textContent = "";
        campaignPromoBadge.style.display = "none";
      }

      if (calcWaOrderBtn) {
        calcWaOrderBtn.href = `https://wa.me/918840035249?text=${encodeURIComponent(buildOrderText())}`;
      }
    }

    // 9. Sync Pop-Up Modal Values
    const effectiveTotal = (typeof CAMPAIGN_CONFIG !== "undefined" && CAMPAIGN_CONFIG.isActive && pricing.supported)
      ? Math.round(pricing.finalTotal * (1 - CAMPAIGN_CONFIG.discountPercent / 100))
      : pricing.finalTotal;
    const finalTotalDisplay = pricing.supported ? `₹${effectiveTotal.toLocaleString("en-IN")}` : "Confirmed Before Production";
    if (modalStripSpecs) {
      modalStripSpecs.textContent = `${state.paperStock} GSM Art Card • ${lamName} • ${printSideName} • ${finishLabel} • ${state.quantity} Cards`;
    }
    if (modalSpecChip) {
      modalSpecChip.textContent = `${state.paperStock} GSM • ${lamName} • ${state.quantity} Cards`;
    }
    if (modalStripTotal) {
      modalStripTotal.textContent = finalTotalDisplay;
    }
    if (modalDirectWaBtn) {
      modalDirectWaBtn.href = `https://wa.me/918840035249?text=${encodeURIComponent(buildOrderText())}`;
    }
  }

  // --- STUDIO MODAL & ORDER MODAL CONTROLS ---
  const luxuryCardConfigModal = document.getElementById("luxuryCardConfigModal");
  const luxuryCardConfigModalClose = document.getElementById("luxuryCardConfigModalClose");
  const luxuryCardConfigModalBackdrop = document.getElementById("luxuryCardConfigModalBackdrop");
  const openCardStudioBtns = document.querySelectorAll('[data-open-card-studio="true"], .btn-open-card-config');

  function openStudioModal() {
    if (luxuryCardConfigModal) {
      luxuryCardConfigModal.classList.add("active");
      luxuryCardConfigModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      renderConfigurator();
    } else {
      const studioElem = document.getElementById("pricing-matrix") || document.getElementById("luxuryCardCalc");
      if (studioElem) {
        studioElem.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }

  function closeStudioModal() {
    if (!luxuryCardConfigModal) return;
    luxuryCardConfigModal.classList.remove("active");
    luxuryCardConfigModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  openCardStudioBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      if (luxuryCardConfigModal) {
        e.preventDefault();
        openStudioModal();
      }
    });
  });

  if (luxuryCardConfigModalClose) {
    luxuryCardConfigModalClose.addEventListener("click", closeStudioModal);
  }
  if (luxuryCardConfigModalBackdrop) {
    luxuryCardConfigModalBackdrop.addEventListener("click", closeStudioModal);
  }

  function openPlaceOrderModal() {
    if (!placeOrderModal) return;
    placeOrderModal.classList.add("active");
    placeOrderModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    setTimeout(() => {
      if (orderCustomerName) orderCustomerName.focus();
    }, 150);
  }

  function closePlaceOrderModal() {
    if (!placeOrderModal) return;
    placeOrderModal.classList.remove("active");
    placeOrderModal.setAttribute("aria-hidden", "true");
    if (!luxuryCardConfigModal || !luxuryCardConfigModal.classList.contains("active")) {
      document.body.style.overflow = "";
    }
  }

  if (btnOpenPlaceOrderModal) {
    btnOpenPlaceOrderModal.addEventListener("click", openPlaceOrderModal);
  }
  if (placeOrderModalClose) {
    placeOrderModalClose.addEventListener("click", closePlaceOrderModal);
  }
  if (placeOrderModalBackdrop) {
    placeOrderModalBackdrop.addEventListener("click", closePlaceOrderModal);
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (placeOrderModal && placeOrderModal.classList.contains("active")) {
        closePlaceOrderModal();
      } else if (luxuryCardConfigModal && luxuryCardConfigModal.classList.contains("active")) {
        closeStudioModal();
      }
    }
  });

  // Email Quote button triggers quoteModal
  if (btnOpenEmailQuote) {
    btnOpenEmailQuote.addEventListener("click", () => {
      const quoteModal = document.getElementById("quoteModal");
      if (quoteModal) {
        quoteModal.classList.add("active");
        quoteModal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
        const serviceSelect = document.getElementById("quoteService");
        if (serviceSelect) {
          serviceSelect.value = "luxury-cards";
        }
      }
    });
  }

  // --- EVENT LISTENERS ---

  // Paper Stock
  stockButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      state.paperStock = btn.getAttribute("data-stock") || "400";
      renderConfigurator();
    });
  });

  // Lamination
  lamButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      state.lamination = btn.getAttribute("data-lam") || "velvet";
      renderConfigurator();
    });
  });

  // Print Side
  sideButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      state.printSide = btn.getAttribute("data-side") || "both_side";
      renderConfigurator();
    });
  });

  // Spot UV
  uvButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      state.spotUv = btn.getAttribute("data-spotuv") || "none";
      state.activeView = "front";
      renderConfigurator();
    });
  });

  // 3D Foil
  foilButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      state.foil = btn.getAttribute("data-foil") || "none";
      state.activeView = "front";
      renderConfigurator();
    });
  });

  // Foil Colour Swatches
  swatchButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      state.foilColour = btn.getAttribute("data-color") || "gold";
      state.activeView = "front";
      renderConfigurator();
    });
  });

  // Quantity
  qtyButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      state.quantity = parseInt(btn.getAttribute("data-qty") || "500", 10);
      renderConfigurator();
    });
  });

  // Add-on Toggle Clicks
  if (tileDrip) {
    tileDrip.addEventListener("click", () => {
      state.dripOff = !state.dripOff;
      renderConfigurator();
    });
    tileDrip.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        state.dripOff = !state.dripOff;
        renderConfigurator();
      }
    });
  }

  if (tileShape) {
    tileShape.addEventListener("click", () => {
      state.customShapeCut = !state.customShapeCut;
      renderConfigurator();
    });
    tileShape.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        state.customShapeCut = !state.customShapeCut;
        renderConfigurator();
      }
    });
  }

  // Alternate Perspective Flip Button
  if (btnFlipView) {
    btnFlipView.addEventListener("click", () => {
      state.activeView = state.activeView === "front" ? "angle" : "front";
      renderConfigurator();
    });
  }

  // Thumbnails Strip Quick Switch
  thumbButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const mode = btn.getAttribute("data-thumb");
      state.activeView = "front";

      if (mode === "plain") {
        state.spotUv = "none";
        state.foil = "none";
      } else if (mode === "spot_uv") {
        state.spotUv = state.printSide === "one_side" ? "one_side" : "both_side";
        state.foil = "none";
      } else if (mode === "foil") {
        state.foil = state.printSide === "one_side" ? "one_side" : "both_side";
        state.spotUv = "none";
      } else if (mode === "foil_uv") {
        state.foil = state.printSide === "one_side" ? "one_side" : "both_side";
        state.spotUv = state.printSide === "one_side" ? "one_side" : "both_side";
      } else if (mode === "showcase") {
        state.activeView = "angle";
      }

      renderConfigurator();
    });
  });

  // Upload Design Interaction inside Modal
  const MAX_FILE_SIZE = 15 * 1024 * 1024;
  let isFileTooLarge = false;

  function handleDesignFile(file) {
    if (!file) return;
    state.uploadedFile = file;
    isFileTooLarge = file.size > MAX_FILE_SIZE;

    if (uploadEmptyState) uploadEmptyState.style.display = "none";
    if (uploadSelectedState) uploadSelectedState.style.display = "flex";
    if (selectedFileName) {
      const sizeKB = (file.size / 1024).toFixed(0);
      const sizeStr = sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${sizeKB} KB`;
      selectedFileName.textContent = `${file.name} (${sizeStr})`;
    }
    if (uploadFileWarning) {
      uploadFileWarning.style.display = isFileTooLarge ? "block" : "none";
    }
    renderConfigurator();
  }

  function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        if (typeof result === "string") {
          const commaIdx = result.indexOf(",");
          resolve(commaIdx !== -1 ? result.slice(commaIdx + 1) : result);
        } else {
          resolve("");
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  }

  if (uploadDropzone && designFileInput) {
    uploadDropzone.addEventListener("click", (e) => {
      if (e.target !== btnChangeFile) {
        designFileInput.click();
      }
    });

    if (btnChangeFile) {
      btnChangeFile.addEventListener("click", (e) => {
        e.stopPropagation();
        designFileInput.click();
      });
    }

    designFileInput.addEventListener("change", (e) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleDesignFile(files[0]);
      }
    });

    uploadDropzone.addEventListener("dragover", (e) => {
      e.preventDefault();
      uploadDropzone.style.borderColor = "var(--gold-base)";
    });

    uploadDropzone.addEventListener("dragleave", () => {
      uploadDropzone.style.borderColor = "";
    });

    uploadDropzone.addEventListener("drop", (e) => {
      e.preventDefault();
      uploadDropzone.style.borderColor = "";
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleDesignFile(e.dataTransfer.files[0]);
      }
    });
  }

  // --- FINAL ORDER SUBMISSION FLOW (INSIDE MODAL) ---
  if (cfgOrderForm) {
    cfgOrderForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const nameVal = orderCustomerName ? orderCustomerName.value.trim() : "";
      const phoneVal = orderCustomerPhone ? orderCustomerPhone.value.trim() : "";
      const emailVal = orderCustomerEmail ? orderCustomerEmail.value.trim() : "";
      const cityVal = orderCustomerCity ? orderCustomerCity.value.trim() : "";
      const notesVal = orderCustomerNotes ? orderCustomerNotes.value.trim() : "";

      let isValid = true;
      if (!nameVal) {
        if (orderCustomerNameError) orderCustomerNameError.textContent = "Please enter your name.";
        isValid = false;
      } else {
        if (orderCustomerNameError) orderCustomerNameError.textContent = "";
      }

      const cleanPhone = phoneVal.replace(/[^0-9]/g, "");
      if (cleanPhone.length < 10) {
        if (orderCustomerPhoneError) orderCustomerPhoneError.textContent = "Please enter a valid 10-digit number.";
        isValid = false;
      } else {
        if (orderCustomerPhoneError) orderCustomerPhoneError.textContent = "";
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailVal || !emailRegex.test(emailVal)) {
        if (orderCustomerEmailError) orderCustomerEmailError.textContent = "Please enter a valid email address.";
        isValid = false;
      } else {
        if (orderCustomerEmailError) orderCustomerEmailError.textContent = "";
      }

      if (!cityVal) {
        if (orderCustomerCityError) orderCustomerCityError.textContent = "Please enter your city and delivery pincode.";
        isValid = false;
      } else {
        if (orderCustomerCityError) orderCustomerCityError.textContent = "";
      }

      if (!isValid) return;

      if (cfgOrderErrorBox) cfgOrderErrorBox.style.display = "none";
      if (btnPlaceOrder) btnPlaceOrder.disabled = true;
      if (btnPlaceOrderSpinner) btnPlaceOrderSpinner.style.display = "inline-block";
      if (btnPlaceOrderText) btnPlaceOrderText.textContent = "Submitting Order...";

      try {
        const pricing = calculateBusinessCardPrice(state);
        const activeAddons = [];
        if (state.dripOff) activeAddons.push("Drip-off");
        if (state.customShapeCut) activeAddons.push("Custom Shape Cut");
        const addonsStr = activeAddons.length > 0 ? activeAddons.join(", ") : "None";

        const payload = {
          action: "submitOrder",
          customerName: nameVal,
          phone: phoneVal,
          email: emailVal,
          deliveryCity: cityVal,
          notes: notesVal,
          product: "Luxury Business Cards",
          paperGsm: state.paperStock,
          paperStock: state.paperStock,
          lamination: state.lamination,
          printSide: state.printSide,
          spotUv: state.spotUv,
          foil: state.foil !== "none" ? `${state.foil} (${state.foilColour})` : state.foil,
          foilSelection: state.foil,
          foilColour: state.foilColour,
          dripOff: state.dripOff,
          customShapeCut: state.customShapeCut,
          addons: addonsStr,
          quantity: state.quantity,
          perCardRate: pricing.supported ? pricing.perCardRate : "Confirmation Required",
          totalAmount: pricing.supported ? pricing.finalTotal : "Confirmation Required"
        };

        if (state.uploadedFile && !isFileTooLarge) {
          try {
            const base64Data = await readFileAsBase64(state.uploadedFile);
            payload.fileBase64 = base64Data;
            payload.fileName = state.uploadedFile.name;
            payload.fileMimeType = state.uploadedFile.type || "application/octet-stream";
          } catch (fileErr) {
            console.warn("Could not read base64:", fileErr);
          }
        } else if (state.uploadedFile && isFileTooLarge) {
          payload.fileName = state.uploadedFile.name;
          payload.fileMimeType = state.uploadedFile.type || "application/octet-stream";
        }

        const res = await fetch(WEB_APP_URL, {
          method: "POST",
          headers: {
            "Content-Type": "text/plain;charset=utf-8"
          },
          body: JSON.stringify(payload)
        });

        const resText = await res.text();
        let resData = null;
        try {
          resData = JSON.parse(resText);
        } catch (parseErr) {
          console.warn("Response not JSON:", resText);
        }

        if (!res.ok || !resData || resData.ok === false) {
          const errMsg = (resData && (resData.error || resData.message)) || "Submission failed";
          throw new Error(errMsg);
        }

        const orderId = (resData && (resData.orderId || resData.id || resData.order_id)) || ("CV-" + Math.floor(100000 + Math.random() * 900000));
        const orderTotalToDisplay = (typeof CAMPAIGN_CONFIG !== "undefined" && CAMPAIGN_CONFIG.isActive && pricing.supported)
          ? Math.round(pricing.finalTotal * (1 - CAMPAIGN_CONFIG.discountPercent / 100))
          : pricing.finalTotal;
        const finalTotalDisplay = pricing.supported ? `₹${orderTotalToDisplay.toLocaleString("en-IN")}` : "Confirmed Before Production";

        // Success - show confirmation inside modal
        if (cfgOrderForm) cfgOrderForm.style.display = "none";
        if (cfgOrderErrorBox) cfgOrderErrorBox.style.display = "none";
        if (cfgOrderConfirmationPanel) cfgOrderConfirmationPanel.style.display = "flex";

        if (confirmedOrderId) confirmedOrderId.textContent = orderId;
        if (confirmedOrderTotal) confirmedOrderTotal.textContent = finalTotalDisplay;

        if (btnTrackOrder) {
          btnTrackOrder.href = `track-order.html?orderId=${encodeURIComponent(orderId)}`;
        }

        if (btnConfirmedWa) {
          btnConfirmedWa.href = `https://wa.me/918840035249?text=${encodeURIComponent(buildOrderText(orderId, nameVal, phoneVal, cityVal, notesVal))}`;
        }

      } catch (err) {
        console.error("Order submission failed:", err);
        if (cfgOrderErrorBox) {
          cfgOrderErrorBox.style.display = "flex";
          if (cfgErrorMsgText) {
            cfgErrorMsgText.textContent = "Unable to submit your order right now. Please try again or complete your order via WhatsApp.";
          }
        }

        if (cfgErrorWaLink) {
          cfgErrorWaLink.href = `https://wa.me/918840035249?text=${encodeURIComponent(buildOrderText(null, nameVal, phoneVal, cityVal, notesVal))}`;
        }

      } finally {
        if (btnPlaceOrder) btnPlaceOrder.disabled = false;
        if (btnPlaceOrderSpinner) btnPlaceOrderSpinner.style.display = "none";
        if (btnPlaceOrderText) btnPlaceOrderText.textContent = "Confirm & Submit Order";
      }
    });
  }

  if (btnTryAgainOrder) {
    btnTryAgainOrder.addEventListener("click", () => {
      if (cfgOrderErrorBox) cfgOrderErrorBox.style.display = "none";
      if (btnPlaceOrder) btnPlaceOrder.focus();
    });
  }

  // Initial Calculation
  renderConfigurator();
}
