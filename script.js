/**
 * CraftsVeda — Premium Printing Studio
 * Saki Naka, Mumbai
 * Interactive Engine & WhatsApp Quotation Builder
 */

// Finish Data Matrix for Interactive Finishes Explorer
const FINISH_DATA = {
  foil: {
    badge: 'HOT FOIL STAMPING',
    title: '24K Metallic Foil Stamping',
    desc: 'Using precision heated brass dies, metallic pigment is transferred directly under extreme pressure into the fibers of the card stock. Creates an unmissable mirror-like reflection that never chips or dulls over time.',
    val1: 'Gold, Rose Gold, Silver, Copper, Hologram',
    val2: 'Soft-Touch Velvet, 600 GSM Cotton, Black Board',
    val3: '100 pieces (Custom Dies included)',
    img: 'assets/finishes-mockup.jpg'
  },
  spotuv: {
    badge: 'DIMENSIONAL COATING',
    title: 'Raised 3D Spot UV Varnish',
    desc: 'An ultra-glossy, high-viscosity liquid polymer applied selectively to logotypes, patterns, or typography. When cured under UV light, it forms a tangible 3D raised tactile glaze contrasting dramatically with a matte backdrop.',
    val1: 'High-Gloss Clear Polymer (Up to 50 microns raise)',
    val2: 'Velvet Soft-Touch & Ultra-Matte Lamination',
    val3: '250 pieces',
    img: 'assets/hero-mockup.jpg'
  },
  emboss: {
    badge: 'TACTILE IMPRESSION',
    title: 'Blind Embossing & Sculpted Debossing',
    desc: 'Deep multi-level sculptural relief stamped directly into heavyweight fibrous papers without ink. Gives a subtle, royal architectural presence where light and shadow create the brand imprint.',
    val1: 'Single-level, Multi-level & Sculpted 3D Brass Dies',
    val2: '500+ GSM Heavyweight Cotton & Textured Linen',
    val3: '100 pieces',
    img: 'assets/cards-mockup.jpg'
  },
  velvet: {
    badge: 'SURFACE PROTECTION',
    title: 'Velvet Soft-Touch Lamination',
    desc: 'An ultra-matte biaxially oriented film that imparts an irresistible, velvety peach-skin feel upon first touch. Highly fingerprint-resistant and protects packaging boxes from scuffs and abrasions during transit.',
    val1: 'Matte Velvet Soft-Touch & Anti-Scratch Finish',
    val2: 'Rigid Boxes, Pocket Folders, Book Covers & Cards',
    val3: '100 pieces',
    img: 'assets/packaging-mockup.jpg'
  },
  gilding: {
    badge: 'ARTISANAL DETAIL',
    title: 'Edge Gilding & Painted Edges',
    desc: 'The thick edges of stacked business cards and royal invitation cards are beveled, burnished, and foiled with genuine metallic foil or custom mixed Pantone pigments for an unmistakable luxury side-profile.',
    val1: 'Mirror Gold, Rose Gold, Silver, Black Gloss & Custom Ink',
    val2: '600 to 900 GSM Triplex Sandwich & Cotton Boards',
    val3: '100 pieces',
    img: 'assets/cards-mockup.jpg'
  },
  diecut: {
    badge: 'CUSTOM SILHOUETTES',
    title: 'Precision Laser & Steel Rule Die-Cutting',
    desc: 'Custom steel rule dies or high-speed lasers cut intricate custom curves, viewing windows, interlocking tabs, and irregular brand contours into packaging and bespoke presentation pieces.',
    val1: 'Complex Contours, Window Cutouts & Perforations',
    val2: 'Stickers, Rigid Sleeves, Hangtags & Folders',
    val3: '200 pieces',
    img: 'assets/invitation-mockup.jpg'
  }
};

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  initLuxuryBackgroundAnimation();
  initMobileNav();
  initPortfolioFilters();
  initQuoteCalculator();
  initHeroTilt();
  initHeroCounters();
  initScrollSpy();
  initSmoothScroll();
});

