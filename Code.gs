/**
 * ==========================================================================
 * CRAFTSVEDA LUXURY BUSINESS CARDS — GOOGLE APPS SCRIPT ORDER BACKEND (Code.gs)
 * ==========================================================================
 * 
 * Target Sheet Tab: "Orders" (Exact 26 verified columns)
 * ID Format: CV-DDMMYY-XXXX (atomic daily increment via LockService)
 * Properties: ORDERS_SHEET_ID, ROOT_FOLDER_ID (configured in Script Properties)
 */

/* ==========================================================================
   1. RATE TABLES & PRICING ENGINE (1:1 PARITY WITH script.js)
   ========================================================================== */

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

const CUSTOM_SHAPE_CUT_RATES = {
  100: 50,
  200: 90,
  300: 130,
  400: 170,
  500: 210,
  1000: 420
};

const DRIPOFF_RATES = {
  one_side: { 100: 125, 200: 225, 300: 325, 400: 425, 500: 525, 1000: 1050 },
  both_side: { 100: 250, 200: 450, 300: 650, 400: 850, 500: 1050, 1000: 2100 }
};

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

const ALLOWED_QUANTITIES = [100, 200, 300, 400, 500, 1000];
const ALLOWED_STOCKS = ["350", "400"];
const ALLOWED_LAMINATIONS = ["velvet", "matt", "gloss"];
const ALLOWED_SIDES = ["one_side", "both_side"];
const ALLOWED_SPOTUV = ["none", "one_side", "both_side"];
const ALLOWED_FOIL_OPTIONS = ["none", "one_side", "both_side"];
const ALLOWED_FOIL_COLOURS = ["gold", "silver", "rose_gold", "copper", "red", "black", "pink", "blue", "rainbow"];

/**
 * Server-Side Calculation (exact logic matching script.js calculateBusinessCardPrice)
 */
function calculateBusinessCardPrice(sel) {
  const qty = parseInt(sel.quantity, 10);
  const stock = sel.paperStock === "400" ? "400" : "350";
  const lam = (sel.lamination === "gloss" || sel.lamination === "matt") ? "matt" : "velvet";
  const side = sel.printSide === "one_side" ? "one" : "both";
  const isSpecialFoil = ["rose_gold", "copper", "red", "black", "pink", "blue", "rainbow"].indexOf(sel.foilColour) !== -1;
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
      variantCode: "PLAIN",
      baseRate: baseRate,
      cardSellingTotal: cardSellingTotal,
      perCardRate: perCardRate,
      discountPercent: discountPercent,
      addonCharges: { drip: dripCharge, customShape: customShapeCharge, total: dripCharge + customShapeCharge },
      finalTotal: finalTotal,
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
    baseRate: baseRate,
    cardSellingTotal: cardSellingTotal,
    perCardRate: perCardRate,
    discountPercent: 0,
    addonCharges: { drip: dripCharge, customShape: customShapeCharge, total: dripCharge + customShapeCharge },
    finalTotal: finalTotal,
    confirmationRequired: false
  };
}

function getFinishDisplay(s) {
  const hasFoil = s.foil && s.foil !== "none";
  const hasUv = s.spotUv && s.spotUv !== "none";
  const foilName = "3D Foil " + (FOIL_NAMES[s.foilColour] || "Gold");

  if (!hasFoil && !hasUv) {
    return "Plain (No Specialty Finish)";
  }
  if (hasFoil && !hasUv) {
    if (s.foil === "both_side") {
      return foilName + " — Both Sides";
    }
    if (s.printSide === "one_side") {
      return foilName + " — One Side";
    }
    return "Front — " + foilName + " | Back — Plain";
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
      return foilName + " + Spot UV — Both Sides";
    }
    if (s.foil === "one_side" && s.spotUv === "one_side") {
      if (s.printSide === "one_side") {
        return foilName + " + Spot UV — One Side";
      }
      return "Front — " + foilName + " + Spot UV | Back — Plain";
    }
    if (s.foil === "one_side" && s.spotUv === "both_side") {
      return "Front — " + foilName + " + Spot UV | Back — Spot UV";
    }
    if (s.foil === "both_side" && s.spotUv === "one_side") {
      return "Front — " + foilName + " + Spot UV | Back — " + foilName;
    }
  }
  return "Custom Finishing";
}

/* ==========================================================================
   2. ATOMIC ORDER ID GENERATOR (CV-DDMMYY-XXXX)
   ========================================================================== */

