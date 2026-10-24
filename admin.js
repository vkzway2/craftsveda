/* admin.js — CraftsVeda Admin Dashboard v3.1
 * Backend: Apps Script (Code.gs). Auth: session token (password browser me store nahi hota).
 */
(function () {
  'use strict';

  var CFG = window.CV_CONFIG || {};
  var STATUSES = ['ORDER RECEIVED', 'MANUAL CONFIRMATION REQUIRED', 'ORDER CONFIRMED', 'ARTWORK APPROVAL REQUIRED',
    'ARTWORK REVISION REQUIRED', 'PRODUCTION IN PROGRESS', 'QUALITY CHECKED & READY', 'DISPATCHED', 'DELIVERED', 'DELIVERY DELAYED'];
  var SESSION_KEY = 'cv_admin_session';

  var state = {
    token: null, email: '', orders: [], filter: 'ALL', pay: 'ALL', search: '',
    sort: 'DATE_DESC', page: 1, selected: {}, current: null, timer: null, busy: false
  };

  /* ---------- helpers ---------- */
  function $(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function inr(n) { return '₹' + Number(n || 0).toLocaleString('en-IN'); }
  function show(el) { if (el) el.classList.remove('hidden'); }
  function hide(el) { if (el) el.classList.add('hidden'); }
  function safeUrl(u) { return /^https?:\/\//i.test(u || '') ? u : ''; }
  function phone91(p) {
    var d = String(p || '').replace(/\D/g, '');
    if (d.length === 10) d = '91' + d;
    return d;
  }
  function today0() { var d = new Date(); d.setHours(0, 0, 0, 0); return d; }

  function toast(msg, type) {
    var box = $('adminToastContainer');
    var t = document.createElement('div');
    t.className = 'admin-toast toast-' + (type || 'info');
    t.textContent = msg;
    box.appendChild(t);
    setTimeout(function () { t.remove(); }, 3800);
  }

  function ss(k, v) {
    try { if (v === undefined) return sessionStorage.getItem(k); if (v === null) sessionStorage.removeItem(k); else sessionStorage.setItem(k, v); } catch (e) { /* ignore */ }
    return null;
  }
  function ls(k, v) {
    try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { /* ignore */ }
    return null;
  }

  /* ---------- API ---------- */
  function api(action, payload) {
    if (!CFG.API_URL || CFG.API_URL.indexOf('PASTE_') === 0) {
      return Promise.reject(new Error('config.js me API_URL set karo'));
    }
    var body = JSON.stringify(Object.assign({ action: action, token: state.token }, payload || {}));
    // text/plain => CORS preflight nahi hota (Apps Script ke liye zaroori)
    return fetch(CFG.API_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: body })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        if (j && j.error === 'AUTH') { doLogout(true); throw new Error('Session expire ho gaya, dobara login karo'); }
        if (!j || !j.ok) throw new Error((j && j.error) || 'Server error');
        return j;
      });
  }

  /* ---------- status / payment logic ---------- */
  function payState(o) {
    var amt = Number(o.amount || 0), paid = Number(o.paid || 0);
    if (paid <= 0) return 'UNPAID';
    if (paid >= amt && amt > 0) return 'PAID';
    return 'PARTIAL';
  }
  function deadlineInfo(o) {
    if (!o.deadline) return { cls: '', label: '—', overdue: false };
    var d = new Date(o.deadline + 'T00:00:00');
    if (isNaN(d)) return { cls: '', label: '—', overdue: false };
    var diff = Math.round((d - today0()) / 86400000);
    var done = o.status === 'DISPATCHED' || o.status === 'DELIVERED';
    var label = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
    if (!done && diff < 0) return { cls: 'deadline-overdue', label: label + ' (' + (-diff) + 'd late)', overdue: true };
    if (!done && diff <= 2) return { cls: 'deadline-soon', label: label + (diff === 0 ? ' (today)' : ' (' + diff + 'd)'), overdue: false };
    return { cls: '', label: label, overdue: false };
  }

  /* ---------- filtering ---------- */
  function filtered() {
    var q = state.search.trim().toLowerCase();
    var list = state.orders.filter(function (o) {
      if (state.filter !== 'ALL' && o.status !== state.filter) return false;
      if (state.pay !== 'ALL' && payState(o) !== state.pay) return false;
      if (!q) return true;
      return [o.orderId, o.name, o.phone, o.email, o.city, o.advanceDue || '', o.paymentMode || '', o.status, o.paymentStatus || ''].join(' ').toLowerCase().indexOf(q) !== -1;
    });
    var s = state.sort;
    list.sort(function (a, b) {
      if (s === 'DATE_ASC') return new Date(a.date) - new Date(b.date);
      if (s === 'AMOUNT_DESC') return Number(b.amount) - Number(a.amount);
      if (s === 'QTY_DESC') return Number(b.qty) - Number(a.qty);
      if (s === 'DEADLINE_ASC') {
        var x = a.deadline || '9999', y = b.deadline || '9999';
        return x < y ? -1 : x > y ? 1 : 0;
      }
      return new Date(b.date) - new Date(a.date);
    });
    return list;
  }

  /* ---------- render ---------- */
  function renderKpis() {
    var o = state.orders, c = function (s) { return o.filter(function (x) { return x.status === s; }).length; };
    var rev = 0, paid = 0, overdue = 0;
    o.forEach(function (x) { rev += Number(x.amount || 0); paid += Number(x.paid || 0); if (deadlineInfo(x).overdue) overdue++; });
    $('kpiTotalOrders').textContent = o.length;
    $('kpiNewOrders').textContent = c('ORDER RECEIVED');
    $('kpiProductionOrders').textContent = c('PRODUCTION IN PROGRESS');
    $('kpiDispatchedOrders').textContent = c('DISPATCHED');
    $('kpiTotalRevenue').textContent = inr(rev);
    $('kpiBalance').textContent = 'Balance: ' + inr(Math.max(0, rev - paid));
    $('kpiOverdue').textContent = overdue;
    $('countAll').textContent = o.length;
    $('countNew').textContent = c('ORDER RECEIVED');
    $('countConfirmed').textContent = c('ORDER CONFIRMED');
    $('countProduction').textContent = c('PRODUCTION IN PROGRESS');
    $('countReady').textContent = c('QUALITY CHECKED & READY');
    $('countDispatched').textContent = c('DISPATCHED');
    $('countDelivered').textContent = c('DELIVERED');
    $('countQuote').textContent = c('MANUAL CONFIRMATION REQUIRED');
  }

  function statusSelect(o) {
    return '<select class="toolbar-select js-status" data-id="' + esc(o.orderId) + '" aria-label="Status for ' + esc(o.orderId) + '">' +
      STATUSES.map(function (s) {
        return '<option value="' + s + '"' + (s === o.status ? ' selected' : '') + '>' + s + '</option>';
      }).join('') + '</select>';
  }

  function renderTable() {
    var list = filtered(), size = CFG.PAGE_SIZE || 25;
    var pages = Math.max(1, Math.ceil(list.length / size));
    if (state.page > pages) state.page = pages;
    var slice = list.slice((state.page - 1) * size, state.page * size);
    var body = $('ordersTableBody');

    body.innerHTML = slice.map(function (o) {
      var ps = payState(o), dl = deadlineInfo(o), bal = Math.max(0, Number(o.amount || 0) - Number(o.paid || 0));
      var art = safeUrl(o.artworkUrl);
      var isCustomerClaimedPaid = o.notes && o.notes.indexOf("Maine Pay Kar Diya") !== -1 && ps === 'UNPAID';
      var rowCls = [];
      if (dl.overdue) rowCls.push('row-overdue');
      if (isCustomerClaimedPaid) rowCls.push('row-bank-check');

      return '<tr class="' + rowCls.join(' ') + '">' +
        '<td class="col-check"><input type="checkbox" class="js-sel" data-id="' + esc(o.orderId) + '"' + (state.selected[o.orderId] ? ' checked' : '') + ' aria-label="Select ' + esc(o.orderId) + '"></td>' +
        '<td><strong class="gold-text">' + esc(o.orderId) + '</strong><div class="mini-muted">' + esc(new Date(o.date).toLocaleDateString('en-IN')) + '</div></td>' +
        '<td><strong>' + esc(o.name) + '</strong><div class="mini-muted">' + esc(o.phone) + '</div><div class="mini-muted">' + esc(o.city) + '</div></td>' +
        '<td>' + esc(o.specs) + '<div class="mini-muted">Qty: ' + esc(o.qty) + '</div></td>' +
        '<td><strong>' + (o.needsQuote ? 'Quote pending' : inr(o.amount)) + '</strong><div><span class="pay-badge pay-' + ps + '">' + ps + '</span></div>' +
          (o.advanceDue ? '<div class="mini-muted" style="color:#d97706;font-weight:600;">Adv Due: ₹' + (typeof o.advanceDue === 'number' ? o.advanceDue.toFixed(2) : o.advanceDue) + '</div>' : '') +
          (isCustomerClaimedPaid ? '<div style="margin-top:4px;"><span style="background:#fef08a;color:#854d0e;padding:2px 6px;border-radius:4px;font-size:0.72rem;font-weight:700;">⚡ Verify Bank Advance</span></div>' : '') +
          '<div class="mini-muted">Paid ' + inr(o.paid) + ' · Bal ' + inr(bal) + '</div>' +
          (o.paymentMode ? '<div class="mini-muted" style="color:#10b981;font-weight:600;">Mode: ' + esc(o.paymentMode) + '</div>' : '') +
          '<button type="button" class="link-btn js-meta" data-id="' + esc(o.orderId) + '">Edit payment</button></td>' +
        '<td class="' + dl.cls + '">' + esc(dl.label) + '</td>' +
        '<td><span class="art-badge art-' + esc(o.artworkStatus || 'RECEIVED') + '">' + esc(o.artworkStatus || 'RECEIVED') + '</span>' +
          (art ? '<div><a class="link-btn" href="' + esc(art) + '" target="_blank" rel="noopener noreferrer">Open file ↗</a></div>' : '<div class="mini-muted">No file</div>') + '</td>' +
        '<td>' + statusSelect(o) + '</td>' +
        '<td><div class="row-actions">' +
          '<button type="button" class="link-btn js-notes" data-id="' + esc(o.orderId) + '">' + (o.notes ? 'Edit notes' : 'Add notes') + '</button>' +
          (o.notes ? '<div class="mini-muted">' + esc(String(o.notes).slice(0, 60)) + '</div>' : '') +
          '<button type="button" class="link-btn js-dispatch" data-id="' + esc(o.orderId) + '">' + (o.awb ? 'AWB: ' + esc(o.awb) : 'Dispatch') + '</button>' +
        '</div></td>' +
        '<td><button type="button" class="btn btn-outline-gold btn-sm js-wa" data-id="' + esc(o.orderId) + '">WhatsApp</button></td>' +
        '</tr>';
    }).join('');

    var empty = list.length === 0;
    if (empty) show($('tableEmptyState')); else hide($('tableEmptyState'));
    $('ordersTable').classList.toggle('hidden', empty);
    $('tableOrdersCount').textContent = list.length + ' Orders';
    $('activeFilterBadge').textContent = 'Showing: ' + (state.filter === 'ALL' ? 'All Orders' : state.filter);
    $('pageInfo').textContent = 'Page ' + state.page + ' / ' + pages;
    $('btnPrevPage').disabled = state.page <= 1;
    $('btnNextPage').disabled = state.page >= pages;
    $('selectAllRows').checked = slice.length > 0 && slice.every(function (o) { return state.selected[o.orderId]; });
    updateBulkBar();

    document.querySelectorAll('.tab-btn').forEach(function (b) {
      b.classList.toggle('tab-active', b.getAttribute('data-status') === state.filter);
    });
  }

  function renderAll() { renderKpis(); renderTable(); }
  function find(id) { return state.orders.filter(function (o) { return o.orderId === id; })[0]; }

  /* ---------- data load ---------- */
  function loadOrders(silent) {
    if (state.busy) return Promise.resolve();
    state.busy = true;
    $('btnRefreshOrders').classList.add('is-loading');
    return api('getOrders').then(function (j) {
      state.orders = j.orders || [];
      renderAll();
      $('syncStatusText').textContent = 'Backend Online';
      $('syncDot').style.opacity = 1;
      $('lastSynced').textContent = 'Synced ' + new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      if (!silent) toast('Orders updated', 'success');
    }).catch(function (e) {
      $('syncStatusText').textContent = 'Backend Offline';
      $('syncDot').style.opacity = .3;
      if (!silent) toast(e.message, 'error');
    }).then(function () {
      state.busy = false;
      $('btnRefreshOrders').classList.remove('is-loading');
    });
  }

  function loadConfigStatus() {
    return api('getConfigStatus').then(function (j) {
      var p = j.props || {};
      document.querySelectorAll('.prop-badge').forEach(function (el) {
        var ok = !!p[el.getAttribute('data-prop')];
        el.textContent = ok ? 'Configured' : 'Missing';
        el.classList.toggle('ok', ok);
        el.classList.toggle('bad', !ok);
      });
      var waOk = !!(p.WHATSAPP_PHONE_NUMBER_ID && p.WHATSAPP_ACCESS_TOKEN);
      $('waStatusText').textContent = waOk ? 'WhatsApp: Cloud API Ready' : 'WhatsApp: Not configured (wa.me fallback)';
      $('webhookUrlDisplay').textContent = CFG.API_URL;
    }).catch(function () { /* silent */ });
  }

  function startAutoRefresh() {
    clearInterval(state.timer);
    if (!$('autoRefreshToggle').checked) return;
    state.timer = setInterval(function () {
      if (!document.hidden && state.token) loadOrders(true);
    }, (CFG.AUTO_REFRESH_SEC || 60) * 1000);
  }

  /* ---------- modals (Esc, focus return, focus trap) ---------- */
  var lastFocus = null;
  function openModal(id) {
    lastFocus = document.activeElement;
    var m = $(id); show(m);
    var f = m.querySelector('input:not([type=checkbox]), select, textarea, button');
    if (f) setTimeout(function () { f.focus(); }, 30);
  }
  function closeModal(id) {
    hide($(id));
    if (lastFocus && lastFocus.focus) { try { lastFocus.focus(); } catch (e) { /* ignore */ } }
  }
  document.addEventListener('keydown', function (e) {
    var open = Array.prototype.slice.call(document.querySelectorAll('.admin-modal-overlay:not(.hidden)'));
    if (!open.length) return;
    var m = open[open.length - 1];
    if (e.key === 'Escape' && m.id !== 'adminLoginOverlay') { closeModal(m.id); return; }
    if (e.key === 'Tab') {
      var f = m.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, textarea');
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- WhatsApp templates ---------- */
  function trackLink(o) { return (CFG.TRACK_URL || '') + '?id=' + encodeURIComponent(o.orderId); }
  function buildMessage(key, o) {
    var bal = Math.max(0, Number(o.amount || 0) - Number(o.paid || 0));
    var t = {
      ORDER_CONFIRMED: 'Namaste ' + o.name + ', aapka order *' + o.orderId + '* confirm ho gaya hai.\nLive status: ' + trackLink(o) + '\n— CraftsVeda Studio',
      PAYMENT_RECEIVED: 'Namaste ' + o.name + ', order *' + o.orderId + '* ka payment (' + inr(o.paid) + ') mil gaya hai. Production shuru ho raha hai.\n— CraftsVeda Studio',
      IN_PRODUCTION: 'Namaste ' + o.name + ', aapka order *' + o.orderId + '* ab *IN PRODUCTION* me hai.\nTrack: ' + trackLink(o) + '\n— CraftsVeda Studio',
      DISPATCHED: 'Namaste ' + o.name + ', aapka order *' + o.orderId + '* dispatch ho gaya hai.\nCourier: ' + (o.courier || '—') + '\nAWB: ' + (o.awb || '—') + '\nTrack: ' + (safeUrl(o.trackingUrl) || trackLink(o)) + '\n— CraftsVeda Studio',
      DELIVERED: 'Namaste ' + o.name + ', order *' + o.orderId + '* deliver ho chuka hai. Hume batayein aapko kaisa laga. Dhanyavaad!\n— CraftsVeda Studio',
      BALANCE_REMINDER: 'Namaste ' + o.name + ', order *' + o.orderId + '* ka balance payment ' + inr(bal) + ' baaki hai. Kripya jaldi clear karein.\n— CraftsVeda Studio',
      CUSTOM: ''
    };
    return t[key] || '';
  }
  function refreshWaPreview() {
    var o = state.current; if (!o) return;
    var key = $('waTemplateSelect').value;
    if (key !== 'CUSTOM') $('waMessageTextarea').value = buildMessage(key, o);
    var msg = $('waMessageTextarea').value;
    $('waCharCount').textContent = msg.length + ' characters';
    $('btnOpenWaWebDirect').href = 'https://wa.me/' + phone91(o.phone) + '?text=' + encodeURIComponent(msg);
  }

  function openWa(o, tpl) {
    state.current = o;
    $('waModalCustomerName').textContent = o.name;
    $('waModalOrderId').textContent = o.orderId;
    $('waModalPhone').textContent = o.phone;
    $('waTemplateSelect').value = tpl || 'ORDER_CONFIRMED';
    hide($('waSendResultAlert'));
    refreshWaPreview();
    openModal('waPreviewModal');
  }

  function sendWaApi() {
    var o = state.current; if (!o) return;
    var msg = $('waMessageTextarea').value.trim();
    if (!msg) { toast('Message khaali hai', 'error'); return; }
    var btn = $('btnSendViaWaApi'); btn.disabled = true; show($('waApiSpinner'));
    var box = $('waSendResultAlert');
    api('sendWhatsApp', { orderId: o.orderId, phone: phone91(o.phone), message: msg, template: $('waTemplateSelect').value })
      .then(function () {
        box.className = 'modal-alert-box alert-success'; box.textContent = '✓ WhatsApp bhej diya gaya'; show(box);
        toast('WhatsApp sent', 'success');
      })
      .catch(function (e) {
        box.className = 'modal-alert-box alert-error';
        box.textContent = '✗ ' + e.message + ' — wa.me button se manually bhej sakte ho.'; show(box);
      })
      .then(function () { btn.disabled = false; hide($('waApiSpinner')); });
  }

  /* ---------- status change ---------- */
  function autoNotify() { var t = $('toggleAutoNotify'); return t ? t.checked : true; }
  function reportNotify(n) {
    if (!n) return;
    if (n.sent) toast('Customer ko WhatsApp notification gaya', 'success');
    else if (n.error) toast('WhatsApp fail: ' + n.error, 'error');
  }

  function changeStatus(o, status) {
    // DISPATCHED ke liye courier + AWB chahiye, isliye pehle dispatch form kholte hain
    if (status === 'DISPATCHED' && !o.awb) { renderTable(); openDispatch(o); return Promise.resolve(); }

    // Rule: Paid hue bina production status par order nahi ja sakta
    var isProd = status === 'PRODUCTION IN PROGRESS' || status === 'QUALITY CHECKED & READY' || status === 'DISPATCHED' || status === 'DELIVERED';
    var isPaid = Number(o.paid || 0) > 0 || o.paymentStatus === 'Paid' || o.paymentStatus === 'Advance Received' || o.paymentStatus === 'Received';
    if (isProd && !isPaid) {
      renderTable();
      toast('Rule: Paid / Advance Received hue bina order production status par nahi ja sakta', 'error');
      return Promise.resolve();
    }

    var prev = o.status;
    return api('updateStatus', { orderId: o.orderId, status: status, notify: autoNotify() }).then(function (j) {
      o.status = status; renderAll(); toast(o.orderId + ' → ' + status, 'success'); reportNotify(j.notify);
    }).catch(function (e) { o.status = prev; renderAll(); toast(e.message, 'error'); });
  }

  /* ---------- dispatch ---------- */
  var COURIER_URLS = {
    'Blue Dart Express': 'https://www.bluedart.com/tracking',
    'Delhivery': 'https://www.delhivery.com/track/package/',
    'DTDC': 'https://www.dtdc.in/tracking.asp',
    'Trackon': 'https://www.trackoncourier.com/',
    'India Post Speed Post': 'https://www.indiapost.gov.in/_layouts/15/dop.portal.tracking/trackconsignment.aspx'
  };
  function openDispatch(o) {
    state.current = o;
    $('dispatchOrderIdText').textContent = o.orderId;
    $('dispatchCourierSelect').value = o.courier || 'Blue Dart Express';
    $('dispatchAwbInput').value = o.awb || '';
    $('dispatchTrackingUrlInput').value = o.trackingUrl || COURIER_URLS[$('dispatchCourierSelect').value] || '';
    openModal('dispatchModal');
  }
  function confirmDispatch() {
    var o = state.current;
    var courier = $('dispatchCourierSelect').value, awb = $('dispatchAwbInput').value.trim();
    var url = $('dispatchTrackingUrlInput').value.trim();
    if (!awb) { toast('AWB number zaroori hai', 'error'); $('dispatchAwbInput').focus(); return; }
    if (url && !safeUrl(url)) { toast('Tracking URL http/https se shuru hona chahiye', 'error'); return; }
    api('dispatch', { orderId: o.orderId, courier: courier, awb: awb, trackingUrl: url, notify: $('dispatchSendWaCheckbox').checked }).then(function (j) {
      o.courier = courier; o.awb = awb; o.trackingUrl = url; o.status = 'DISPATCHED';
      closeModal('dispatchModal'); renderAll(); toast('Order dispatched', 'success'); reportNotify(j.notify);
    }).catch(function (e) { toast(e.message, 'error'); });
  }

  /* ---------- notes / meta ---------- */
  function openNotes(o) {
    state.current = o;
    $('notesOrderIdText').textContent = o.orderId;
    $('notesCustomerNameText').textContent = o.name;
    $('adminNotesTextarea').value = o.notes || '';
    openModal('notesModal');
  }
  function saveNotes() {
    var o = state.current, v = $('adminNotesTextarea').value;
    api('saveNotes', { orderId: o.orderId, notes: v }).then(function () {
      o.notes = v; closeModal('notesModal'); renderTable(); toast('Notes saved', 'success');
    }).catch(function (e) { toast(e.message, 'error'); });
  }

  /* ---------- payment & meta (multiple payments & mode support) ---------- */

  function parsePaymentHistory(o) {
    if (!o) return [];
    if (o.paymentHistory) {
      try {
        var parsed = JSON.parse(o.paymentHistory);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    // Backward compatibility: If no history exists yet but there is an existing paid amount, show as initial entry
    var paid = Number(o.paid || 0);
    if (paid > 0) {
      return [{
        amount: paid,
        mode: o.paymentMode || 'UPI',
        date: o.date ? new Date(o.date).toLocaleDateString('en-IN') : 'Initial',
        note: 'Previous recorded payment'
      }];
    }
    return [];
  }

  function renderPaymentsList() {
    var o = state.current;
    if (!o) return;
    var listEl = $('metaPaymentsList');
    if (!listEl) return;

    var payments = state.currentPayments || [];
    if (payments.length === 0) {
      listEl.innerHTML = '<div class="meta-payments-empty">No payment entries recorded yet. Add installment with mode below.</div>';
    } else {
      listEl.innerHTML = payments.map(function (p, idx) {
        var modeClass = 'pay-mode-' + String(p.mode || 'Other').replace(/\s+/g, '-');
        return '<div class="payment-entry-row">' +
          '<div class="pay-entry-left">' +
            '<span class="pay-entry-amt">₹' + Number(p.amount || 0).toLocaleString('en-IN') + '</span>' +
            '<span class="pay-mode-pill ' + modeClass + '">' + esc(p.mode || 'Other') + '</span>' +
            '<span class="pay-entry-meta">' + esc(p.date || '') + (p.note ? ' • ' + esc(p.note) : '') + '</span>' +
          '</div>' +
          '<button type="button" class="btn-del-entry" data-idx="' + idx + '" title="Remove this payment entry">✕</button>' +
        '</div>';
      }).join('');
    }

    // Recalculate total paid from entries
    var sumPaid = payments.reduce(function (acc, p) { return acc + Number(p.amount || 0); }, 0);
    $('metaPaidInput').value = sumPaid;
    updateBalanceHelp();
  }

  function addPaymentEntry() {
    var amtInput = $('metaAddAmount');
    var modeInput = $('metaAddMode');
    var noteInput = $('metaAddNote');

    var amt = Number(amtInput.value);
    if (isNaN(amt) || amt <= 0) {
      toast('Please enter a valid payment amount (> 0)', 'error');
      if (amtInput) amtInput.focus();
      return;
    }

    var mode = (modeInput && modeInput.value) ? modeInput.value.trim() : 'UPI';
    var note = (noteInput && noteInput.value) ? noteInput.value.trim() : '';

    var now = new Date();
    var dateStr = now.toLocaleDateString('en-IN') + ' ' + now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    if (!state.currentPayments) state.currentPayments = [];

    var newEntry = {
      amount: amt,
      mode: mode,
      date: dateStr,
      note: note
    };

    state.currentPayments.push(newEntry);
    state.lastAddedPayment = newEntry; // track for server notes audit

    // Clear add inputs
    amtInput.value = '';
    if (noteInput) noteInput.value = '';

    renderPaymentsList();
    toast('Added ₹' + amt.toLocaleString('en-IN') + ' via ' + mode + ' to paid total', 'success');
  }

  function removePaymentEntry(idx) {
    if (!state.currentPayments || !state.currentPayments[idx]) return;
    state.currentPayments.splice(idx, 1);
    renderPaymentsList();
  }

  function openMeta(o) {
    state.current = o;
    state.lastAddedPayment = null;
    state.currentPayments = parsePaymentHistory(o);

    $('metaOrderIdText').textContent = o.orderId;
    if ($('metaCustomerNameText')) $('metaCustomerNameText').textContent = o.name || 'Customer';

    $('metaFinalInput').value = o.needsQuote ? '' : Number(o.amount || 0);
    $('metaPaidInput').value = Number(o.paid || 0);
    $('metaDeadlineInput').value = o.deadline || '';
    $('metaArtworkStatus').value = o.artworkStatus || 'RECEIVED';

    // Clear add payment inputs
    if ($('metaAddAmount')) $('metaAddAmount').value = '';
    if ($('metaAddNote')) $('metaAddNote').value = '';
    if ($('metaAddMode')) $('metaAddMode').value = (o.paymentMode && o.paymentMode.indexOf(',') === -1) ? o.paymentMode : 'UPI';

    renderPaymentsList();
    openModal('metaModal');
  }

  function updateBalanceHelp() {
    var o = state.current; if (!o) return;
    var total = $('metaFinalInput').value !== '' ? Number($('metaFinalInput').value) : Number(o.amount || 0);
    var paid = Number($('metaPaidInput').value || 0);
    var bal = Math.max(0, total - paid);

    if ($('metaSummaryTotal')) $('metaSummaryTotal').textContent = inr(total);
    if ($('metaSummaryPaid')) $('metaSummaryPaid').textContent = inr(paid);
    if ($('metaSummaryBalance')) $('metaSummaryBalance').textContent = inr(bal);
    $('metaBalanceHelp').textContent = 'Remaining Balance: ' + inr(bal);
  }

  function saveMeta() {
    var o = state.current, paid = Number($('metaPaidInput').value || 0);
    if (paid < 0) { toast('Amount negative nahi ho sakta', 'error'); return; }

    // Aggregate unique payment modes from entries
    var modes = [];
    if (state.currentPayments && state.currentPayments.length > 0) {
      state.currentPayments.forEach(function (p) {
        if (p.mode && modes.indexOf(p.mode) === -1) modes.push(p.mode);
      });
    }
    if (modes.length === 0 && $('metaAddMode')) {
      modes.push($('metaAddMode').value || 'UPI');
    }
    var combinedMode = modes.join(', ');

    var payload = {
      orderId: o.orderId,
      paid: paid,
      paymentMode: combinedMode,
      paymentHistory: state.currentPayments || [],
      newPayment: state.lastAddedPayment || null,
      finalTotal: $('metaFinalInput').value,
      deadline: $('metaDeadlineInput').value,
      artworkStatus: $('metaArtworkStatus').value,
      notify: autoNotify()
    };

    api('saveMeta', payload).then(function (j) {
      o.paid = paid;
      o.paymentMode = j.paymentMode || combinedMode;
      o.paymentHistory = JSON.stringify(state.currentPayments || []);
      o.advanceDue = ""; // Requirement 2: pending advance due released!
      o.deadline = payload.deadline;
      o.artworkStatus = payload.artworkStatus;
      if (payload.finalTotal !== '') { o.amount = Number(payload.finalTotal); o.needsQuote = false; }
      if (j.status) o.status = j.status;
      if (j.paymentStatus) o.paymentStatus = j.paymentStatus;
      closeModal('metaModal');
      renderAll();
      toast('Payment saved! Mode: ' + o.paymentMode + ' • Advance Due released.', 'success');
      reportNotify(j.notify);
    }).catch(function (e) { toast(e.message, 'error'); });
  }

  /* ---------- bulk ---------- */
  function updateBulkBar() {
    var ids = Object.keys(state.selected).filter(function (k) { return state.selected[k]; });
    $('bulkCount').textContent = ids.length;
    if (ids.length) show($('bulkBar')); else hide($('bulkBar'));
  }
  function bulkApply() {
    var ids = Object.keys(state.selected).filter(function (k) { return state.selected[k]; });
    var status = $('bulkStatusSelect').value;
    if (!status) { toast('Pehle status chuno', 'error'); return; }
    if (!ids.length) return;
    if (status === 'DISPATCHED') { toast('Dispatch ek-ek order par karo (AWB chahiye)', 'error'); return; }
    if (ids.length > 50) { toast('Ek baar me max 50 orders select karo', 'error'); return; }
    if (!confirm(ids.length + ' orders ka status "' + status + '" karna hai?' + ($('bulkSendWa').checked ? '\nCustomers ko WhatsApp bhi jayega.' : ''))) return;
    api('bulkStatus', { orderIds: ids, status: status, notify: $('bulkSendWa').checked }).then(function (j) {
      ids.forEach(function (id) { var o = find(id); if (o) o.status = status; });
      state.selected = {}; renderAll();
      toast(j.updated + ' orders updated' + (j.notifyFailed ? ' (' + j.notifyFailed + ' WhatsApp fail, Notification Error column dekho)' : ''), j.notifyFailed ? 'error' : 'success');
    }).catch(function (e) { toast(e.message, 'error'); });
  }

  /* ---------- CSV (formula-injection safe) ---------- */
  function csvCell(v) {
    var s = String(v == null ? '' : v);
    if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
    return '"' + s.replace(/"/g, '""') + '"';
  }
  function exportCsv() {
    var list = filtered();
    if (!list.length) { toast('Export karne ke liye orders nahi hain', 'error'); return; }
    var cols = ['orderId', 'date', 'name', 'phone', 'email', 'city', 'specs', 'qty', 'amount', 'paid', 'status', 'deadline', 'artworkStatus', 'courier', 'awb', 'notes'];
    var rows = [cols.join(',')].concat(list.map(function (o) { return cols.map(function (c) { return csvCell(o[c]); }).join(','); }));
    var blob = new Blob(['﻿' + rows.join('\n')], { type: 'text/csv;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'craftsveda-orders-' + new Date().toISOString().slice(0, 10) + '.csv';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  }

  /* ---------- auth ---------- */
  function afterLogin() {
    hide($('adminLoginOverlay'));
    $('adminUserEmailText').textContent = state.email || 'admin';
    show($('adminUserBadge'));
    loadOrders(true); loadConfigStatus(); startAutoRefresh();
  }
  function doLogout(expired) {
    state.token = null; state.orders = []; ss(SESSION_KEY, null);
    clearInterval(state.timer);
    hide($('adminUserBadge')); renderAll();
    show($('adminLoginOverlay'));
    if (expired) toast('Session expire ho gaya', 'error');
  }
  function doLogin(e) {
    e.preventDefault();
    var err = $('adminLoginError'); hide(err);
    var email = $('adminLoginEmail').value.trim(), pw = $('adminLoginPassword').value;
    $('btnAdminLoginSubmit').disabled = true; show($('loginBtnSpinner'));
    api('login', { email: email, password: pw }).then(function (j) {
      state.token = j.token; state.email = email;
      ss(SESSION_KEY, JSON.stringify({ t: j.token, e: email }));
      $('adminLoginPassword').value = '';
      afterLogin();
    }).catch(function (x) {
      err.textContent = x.message; show(err);
    }).then(function () { $('btnAdminLoginSubmit').disabled = false; hide($('loginBtnSpinner')); });
  }

  /* ---------- events ---------- */
  function bind() {
    $('adminLoginForm').addEventListener('submit', doLogin);
    $('btnToggleLoginPw').addEventListener('click', function () {
      var i = $('adminLoginPassword'); i.type = i.type === 'password' ? 'text' : 'password';
    });
    $('btnAdminLogout').addEventListener('click', function () { doLogout(false); });
    $('btnRefreshOrders').addEventListener('click', function () { loadOrders(false); });
    $('btnExportCsv').addEventListener('click', exportCsv);
    $('autoRefreshToggle').addEventListener('change', startAutoRefresh);

    // KPI + tabs
    document.querySelectorAll('.kpi-card[data-filter]').forEach(function (k) {
      k.addEventListener('click', function () { state.filter = k.getAttribute('data-filter'); state.page = 1; renderTable(); });
    });
    $('statusFilterTabs').addEventListener('click', function (e) {
      var b = e.target.closest('.tab-btn'); if (!b) return;
      state.filter = b.getAttribute('data-status'); state.page = 1; renderTable();
    });
    $('adminSortSelect').addEventListener('change', function (e) { state.sort = e.target.value; state.page = 1; renderTable(); });
    $('paymentFilterSelect').addEventListener('change', function (e) { state.pay = e.target.value; state.page = 1; renderTable(); });

    var st;
    $('adminSearchInput').addEventListener('input', function (e) {
      clearTimeout(st);
      var v = e.target.value;
      st = setTimeout(function () {
        state.search = v; state.page = 1;
        if (v) show($('btnClearSearch')); else hide($('btnClearSearch'));
        renderTable();
      }, 200);
    });
    $('btnClearSearch').addEventListener('click', function () {
      $('adminSearchInput').value = ''; state.search = ''; hide($('btnClearSearch')); renderTable();
    });

    $('btnPrevPage').addEventListener('click', function () { state.page--; renderTable(); });
    $('btnNextPage').addEventListener('click', function () { state.page++; renderTable(); });

    // table delegation
    var tb = $('ordersTableBody');
    tb.addEventListener('click', function (e) {
      var t = e.target.closest('button');
      if (!t) return;
      var o = find(t.getAttribute('data-id')); if (!o) return;
      if (t.classList.contains('js-wa')) openWa(o, o.status === 'DISPATCHED' ? 'DISPATCHED' : o.status === 'PRODUCTION IN PROGRESS' ? 'IN_PRODUCTION' : 'ORDER_CONFIRMED');
      else if (t.classList.contains('js-notes')) openNotes(o);
      else if (t.classList.contains('js-dispatch')) openDispatch(o);
      else if (t.classList.contains('js-meta')) openMeta(o);
    });
    tb.addEventListener('change', function (e) {
      var t = e.target, o = find(t.getAttribute('data-id')); if (!o) return;
      if (t.classList.contains('js-status')) changeStatus(o, t.value);
      else if (t.classList.contains('js-sel')) { state.selected[o.orderId] = t.checked; updateBulkBar(); }
    });
    $('selectAllRows').addEventListener('change', function (e) {
      document.querySelectorAll('.js-sel').forEach(function (c) { c.checked = e.target.checked; state.selected[c.getAttribute('data-id')] = e.target.checked; });
      updateBulkBar();
    });
    $('btnBulkApply').addEventListener('click', bulkApply);
    $('btnBulkClear').addEventListener('click', function () { state.selected = {}; renderTable(); });

    // WA modal
    $('waTemplateSelect').addEventListener('change', refreshWaPreview);
    $('waMessageTextarea').addEventListener('input', function () { $('waTemplateSelect').value = 'CUSTOM'; refreshWaPreview(); });
    $('btnSendViaWaApi').addEventListener('click', sendWaApi);
    ['btnCloseWaModal', 'btnCancelWaModal'].forEach(function (id) { $(id).addEventListener('click', function () { closeModal('waPreviewModal'); }); });

    // dispatch
    $('dispatchCourierSelect').addEventListener('change', function (e) { $('dispatchTrackingUrlInput').value = COURIER_URLS[e.target.value] || ''; });
    $('btnConfirmDispatch').addEventListener('click', confirmDispatch);
    ['btnCloseDispatchModal', 'btnCancelDispatchModal'].forEach(function (id) { $(id).addEventListener('click', function () { closeModal('dispatchModal'); }); });

    // notes
    $('btnSaveNotes').addEventListener('click', saveNotes);
    ['btnCloseNotesModal', 'btnCancelNotesModal'].forEach(function (id) { $(id).addEventListener('click', function () { closeModal('notesModal'); }); });

    // meta & payments
    $('metaPaidInput').addEventListener('input', updateBalanceHelp);
    $('metaFinalInput').addEventListener('input', updateBalanceHelp);
    if ($('btnAddPaymentEntry')) $('btnAddPaymentEntry').addEventListener('click', addPaymentEntry);
    if ($('metaPaymentsList')) {
      $('metaPaymentsList').addEventListener('click', function (e) {
        var btn = e.target.closest('.btn-del-entry');
        if (btn) {
          var idx = Number(btn.getAttribute('data-idx'));
          removePaymentEntry(idx);
        }
      });
    }
    $('btnSaveMeta').addEventListener('click', saveMeta);
    ['btnCloseMetaModal', 'btnCancelMetaModal'].forEach(function (id) { $(id).addEventListener('click', function () { closeModal('metaModal'); }); });

    // WA status modal
    $('btnOpenWaSettings').addEventListener('click', function () { loadConfigStatus(); openModal('waSettingsModal'); });
    ['btnCloseWaSettingsModal', 'btnCloseWaSettingsFooter'].forEach(function (id) { $(id).addEventListener('click', function () { closeModal('waSettingsModal'); }); });
    $('btnCopyWebhookUrl').addEventListener('click', function () {
      if (navigator.clipboard) navigator.clipboard.writeText(CFG.API_URL).then(function () { toast('URL copied', 'success'); });
    });
    (function () {
      var saved = ls('cv_toggleAutoNotify');
      if (saved !== null) $('toggleAutoNotify').checked = saved === '1';
      $('toggleAutoNotify').addEventListener('change', function () { ls('cv_toggleAutoNotify', $('toggleAutoNotify').checked ? '1' : '0'); });
    })();
    $('btnTestWaConnection').addEventListener('click', function () {
      var p = phone91($('testPhoneInput').value), out = $('testConnectionResult');
      if (p.length < 12) { toast('Sahi 10-digit number daalo', 'error'); return; }
      api('sendWhatsApp', { orderId: 'TEST', phone: p, message: 'CraftsVeda test message ✓', template: 'CUSTOM' })
        .then(function () { out.textContent = '✓ Test message gaya'; show(out); })
        .catch(function (e) { out.textContent = '✗ ' + e.message; show(out); });
    });

    // clock
    setInterval(function () {
      $('adminClock').textContent = new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }) + ' IST';
    }, 1000);
  }

  function init() {
    bind();
    var saved = null;
    try { saved = JSON.parse(ss(SESSION_KEY) || 'null'); } catch (e) { saved = null; }
    if (saved && saved.t) { state.token = saved.t; state.email = saved.e; afterLogin(); }
    else show($('adminLoginOverlay'));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