/* ==========================================================================
   01. MOBILE NAVIGATION
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobileToggle');
  const nav = document.getElementById('mainNav');

  if (!toggleBtn || !nav) return;

  toggleBtn.addEventListener('click', () => {
    nav.classList.toggle('open');
    toggleBtn.classList.toggle('active');
  });

  // Close nav when clicking any link
  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggleBtn.classList.remove('active');
    });
  });
}

/* ==========================================================================
   02. SPECIAL FINISHES SWITCHER
   ========================================================================== */
function switchFinish(finishKey) {
  const data = FINISH_DATA[finishKey];
  if (!data) return;

  // Update Nav Buttons
  document.querySelectorAll('.finish-nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.finish === finishKey);
  });

  // Update Details with smooth transition
  const badge = document.getElementById('finishBadge');
  const title = document.getElementById('finishTitle');
  const desc = document.getElementById('finishDesc');
  const val1 = document.getElementById('finishVal1');
  const val2 = document.getElementById('finishVal2');
  const val3 = document.getElementById('finishVal3');
  const img = document.getElementById('finishImg');
  const sheen = document.getElementById('finishSheen');

  if (badge) badge.textContent = data.badge;
  if (title) title.textContent = data.title;
  if (desc) desc.textContent = data.desc;
  if (val1) val1.textContent = data.val1;
  if (val2) val2.textContent = data.val2;
  if (val3) val3.textContent = data.val3;
  if (img) img.src = data.img;

  // Retrigger sheen animation
  if (sheen) {
    sheen.style.animation = 'none';
    sheen.offsetHeight; /* trigger reflow */
    sheen.style.animation = 'light-sheen 4s ease-in-out';
  }
}

/* ==========================================================================
   03. PORTFOLIO FILTERING
   ========================================================================== */
function initPortfolioFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.portfolio-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const cat = card.getAttribute('data-cat');
        if (filterValue === 'all' || cat === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => { card.style.opacity = '1'; }, 20);
        } else {
          card.style.opacity = '0';
          setTimeout(() => { card.style.display = 'none'; }, 250);
        }
      });
    });
  });
}

/* ==========================================================================
   04. LIGHTBOX MODAL
   ========================================================================== */
function openLightbox(imgSrc, title, desc) {
  const modal = document.getElementById('lightboxModal');
  const lbImg = document.getElementById('lightboxImg');
  const lbTitle = document.getElementById('lightboxTitle');
  const lbDesc = document.getElementById('lightboxDesc');

  if (!modal) return;

  lbImg.src = imgSrc;
  lbTitle.textContent = title;
  lbDesc.textContent = desc;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const modal = document.getElementById('lightboxModal');
  if (!modal) return;

  modal.classList.remove('active');
  document.body.style.overflow = '';
}

// ESC Key listener for Lightbox
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeLightbox();
  }
});

/* ==========================================================================
   05. INTERACTIVE QUOTE BUILDER & LIVE SUMMARY
   ========================================================================== */
let currentLeadMode = 'custom'; // 'custom' or 'sample'

function initQuoteCalculator() {
  updateQuoteSummary();
}