function generateOrderId() {
  const lock = LockService.getScriptLock();
  lock.waitLock(15000); // Wait up to 15s to guarantee atomic counter increment

  try {
    const now = new Date();
    const dd = Utilities.formatDate(now, "Asia/Kolkata", "dd");
    const mm = Utilities.formatDate(now, "Asia/Kolkata", "MM");
    const yy = Utilities.formatDate(now, "Asia/Kolkata", "yy");
    const dateTag = dd + mm + yy;
    const propertyKey = "COUNTER_" + dateTag;

    const props = PropertiesService.getScriptProperties();
    let currentCounter = parseInt(props.getProperty(propertyKey) || "1000", 10);
    currentCounter += 1;
    props.setProperty(propertyKey, currentCounter.toString());

    return "CV-" + dateTag + "-" + currentCounter;
  } finally {
    lock.releaseLock();
  }
}

/* ==========================================================================
   3. SHEET & DRIVE RESOLVER HELPERS
   ========================================================================== */

function getOrdersSheet() {
  const props = PropertiesService.getScriptProperties();
  const sheetId = props.getProperty("ORDERS_SHEET_ID");
  let ss = null;

  if (sheetId && sheetId.trim().length > 0) {
    try {
      ss = SpreadsheetApp.openById(sheetId.trim());
    } catch (e) {
      throw new Error("Unable to open Spreadsheet with ORDERS_SHEET_ID ('" + sheetId.trim() + "'): " + e.message);
    }
  }

  if (!ss) {
    try {
      ss = SpreadsheetApp.getActiveSpreadsheet();
    } catch (e) {
      // Script is not container-bound
    }
  }

  if (!ss) {
    throw new Error("Spreadsheet not configured. Please define ORDERS_SHEET_ID in Script Properties.");
  }

  const sheet = ss.getSheetByName("Orders");
  if (!sheet) {
    throw new Error("Tab 'Orders' not found in the spreadsheet.");
  }

  return sheet;
}

/**
 * Creates folder and file in Google Drive. If decoding or file creation fails,
 * immediately cleans up (trashes) the newly created folder to prevent Drive clutter.
 */
function saveDesignFileToDrive(orderId, customerName, payload) {
  if (!payload.fileBase64 || typeof payload.fileBase64 !== "string" || payload.fileBase64.trim().length === 0) {
    if (payload.fileName && typeof payload.fileName === "string" && payload.fileName.trim().length > 0) {
      return {
        fileId: "",
        folderId: "",
        folderObj: null,
        display: payload.fileName.trim() + " (>15MB — WhatsApp submission)"
      };
    }
    return {
      fileId: "",
      folderId: "",
      folderObj: null,
      display: "No file uploaded (Will share on WhatsApp)"
    };
  }

  const props = PropertiesService.getScriptProperties();
  const rootFolderId = props.getProperty("ROOT_FOLDER_ID");
  let rootFolder = null;

  if (rootFolderId && rootFolderId.trim().length > 0) {
    try {
      rootFolder = DriveApp.getFolderById(rootFolderId.trim());
    } catch (e) {
      throw new Error("ROOT_FOLDER_ID configured in Script Properties is invalid or inaccessible: " + e.message);
    }
  }

  if (!rootFolder) {
    rootFolder = DriveApp.getRootFolder();
  }

  const folderTitle = orderId + " - " + (customerName || "Customer");
  let orderFolder = null;

  try {
    orderFolder = rootFolder.createFolder(folderTitle);

    let cleanBase64 = payload.fileBase64.trim();
    if (cleanBase64.indexOf(",") !== -1) {
      cleanBase64 = cleanBase64.split(",")[1];
    }

    const bytes = Utilities.base64Decode(cleanBase64);
    const fileName = (payload.fileName && payload.fileName.trim()) || (orderId + "_artwork");
    const mimeType = (payload.fileMimeType && payload.fileMimeType.trim()) || "application/octet-stream";
    const blob = Utilities.newBlob(bytes, mimeType, fileName);

    const file = orderFolder.createFile(blob);

    return {
      fileId: file.getId(),
      folderId: orderFolder.getId(),
      folderObj: orderFolder,
      display: file.getUrl()
    };
  } catch (fileErr) {
    // Immediate cleanup: If folder was created but decoding or file creation failed, trash the folder
    if (orderFolder) {
      try {
        orderFolder.setTrashed(true);
      } catch (cleanupErr) {
        console.warn("Could not trash failed order folder: " + cleanupErr.message);
      }
    }
    throw new Error("Design file processing failed: " + fileErr.message);
  }
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function computeSubmissionSignature(payload, cleanPhone) {
  const parts = [
    cleanPhone,
    (payload.customerName || "").trim().toLowerCase(),
    String(payload.quantity).trim(),
    payload.paperStock || payload.paperGsm,
    payload.lamination,
    payload.printSide,
    payload.spotUv,
    payload.foilSelection || payload.foil,
    payload.foilColour,
    !!payload.dripOff,
    !!payload.customShapeCut,
    (payload.notes || "").trim().toLowerCase(),
    payload.fileName || ""
  ];
  const rawSig = parts.join("|");
  const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, rawSig, Utilities.Charset.UTF_8);
  let hash = "";
  for (let i = 0; i < bytes.length; i++) {
    let byteVal = bytes[i];
    if (byteVal < 0) byteVal += 256;
    let byteHex = byteVal.toString(16);
    if (byteHex.length === 1) byteHex = "0" + byteHex;
    hash += byteHex;
  }
  return "DEBOUNCE_" + hash;
}

