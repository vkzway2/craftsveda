/**
 * CraftsVeda Luxury Client Portal — Customer Tracking Logic (track.js)
 */

document.addEventListener("DOMContentLoaded", () => {
  const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyvdBZtzqONY_pmXqEhGrqOlgoCM3TI5hUhSDCX4p30wY5Vq3WrE87rftCz9FhrkcPg2Q/exec";

  // Elements
  const trackOrderForm = document.getElementById("trackOrderForm");
  const trackOrderIdInput = document.getElementById("trackOrderId");
  const trackContactInput = document.getElementById("trackContact");
  const btnTrackSubmit = document.getElementById("btnTrackSubmit");
  const trackSpinner = document.getElementById("trackSpinner");
  const btnTrackText = document.getElementById("btnTrackText");
  const trackErrorBox = document.getElementById("trackErrorBox");
  const trackErrorTitle = document.getElementById("trackErrorTitle");
  const trackErrorMessage = document.getElementById("trackErrorMessage");

  const btnLoadDemoOrder = document.getElementById("btnLoadDemoOrder");
  const recentOrderQuickBar = document.getElementById("recentOrderQuickBar");
  const recentOrderIdText = document.getElementById("recentOrderIdText");
  const btnQuickLoadRecent = document.getElementById("btnQuickLoadRecent");

  const trackingResultSection = document.getElementById("trackingResultSection");
  const resOrderId = document.getElementById("resOrderId");
  const btnCopyOrderId = document.getElementById("btnCopyOrderId");
  const copyFeedbackText = document.getElementById("copyFeedbackText");
  const resOrderDate = document.getElementById("resOrderDate");
  const resOrderCity = document.getElementById("resOrderCity");
  const resStatusBadge = document.getElementById("resStatusBadge");
  const resStatusText = document.getElementById("resStatusText");
  const resPaymentBadge = document.getElementById("resPaymentBadge");

  const courierTrackingCard = document.getElementById("courierTrackingCard");
  const resCourierName = document.getElementById("resCourierName");
  const resTrackingNumber = document.getElementById("resTrackingNumber");
  const resCourierLink = document.getElementById("resCourierLink");

  const resLastUpdated = document.getElementById("resLastUpdated");
  const resProduct = document.getElementById("resProduct");
  const resQuantity = document.getElementById("resQuantity");
  const resPaperStock = document.getElementById("resPaperStock");
  const resLamination = document.getElementById("resLamination");
  const resPrintSide = document.getElementById("resPrintSide");
  const resFinish = document.getElementById("resFinish");
  const resAddons = document.getElementById("resAddons");
  const resFinalTotal = document.getElementById("resFinalTotal");
  const rowPaidAmount = document.getElementById("rowPaidAmount");
  const resPaidAmount = document.getElementById("resPaidAmount");
  const rowBalanceAmount = document.getElementById("rowBalanceAmount");
  const resBalanceAmount = document.getElementById("resBalanceAmount");

  const resCustomerName = document.getElementById("resCustomerName");
  const resDestinationCity = document.getElementById("resDestinationCity");
  const resArtworkFileName = document.getElementById("resArtworkFileName");
  const btnDownloadArtwork = document.getElementById("btnDownloadArtwork");
  const btnLiveChatWa = document.getElementById("btnLiveChatWa");

  // Sample Demo Orders for Instant Testing & Offline Resilience
  const DEMO_ORDERS = {
    "CV-161026-0001": {
      orderId: "CV-161026-0001",
      dateTime: "16/10/2026 14:30:15",
      customerName: "Aditi Singhania (Luxe Studio)",
      phone: "9820012345",
      email: "aditi@luxestudio.in",
      deliveryCity: "Mumbai 400072",
      product: "Luxury Business Cards",
      quantity: 500,
      paperStock: "400 GSM Premium Art Card",
      lamination: "Velvet Soft-Touch",
      printSide: "Both Sides Full Colour",
      finish: "BV-05: Both Side Spot UV + Front Gold Foil",
      foilColour: "Gold",
      dripOff: "No",
      customShapeCut: "Yes",
      finalTotal: 2694,
      paidAmount: 1000,
      balanceAmount: 1694,
      paymentStatus: "Advance Received",
      orderStatus: "In Production",
      adminNotes: "Die-cut plate prepared. High priority luxury order.",
      lastUpdated: "16/10/2026 18:45:00",
      courierName: "",
      trackingNumber: "",
      trackingUrl: "",
      designFileUrl: "https://drive.google.com/drive/u/0/folders/example_luxe_cards"
    },
    "CV-161026-0002": {
      orderId: "CV-161026-0002",
      dateTime: "15/10/2026 11:20:00",
      customerName: "Vikram Malhotra (Apex Capital)",
      phone: "9811122334",
      email: "vikram@apexcapital.co",
      deliveryCity: "Bengaluru 560001",
      product: "Luxury Business Cards",
      quantity: 1000,
      paperStock: "400 GSM Premium Art Card",
      lamination: "Velvet Soft-Touch",
      printSide: "Both Sides Full Colour",
      finish: "BV-10: Both Side Foil & Both Side Spot UV (Rose Gold)",
      foilColour: "Rose Gold",
      dripOff: "Yes",
      customShapeCut: "No",
      finalTotal: 6850,
      paidAmount: 6850,
      balanceAmount: 0,
      paymentStatus: "Paid (Received)",
      orderStatus: "Dispatched",
      adminNotes: "Dispatched via Blue Dart Air Express.",
      lastUpdated: "16/10/2026 16:30:00",
      courierName: "Blue Dart Express Air",
      trackingNumber: "BLUEDART-8892019482",
      trackingUrl: "https://www.bluedart.com/tracking",
      designFileUrl: "https://drive.google.com/drive/u/0/folders/example_apex"
    }
  };

  // 1. Check for stored recent order
  try {
    const rawLast = localStorage.getItem("cv_last_order");
    if (rawLast) {
      const parsedLast = JSON.parse(rawLast);
      if (parsedLast && parsedLast.orderId) {
        recentOrderIdText.textContent = parsedLast.orderId;
        recentOrderQuickBar.style.display = "flex";

        btnQuickLoadRecent.addEventListener("click", () => {
          trackOrderIdInput.value = parsedLast.orderId;
          trackContactInput.value = parsedLast.phone || parsedLast.email || "";
          trackOrderForm.dispatchEvent(new Event("submit"));
        });
      }
    }
  } catch (e) {}

  // 2. Parse URL Search Parameters (e.g. ?orderId=CV-161026-0001&phone=9820012345)
  const urlParams = new URLSearchParams(window.location.search);
  const qOrderId = urlParams.get("orderId") || urlParams.get("id");
  const qPhone = urlParams.get("phone") || urlParams.get("tel");
  const qEmail = urlParams.get("email");

  if (qOrderId) {
    trackOrderIdInput.value = qOrderId.trim();
  }
  if (qPhone || qEmail) {
    trackContactInput.value = (qPhone || qEmail).trim();
  }
  // Auto-submit if both are present in URL
  if (qOrderId && (qPhone || qEmail)) {
    setTimeout(() => {
      trackOrderForm.dispatchEvent(new Event("submit"));
    }, 200);
  }

  // 3. Demo Button
  if (btnLoadDemoOrder) {
    btnLoadDemoOrder.addEventListener("click", () => {
      trackOrderIdInput.value = "CV-161026-0001";
      trackContactInput.value = "9820012345";
      trackOrderForm.dispatchEvent(new Event("submit"));
    });
  }

  // 4. Form Submit Handler
  trackOrderForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const orderId = trackOrderIdInput.value.trim();
    const contact = trackContactInput.value.trim();

    trackErrorBox.style.display = "none";

    if (!orderId) {
      showError("Please enter your Order ID (e.g. CV-161026-0001).");
      trackOrderIdInput.focus();
      return;
    }

    if (!contact) {
      showError("Please enter the mobile number or email address registered with this order.");
      trackContactInput.focus();
      return;
    }

    // Set Loading State
    setLoading(true);

    try {
      const cleanPhone = contact.replace(/[^0-9]/g, "");
      const isEmail = contact.indexOf("@") !== -1;

      let orderData = null;

      // First check local demo registry for instantaneous responsiveness
      const normId = orderId.toUpperCase();
      if (DEMO_ORDERS[normId]) {
        const demo = DEMO_ORDERS[normId];
        const demoPhone = (demo.phone || "").replace(/[^0-9]/g, "");
        const demoEmail = (demo.email || "").toLowerCase();

        let match = false;
        if (cleanPhone.length >= 10 && demoPhone.endsWith(cleanPhone.slice(-10))) match = true;
        if (isEmail && demoEmail === contact.toLowerCase()) match = true;

        if (match) {
          orderData = demo;
        }
      }

      // If not in local demo cache, query Apps Script backend
      if (!orderData) {
        const queryUrl = `${WEB_APP_URL}?action=trackOrder&orderId=${encodeURIComponent(orderId)}&phone=${encodeURIComponent(cleanPhone)}&email=${encodeURIComponent(isEmail ? contact.toLowerCase() : "")}`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 9000);

        try {
          const res = await fetch(queryUrl, { signal: controller.signal });
          clearTimeout(timeoutId);
          const data = await res.json();

          if (data && data.ok && data.order) {
            orderData = data.order;
          } else {
            throw new Error((data && data.error) || "Order verification failed. Please check your Order ID and phone/email.");
          }
        } catch (fetchErr) {
          // If server returns error or aborts, check demo orders fallback
          if (DEMO_ORDERS[normId]) {
            orderData = DEMO_ORDERS[normId];
          } else {
            throw fetchErr;
          }
        }
      }

      if (!orderData) {
        throw new Error("Order not found or contact verification failed. Please check your details.");
      }

      // Render Order Tracking View
      renderTrackingResult(orderData);

    } catch (err) {
      console.error("Tracking lookup error:", err);
      showError(err.message || "Unable to verify order. Please ensure your Order ID and contact details match.");
    } finally {
      setLoading(false);
    }
  });

  // Render Function
  function renderTrackingResult(order) {
    resOrderId.textContent = order.orderId;
    resOrderDate.textContent = `Placed: ${order.dateTime || "Recent"}`;
    resOrderCity.textContent = `📍 Delivery: ${order.deliveryCity || "Pan-India"}`;
    resDestinationCity.textContent = order.deliveryCity || "Pan-India Delivery Address";

    // Status Badge & Stepper Progression
    const statusStr = String(order.orderStatus || "New Order").toUpperCase();
    resStatusText.textContent = order.orderStatus || "New Order";

    resStatusBadge.className = "status-indicator-pill";
    if (statusStr.indexOf("DISPATCH") !== -1) {
      resStatusBadge.classList.add("status-dispatched");
    } else if (statusStr.indexOf("DELIVER") !== -1) {
      resStatusBadge.classList.add("status-delivered");
    }

    // Payment Status Badge (shows exact order.paymentStatus without fixed prefix)
    const payStatus = order.paymentStatus || "Pending";
    resPaymentBadge.textContent = payStatus;

    const payUpper = String(payStatus).toUpperCase();
    if (payUpper.indexOf("PAID") !== -1 || payUpper.indexOf("RECEIVED") !== -1) {
      resPaymentBadge.style.borderColor = "var(--status-green)";
      resPaymentBadge.style.color = "#34d399";
    } else if (payUpper.indexOf("COD") !== -1) {
      resPaymentBadge.style.borderColor = "var(--gold-bright)";
      resPaymentBadge.style.color = "var(--gold-bright)";
    } else {
      resPaymentBadge.style.borderColor = "rgba(255, 255, 255, 0.1)";
      resPaymentBadge.style.color = "var(--text-sub)";
    }

    // Specifications
    resProduct.textContent = order.product || "Luxury Business Cards";
    resQuantity.textContent = `${order.quantity || 500} Cards`;
    resPaperStock.textContent = order.paperStock || "400 GSM Premium Card";
    resLamination.textContent = order.lamination || "Velvet Soft-Touch";
    resPrintSide.textContent = order.printSide || "Both Sides Full Color";
    resFinish.textContent = order.finish || "Specialty Finishing";
    
    const addonsArr = [];
    if (order.dripOff === "Yes" || order.dripOff === true) addonsArr.push("Drip-off Effect");
    if (order.customShapeCut === "Yes" || order.customShapeCut === true) addonsArr.push("Custom Shape Die-Cut");
    resAddons.textContent = addonsArr.length > 0 ? addonsArr.join(", ") : "None";

    // Total Amount (order.finalTotal; agar "Confirmation Required" ho to wahi text)
    let totalText = "Confirmation Required";
    if (order.finalTotal !== null && order.finalTotal !== undefined && order.finalTotal !== "") {
      const rawTotalStr = String(order.finalTotal).trim();
      if (rawTotalStr.toUpperCase().indexOf("CONFIRM") !== -1) {
        totalText = rawTotalStr;
      } else if (typeof order.finalTotal === "number") {
        totalText = `₹${order.finalTotal.toLocaleString("en-IN")}`;
      } else {
        const num = Number(rawTotalStr.replace(/[^0-9.-]+/g, ""));
        totalText = (!isNaN(num) && num > 0) ? `₹${num.toLocaleString("en-IN")}` : rawTotalStr;
      }
    }
    resFinalTotal.textContent = totalText;

    // Parse Paid and Balance amounts
    const paid = (order.paidAmount !== null && order.paidAmount !== undefined && order.paidAmount !== "")
      ? Number(order.paidAmount)
      : 0;

    const hasBalance = order.balanceAmount !== null && order.balanceAmount !== undefined && order.balanceAmount !== "";
    const balance = hasBalance ? Number(order.balanceAmount) : null;

    // Rules:
    // 1. paidAmount 0 ho to Paid aur Balance ki line mat dikhao, sirf payment status badge dikhao.
    if (isNaN(paid) || paid <= 0) {
      if (rowPaidAmount) rowPaidAmount.style.display = "none";
      if (rowBalanceAmount) rowBalanceAmount.style.display = "none";
    } else {
      // Show Paid Amount in rupee format
      if (rowPaidAmount) {
        rowPaidAmount.style.display = "flex";
        if (resPaidAmount) resPaidAmount.textContent = `₹${paid.toLocaleString("en-IN")}`;
      }

      // 2. balanceAmount null ho (Final Total pending) to Balance line chhupa do.
      if (balance === null || isNaN(balance)) {
        if (rowBalanceAmount) rowBalanceAmount.style.display = "none";
      } else if (balance === 0) {
        // 3. balanceAmount 0 aur paidAmount > 0 ho to Balance ki jagah "Fully Paid" dikhao.
        if (rowBalanceAmount) {
          rowBalanceAmount.style.display = "flex";
          if (resBalanceAmount) {
            resBalanceAmount.textContent = "Fully Paid";
            resBalanceAmount.style.color = "#34d399";
          }
        }
      } else {
        // Balance > 0
        if (rowBalanceAmount) {
          rowBalanceAmount.style.display = "flex";
          if (resBalanceAmount) {
            resBalanceAmount.textContent = `₹${balance.toLocaleString("en-IN")}`;
            resBalanceAmount.style.color = "";
          }
        }
      }
    }

    resCustomerName.textContent = order.customerName || "Valued Client";
    resLastUpdated.textContent = `Last sync: ${order.lastUpdated || "Live"}`;

    // Courier Dispatch Card
    if ((statusStr.indexOf("DISPATCH") !== -1 || statusStr.indexOf("DELIVER") !== -1) && (order.courierName || order.trackingNumber)) {
      courierTrackingCard.style.display = "block";
      resCourierName.textContent = order.courierName || "Express Courier Partner";
      resTrackingNumber.textContent = order.trackingNumber || "Assigned";
      resCourierLink.href = order.trackingUrl || "#";
      if (!order.trackingUrl) resCourierLink.style.display = "none";
    } else {
      courierTrackingCard.style.display = "none";
    }

    // Artwork File Box
    if (order.designFileUrl && order.designFileUrl.startsWith("http")) {
      btnDownloadArtwork.style.display = "inline-flex";
      btnDownloadArtwork.href = order.designFileUrl;
      resArtworkFileName.textContent = "High-Res Artwork File Attached (Click to View)";
    } else {
      btnDownloadArtwork.style.display = "none";
      resArtworkFileName.textContent = order.designFileUrl || "Artwork Received & Queued";
    }

    // WhatsApp Live Chat Link prefill
    const waText = `Hi CraftsVeda, I am tracking my order ${order.orderId} (${order.customerName || ""}). Current status is "${order.orderStatus}". I would like an update on delivery.`;
    btnLiveChatWa.href = `https://wa.me/918840035249?text=${encodeURIComponent(waText)}`;

    // Update 5-Step Timeline
    updateStepper(statusStr);

    // Show Results & Smooth Scroll
    trackingResultSection.style.display = "block";
    trackingResultSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Update Stepper Nodes according to order status
  function updateStepper(statusStr) {
    const steps = [
      document.getElementById("step1"),
      document.getElementById("step2"),
      document.getElementById("step3"),
      document.getElementById("step4"),
      document.getElementById("step5")
    ];

    steps.forEach((s) => {
      s.className = "step-item";
    });

    let activeIndex = 0; // 0 = step1, 1 = step2, etc.

    if (statusStr.indexOf("NEW") !== -1 || statusStr.indexOf("CONFIRM") !== -1) {
      activeIndex = 0;
    } else if (statusStr.indexOf("PROOF") !== -1 || statusStr.indexOf("PAYMENT") !== -1) {
      activeIndex = 1;
    } else if (statusStr.indexOf("PRODUCTION") !== -1 || statusStr.indexOf("PRINT") !== -1) {
      activeIndex = 2;
    } else if (statusStr.indexOf("DISPATCH") !== -1 || statusStr.indexOf("SHIPPED") !== -1) {
      activeIndex = 3;
    } else if (statusStr.indexOf("DELIVER") !== -1) {
      activeIndex = 4;
    } else {
      activeIndex = 2; // Default to production if active
    }

    for (let i = 0; i < steps.length; i++) {
      if (i < activeIndex) {
        steps[i].classList.add("step-completed");
      } else if (i === activeIndex) {
        if (activeIndex === 4 && statusStr.indexOf("DELIVER") !== -1) {
          steps[i].classList.add("step-completed");
        } else {
          steps[i].classList.add("step-active");
        }
      }
    }
  }

  // Helper Functions
  function setLoading(isLoading) {
    btnTrackSubmit.disabled = isLoading;
    trackSpinner.style.display = isLoading ? "inline-block" : "none";
    btnTrackText.textContent = isLoading ? "Verifying Studio Records..." : "Verify & Track Order";
  }

  function showError(msg) {
    trackErrorBox.style.display = "flex";
    trackErrorMessage.textContent = msg;
  }

  // Copy Order ID
  if (btnCopyOrderId) {
    btnCopyOrderId.addEventListener("click", () => {
      const idText = resOrderId.textContent;
      navigator.clipboard.writeText(idText).then(() => {
        copyFeedbackText.textContent = "Copied!";
        setTimeout(() => {
          copyFeedbackText.textContent = "Copy";
        }, 2000);
      });
    });
  }
});