// Quick Switcher: Custom Print Quote vs Sample Kit
function setLeadMode(mode) {
  currentLeadMode = mode;
  const tabCustom = document.getElementById('tabCustomQuote');
  const tabSample = document.getElementById('tabSampleKit');
  const sampleBanner = document.getElementById('sampleKitBanner');
  const productSelect = document.getElementById('productSelect');
  const paperStock = document.getElementById('paperStock');
  const qtySelect = document.getElementById('qtySelect');
  const submitBtnLabel = document.getElementById('submitBtnLabel');
  const summaryModeLabel = document.getElementById('summaryModeLabel');
  const summaryTipText = document.getElementById('summaryTipText');
  const leadTypeHidden = document.getElementById('leadTypeHidden');
  const web3Subject = document.getElementById('web3Subject');

  if (mode === 'sample') {
    if (tabCustom) {
      tabCustom.classList.remove('active');
      tabCustom.setAttribute('aria-selected', 'false');
    }
    if (tabSample) {
      tabSample.classList.add('active');
      tabSample.setAttribute('aria-selected', 'true');
    }
    if (sampleBanner) sampleBanner.style.display = 'flex';

    if (productSelect) {
      productSelect.value = '📦 Physical Sample Kit (₹499 / Studio Swatch Deck)';
    }
    if (paperStock) {
      paperStock.value = 'Curated Swatch Deck (15+ Luxury Papers & Foil Catalog)';
    }
    if (qtySelect) {
      qtySelect.value = '1 Sample Kit (₹499)';
    }
    if (submitBtnLabel) {
      submitBtnLabel.textContent = 'Order Sample Kit (₹499)';
    }
    if (summaryModeLabel) {
      summaryModeLabel.textContent = 'PHYSICAL SAMPLE KIT REQUEST';
    }
    if (summaryTipText) {
      summaryTipText.textContent = '📦 ₹499 fee is 100% credited back toward your first production order!';
    }
    if (leadTypeHidden) leadTypeHidden.value = 'Physical Sample Kit Request (₹499)';
    if (web3Subject) web3Subject.value = 'Sample Kit Request (₹499) — CraftsVeda Studio';

  } else {
    // Custom Print Quote mode
    if (tabCustom) {
      tabCustom.classList.add('active');
      tabCustom.setAttribute('aria-selected', 'true');
    }
    if (tabSample) {
      tabSample.classList.remove('active');
      tabSample.setAttribute('aria-selected', 'false');
    }
    if (sampleBanner) sampleBanner.style.display = 'none';

    if (productSelect && productSelect.value.includes('Sample Kit')) {
      productSelect.value = 'Luxury Business Cards';
    }
    if (paperStock && paperStock.value.includes('Curated Swatch')) {
      paperStock.value = '600 GSM Natural Cotton Stock';
    }
    if (qtySelect && qtySelect.value.includes('Sample Kit')) {
      qtySelect.value = '500 pcs';
    }
    if (submitBtnLabel) {
      submitBtnLabel.textContent = 'Get Instant Quote';
    }
    if (summaryModeLabel) {
      summaryModeLabel.textContent = 'LIVE INQUIRY SPECIFICATION';
    }
    if (summaryTipText) {
      summaryTipText.textContent = '💡 Instant 30-minute response guaranteed during studio hours.';
    }
    if (leadTypeHidden) leadTypeHidden.value = 'Custom Print Quote';
    if (web3Subject) web3Subject.value = 'New Print Quote Inquiry — CraftsVeda Studio';
  }

  updateQuoteSummary();
}

function onProductChange() {
  const productSelect = document.getElementById('productSelect');
  if (!productSelect) return;

  if (productSelect.value.includes('Sample Kit')) {
    setLeadMode('sample');
  } else if (currentLeadMode === 'sample') {
    setLeadMode('custom');
  } else {
    updateQuoteSummary();
  }
}

function updateQuoteSummary() {
  const productSelect = document.getElementById('productSelect');
  const paperStock = document.getElementById('paperStock');
  const qtySelect = document.getElementById('qtySelect');
  const turnaround = document.getElementById('turnaround');
  const clientCity = document.getElementById('clientCity');

  const sumProduct = document.getElementById('sumProduct');
  const sumStock = document.getElementById('sumStock');
  const sumFinishes = document.getElementById('sumFinishes');
  const sumQty = document.getElementById('sumQty');
  const sumTurnaround = document.getElementById('sumTurnaround');
  const sumCity = document.getElementById('sumCity');
  const sumCityRow = document.getElementById('sumCityRow');

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
      sumCityRow.style.display = 'flex';
    } else {
      sumCityRow.style.display = 'none';
    }
  }

  // Selected Finishes Chips
  const selectedFinishes = [];
  document.querySelectorAll('input[name="finish"]:checked').forEach(cb => {
    selectedFinishes.push(cb.value);
  });

  if (sumFinishes) {
    if (selectedFinishes.length > 0) {
      sumFinishes.textContent = selectedFinishes.join(', ');
    } else {
      sumFinishes.textContent = 'Standard Print (No Specialty Finish)';
    }
  }
}

