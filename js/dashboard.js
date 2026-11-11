/* ============================================
   SegmentIQ — Dashboard Logic & Demo Data
   ============================================ */

(function () {
  'use strict';

  /* ============================================================
     DEMO DATA
     ============================================================ */
  const SEGMENT_COLORS = {
    VIP: '#f59e0b',
    Loyalists: '#6366f1',
    Prospects: '#22d3ee',
    'At-Risk': '#ef4444',
    Occasional: '#a855f7',
    Dormant: '#64748b',
  };

  const SEGMENTS = [
    {
      id: 'vip',
      name: 'VIP Champions',
      emoji: '👑',
      color: SEGMENT_COLORS.VIP,
      tag: 'high',
      tagLabel: 'High Value',
      desc: 'Top 1% spenders with the highest lifetime value and referral rate.',
      size: 1284,
      revenue: 42800,
      growth: 14.2,
    },
    {
      id: 'loyalists',
      name: 'High-Value Loyalists',
      emoji: '💎',
      color: SEGMENT_COLORS.Loyalists,
      tag: 'high',
      tagLabel: 'High Value',
      desc: 'Repeat buyers with consistent purchase frequency and strong loyalty.',
      size: 24890,
      revenue: 96400,
      growth: 9.8,
    },
    {
      id: 'prospects',
      name: 'New Prospects',
      emoji: '🌱',
      color: SEGMENT_COLORS.Prospects,
      tag: 'new',
      tagLabel: 'New',
      desc: 'Recent signups with early engagement signals and high potential.',
      size: 33420,
      revenue: 38200,
      growth: 22.6,
    },
    {
      id: 'atrisk',
      name: 'At-Risk Churners',
      emoji: '⚠️',
      color: SEGMENT_COLORS['At-Risk'],
      tag: 'risk',
      tagLabel: 'At Risk',
      desc: 'Previously active customers showing declining engagement patterns.',
      size: 18640,
      revenue: 21400,
      growth: -8.4,
    },
    {
      id: 'occasional',
      name: 'Occasional Buyers',
      emoji: '🛒',
      color: SEGMENT_COLORS.Occasional,
      tag: 'occasional',
      tagLabel: 'Occasional',
      desc: 'Price-sensitive shoppers who buy during promotions and sales only.',
      size: 40210,
      revenue: 27600,
      growth: 3.1,
    },
    {
      id: 'dormant',
      name: 'Dormant Accounts',
      emoji: '💤',
      color: SEGMENT_COLORS.Dormant,
      tag: 'risk',
      tagLabel: 'Dormant',
      desc: 'No activity in 90+ days. Prime candidates for win-back campaigns.',
      size: 10096,
      revenue: 8400,
      growth: -12.7,
    },
  ];

  const FIRST_NAMES = ['Olivia', 'Liam', 'Emma', 'Noah', 'Ava', 'Ethan', 'Sophia', 'Mason', 'Isabella', 'Lucas', 'Mia', 'Logan', 'Charlotte', 'James', 'Amelia', 'Benjamin', 'Harper', 'Elijah', 'Evelyn', 'Oliver', 'Priya', 'Arjun', 'Sofia', 'Diego', 'Yuki', 'Chen', 'Fatima', 'Omar'];
  const LAST_NAMES = ['Chen', 'Patel', 'Kim', 'Garcia', 'Nguyen', 'Smith', 'Johnson', 'Müller', 'Rossi', 'Silva', 'Sato', 'Ahmed', 'Kowalski', 'Dubois', 'Andersen', 'Okafor', 'Reyes', 'Haddad', 'Novak', 'Wilson'];
  const DOMAINS = ['gmail.com', 'outlook.com', 'company.io', 'acme.co', 'mail.com', 'proton.me', 'yahoo.com'];
  const AVATAR_COLORS = ['#6366f1', '#22d3ee', '#a855f7', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6'];

  function seededRandom(seed) {
    let s = seed;
    return function () {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
  }

  function generateCustomers(count) {
    const rand = seededRandom(42);
    const segKeys = SEGMENTS.map((s) => s.name);
    const customers = [];

    for (let i = 0; i < count; i++) {
      const first = FIRST_NAMES[Math.floor(rand() * FIRST_NAMES.length)];
      const last = LAST_NAMES[Math.floor(rand() * LAST_NAMES.length)];
      const seg = SEGMENTS[Math.floor(rand() * SEGMENTS.length)];
      const ltv = Math.round((rand() * 2400 + 40) * 100) / 100;
      const orders = Math.floor(rand() * 42) + 1;
      let risk = Math.floor(rand() * 100);
      if (seg.id === 'atrisk' || seg.id === 'dormant') risk = 55 + Math.floor(rand() * 45);
      else if (seg.id === 'vip' || seg.id === 'loyalists') risk = Math.floor(rand() * 20);
      const daysAgo = Math.floor(rand() * 120);
      customers.push({
        id: i + 1,
        name: `${first} ${last}`,
        email: `${first.toLowerCase()}.${last.toLowerCase()}${Math.floor(rand() * 99)}@${DOMAINS[Math.floor(rand() * DOMAINS.length)]}`,
        segment: seg.name,
        ltv,
        orders,
        risk,
        daysAgo,
        color: AVATAR_COLORS[i % AVATAR_COLORS.length],
        initials: first[0] + last[0],
      });
    }
    return customers;
  }

  const CUSTOMERS = generateCustomers(64);

  const CAMPAIGNS = [
    { name: 'VIP Early Access Drop', segment: 'VIP Champions', status: 'active', sent: 1284, opened: 892, converted: 218, progress: 82 },
    { name: 'Loyalist Rewards Program', segment: 'High-Value Loyalists', status: 'active', sent: 24890, opened: 14120, converted: 2847, progress: 64 },
    { name: 'Win-Back: Dormant Users', segment: 'Dormant Accounts', status: 'active', sent: 10096, opened: 3410, converted: 612, progress: 41 },
    { name: 'Prospect Welcome Series', segment: 'New Prospects', status: 'active', sent: 33420, opened: 19870, converted: 4120, progress: 73 },
    { name: 'At-Risk Retention Offer', segment: 'At-Risk Churners', status: 'paused', sent: 18640, opened: 7640, converted: 1104, progress: 52 },
    { name: 'Flash Sale — Occasional', segment: 'Occasional Buyers', status: 'draft', sent: 0, opened: 0, converted: 0, progress: 0 },
  ];

  const AI_INSIGHTS = [
    {
      icon: '📈',
      color: '#10b981',
      title: 'Revenue Opportunity Detected',
      tag: 'High Confidence',
      desc: 'Your "High-Value Loyalists" segment has a 34% higher cart value than average. A personalized bundle offer could unlock significant additional revenue.',
      metric: '+$42,800',
      metricLabel: 'projected monthly uplift',
      action: 'Create Campaign',
    },
    {
      icon: '⚠️',
      color: '#ef4444',
      title: 'Churn Risk Spike',
      tag: 'Urgent',
      desc: '1,842 customers in "At-Risk Churners" showed increased drop-off signals in the last 7 days. Act now before they lapse.',
      metric: '1,842',
      metricLabel: 'customers at immediate risk',
      action: 'View At-Risk',
    },
    {
      icon: '✨',
      color: '#22d3ee',
      title: 'New Micro-Segment Found',
      tag: 'Discovery',
      desc: 'AI identified a cluster of 620 "Weekend Browsers" who convert 3.1× higher on Saturdays. Consider weekend-targeted promotions.',
      metric: '3.1×',
      metricLabel: 'higher weekend conversion',
      action: 'Explore Segment',
    },
    {
      icon: '🎯',
      color: '#a855f7',
      title: 'Best Send Time Identified',
      tag: 'Optimization',
      desc: 'Your "New Prospects" segment opens emails 47% more often between 7–9 PM local time. Schedule campaigns accordingly.',
      metric: '+47%',
      metricLabel: 'email open rate',
      action: 'Apply to Campaigns',
    },
  ];

  const REPORTS = [
    { icon: 'bar', title: 'Segment Performance', desc: 'Detailed breakdown of revenue, growth and engagement per segment.', updated: 'Updated 2h ago' },
    { icon: 'users', title: 'Customer Cohort Analysis', desc: 'Retention and value trends across acquisition cohorts.', updated: 'Updated 5h ago' },
    { icon: 'trend', title: 'Revenue Attribution', desc: 'Which segments drive the most revenue and how that changes over time.', updated: 'Updated 1d ago' },
    { icon: 'alert', title: 'Churn Prediction Report', desc: 'ML-powered churn scores with recommended interventions per customer.', updated: 'Updated 3h ago' },
    { icon: 'mail', title: 'Campaign Effectiveness', desc: 'Open, click and conversion rates across all active campaigns.', updated: 'Updated 6h ago' },
    { icon: 'download', title: 'Full Data Export', desc: 'Export all segments and customer records as CSV or JSON.', updated: 'Available now' },
  ];

  const INTEGRATIONS = [
    { name: 'Shopify', letter: 'S', color: '#95bf47', connected: true, desc: 'E-commerce' },
    { name: 'Stripe', letter: 'S', color: '#635bff', connected: true, desc: 'Payments' },
    { name: 'HubSpot', letter: 'H', color: '#ff7a59', connected: true, desc: 'CRM' },
    { name: 'Segment', letter: 'S', color: '#52bd94', connected: false, desc: 'CDP' },
    { name: 'BigQuery', letter: 'B', color: '#4285f4', connected: false, desc: 'Warehouse' },
    { name: 'Klaviyo', letter: 'K', color: '#7c3aed', connected: false, desc: 'Email' },
    { name: 'Intercom', letter: 'I', color: '#1f8ded', connected: true, desc: 'Support' },
    { name: 'Slack', letter: 'S', color: '#4a154b', connected: false, desc: 'Alerts' },
  ];

  const ACTIVITIES = [
    { icon: '✨', color: '#a855f7', text: 'AI re-clustered <strong>128,540 customers</strong> into 6 refined segments', time: '3 minutes ago' },
    { icon: '👑', color: '#f59e0b', text: '<strong>VIP Champions</strong> grew by <strong>14.2%</strong> this week', time: '18 minutes ago' },
    { icon: '🎯', color: '#22d3ee', text: 'Campaign <strong>Loyalist Rewards</strong> hit a 56.7% open rate', time: '1 hour ago' },
    { icon: '⚠️', color: '#ef4444', text: '<strong>1,842 customers</strong> flagged as high churn risk', time: '2 hours ago' },
    { icon: '🔗', color: '#10b981', text: 'New integration connected: <strong>Intercom</strong>', time: '4 hours ago' },
    { icon: '📊', color: '#6366f1', text: 'Weekly segment performance report is ready', time: '6 hours ago' },
  ];

  /* ============================================================
     UTILITIES
     ============================================================ */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  function formatNumber(n, decimals = 0) {
    return Number(n).toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }

  function formatCurrency(n) {
    return '$' + Math.round(n).toLocaleString('en-US');
  }

  function timeAgo(days) {
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return days + ' days ago';
    if (days < 30) return Math.floor(days / 7) + ' weeks ago';
    return Math.floor(days / 30) + ' months ago';
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  /* Toast notifications */
  function showToast(title, message, type = 'info') {
    const container = $('#toastContainer');
    if (!container) return;
    const icons = { success: '✓', info: 'ℹ', error: '!' };
    const toast = document.createElement('div');
    toast.className = 'toast ' + type;
    toast.innerHTML = `
      <div class="toast-icon">${icons[type] || 'ℹ'}</div>
      <div class="toast-body"><strong>${escapeHtml(title)}</strong><p>${escapeHtml(message)}</p></div>
    `;
    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('removing');
      setTimeout(() => toast.remove(), 320);
    }, 3800);
  }

  /* ============================================================
     SESSION / USER
     ============================================================ */
  const isDemo = new URLSearchParams(window.location.search).get('demo') === '1';
  let session = null;
  let storedUser = null;

  try {
    session = JSON.parse(localStorage.getItem('segmentiq_auth') || 'null');
    storedUser = JSON.parse(localStorage.getItem('segmentiq_user') || 'null');
  } catch (e) {
    session = null;
    storedUser = null;
  }

  const user = (session && session.user) || storedUser || null;

  // If not logged in and not demo mode, still allow viewing (demo dashboard), but flag it.
  const effectiveDemo = isDemo || !user || (user && user.demo);

  function initUserUI() {
    const name = (user && user.name) || 'Alex Demo';
    const email = (user && user.email) || 'demo@segmentiq.io';
    const company = (storedUser && storedUser.company) || 'Acme Inc.';
    const plan = (user && user.plan) || 'Growth';

    const nameEl = $('#userName');
    const avatarEl = $('#userAvatar');
    const udName = $('#udName');
    const udEmail = $('#udEmail');
    const wsName = $('#wsName');
    const wsPlan = $('#wsPlan');

    if (nameEl) nameEl.textContent = name;
    if (avatarEl) avatarEl.textContent = name.charAt(0).toUpperCase();
    if (udName) udName.textContent = name;
    if (udEmail) udEmail.textContent = email;
    if (wsName) wsName.textContent = company;
    if (wsPlan) wsPlan.textContent = plan + ' plan';

    const banner = $('#demoBanner');
    if (banner) {
      if (!effectiveDemo) banner.style.display = 'none';
    }

    // Settings form prefill
    const setName = $('#setName');
    const setEmail = $('#setEmail');
    const setCompany = $('#setCompany');
    if (setName) setName.value = name;
    if (setEmail) setEmail.value = email;
    if (setCompany) setCompany.value = company;
  }

  /* ============================================================
     VIEW NAVIGATION
     ============================================================ */
  const VIEW_META = {
    overview: { title: 'Dashboard', subtitle: "Welcome back — here's what's happening with your customers." },
    segments: { title: 'Segments', subtitle: 'Manage and analyze your AI-generated customer segments.' },
    customers: { title: 'Customers', subtitle: 'Browse and filter every customer in your workspace.' },
    campaigns: { title: 'Campaigns', subtitle: 'Track and manage your segment-targeted campaigns.' },
    ai: { title: 'AI Insights', subtitle: 'Actionable recommendations from your AI models.' },
    reports: { title: 'Reports', subtitle: 'Deep-dive analytics and exportable reports.' },
    integrations: { title: 'Integrations', subtitle: 'Connect your data sources and marketing stack.' },
    settings: { title: 'Settings', subtitle: 'Manage your profile, notifications and workspace.' },
  };

  function switchView(view) {
    if (!VIEW_META[view]) view = 'overview';

    $$('.view').forEach((el) => el.classList.toggle('active', el.id === 'view-' + view));
    $$('.side-link').forEach((link) => link.classList.toggle('active', link.getAttribute('data-view') === view));

    const titleEl = $('#pageTitle');
    const subEl = $('#pageSubtitle');
    if (titleEl) titleEl.textContent = VIEW_META[view].title;
    if (subEl) subEl.textContent = VIEW_META[view].subtitle;

    closeSidebar();
    if (window.innerWidth < 1024) window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  $$('.side-link').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      switchView(link.getAttribute('data-view'));
    });
  });

  $$('[data-goto]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      switchView(el.getAttribute('data-goto'));
    });
  });

  /* ============================================================
     SIDEBAR
     ============================================================ */
  const sidebar = $('#sidebar');
  const sidebarOverlay = $('#sidebarOverlay');

  function openSidebar() {
    if (sidebar) sidebar.classList.add('open');
    if (sidebarOverlay) sidebarOverlay.classList.add('open');
  }
  function closeSidebar() {
    if (sidebar) sidebar.classList.remove('open');
    if (sidebarOverlay) sidebarOverlay.classList.remove('open');
  }

  const sidebarToggle = $('#sidebarToggle');
  const sidebarClose = $('#sidebarClose');
  if (sidebarToggle) sidebarToggle.addEventListener('click', openSidebar);
  if (sidebarClose) sidebarClose.addEventListener('click', closeSidebar);
  if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);

  /* ============================================================
     USER MENU
     ============================================================ */
  const userBtn = $('#userBtn');
  const userDropdown = $('#userDropdown');
  if (userBtn && userDropdown) {
    userBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      userDropdown.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
      if (!userDropdown.contains(e.target) && !userBtn.contains(e.target)) {
        userDropdown.classList.remove('open');
      }
    });
  }

  const logoutBtn = $('#logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      try {
        localStorage.removeItem('segmentiq_auth');
      } catch (e) { /* ignore */ }
      showToast('Signed out', 'Redirecting to login…', 'info');
      setTimeout(() => (window.location.href = 'login.html'), 800);
    });
  }

  /* ============================================================
     KPI COUNTERS
     ============================================================ */
  function animateCounter(el) {
    const target = parseFloat(el.getAttribute('data-count'));
    const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    const duration = 1400;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = formatNumber(value, decimals);
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = formatNumber(target, decimals);
    }
    requestAnimationFrame(tick);
  }

  function initCounters() {
    $$('.kpi-value [data-count], .kpi-value[data-count]').forEach((el) => {
      animateCounter(el);
    });
  }

  /* ============================================================
     CHARTS
     ============================================================ */
  function renderRevenueChart() {
    const el = $('#revenueChart');
    if (!el) return;
    const months = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
    const data = {
      loyalists: [58, 66, 61, 74, 82, 88],
      prospects: [32, 41, 38, 47, 55, 63],
      atrisk: [22, 19, 25, 21, 24, 20],
    };

    el.innerHTML = months
      .map((m, i) => {
        return `
          <div class="chart-group">
            <div class="chart-bars">
              <div class="cb cb-1" style="--h:${data.loyalists[i]}%"></div>
              <div class="cb cb-2" style="--h:${data.prospects[i]}%"></div>
              <div class="cb cb-3" style="--h:${data.atrisk[i]}%"></div>
            </div>
            <span class="chart-label">${m}</span>
          </div>`;
      })
      .join('');
  }

  function renderDonut() {
    const svg = $('#donutChart');
    const legend = $('#donutLegend');
    if (!svg || !legend) return;

    const total = SEGMENTS.reduce((sum, s) => sum + s.size, 0);
    const radius = 44;
    const circumference = 2 * Math.PI * radius;
    let offset = 0;

    const circles = SEGMENTS.map((seg, i) => {
      const fraction = seg.size / total;
      const dash = fraction * circumference;
      const gap = circumference - dash;
      const c = `<circle class="donut-seg" cx="60" cy="60" r="${radius}"
        stroke="${seg.color}"
        stroke-dasharray="${dash.toFixed(2)} ${gap.toFixed(2)}"
        stroke-dashoffset="${(-offset).toFixed(2)}"
        style="animation-delay:${i * 90}ms">
        <title>${escapeHtml(seg.name)}: ${formatNumber(seg.size)}</title>
      </circle>`;
      offset += dash;
      return c;
    }).join('');

    svg.innerHTML = `<circle cx="60" cy="60" r="${radius}" stroke="rgba(255,255,255,0.06)" />` + circles;

    legend.innerHTML = SEGMENTS.map((seg) => {
      const pct = ((seg.size / total) * 100).toFixed(1);
      return `<div class="dl-item"><i style="background:${seg.color}"></i>${escapeHtml(seg.name)}<b>${pct}%</b></div>`;
    }).join('');
  }

  function renderTopSegments() {
    const el = $('#topSegments');
    if (!el) return;
    const sorted = [...SEGMENTS].sort((a, b) => b.revenue - a.revenue);
    const max = sorted[0].revenue;

    el.innerHTML = sorted.map((seg) => {
      const pct = Math.round((seg.revenue / max) * 100);
      return `
        <div class="seg-row" data-seg="${seg.id}">
          <span class="seg-row-dot" style="background:${seg.color}"></span>
          <div class="seg-row-info">
            <strong>${escapeHtml(seg.name)}</strong>
            <span>${formatNumber(seg.size)} customers</span>
          </div>
          <div class="seg-row-bar"><i style="width:${pct}%; background:${seg.color}"></i></div>
          <span class="seg-row-val">${formatCurrency(seg.revenue)}</span>
        </div>`;
    }).join('');
  }

  function renderActivity() {
    const el = $('#activityList');
    if (!el) return;
    el.innerHTML = ACTIVITIES.map((a, i) => `
      <div class="activity-item" style="animation-delay:${i * 60}ms">
        <div class="act-icon" style="background:color-mix(in srgb, ${a.color} 15%, transparent)">${a.icon}</div>
        <div class="act-body">
          <p>${a.text}</p>
          <div class="act-time">${a.time}</div>
        </div>
      </div>`).join('');
  }

  /* ============================================================
     SEGMENTS VIEW
     ============================================================ */
  let currentSegmentFilter = 'all';

  function renderSegmentsGrid() {
    const grid = $('#segmentsGrid');
    if (!grid) return;

    const filtered = SEGMENTS.filter((seg) => {
      if (currentSegmentFilter === 'all') return true;
      if (currentSegmentFilter === 'high') return seg.tag === 'high';
      if (currentSegmentFilter === 'risk') return seg.tag === 'risk';
      if (currentSegmentFilter === 'new') return seg.tag === 'new';
      return true;
    });

    if (!filtered.length) {
      grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><h3>No segments in this category</h3><p>Try a different filter.</p></div>`;
      return;
    }

    grid.innerHTML = filtered.map((seg) => `
      <div class="seg-card" style="--accent-color:${seg.color}" data-seg="${seg.id}">
        <div class="seg-card-head">
          <div class="seg-card-icon">${seg.emoji}</div>
          <span class="seg-tag ${seg.tag}">${seg.tagLabel}</span>
        </div>
        <h3>${escapeHtml(seg.name)}</h3>
        <p>${escapeHtml(seg.desc)}</p>
        <div class="seg-stats">
          <div class="seg-stat"><strong>${formatNumber(seg.size)}</strong><span>Customers</span></div>
          <div class="seg-stat"><strong>${formatCurrency(seg.revenue)}</strong><span>Revenue</span></div>
        </div>
        <div class="seg-card-foot">
          <span class="seg-growth ${seg.growth >= 0 ? 'positive' : 'negative'}">${seg.growth >= 0 ? '▲' : '▼'} ${Math.abs(seg.growth)}%</span>
          <span class="seg-action">View details →</span>
        </div>
      </div>`).join('');
  }

  $$('#segmentTabs .tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      $$('#segmentTabs .tab').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      currentSegmentFilter = tab.getAttribute('data-filter');
      renderSegmentsGrid();
    });
  });

  const createSegmentBtn = $('#createSegmentBtn');
  if (createSegmentBtn) {
    createSegmentBtn.addEventListener('click', () => {
      showToast('AI is clustering', 'Analyzing 128,540 customers to find new segments…', 'info');
      setTimeout(() => showToast('New segment created', 'Found "Weekend Browsers" — 620 customers with 3.1× weekend conversion.', 'success'), 2200);
    });
  }

  /* ============================================================
     CUSTOMERS VIEW
     ============================================================ */
  let customerPage = 1;
  const PER_PAGE = 10;

  function getFilteredCustomers() {
    const search = ($('#customerSearch') && $('#customerSearch').value.toLowerCase().trim()) || '';
    const segFilter = ($('#segmentFilter') && $('#segmentFilter').value) || 'all';

    return CUSTOMERS.filter((c) => {
      const matchesSearch = !search || c.name.toLowerCase().includes(search) || c.email.toLowerCase().includes(search);
      const matchesSeg = segFilter === 'all' || c.segment === segFilter;
      return matchesSearch && matchesSeg;
    });
  }

  function riskColor(risk) {
    if (risk < 30) return '#10b981';
    if (risk < 60) return '#f59e0b';
    return '#ef4444';
  }

  function renderCustomers() {
    const body = $('#customersBody');
    const countEl = $('#customerCount');
    const pagEl = $('#pagination');
    if (!body) return;

    const filtered = getFilteredCustomers();
    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    if (customerPage > totalPages) customerPage = totalPages;

    const start = (customerPage - 1) * PER_PAGE;
    const pageItems = filtered.slice(start, start + PER_PAGE);

    if (!pageItems.length) {
      body.innerHTML = `<tr><td colspan="6"><div class="empty-state"><h3>No customers found</h3><p>Try adjusting your search or filters.</p></div></td></tr>`;
    } else {
      body.innerHTML = pageItems.map((c) => {
        const seg = SEGMENTS.find((s) => s.name === c.segment) || SEGMENTS[0];
        return `
          <tr>
            <td>
              <div class="cust-cell">
                <div class="cust-avatar" style="background:${c.color}">${escapeHtml(c.initials)}</div>
                <div class="cust-info"><strong>${escapeHtml(c.name)}</strong><span>${escapeHtml(c.email)}</span></div>
              </div>
            </td>
            <td><span class="badge-seg" style="background:color-mix(in srgb, ${seg.color} 16%, transparent); color:${seg.color}">${escapeHtml(seg.name)}</span></td>
            <td style="font-weight:600">${formatCurrency(c.ltv)}</td>
            <td>${c.orders}</td>
            <td>
              <div class="risk-bar">
                <div class="risk-bar-track"><i style="width:${c.risk}%; background:${riskColor(c.risk)}"></i></div>
                <span class="risk-text" style="color:${riskColor(c.risk)}">${c.risk}%</span>
              </div>
            </td>
            <td style="color:var(--text-dim)">${timeAgo(c.daysAgo)}</td>
          </tr>`;
      }).join('');
    }

    if (countEl) {
      const from = filtered.length ? start + 1 : 0;
      const to = Math.min(start + PER_PAGE, filtered.length);
      countEl.textContent = `Showing ${from}–${to} of ${formatNumber(filtered.length)} customers`;
    }

    if (pagEl) {
      let html = `<button class="page-btn" data-page="prev" ${customerPage === 1 ? 'disabled' : ''}>‹</button>`;
      for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || Math.abs(i - customerPage) <= 1) {
          html += `<button class="page-btn ${i === customerPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
        } else if (Math.abs(i - customerPage) === 2) {
          html += `<span style="color:var(--text-dim); padding:0 4px">…</span>`;
        }
      }
      html += `<button class="page-btn" data-page="next" ${customerPage === totalPages ? 'disabled' : ''}>›</button>`;
      pagEl.innerHTML = html;

      $$('.page-btn', pagEl).forEach((btn) => {
        btn.addEventListener('click', () => {
          const p = btn.getAttribute('data-page');
          if (p === 'prev' && customerPage > 1) customerPage--;
          else if (p === 'next' && customerPage < totalPages) customerPage++;
          else if (p !== 'prev' && p !== 'next') customerPage = parseInt(p, 10);
          renderCustomers();
        });
      });
    }
  }

  const customerSearch = $('#customerSearch');
  const segmentFilter = $('#segmentFilter');
  if (customerSearch) {
    let debounce;
    customerSearch.addEventListener('input', () => {
      clearTimeout(debounce);
      debounce = setTimeout(() => {
        customerPage = 1;
        renderCustomers();
      }, 200);
    });
  }
  if (segmentFilter) {
    segmentFilter.addEventListener('change', () => {
      customerPage = 1;
      renderCustomers();
    });
  }

  /* ============================================================
     CAMPAIGNS VIEW
     ============================================================ */
  function renderCampaigns() {
    const grid = $('#campaignsGrid');
    if (!grid) return;

    grid.innerHTML = CAMPAIGNS.map((c) => {
      const convRate = c.sent ? ((c.converted / c.sent) * 100).toFixed(1) : '0.0';
      const statusClass = c.status === 'active' ? 'active' : c.status === 'paused' ? 'paused' : 'draft';
      const statusLabel = c.status.charAt(0).toUpperCase() + c.status.slice(1);
      return `
        <div class="campaign-card">
          <div class="camp-head">
            <h3>${escapeHtml(c.name)}</h3>
            <span class="camp-status ${statusClass}">${statusLabel}</span>
          </div>
          <div style="font-size:12px;color:var(--text-dim);margin-bottom:14px">→ ${escapeHtml(c.segment)}</div>
          <div class="camp-meta">
            <div><strong>${formatNumber(c.sent)}</strong><span>Sent</span></div>
            <div><strong>${formatNumber(c.opened)}</strong><span>Opened</span></div>
            <div><strong>${formatNumber(c.converted)}</strong><span>Converted</span></div>
            <div><strong>${convRate}%</strong><span>CVR</span></div>
          </div>
          <div class="camp-progress">
            <div class="camp-progress-head"><span>Delivery progress</span><span>${c.progress}%</span></div>
            <div class="camp-progress-track"><i style="width:${c.progress}%"></i></div>
          </div>
          <div class="camp-foot">
            <button class="camp-btn" data-camp="${escapeHtml(c.name)}">${c.status === 'active' ? 'Pause' : 'Activate'}</button>
            <button class="camp-btn" data-camp-view="${escapeHtml(c.name)}">View Details</button>
          </div>
        </div>`;
    }).join('');

    $$('[data-camp]', grid).forEach((btn) => {
      btn.addEventListener('click', () => {
        const name = btn.getAttribute('data-camp');
        const camp = CAMPAIGNS.find((c) => c.name === name);
        if (!camp) return;
        camp.status = camp.status === 'active' ? 'paused' : 'active';
        showToast('Campaign updated', `${name} is now ${camp.status}.`, 'success');
        renderCampaigns();
      });
    });

    $$('[data-camp-view]', grid).forEach((btn) => {
      btn.addEventListener('click', () => {
        showToast('Campaign details', 'Full analytics view coming right up.', 'info');
      });
    });
  }

  /* ============================================================
     AI INSIGHTS VIEW
     ============================================================ */
  function renderInsights() {
    const grid = $('#insightsGrid');
    if (!grid) return;

    grid.innerHTML = AI_INSIGHTS.map((ins, i) => `
      <div class="insight-card" style="--insight-color:${ins.color}; animation-delay:${i * 70}ms">
        <div class="insight-head">
          <div class="insight-icon">${ins.icon}</div>
          <div>
            <h3>${escapeHtml(ins.title)}</h3>
            <span>${escapeHtml(ins.tag)}</span>
          </div>
        </div>
        <p>${escapeHtml(ins.desc)}</p>
        <div class="insight-metric">
          <strong style="color:${ins.color}">${ins.metric}</strong>
          <span>${escapeHtml(ins.metricLabel)}</span>
        </div>
        <button class="insight-action" data-insight="${escapeHtml(ins.action)}">${escapeHtml(ins.action)} →</button>
      </div>`).join('');

    $$('[data-insight]', grid).forEach((btn) => {
      btn.addEventListener('click', () => {
        showToast('Action started', `"${btn.getAttribute('data-insight')}" initiated in the background.`, 'success');
      });
    });
  }

  const runAiBtn = $('#runAiBtn');
  if (runAiBtn) {
    runAiBtn.addEventListener('click', () => {
      runAiBtn.disabled = true;
      runAiBtn.innerHTML = 'Analyzing 128,540 customers…';
      setTimeout(() => {
        runAiBtn.disabled = false;
        runAiBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg> Re-run Analysis`;
        showToast('Analysis complete', 'AI found 2 new opportunities and refreshed all insights.', 'success');
        renderInsights();
      }, 2000);
    });
  }

  /* ============================================================
     REPORTS VIEW
     ============================================================ */
  const REPORT_ICONS = {
    bar: '<path d="M3 3v18h18"/><path d="M7 14l4-4 4 3 5-6"/>',
    users: '<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>',
    trend: '<path d="M23 6l-9.5 9.5-5-5L1 18"/><path d="M17 6h6v6"/>',
    alert: '<path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><path d="M12 9v4M12 17h.01"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6l-10 7L2 6"/>',
    download: '<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
  };

  function renderReports() {
    const grid = $('#reportsGrid');
    if (!grid) return;
    grid.innerHTML = REPORTS.map((r) => `
      <div class="report-card" data-report="${escapeHtml(r.title)}">
        <div class="report-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${REPORT_ICONS[r.icon] || REPORT_ICONS.bar}</svg>
        </div>
        <h3>${escapeHtml(r.title)}</h3>
        <p>${escapeHtml(r.desc)}</p>
        <div class="report-foot">
          <span>${escapeHtml(r.updated)}</span>
          <span class="report-dl">Export
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
          </span>
        </div>
      </div>`).join('');

    $$('[data-report]', grid).forEach((card) => {
      card.addEventListener('click', () => {
        showToast('Generating report', `Preparing "${card.getAttribute('data-report')}" for download…`, 'info');
        setTimeout(() => showToast('Report ready', 'Your download has started.', 'success'), 1500);
      });
    });
  }

  /* ============================================================
     INTEGRATIONS VIEW
     ============================================================ */
  function renderIntegrations() {
    const grid = $('#integrationsGrid');
    if (!grid) return;

    grid.innerHTML = INTEGRATIONS.map((intg, i) => `
      <div class="integration-card">
        <div class="integration-logo" style="background:color-mix(in srgb, ${intg.color} 18%, transparent); color:${intg.color}">${intg.letter}</div>
        <h3>${escapeHtml(intg.name)}</h3>
        <p>${escapeHtml(intg.desc)}</p>
        <button class="integration-btn ${intg.connected ? 'connected' : ''}" data-intg="${i}">
          ${intg.connected ? '✓ Connected' : 'Connect'}
        </button>
      </div>`).join('');

    $$('[data-intg]', grid).forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-intg'), 10);
        const intg = INTEGRATIONS[idx];
        intg.connected = !intg.connected;
        showToast(
          intg.connected ? 'Integration connected' : 'Integration disconnected',
          `${intg.name} has been ${intg.connected ? 'connected to' : 'removed from'} your workspace.`,
          intg.connected ? 'success' : 'info'
        );
        renderIntegrations();
      });
    });
  }

  /* ============================================================
     SETTINGS
     ============================================================ */
  const saveSettings = $('#saveSettings');
  if (saveSettings) {
    saveSettings.addEventListener('click', () => {
      const newName = $('#setName').value.trim();
      const newEmail = $('#setEmail').value.trim();
      const newCompany = $('#setCompany').value.trim();

      if (!newName || !newEmail) {
        showToast('Missing fields', 'Name and email are required.', 'error');
        return;
      }

      const userData = {
        name: newName,
        email: newEmail,
        company: newCompany,
        plan: (storedUser && storedUser.plan) || 'Growth',
        password: (storedUser && storedUser.password) || 'demo1234',
      };

      try {
        localStorage.setItem('segmentiq_user', JSON.stringify(userData));
        const s = JSON.parse(localStorage.getItem('segmentiq_auth') || 'null');
        if (s) {
          s.user = { ...s.user, name: newName, email: newEmail };
          localStorage.setItem('segmentiq_auth', JSON.stringify(s));
        }
      } catch (e) { /* ignore */ }

      showToast('Settings saved', 'Your profile has been updated.', 'success');
      initUserUI();
    });
  }

  /* ============================================================
     MISC BUTTONS
     ============================================================ */
  const notifBtn = $('#notifBtn');
  if (notifBtn) {
    notifBtn.addEventListener('click', () => {
      showToast('Notifications', 'You have 3 unread updates. AI insights refreshed.', 'info');
    });
  }

  const upgradeBtn = $('#upgradeBtn');
  if (upgradeBtn) {
    upgradeBtn.addEventListener('click', () => {
      showToast('Upgrade to Pro AI', 'Redirecting to pricing…', 'info');
      setTimeout(() => (window.location.href = 'index.html#pricing'), 900);
    });
  }

  const globalSearch = $('#globalSearch');
  if (globalSearch) {
    globalSearch.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const q = globalSearch.value.trim();
        if (!q) return;
        switchView('customers');
        const cs = $('#customerSearch');
        if (cs) {
          cs.value = q;
          customerPage = 1;
          renderCustomers();
        }
        globalSearch.blur();
      }
    });
  }

  /* ============================================================
     INIT
     ============================================================ */
  function init() {
    initUserUI();
    initCounters();
    renderRevenueChart();
    renderDonut();
    renderTopSegments();
    renderActivity();
    renderSegmentsGrid();
    renderCustomers();
    renderCampaigns();
    renderInsights();
    renderReports();
    renderIntegrations();

    // Enter demo dashboard with an initial toast
    if (effectiveDemo) {
      setTimeout(() => {
        showToast('Demo workspace loaded', 'Explore segments, customers, campaigns and AI insights freely.', 'success');
      }, 900);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