/**
 * Concurrency-safe short-window duplicate submission check (debounce) using LockService + CacheService.
 * NOTE: This is a short-window debounce (15 seconds) against accidental rapid double-submissions,
 * NOT guaranteed permanent idempotency, which would require a persistent client-generated request ID.
 */
function tryAcquireDebounceLock(key) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) {
    return { status: "LOCK_TIMEOUT" };
  }

  try {
    const cache = CacheService.getScriptCache();
    if (cache.get(key)) {
      return { status: "DUPLICATE" };
    }
    cache.put(key, "PROCESSING", 15);
    return { status: "ACQUIRED" };
  } finally {
    lock.releaseLock();
  }
}

function releaseDebounceLock(key) {
  try {
    CacheService.getScriptCache().remove(key);
  } catch (e) {}
}

/* ==========================================================================
   4. WEB APP ENDPOINTS (doGet & doPost)
   ========================================================================== */

function doGet(e) {
  return jsonResponse({
    ok: true,
    service: "CraftsVeda Luxury Card Order Backend",
    status: "online",
    timestamp: new Date().toISOString()
  });
}

function doPost(e) {
  let debounceKey = null;
  let fileResult = null;

  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ ok: false, error: "Empty or missing request payload." });
    }

    let payload;
    try {
      payload = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      return jsonResponse({ ok: false, error: "Malformed JSON payload: " + parseErr.message });
    }

    // 1. Strict Validation of Customer Contact Fields
    const customerName = (payload.customerName || "").trim();
    const phone = (payload.phone || "").trim();
    const email = (payload.email || "").trim();
    const deliveryCity = (payload.deliveryCity || "").trim();
    const notes = (payload.notes || "").trim();

    if (!customerName) {
      return jsonResponse({ ok: false, error: "Validation error: Customer name is required." });
    }

    const cleanPhone = phone.replace(/[^0-9]/g, "");
    if (cleanPhone.length < 10 || cleanPhone.length > 15) {
      return jsonResponse({ ok: false, error: "Validation error: Please provide a valid 10 to 15-digit phone number." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return jsonResponse({ ok: false, error: "Validation error: Please provide a valid email address." });
    }

    if (!deliveryCity) {
      return jsonResponse({ ok: false, error: "Validation error: Delivery city and pincode are required." });
    }

    // 2. Strict Numeric Quantity Validation (Rejects decimals, strings with characters, e.g. "100abc")
    const rawQty = payload.quantity;
    if (rawQty === null || rawQty === undefined || typeof rawQty === "boolean" || typeof rawQty === "object") {
      return jsonResponse({ ok: false, error: "Validation error: Quantity is required." });
    }

    const strQty = String(rawQty).trim();
    if (!/^\d+$/.test(strQty)) {
      return jsonResponse({
        ok: false,
        error: "Validation error: Malformed quantity '" + rawQty + "'. Must be a whole integer without decimals or extra characters."
      });
    }

    const qty = Number(strQty);
    if (ALLOWED_QUANTITIES.indexOf(qty) === -1) {
      return jsonResponse({
        ok: false,
        error: "Validation error: Invalid quantity '" + rawQty + "'. Allowed quantities: " + ALLOWED_QUANTITIES.join(", ") + "."
      });
    }

    // 3. Strict Specification Validation (No Silent Defaulting)
    const rawStock = String(payload.paperStock || payload.paperGsm || "").trim();
    if (ALLOWED_STOCKS.indexOf(rawStock) === -1) {
      return jsonResponse({
        ok: false,
        error: "Validation error: Invalid paper stock '" + rawStock + "'. Allowed stocks: " + ALLOWED_STOCKS.join(", ") + " GSM."
      });
    }
    const stock = rawStock;

    const rawLam = String(payload.lamination || "").trim().toLowerCase();
    if (ALLOWED_LAMINATIONS.indexOf(rawLam) === -1) {
      return jsonResponse({
        ok: false,
        error: "Validation error: Invalid lamination '" + payload.lamination + "'. Allowed laminations: " + ALLOWED_LAMINATIONS.join(", ") + "."
      });
    }
    const lamination = (rawLam === "gloss" || rawLam === "matt") ? "matt" : "velvet";

    const rawSide = String(payload.printSide || "").trim();
    if (ALLOWED_SIDES.indexOf(rawSide) === -1) {
      return jsonResponse({
        ok: false,
        error: "Validation error: Invalid print side '" + payload.printSide + "'. Allowed print sides: " + ALLOWED_SIDES.join(", ") + "."
      });
    }
    const printSide = rawSide;

    const rawSpotUv = String(payload.spotUv || "").trim();
    if (ALLOWED_SPOTUV.indexOf(rawSpotUv) === -1) {
      return jsonResponse({
        ok: false,
        error: "Validation error: Invalid Spot UV option '" + payload.spotUv + "'. Allowed options: " + ALLOWED_SPOTUV.join(", ") + "."
      });
    }
    const spotUv = rawSpotUv;

    let rawFoil = payload.foilSelection;
    if (!rawFoil) {
      if (typeof payload.foil === "string") {
        rawFoil = payload.foil.split(" ")[0].trim();
      } else {
        rawFoil = "";
      }
    }
    if (ALLOWED_FOIL_OPTIONS.indexOf(rawFoil) === -1) {
      return jsonResponse({
        ok: false,
        error: "Validation error: Invalid foil selection '" + (payload.foilSelection || payload.foil) + "'. Allowed options: " + ALLOWED_FOIL_OPTIONS.join(", ") + "."
      });
    }
    const foil = rawFoil;

    let foilColour = "gold";
    if (foil !== "none") {
      const rawFoilColour = String(payload.foilColour || "").trim().toLowerCase();
      if (ALLOWED_FOIL_COLOURS.indexOf(rawFoilColour) === -1) {
        return jsonResponse({
          ok: false,
          error: "Validation error: Invalid foil colour '" + payload.foilColour + "'. Allowed colours: " + ALLOWED_FOIL_COLOURS.join(", ") + "."
        });
      }
      foilColour = rawFoilColour;
    }

    const isDrip = payload.dripOff === true || (typeof payload.addons === "string" && payload.addons.indexOf("Drip-off") !== -1);
    const isShape = payload.customShapeCut === true || (typeof payload.addons === "string" && payload.addons.indexOf("Custom Shape Cut") !== -1);

    // 4. Concurrency-Safe Short-Window Debounce Protection
    debounceKey = computeSubmissionSignature(payload, cleanPhone);
    const debounceResult = tryAcquireDebounceLock(debounceKey);

    if (debounceResult.status === "LOCK_TIMEOUT") {
      return jsonResponse({
        ok: false,
        error: "Server is currently busy handling concurrent requests. Please retry in a few seconds."
      });
    }

    if (debounceResult.status === "DUPLICATE") {
      return jsonResponse({
        ok: false,
        error: "A duplicate order with identical specifications is currently being processed. Please wait a moment."
      });
    }

    // 5. Pre-Flight Verification of Spreadsheet & "Orders" Tab
    const sheet = getOrdersSheet();

    // 6. Server-Side Price Recalculation (Zero Client-Trust)
    const calcInput = {
      quantity: qty,
      paperStock: stock,
      lamination: lamination,
      printSide: printSide,
      spotUv: spotUv,
      foil: foil,
      foilColour: foilColour,
      dripOff: isDrip,
      customShapeCut: isShape
    };

    const pricing = calculateBusinessCardPrice(calcInput);
    const finishLabel = getFinishDisplay(calcInput);

    // 7. Generate Atomic Order ID
    const orderId = generateOrderId();
    const now = new Date();
    const timestampStr = Utilities.formatDate(now, "Asia/Kolkata", "dd/MM/yyyy HH:mm:ss");

    // 8. Handle Google Drive File Storage (Includes internal failure cleanup)
    fileResult = saveDesignFileToDrive(orderId, customerName, payload);

    // 9. Format Fields for the Exact 26 Headers
    const lamDisplay = rawLam === "velvet" ? "Velvet" : (rawLam === "gloss" ? "Gloss" : "Matte");
    const sideDisplay = printSide === "one_side" ? "One Side" : "Both Sides";
    const finishDisplay = pricing.supported && pricing.variantCode && pricing.variantCode !== "PLAIN"
      ? pricing.variantCode + ": " + finishLabel
      : finishLabel;
    const hasFoil = foil !== "none";
    const foilColourDisplay = hasFoil ? (FOIL_NAMES[foilColour] || foilColour) : "None";

    const ratePerCard = pricing.supported ? pricing.perCardRate : "Confirmation Required";
    const cardTotal = pricing.supported ? pricing.cardSellingTotal : "Confirmation Required";
    const addonsTotal = pricing.supported ? pricing.addonCharges.total : (isDrip || isShape ? "Confirmation Required" : 0);
    const finalTotal = pricing.supported ? pricing.finalTotal : "Confirmation Required";

    const paymentStatus = "Pending";
    const orderStatus = pricing.supported ? "New Order" : "Manual Confirmation Required";
    const adminNotes = pricing.supported
      ? notes
      : (notes ? notes + " | " : "") + "[FLAG: Non-standard finish combination. Requires manual rate quote confirmation.]";

    // 10. Construct 26-Column Row Array (EXACT ORDER MATCH)
    const rowData = [
      orderId,                  // 1. Order ID
      timestampStr,             // 2. Date/Time
      customerName,             // 3. Customer Name
      phone,                    // 4. Phone
      email,                    // 5. Email
      deliveryCity,             // 6. Address
      "Luxury Business Cards",  // 7. Product
      qty,                      // 8. Quantity
      stock + " GSM",           // 9. GSM
      lamDisplay,               // 10. Lamination
      sideDisplay,              // 11. Print Side
      finishDisplay,            // 12. Finish
      foilColourDisplay,        // 13. Foil Colour
      isDrip ? "Yes" : "No",    // 14. Drip-off
      isShape ? "Yes" : "No",   // 15. Custom Shape Cut
      ratePerCard,              // 16. Rate/Card
      cardTotal,                // 17. Card Total
      addonsTotal,              // 18. Add-ons Total
      finalTotal,               // 19. Final Total
      fileResult.display,       // 20. Design File
      fileResult.fileId,        // 21. Drive File ID
      fileResult.folderId,      // 22. Drive Folder ID
      paymentStatus,            // 23. Payment Status
      orderStatus,              // 24. Order Status
      adminNotes,               // 25. Admin Notes
      timestampStr              // 26. Last Updated
    ];

    // 11. Append Row to "Orders" Sheet
    sheet.appendRow(rowData);

    // 12. Return Successful JSON Response
    return jsonResponse({
      ok: true,
      orderId: orderId,
      totalAmount: pricing.supported ? pricing.finalTotal : "Confirmation Required",
      perCardRate: pricing.supported ? pricing.perCardRate : "Confirmation Required",
      confirmationRequired: !pricing.supported,
      driveFileUrl: fileResult.fileId ? fileResult.display : null
    });

  } catch (err) {
    console.error("Order processing failed: " + err.stack);

    // Clean up orphaned Drive folder and file if spreadsheet append or subsequent step failed
    if (fileResult && fileResult.folderObj) {
      try {
        fileResult.folderObj.setTrashed(true);
      } catch (cleanupErr) {
        console.warn("Could not trash orphaned order folder: " + cleanupErr.message);
      }
    }

    // Release debounce lock on error so the customer is not blocked from retrying
    if (debounceKey) {
      releaseDebounceLock(debounceKey);
    }

    return jsonResponse({
      ok: false,
      error: "Order processing error: " + err.message
    });
  }
}

/* ==========================================================================
   5. TESTING & VERIFICATION HARNESS (PRESERVED FOR IDE TESTING)
   ========================================================================== */

function testPricingRecalculation() {
  const test1 = calculateBusinessCardPrice({
    quantity: 500,
    paperStock: "400",
    lamination: "velvet",
    printSide: "both_side",
    spotUv: "both_side",
    foil: "one_side",
    foilColour: "gold",
    dripOff: false,
    customShapeCut: false
  });
  Logger.log("Test 1 (BV-10 Velvet 400 @ 500): " + JSON.stringify(test1));

  const testPlain = calculateBusinessCardPrice({
    quantity: 100,
    paperStock: "350",
    lamination: "matt",
    printSide: "one_side",
    spotUv: "none",
    foil: "none",
    dripOff: true,
    customShapeCut: true
  });
  Logger.log("Test Plain (350 Matt 100 with drip + shape): " + JSON.stringify(testPlain));
}