// Preselection helpers from What We Print & Finishes sections
function preselectQuoteProduct(productName) {
  const select = document.getElementById('productSelect');
  if (!select) return;

  if (productName.includes('Sample Kit')) {
    setLeadMode('sample');
  } else {
    setLeadMode('custom');
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
  const quoteTarget = document.getElementById('quote-generator');
  if (quoteTarget) {
    scrollToTarget(quoteTarget);
  }
}

function preselectQuoteFinish(finishName) {
  setLeadMode('custom');

  // Check corresponding checkbox
  const foilCb = document.getElementById('checkFoil');
  const uvCb = document.getElementById('checkSpotUV');
  const embossCb = document.getElementById('checkEmboss');
  const velvetCb = document.getElementById('checkVelvet');
  const gildCb = document.getElementById('checkGilding');
  const dieCb = document.getElementById('checkDieCut');

  if (finishName.includes('Foil') && foilCb) foilCb.checked = true;
  if (finishName.includes('Spot UV') && uvCb) uvCb.checked = true;
  if (finishName.includes('Emboss') && embossCb) embossCb.checked = true;
  if (finishName.includes('Velvet') && velvetCb) velvetCb.checked = true;
  if (finishName.includes('Gild') && gildCb) gildCb.checked = true;
  if (finishName.includes('Die') && dieCb) dieCb.checked = true;

  updateQuoteSummary();
  const quoteTarget = document.getElementById('quote-generator');
  if (quoteTarget) {
    scrollToTarget(quoteTarget);
  }
}

/* ==========================================================================
   06. UNIFIED LEAD SUBMISSION (WEB3FORMS SILENT POST + DIRECT WHATSAPP)
   ========================================================================== */
function handleUnifiedLeadSubmit(e) {
  e.preventDefault();

  const clientName = document.getElementById('clientName')?.value.trim();
  const clientPhone = document.getElementById('clientPhone')?.value.trim();
  const clientCity = document.getElementById('clientCity')?.value.trim() || 'Mumbai / Pan-India';
  const clientEmail = document.getElementById('clientEmail')?.value.trim() || 'Not Provided';
  const product = document.getElementById('productSelect')?.value || 'Luxury Printing';
  const paper = document.getElementById('paperStock')?.value || 'Premium Stock';
  const qty = document.getElementById('qtySelect')?.value || '500 pcs';
  const turnaround = document.getElementById('turnaround')?.value || 'Standard';
  const notes = document.getElementById('clientNotes')?.value.trim() || 'None';

  if (!clientName || !clientPhone) {
    alert('Please provide your Name and Phone / WhatsApp number so our studio team can connect with you.');
    return;
  }

  // Finishes List
  const finishes = [];
  document.querySelectorAll('input[name="finish"]:checked').forEach(cb => {
    finishes.push(cb.value);
  });
  const finishesText = finishes.length > 0 ? finishes.join(', ') : 'Standard Print (No Specialty Finish)';

  // 1. Asynchronously send form to Web3Forms in background for inbox logging (vkzway2@gmail.com)
  const formElement = document.getElementById('quoteCalculatorForm');
  if (formElement) {
    const formData = new FormData(formElement);
    formData.append('selected_finishes_list', finishesText);
    formData.append('submission_timestamp', new Date().toLocaleString());

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      console.log('Web3Forms lead logged:', data);
    })
    .catch(err => {
      // Non-blocking catch to ensure WhatsApp and user flow are never interrupted
      console.warn('Web3Forms notification log notice:', err);
    });
  }

  // 2. Format Structured WhatsApp Specification Message
  const isSampleKit = currentLeadMode === 'sample' || product.includes('Sample Kit');
  let message = '';

  if (isSampleKit) {
    message = 
`📦 *PHYSICAL SAMPLE KIT REQUEST — CRAFTSVEDA STUDIO* 📦
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
    message = 
`✨ *NEW PRINT INQUIRY — CRAFTSVEDA STUDIO* ✨
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
  showToast('Inquiry Sent! Opening WhatsApp with our print specialist at Saki Naka, Mumbai...');

  // 4. Launch WhatsApp in new tab
  setTimeout(() => {
    window.open(encodedUrl, '_blank');
  }, 400);
}

