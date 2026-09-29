/**
 * RFC GULU — REGAL FOOD CENTER (PICTORIAL CONTOUR ENGINE)
 * Plot 18, Gulu Avenue, Main Street, Laroo, Gulu City, Uganda
 * Topographic Motion Canvas • Food Tray Order Engine • Ambient Sound
 */

// Procedural Topographic Elevation Wave Canvas Engine (Exact KSP / Sol System)
const ContourEngine = (function () {
  let canvas, ctx;
  let width, height;
  let time = 0;
  let mouseX = 0, mouseY = 0;
  let targetMouseX = 0, targetMouseY = 0;

  function init() {
    canvas = document.getElementById('contour-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    resize();

    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    render();
  }

  function resize() {
    if (!canvas) return;
    width = canvas.width = window.innerWidth;
    const stage = document.querySelector('.hero-contour-stage');
    height = canvas.height = stage ? stage.offsetHeight : 720;
  }

  function onMouseMove(e) {
    const rect = canvas?.getBoundingClientRect();
    if (rect) {
      targetMouseX = (e.clientX - rect.left) / width - 0.5;
      targetMouseY = (e.clientY - rect.top) / height - 0.5;
    }
  }

  function render() {
    time += 0.003;
    mouseX += (targetMouseX - mouseX) * 0.04;
    mouseY += (targetMouseY - mouseY) * 0.04;

    ctx.clearRect(0, 0, width, height);

    const lineCount = 10;
    const spacing = height / (lineCount + 1);
    ctx.lineWidth = 1.3;

    for (let i = 1; i <= lineCount; i++) {
      ctx.beginPath();
      const baseY = i * spacing + Math.sin(time + i * 0.45) * 16;
      const alpha = 0.05 + (i / lineCount) * 0.08;

      // RFC Saffron Yellow & Paprika Crimson waves
      ctx.strokeStyle = i % 2 === 0
        ? `rgba(255, 184, 0, ${alpha * 1.2})`
        : `rgba(211, 35, 35, ${alpha})`;

      ctx.moveTo(0, baseY);

      for (let x = 0; x <= width; x += 24) {
        const wave1 = Math.sin(x * 0.0025 + time * 1.2 + i * 0.35) * 20;
        const wave2 = Math.cos(x * 0.005 - time * 0.7 + i * 0.25) * 14;
        const wave3 = Math.sin(x * 0.0012 + time * 0.4) * 26;
        const mouseShift = Math.sin((x / width) * Math.PI) * (mouseY * 40);

        const y = baseY + wave1 + wave2 + wave3 + mouseShift;
        ctx.lineTo(x, y);
      }

      ctx.stroke();
    }

    requestAnimationFrame(render);
  }

  return { init };
})();

// Ambient Fast-Casual Acoustic Synthesizer
const AmbientAudio = (function () {
  let audioCtx;
  let isPlaying = false;
  let osc1, osc2, gainNode, filterNode;

  function toggle() {
    if (!audioCtx) initAudio();
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }

  function initAudio() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();

    osc1 = audioCtx.createOscillator();
    osc2 = audioCtx.createOscillator();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(220.00, audioCtx.currentTime); // A3

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(329.63, audioCtx.currentTime); // E4

    filterNode = audioCtx.createBiquadFilter();
    filterNode.type = 'lowpass';
    filterNode.frequency.setValueAtTime(350, audioCtx.currentTime);

    gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.0001, audioCtx.currentTime);

    osc1.connect(filterNode);
    osc2.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc1.start();
    osc2.start();
  }

  function play() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    gainNode.gain.cancelScheduledValues(audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.06, audioCtx.currentTime + 1.2);
    isPlaying = true;
    updateUI(true);
    AppUtils.showToast('🎶 RFC Warm Social Acoustic Atmosphere Active');
  }

  function pause() {
    gainNode.gain.cancelScheduledValues(audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 0.6);
    isPlaying = false;
    updateUI(false);
  }

  function updateUI(active) {
    const btn = document.getElementById('sound-btn');
    if (btn) {
      if (active) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    }
  }

  return { toggle };
})();

