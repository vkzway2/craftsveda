/**
 * CraftsVeda Premium Client Portal — Customer Tracking Logic (track.js)
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
  const rowAdvanceDue = document.getElementById("rowAdvanceDue");
  const resAdvanceDue = document.getElementById("resAdvanceDue");
  const rowPaidAmount = document.getElementById("rowPaidAmount");
  const resPaidAmount = document.getElementById("resPaidAmount");
  const rowBalanceAmount = document.getElementById("rowBalanceAmount");
  const resBalanceAmount = document.getElementById("resBalanceAmount");

  const resCustomerName = document.getElementById("resCustomerName");
  const resDestinationCity = document.getElementById("resDestinationCity");
  const resArtworkFileName = document.getElementById("resArtworkFileName");
  const btnDownloadArtwork = document.getElementById("btnDownloadArtwork");
  const btnLiveChatWa = document.getElementById("btnLiveChatWa");

  // Sample Demo Orders for Instant Testing & Offline Resilience (3 Verified Statuses)
  const DEMO_ORDERS = {
    // 1. In Production Test Order
    "CV-161026-0001": {
      orderId: "CV-161026-0001",
      dateTime: "16/10/2026 14:30:15",
      customerName: "Aditi Singhania (Luxe Studio)",
      phone: "9820012345",
      email: "aditi@luxestudio.in",
      deliveryCity: "Mumbai 400072",
      product: "Premium Business Cards",
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
      orderStatus: "PRODUCTION IN PROGRESS",
      artworkStatus: "APPROVED",
      adminNotes: "Die-cut plate prepared. High priority premium order.",
      lastUpdated: "16/10/2026 18:45:00",
      courierName: "",
      trackingNumber: "",
      trackingUrl: "",
      designFileUrl: "https://drive.google.com/drive/u/0/folders/example_luxe_cards"
    },
    // 2. Quality Checked & Ready Test Order
    "CV-161026-0002": {
      orderId: "CV-161026-0002",
      dateTime: "17/10/2026 10:15:00",
      customerName: "Rajesh Mehta (Mehta & Sons)",
      phone: "9820054321",
      email: "rajesh@mehtasons.in",
      deliveryCity: "Delhi 110001",
      product: "Premium Business Cards",
      quantity: 500,
      paperStock: "400 GSM Premium Art Card",
      lamination: "Velvet Soft-Touch",
      printSide: "Both Sides Full Colour",
      finish: "BV-03: Front Foil + Front Spot UV",
      foilColour: "Gold",
      dripOff: "No",
      customShapeCut: "No",
      finalTotal: 4500,
      paidAmount: 2500,
      balanceAmount: 2000,
      paymentStatus: "Advance Received",
      orderStatus: "QUALITY CHECKED & READY",
      artworkStatus: "APPROVED",
      adminNotes: "Finishing inspected. Boxed in premium rigid drawer packaging.",
      lastUpdated: "18/10/2026 15:30:00",
      courierName: "",
      trackingNumber: "",
      trackingUrl: "",
      designFileUrl: "https://drive.google.com/drive/u/0/folders/example_mehta"
    },
    // 3. Dispatched Test Order
    "CV-161026-0003": {
      orderId: "CV-161026-0003",
      dateTime: "15/10/2026 11:20:00",
      customerName: "Vikram Malhotra (Apex Capital)",
      phone: "9811122334",
      email: "vikram@apexcapital.co",
      deliveryCity: "Bengaluru 560001",
      product: "Premium Business Cards",
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
      orderStatus: "DISPATCHED",
      artworkStatus: "APPROVED",
      adminNotes: "Dispatched via Blue Dart Air Express.",
      lastUpdated: "18/10/2026 16:30:00",
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

  // Status Mapping Table: Maps exact Admin/Sheet status dropdown strings to 6 Timeline Steps
  const STATUS_MAPPING = {
    // Step 1: Order Confirmed / Order Placed / Pending
    "ORDER RECEIVED": { step: 1, label: "Order Received", badgeClass: "status-received" },
    "ORDER PLACED": { step: 1, label: "Order Placed", badgeClass: "status-received" },
    "PENDING": { step: 1, label: "Pending", badgeClass: "status-pending" },
    "MANUAL CONFIRMATION REQUIRED": { step: 1, label: "Confirmation Required", badgeClass: "status-pending" },

    // Step 2: Artwork & Payment
    "ORDER CONFIRMED": { step: 2, label: "Order Confirmed", badgeClass: "status-confirmed" },
    "ARTWORK APPROVAL REQUIRED": { step: 2, label: "Artwork Approval Required", badgeClass: "status-artwork" },
    "ARTWORK REVISION REQUIRED": { step: 2, label: "Artwork Revision Required", badgeClass: "status-revision" },
    "ARTWORK APPROVED": { step: 2, label: "Artwork Approved", badgeClass: "status-artwork" },
    "PAID": { step: 2, label: "Payment Confirmed", badgeClass: "status-paid" },

    // Step 3: In Production (steps 1-2 complete)
    "PRODUCTION IN PROGRESS": { step: 3, label: "In Production", badgeClass: "status-production" },
    "IN PRODUCTION": { step: 3, label: "In Production", badgeClass: "status-production" },
    "PRINTING": { step: 3, label: "In Production", badgeClass: "status-production" },

    // Step 4: Ready (Quality Checked & Ready, steps 1-3 complete)
    "QUALITY CHECKED & READY": { step: 4, label: "Quality Checked & Ready", badgeClass: "status-ready" },
    "QUALITY CHECKED": { step: 4, label: "Quality Checked & Ready", badgeClass: "status-ready" },
    "READY": { step: 4, label: "Quality Checked & Ready", badgeClass: "status-ready" },
    "READY FOR DISPATCH": { step: 4, label: "Ready for Dispatch", badgeClass: "status-ready" },

    // Step 5: Dispatched (steps 1-4 complete, step 5 active)
    "DISPATCHED": { step: 5, label: "Dispatched", badgeClass: "status-dispatched" },
    "SHIPPED": { step: 5, label: "Dispatched", badgeClass: "status-dispatched" },
    "IN TRANSIT": { step: 5, label: "In Transit", badgeClass: "status-dispatched" },
    "DELIVERY DELAYED": { step: 5, label: "Delivery Delayed", badgeClass: "status-delayed" },

    // Step 6: Delivered (all steps complete)
    "DELIVERED": { step: 6, label: "Delivered", badgeClass: "status-delivered" }
  };

  function resolveOrderStatus(rawStatus) {
    if (!rawStatus) return { step: 1, label: "Order Received", badgeClass: "status-received" };
    const clean = String(rawStatus).trim();
    const upper = clean.toUpperCase();

    // 1. Direct exact lookup
    if (STATUS_MAPPING[upper]) {
      return STATUS_MAPPING[upper];
    }

    // 2. Keyword matching fallback
    if (upper.indexOf("DELIVER") !== -1) {
      return STATUS_MAPPING["DELIVERED"];
    }
    if (upper.indexOf("DISPATCH") !== -1 || upper.indexOf("SHIPP") !== -1 || upper.indexOf("TRANSIT")) {
      return STATUS_MAPPING["DISPATCHED"];
    }
    if (upper.indexOf("READY") !== -1 || upper.indexOf("QUALITY") !== -1) {
      return STATUS_MAPPING["QUALITY CHECKED & READY"];
    }
    if (upper.indexOf("PRODUCTION") !== -1 || upper.indexOf("PRINT") !== -1) {
      return STATUS_MAPPING["PRODUCTION IN PROGRESS"];
    }
    if (upper.indexOf("ARTWORK") !== -1 || upper.indexOf("PROOF") !== -1) {
      return STATUS_MAPPING["ARTWORK APPROVAL REQUIRED"];
    }
    if (upper.indexOf("CONFIRM") !== -1) {
      return STATUS_MAPPING["ORDER CONFIRMED"];
    }

    // Default clean fallback (never mix text)
    return { step: 1, label: clean, badgeClass: "status-received" };
  }

  // 3. Demo Buttons Delegation (Supports 1-click testing of all 3 statuses)
  document.querySelectorAll(".btn-sample-preview").forEach((btn) => {
    btn.addEventListener("click", () => {
      const demoId = btn.getAttribute("data-demo") || "CV-161026-0001";
      if (DEMO_ORDERS[demoId]) {
        trackOrderIdInput.value = demoId;
        trackContactInput.value = DEMO_ORDERS[demoId].phone;
        trackOrderForm.dispatchEvent(new Event("submit"));
      }
    });
  });

  // 4. Form Submit Handler (Single Source of Truth: Sheet backend first, then local demo fallback)
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
      const normId = orderId.toUpperCase();

      let orderData = null;

      // 1. Live Query: Always attempt real-time fetch from Apps Script backend first (with cache-buster)
      const queryUrl = `${WEB_APP_URL}?action=trackOrder&orderId=${encodeURIComponent(orderId)}&phone=${encodeURIComponent(cleanPhone)}&email=${encodeURIComponent(isEmail ? contact.toLowerCase() : "")}&_t=${Date.now()}`;

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        const res = await fetch(queryUrl, { signal: controller.signal });
        clearTimeout(timeoutId);
        const data = await res.json();

        if (data && data.ok && data.order) {
          orderData = data.order;
        }
      } catch (fetchErr) {
        console.warn("Live backend query unfulfilled, checking local records:", fetchErr);
      }

      // 2. Offline / Demo Fallback
      if (!orderData && DEMO_ORDERS[normId]) {
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

    // 1. Status Mapping & Clean Header Badge (Single Source of Truth, strictly no mixed text)
    const rawStatus = order.orderStatus || order.status || "Order Received";
    const mapped = resolveOrderStatus(rawStatus);

    resStatusText.textContent = mapped.label;
    resStatusBadge.className = "status-indicator-pill";
    if (mapped.badgeClass) {
      resStatusBadge.classList.add(mapped.badgeClass);
    }

    // 2. Parse Paid and Balance amounts
    const finalTotalNum = (order.finalTotal !== null && order.finalTotal !== undefined && order.finalTotal !== "")
      ? Number(String(order.finalTotal).replace(/[^0-9.]/g, ""))
      : NaN;

    const paidNum = (order.paidAmount !== null && order.paidAmount !== undefined && order.paidAmount !== "")
      ? Number(order.paidAmount)
      : (order.paid !== null && order.paid !== undefined && order.paid !== "" ? Number(order.paid) : 0);

    const hasBalance = (order.balanceAmount !== null && order.balanceAmount !== undefined && order.balanceAmount !== "");
    const balanceNum = hasBalance
      ? Number(order.balanceAmount)
      : (!isNaN(finalTotalNum) && !isNaN(paidNum) ? Math.max(0, finalTotalNum - paidNum) : null);

    // 3. Payment Status Badge: "Advance Received" tabhi jab payment paid/partial ho, aur balance amount bhi dikhao
    if (paidNum > 0 && balanceNum !== null && balanceNum > 0) {
      resPaymentBadge.textContent = "Advance Received";
      resPaymentBadge.style.borderColor = "var(--status-green)";
      resPaymentBadge.style.color = "#34d399";
    } else if (paidNum > 0 && balanceNum === 0) {
      resPaymentBadge.textContent = "Fully Paid";
      resPaymentBadge.style.borderColor = "var(--status-green)";
      resPaymentBadge.style.color = "#34d399";
    } else {
      resPaymentBadge.textContent = order.paymentStatus || "Payment Pending";
      const payUpper = String(resPaymentBadge.textContent).toUpperCase();
      if (payUpper.indexOf("PAID") !== -1 || payUpper.indexOf("RECEIVED") !== -1) {
        resPaymentBadge.style.borderColor = "var(--status-green)";
        resPaymentBadge.style.color = "#34d399";
      } else {
        resPaymentBadge.style.borderColor = "rgba(255, 255, 255, 0.1)";
        resPaymentBadge.style.color = "var(--text-sub)";
      }
    }

    // Specifications
    resProduct.textContent = order.product || "Premium Business Cards";
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

    // Advance Due Row (show if advanceDue is present and order is not fully settled)
    if (order.advanceDue && (isNaN(paidNum) || paidNum <= 0)) {
      if (rowAdvanceDue) {
        rowAdvanceDue.style.display = "flex";
        const advVal = typeof order.advanceDue === "number" ? order.advanceDue.toFixed(2) : order.advanceDue;
        if (resAdvanceDue) resAdvanceDue.textContent = `₹${advVal}`;
      }
    } else {
      if (rowAdvanceDue) rowAdvanceDue.style.display = "none";
    }

    // Breakdown Rows for Paid & Balance
    if (isNaN(paidNum) || paidNum <= 0) {
      if (rowPaidAmount) rowPaidAmount.style.display = "none";
      if (rowBalanceAmount) rowBalanceAmount.style.display = "none";
    } else {
      if (rowPaidAmount) {
        rowPaidAmount.style.display = "flex";
        if (resPaidAmount) resPaidAmount.textContent = `₹${paidNum.toLocaleString("en-IN")}`;
      }

      if (balanceNum === null || isNaN(balanceNum)) {
        if (rowBalanceAmount) rowBalanceAmount.style.display = "none";
      } else if (balanceNum === 0) {
        if (rowBalanceAmount) {
          rowBalanceAmount.style.display = "flex";
          if (resBalanceAmount) {
            resBalanceAmount.textContent = "Fully Paid";
            resBalanceAmount.style.color = "#34d399";
          }
        }
      } else {
        if (rowBalanceAmount) {
          rowBalanceAmount.style.display = "flex";
          if (resBalanceAmount) {
            resBalanceAmount.textContent = `₹${balanceNum.toLocaleString("en-IN")}`;
            resBalanceAmount.style.color = "";
          }
        }
      }
    }

    resCustomerName.textContent = order.customerName || "Valued Client";

    // Accurate real-time Last Sync time
    const nowSync = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    resLastUpdated.textContent = `Last sync: ${nowSync}`;

    // Courier Dispatch Card (Shown when dispatched or delivered)
    const hasCourierInfo = !!(order.courierName || order.courier || order.trackingNumber || order.awb);
    if ((mapped.step >= 5 || rawStatus.toUpperCase().indexOf("DISPATCH") !== -1 || rawStatus.toUpperCase().indexOf("DELIVER") !== -1) && hasCourierInfo) {
      courierTrackingCard.style.display = "block";
      resCourierName.textContent = order.courierName || order.courier || "Express Courier Partner";
      resTrackingNumber.textContent = order.trackingNumber || order.awb || "Assigned";
      resCourierLink.href = order.trackingUrl || "#";
      if (!order.trackingUrl) resCourierLink.style.display = "none";
      else resCourierLink.style.display = "inline-flex";
    } else {
      courierTrackingCard.style.display = "none";
    }

    // Artwork File Box
    const fileUrl = order.designFileUrl || order.artworkUrl;
    if (fileUrl && fileUrl.startsWith("http")) {
      btnDownloadArtwork.style.display = "inline-flex";
      btnDownloadArtwork.href = fileUrl;
      resArtworkFileName.textContent = "High-Res Artwork File Attached (Click to View)";
    } else {
      btnDownloadArtwork.style.display = "none";
      resArtworkFileName.textContent = fileUrl || "Artwork Received & Queued";
    }

    // WhatsApp Live Chat Link prefill
    const waText = `Hi CraftsVeda, I am tracking my order ${order.orderId} (${order.customerName || ""}). Current status is "${mapped.label}". I would like an update on delivery.`;
    btnLiveChatWa.href = `https://wa.me/918840035249?text=${encodeURIComponent(waText)}`;

    // Update 6-Step Timeline Stepper
    const isArtworkApproved = (String(order.artworkStatus || "").toUpperCase() === "APPROVED" || mapped.step >= 3);
    updateStepper(mapped.step, {
      paid: paidNum,
      artworkApproved: isArtworkApproved,
      courierName: order.courierName || order.courier || ""
    });

    // Show Results & Smooth Scroll
    trackingResultSection.style.display = "block";
    trackingResultSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Update 6-Step Timeline Stepper Nodes & Context
  function updateStepper(activeStep, ctx) {
    const steps = [
      document.getElementById("step1"),
      document.getElementById("step2"),
      document.getElementById("step3"),
      document.getElementById("step4"),
      document.getElementById("step5"),
      document.getElementById("step6")
    ];

    const step1Time = document.getElementById("step1Time");
    const step2Time = document.getElementById("step2Time");
    const step3Time = document.getElementById("step3Time");
    const step4Time = document.getElementById("step4Time");
    const step5Time = document.getElementById("step5Time");
    const step6Time = document.getElementById("step6Time");

    steps.forEach((s) => {
      if (s) s.className = "step-item";
    });

    // Mark completed & active steps (1-indexed activeStep: 1 to 6)
    for (let i = 0; i < steps.length; i++) {
      const stepNum = i + 1;
      const el = steps[i];
      if (!el) continue;

      if (activeStep === 6) {
        // Delivered: All steps completed
        el.classList.add("step-completed");
      } else if (stepNum < activeStep) {
        el.classList.add("step-completed");
      } else if (stepNum === activeStep) {
        el.classList.add("step-active");
      }
    }

    // Step Contextual Timestamps / Labels
    // Step 1: Confirmed
    if (step1Time) step1Time.textContent = "Confirmed";

    // Step 2: "Step 2 ko 'Verified' tabhi mark karo jab artwork approved ho aur advance paid ho."
    if (step2Time) {
      if (ctx.paid > 0 && ctx.artworkApproved) {
        step2Time.textContent = "Verified";
      } else if (ctx.paid > 0 && !ctx.artworkApproved) {
        step2Time.textContent = "Advance Paid · Artwork In Review";
      } else if (ctx.artworkApproved && ctx.paid <= 0) {
        step2Time.textContent = "Artwork OK · Payment Pending";
      } else {
        step2Time.textContent = "Pending Verification";
      }
    }

    // Step 3: In Production
    if (step3Time) {
      if (activeStep > 3) step3Time.textContent = "Production Completed";
      else if (activeStep === 3) step3Time.textContent = "Active Stage";
      else step3Time.textContent = "Pending";
    }

    // Step 4: Ready (Quality Checked)
    if (step4Time) {
      if (activeStep > 4) step4Time.textContent = "Quality Passed";
      else if (activeStep === 4) step4Time.textContent = "Quality Checked & Ready";
      else step4Time.textContent = "Pending";
    }

    // Step 5: Dispatched
    if (step5Time) {
      if (activeStep > 5) step5Time.textContent = "Dispatched";
      else if (activeStep === 5) step5Time.textContent = ctx.courierName ? `In Transit (${ctx.courierName})` : "In Transit";
      else step5Time.textContent = "Pending";
    }

    // Step 6: Delivered
    if (step6Time) {
      if (activeStep === 6) step6Time.textContent = "Delivered";
      else step6Time.textContent = "Pending";
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