function showToast(text) {
  const toast = document.getElementById('toastNotification');
  const toastText = document.getElementById('toastText');
  if (!toast || !toastText) return;

  toastText.textContent = text;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 5000);
}

/* ==========================================================================
   07. SUBTLE HERO 3D TILT EFFECT
   ========================================================================== */
function initHeroTilt() {
  const card = document.querySelector('.mockup-stage-card');
  if (!card || window.innerWidth < 1024) return;

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateY(-4deg) rotateX(2deg)';
  });
}

/* ==========================================================================
   08. SCROLL SPY FOR NAVIGATION
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const header = document.getElementById('headerMaster') || document.getElementById('siteHeader');
    const headerHeight = header ? header.offsetHeight : 100;
    const scrollPos = window.pageYOffset + headerHeight + 50;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   09. FIXED HEADER SMOOTH SCROLLING ENGINE
   ========================================================================== */
function scrollToTarget(target) {
  const element = typeof target === 'string' ? document.querySelector(target) : target;
  if (!element) return;

  const header = document.getElementById('headerMaster') || document.getElementById('siteHeader');
  const headerHeight = header ? header.offsetHeight : 100;
  const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
  const offsetPosition = Math.max(0, elementPosition - headerHeight - 10);

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#' || targetId.length <= 1) return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        scrollToTarget(targetElement);

        // Close mobile nav if open
        const nav = document.getElementById('mainNav');
        const toggleBtn = document.getElementById('mobileToggle');
        if (nav && nav.classList.contains('open')) {
          nav.classList.remove('open');
          if (toggleBtn) toggleBtn.classList.remove('active');
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
   10. HERO COUNTERS MOTION GRAPHICS ENGINE
   ========================================================================== */
function initHeroCounters() {
  const specsList = document.getElementById('heroSpecsList');
  if (!specsList) return;

  const cntGsm = document.getElementById('cntGsm');
  const cntPantone = document.getElementById('cntPantone');
  const cntRush = document.getElementById('cntRush');

  let hasAnimated = false;

  function runCounters() {
    if (hasAnimated) return;
    hasAnimated = true;

    const duration = 1600; // ms
    const startTime = performance.now();

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);

      // GSM 0 to 600
      if (cntGsm) {
        const val = Math.floor(eased * 600);
        cntGsm.textContent = val;
      }

      // Pantone 0 to 100
      if (cntPantone) {
        const val = Math.floor(eased * 100);
        cntPantone.textContent = val;
      }

      // Rush 0-0 to 24-48
      if (cntRush) {
        const val1 = Math.floor(eased * 24);
        const val2 = Math.floor(eased * 48);
        cntRush.textContent = `${val1}-${val2}`;
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        // Mark all spec items as counted to trigger periodic light sheen
        document.querySelectorAll('.spec-item').forEach(item => {
          item.classList.add('counted');
        });
      }
    }

    requestAnimationFrame(update);
  }

  // Trigger via IntersectionObserver or directly if already visible
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runCounters();
          observer.disconnect();
        }
      });
    }, { threshold: 0.2 });
    observer.observe(specsList);
  } else {
    runCounters();
  }
}

/* ==========================================================================
   10. LUXURY BACKGROUND ANIMATION (GOLD PARTICLES & AMBIENT SHIMMER)
   ========================================================================== */