// Food Tray State
const RFCTray = (function () {
  let items = [];

  function init() {
    try {
      const saved = localStorage.getItem('rfc_tray_items');
      if (saved) items = JSON.parse(saved);
    } catch (e) {
      items = [];
    }
    updateUI();
  }

  function save() {
    try {
      localStorage.setItem('rfc_tray_items', JSON.stringify(items));
    } catch (e) {}
  }

  function addItem(item) {
    const existing = items.find(i => i.id === item.id);
    if (existing) {
      existing.qty += 1;
    } else {
      items.push({
        id: item.id,
        name: item.name,
        price: item.price,
        formattedPrice: item.formattedPrice,
        qty: 1
      });
    }
    save();
    updateUI();
    AppUtils.showToast(`🍗 Added <strong>${item.name}</strong> to your food tray!`);
  }

  function updateQty(id, delta) {
    const item = items.find(i => i.id === id);
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) {
      items = items.filter(i => i.id !== id);
    }
    save();
    updateUI();
  }

  function clearTray() {
    items = [];
    save();
    updateUI();
    AppUtils.showToast('Tray cleared');
  }

  function getTotals() {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const packaging = items.length > 0 ? 1000 : 0;
    const total = subtotal + packaging;
    return { subtotal, packaging, total };
  }

  function updateUI() {
    const totalCount = items.reduce((sum, item) => sum + item.qty, 0);

    document.querySelectorAll('.tray-count-bubble').forEach(el => {
      el.textContent = totalCount;
    });

    const listContainer = document.getElementById('tray-items-container');
    const summaryContainer = document.getElementById('tray-summary-container');
    const emptyState = document.getElementById('tray-empty-state');
    const trayActionBtns = document.getElementById('tray-action-buttons');

    if (!listContainer) return;

    if (items.length === 0) {
      listContainer.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      if (summaryContainer) summaryContainer.style.display = 'none';
      if (trayActionBtns) trayActionBtns.style.display = 'none';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    if (summaryContainer) summaryContainer.style.display = 'block';
    if (trayActionBtns) trayActionBtns.style.display = 'block';

    listContainer.innerHTML = items.map(item => `
      <div class="tray-item-row">
        <div class="tray-item-info">
          <h4>${item.name}</h4>
          <span>UGX ${(item.price * item.qty).toLocaleString()}</span>
        </div>
        <div class="tray-qty-controls">
          <button class="qty-btn" onclick="RFCTray.updateQty('${item.id}', -1)">-</button>
          <span class="qty-display">${item.qty}</span>
          <button class="qty-btn" onclick="RFCTray.updateQty('${item.id}', 1)">+</button>
        </div>
      </div>
    `).join('');

    const { subtotal, packaging, total } = getTotals();
    if (summaryContainer) {
      summaryContainer.innerHTML = `
        <div class="summary-line">
          <span>Subtotal</span>
          <span style="font-family: var(--font-mono); font-weight: 700;">UGX ${subtotal.toLocaleString()}</span>
        </div>
        <div class="summary-line">
          <span>Takeaway Packaging & Sauces</span>
          <span style="font-family: var(--font-mono); font-weight: 700;">UGX ${packaging.toLocaleString()}</span>
        </div>
        <div class="summary-line total-line">
          <span>Total Order</span>
          <span>UGX ${total.toLocaleString()}</span>
        </div>
      `;
    }
  }

  function checkoutViaWhatsApp() {
    if (items.length === 0) {
      AppUtils.showToast('Please add items to your food tray first!');
      return;
    }

    const customerName = document.getElementById('tray-customer-name')?.value.trim() || 'Valued Guest';
    const customerLocation = document.getElementById('tray-customer-location')?.value.trim() || 'Gulu City (Takeaway / Delivery)';
    const orderType = document.getElementById('tray-order-type')?.value || 'Takeaway';
    const specialNotes = document.getElementById('tray-customer-notes')?.value.trim();

    const { total } = getTotals();

    let message = `*🍗 NEW ORDER — RFC GULU (REGAL FOOD CENTER)*\n`;
    message += `--------------------------------------\n`;
    message += `*Customer:* ${customerName}\n`;
    message += `*Order Type:* ${orderType}\n`;
    message += `*Address/Destination:* ${customerLocation}\n`;
    if (specialNotes) message += `*Notes:* ${specialNotes}\n`;
    message += `--------------------------------------\n`;
    message += `*ITEMS ORDERED:*\n`;

    items.forEach(item => {
      message += `• ${item.qty}x ${item.name} — UGX ${(item.price * item.qty).toLocaleString()}\n`;
    });

    message += `--------------------------------------\n`;
    message += `*Estimated Total: UGX ${total.toLocaleString()}*\n\n`;
    message += `Please confirm my order and let me know preparation / delivery time!`;

    const encoded = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/256743599458?text=${encoded}`;

    window.open(whatsappUrl, '_blank');
    AppUtils.showToast('🚀 Redirecting to WhatsApp to send order...');
  }

  return {
    init,
    addItem,
    updateQty,
    clearTray,
    getTotals,
    checkoutViaWhatsApp
  };
})();

// App Utilities & Interactive Handlers
window.AppUtils = (function () {
  function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.innerHTML = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(12px)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(() => toast.remove(), 260);
    }, 3500);
  }

  function openTrayModal() {
    const modal = document.getElementById('tray-modal');
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeTrayModal() {
    const modal = document.getElementById('tray-modal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  function openPartyModal(packageName) {
    const modal = document.getElementById('party-modal');
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (packageName) {
        const select = document.getElementById('party-package-select');
        if (select) select.value = packageName;
      }
    }
  }

  function closePartyModal() {
    const modal = document.getElementById('party-modal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  function submitPartyBooking(e) {
    if (e) e.preventDefault();

    const name = document.getElementById('party-name')?.value.trim();
    const phone = document.getElementById('party-phone')?.value.trim();
    const eventType = document.getElementById('party-type')?.value;
    const date = document.getElementById('party-date')?.value;
    const guests = document.getElementById('party-guests')?.value;
    const packageChoice = document.getElementById('party-package-select')?.value;
    const notes = document.getElementById('party-notes')?.value.trim();

    if (!name || !phone) {
      showToast('Please provide your name and phone number!');
      return;
    }

    let msg = `*🎉 PARTY & GARDEN LAWN INQUIRY — RFC GULU*\n`;
    msg += `--------------------------------------\n`;
    msg += `*Name:* ${name}\n`;
    msg += `*Phone:* ${phone}\n`;
    msg += `*Event Occasion:* ${eventType}\n`;
    msg += `*Requested Date & Time:* ${date || 'Flexible'}\n`;
    msg += `*Estimated Guests:* ${guests || '10-20'}\n`;
    msg += `*Preferred Menu / Lawn:* ${packageChoice}\n`;
    if (notes) msg += `*Special Requests:* ${notes}\n`;
    msg += `--------------------------------------\n`;
    msg += `Kindly provide quotation and availability for our event at RFC Regal Food Center Gulu!`;

    const encoded = encodeURIComponent(msg);
    const url = `https://wa.me/256743599458?text=${encoded}`;

    window.open(url, '_blank');
    closePartyModal();
    showToast('🎉 Booking generated! Connecting to RFC Gulu manager on WhatsApp.');
  }

  function filterMenu(category, clickedBtn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    if (clickedBtn) {
      clickedBtn.classList.add('active');
    } else {
      const matchingTab = document.querySelector(`.filter-btn[data-cat="${category}"]`);
      if (matchingTab) matchingTab.classList.add('active');
    }

    const cards = document.querySelectorAll('.menu-visual-card');
    cards.forEach(card => {
      const cardCategory = card.getAttribute('data-category') || '';
      if (category === 'all' || cardCategory.includes(category)) {
        card.style.display = 'flex';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 15);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(8px)';
        setTimeout(() => { card.style.display = 'none'; }, 150);
      }
    });
  }

  function copyAddress() {
    const address = "Plot NO 18, GULU AVENUE, MAIN STREET, Laroo, Gulu City, Uganda";
    navigator.clipboard.writeText(address).then(() => {
      showToast('📍 Address copied to clipboard!');
    }).catch(() => {
      showToast(`📍 Address: ${address}`);
    });
  }

  function initScrollProgress() {
    const bar = document.getElementById('scroll-progress-line');
    if (!bar) return;

    window.addEventListener('scroll', () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      bar.style.width = scrolled + '%';
    }, { passive: true });
  }

  return {
    showToast,
    openTrayModal,
    closeTrayModal,
    openPartyModal,
    closePartyModal,
    submitPartyBooking,
    filterMenu,
    copyAddress,
    initScrollProgress
  };
})();

// Document Ready Initialization
document.addEventListener('DOMContentLoaded', () => {
  ContourEngine.init();
  RFCTray.init();
  AppUtils.initScrollProgress();
});