function initLuxuryBackgroundAnimation() {
  const canvas = document.getElementById('luxuryBgCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
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
    active: false
  };

  const goldColors = [
    { r: 212, g: 175, b: 55 },   // Primary 24K Gold
    { r: 243, g: 229, b: 171 },  // Pale Gold
    { r: 255, g: 215, b: 0 },    // Bright Gold
    { r: 197, g: 160, b: 89 },   // Champagne
    { r: 255, g: 255, b: 255 }   // Diamond Sparkle Speck
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
        this.type = 'registration';
        this.radius = 7 + Math.random() * 6;
        this.baseAlpha = 0.12 + Math.random() * 0.22;
        this.speedY = 0.18 + Math.random() * 0.3;
        this.speedX = (Math.random() - 0.5) * 0.25;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.008;
      } else if (rand < 0.24) {
        this.type = 'paper';
        this.cardW = 12 + Math.random() * 8;
        this.cardH = 16 + Math.random() * 10;
        this.radius = Math.max(this.cardW, this.cardH);
        this.baseAlpha = 0.10 + Math.random() * 0.18;
        this.speedY = 0.22 + Math.random() * 0.35;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.01;
        this.flipAngle = Math.random() * Math.PI * 2;
        this.flipSpeed = 0.012 + Math.random() * 0.015;
      } else if (rand < 0.32) {
        this.type = 'cropmark';
        this.radius = 6 + Math.random() * 4;
        this.baseAlpha = 0.14 + Math.random() * 0.24;
        this.speedY = 0.2 + Math.random() * 0.35;
        this.speedX = (Math.random() - 0.5) * 0.25;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.006;
      } else if (rand < 0.40) {
        this.type = 'bokeh';
        this.radius = 16 + Math.random() * 26;
        this.baseAlpha = 0.02 + Math.random() * 0.04;
        this.speedY = 0.15 + Math.random() * 0.25;
        this.speedX = (Math.random() - 0.5) * 0.2;
      } else {
        this.type = 'goldDust';
        this.radius = 0.7 + Math.random() * 2.2;
        this.baseAlpha = 0.15 + Math.random() * 0.55;
        this.speedY = 0.25 + Math.random() * 0.65;
        this.speedX = (Math.random() - 0.5) * 0.35;
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
      const swayScale = (this.type === 'bokeh' || this.type === 'paper') ? 0.35 : 0.6;
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

      if (this.type === 'registration') {
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

      } else if (this.type === 'paper') {
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
        ctx.rect(-this.cardW / 2 + 2, -this.cardH / 2 + 2, this.cardW - 4, this.cardH - 4);
        ctx.strokeStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${currentAlpha * 0.4})`;
        ctx.stroke();

      } else if (this.type === 'cropmark') {
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

      } else if (this.type === 'bokeh') {
        // Soft ambient bokeh disc
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
        grad.addColorStop(0, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${currentAlpha})`);
        grad.addColorStop(1, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0)`);
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

    // Responsive density: ~32 on mobile for smooth 60fps and low battery use, ~65 on desktop
    const targetCount = width < 768 ? 32 : 65;
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
  window.addEventListener('resize', () => {
    resize();
  }, { passive: true });

  window.addEventListener('mousemove', (e) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    pointer.active = true;
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    pointer.active = false;
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      pointer.x = e.touches[0].clientX;
      pointer.y = e.touches[0].clientY;
      pointer.active = true;
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    pointer.active = false;
  }, { passive: true });

  // Battery saving: auto-pause animation loop when tab is in background
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      isPaused = true;
      if (animFrameId) cancelAnimationFrame(animFrameId);
    } else {
      isPaused = false;
      animFrameId = requestAnimationFrame(animate);
    }
  });

  resize();
  animFrameId = requestAnimationFrame(animate);
}

/* ==========================================================================
   SYNCHRONIZED RGB ANGLE ROTATOR ENGINE
   Ensures 100% fluid 60fps rotation across all browsers and devices
   ========================================================================== */
(function initRgbAngleEngine() {
  let rgbAngle = 0;
  let lastTime = performance.now();
  let rgbAnimId = null;

  function stepRgb(currentTime) {
    const delta = (currentTime - lastTime) / 1000;
    lastTime = currentTime;
    // Smooth 3.5s full rotation cycle (~102.85 deg/sec)
    rgbAngle = (rgbAngle + delta * 102.85) % 360;
    document.documentElement.style.setProperty('--rgb-angle', rgbAngle.toFixed(1) + 'deg');
    rgbAnimId = requestAnimationFrame(stepRgb);
  }

  // Auto-pause when tab is hidden to conserve GPU/battery
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (rgbAnimId) cancelAnimationFrame(rgbAnimId);
    } else {
      lastTime = performance.now();
      rgbAnimId = requestAnimationFrame(stepRgb);
    }
  });

  rgbAnimId = requestAnimationFrame(stepRgb);
})();



