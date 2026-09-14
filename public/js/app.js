/**
 * CIVICFIX - Core Application UI Helpers & Shared State
 */

const App = {
  init() {
    this.renderHeader();
    this.renderRoleBar();
    this.setupNotificationBell();
  },

  renderRoleBar() {
    let bar = document.getElementById('demo-role-bar');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'demo-role-bar';
      bar.className = 'demo-role-bar';
      document.body.prepend(bar);
    }

    bar.innerHTML = `
      <div class="container demo-role-bar-inner">
        <div>
          <strong>CIVICFIX PROD:</strong> 1-Click Role Switcher & Live Testing
        </div>
        <div class="demo-chips">
          <button class="demo-chip" onclick="App.quickLogin('citizen@civicfix.com', 'password123', 'ROLE_CITIZEN')">👤 Citizen (Alex)</button>
          <button class="demo-chip" onclick="App.quickLogin('officer.roads@civicfix.com', 'password123', 'ROLE_DEPARTMENT_OFFICER')">👮 Officer (Roads)</button>
          <button class="demo-chip" onclick="App.quickLogin('worker.roads@civicfix.com', 'password123', 'ROLE_FIELD_WORKER')">🛠️ Worker (Rajesh)</button>
          <button class="demo-chip" onclick="App.quickLogin('admin@civicfix.com', 'password123', 'ROLE_ADMIN')">🏛️ Admin (Sarah)</button>
        </div>
      </div>
    `;
  },

  async quickLogin(email, password, role) {
    try {
      showToast(`Switching session to ${email}...`, 'info');
      const res = await API.login(email, password);
      if (res.success) {
        showToast(`Signed in as ${res.data.fullName}`, 'success');
        setTimeout(() => {
          window.location.href = API.getRoleRedirectUrl(role);
        }, 500);
      }
    } catch (err) {
      showToast(`Login failed: ${err.message}`, 'error');
    }
  },

  renderHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    const user = API.getUser();
    const isAuth = API.isAuthenticated();

    let authSection = '';
    if (isAuth && user) {
      const cleanRole = (user.role || '').replace('ROLE_', '').replace('_', ' ');
      const dashUrl = API.getRoleRedirectUrl(user.role);

      authSection = `
        <div class="nav-auth">
          <div style="position:relative;">
            <button id="notif-btn" class="btn btn-secondary btn-sm" title="Notifications" style="position:relative; padding: 6px 12px;">
              🔔 <span id="notif-count" style="display:none; position:absolute; top:-6px; right:-6px; background:#dc2626; color:#fff; font-size:10px; font-weight:700; border-radius:999px; padding:2px 6px;">0</span>
            </button>
            <div id="notif-dropdown" style="display:none; position:absolute; right:0; top:42px; width:340px; background:#fff; border:1px solid #e2e8f0; border-radius:10px; box-shadow:0 10px 25px rgba(0,0,0,0.1); z-index:110; max-height:400px; overflow-y:auto; padding:12px;">
              <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #e2e8f0; padding-bottom:8px; margin-bottom:8px;">
                <strong style="font-size:0.9rem;">Notifications</strong>
                <button onclick="App.markAllNotificationsRead()" style="background:none; border:none; color:#1d4ed8; font-size:0.75rem; cursor:pointer;">Mark all read</button>
              </div>
              <div id="notif-list" style="font-size:0.85rem; color:#64748b;">Loading notifications...</div>
            </div>
          </div>
          <a href="${dashUrl}" class="btn btn-primary btn-sm">Portal: ${user.fullName.split(' ')[0]} (${cleanRole})</a>
          <button onclick="API.logout()" class="btn btn-secondary btn-sm" title="Sign Out">Sign Out</button>
        </div>
      `;
    } else {
      authSection = `
        <div class="nav-auth">
          <a href="/login.html" class="btn btn-secondary btn-sm">Sign In</a>
          <a href="/register.html" class="btn btn-primary btn-sm">Citizen Register</a>
        </div>
      `;
    }

    header.innerHTML = `
      <div class="container header-inner">
        <a href="/index.html" class="brand">
          <div class="brand-icon">CF</div>
          <div>
            <div>CIVICFIX</div>
            <div class="brand-tagline">Report. Track. Resolve.</div>
          </div>
        </a>
        <ul class="nav-links">
          <li class="nav-item"><a href="/index.html" id="nav-home">Home</a></li>
          <li class="nav-item"><a href="/index.html#tracker" id="nav-track">Track Ticket</a></li>
          <li class="nav-item"><a href="/index.html#recent" id="nav-recent">Public Issues</a></li>
          <li class="nav-item"><a href="/citizen/dashboard.html" id="nav-report">Report Issue</a></li>
        </ul>
        ${authSection}
      </div>
    `;

    this.checkActiveNav();
  },

  checkActiveNav() {
    const path = window.location.pathname;
    if (path.includes('citizen')) {
      const el = document.getElementById('nav-report');
      if (el) el.classList.add('active');
    } else if (path.includes('index') || path === '/') {
      const el = document.getElementById('nav-home');
      if (el) el.classList.add('active');
    }
  },

  async setupNotificationBell() {
    if (!API.isAuthenticated()) return;
    const btn = document.getElementById('notif-btn');
    const dropdown = document.getElementById('notif-dropdown');
    if (!btn || !dropdown) return;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
      if (dropdown.style.display === 'block') {
        this.loadNotifications();
      }
    });

    document.addEventListener('click', () => {
      if (dropdown) dropdown.style.display = 'none';
    });

    dropdown.addEventListener('click', (e) => e.stopPropagation());

    // Check count
    try {
      const res = await API.get('/api/notifications/unread-count');
      if (res.success && res.data) {
        const count = res.data.unreadCount || 0;
        const badge = document.getElementById('notif-count');
        if (badge) {
          if (count > 0) {
            badge.textContent = count > 99 ? '99+' : count;
            badge.style.display = 'inline-block';
          } else {
            badge.style.display = 'none';
          }
        }
      }
    } catch (e) {
      // quiet fail
    }
  },

  async loadNotifications() {
    const listEl = document.getElementById('notif-list');
    if (!listEl) return;
    try {
      const res = await API.get('/api/notifications');
      if (res.success && res.data) {
        if (res.data.length === 0) {
          listEl.innerHTML = '<div style="text-align:center; padding:12px;">No notifications yet</div>';
          return;
        }

        listEl.innerHTML = res.data.slice(0, 10).map(n => `
          <div style="padding:8px 6px; border-bottom:1px solid #f1f5f9; ${!n.isRead ? 'background:#eff6ff; font-weight:600;' : ''}">
            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
              <span style="color:#0f172a; font-size:0.85rem;">${n.title}</span>
              <span style="font-size:0.7rem; color:#94a3b8;">${App.timeAgo(n.createdAt)}</span>
            </div>
            <div style="font-size:0.78rem; color:#475569; margin-top:2px;">${n.message}</div>
          </div>
        `).join('');
      }
    } catch (e) {
      listEl.innerHTML = '<div style="color:#dc2626;">Failed to load notifications</div>';
    }
  },

  async markAllNotificationsRead() {
    try {
      await API.put('/api/notifications/read-all', {});
      const badge = document.getElementById('notif-count');
      if (badge) badge.style.display = 'none';
      this.loadNotifications();
      showToast('All notifications marked as read', 'success');
    } catch (e) {
      showToast('Error marking notifications', 'error');
    }
  },

  renderStatusBadge(status) {
    if (!status) return '';
    const label = status.replace(/_/g, ' ');
    return `<span class="badge badge-${status}">${label}</span>`;
  },

  renderPriorityBadge(priority) {
    if (!priority) return '';
    return `<span class="badge badge-${priority}">${priority}</span>`;
  },

  renderStepper(currentStatus) {
    const steps = [
      { key: 'SUBMITTED', label: 'Submitted' },
      { key: 'UNDER_REVIEW', label: 'Review' },
      { key: 'ASSIGNED', label: 'Assigned' },
      { key: 'IN_PROGRESS', label: 'In Progress' },
      { key: 'VERIFICATION_PENDING', label: 'Verifying' },
      { key: 'RESOLVED', label: 'Resolved' },
      { key: 'CLOSED', label: 'Closed' }
    ];

    const orderMap = {
      'SUBMITTED': 1,
      'UNDER_REVIEW': 2,
      'ASSIGNED': 3,
      'IN_PROGRESS': 4,
      'VERIFICATION_PENDING': 5,
      'RESOLVED': 6,
      'CLOSED': 7,
      'REOPENED': 3, // looped back
      'REJECTED': 0
    };

    const currentIdx = orderMap[currentStatus] || 1;

    let html = '<div class="stepper">';
    steps.forEach((step, idx) => {
      const stepIdx = idx + 1;
      let cls = '';
      if (currentStatus === 'REOPENED' && step.key === 'ASSIGNED') {
        cls = 'active';
      } else if (stepIdx < currentIdx || (currentIdx === 6 && stepIdx <= 6) || (currentIdx === 7)) {
        cls = 'completed';
      } else if (stepIdx === currentIdx) {
        cls = 'active';
      }

      html += `
        <div class="stepper-step ${cls}">
          <div class="stepper-icon">${cls === 'completed' ? '✓' : (idx + 1)}</div>
          <div class="stepper-label">${step.label}</div>
        </div>
      `;
    });
    html += '</div>';
    return html;
  },

  formatDate(iso) {
    if (!iso) return 'N/A';
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  timeAgo(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    const now = new Date();
    const diffSec = Math.floor((now - d) / 1000);
    if (diffSec < 60) return 'just now';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) return `${diffDays}d ago`;
    return d.toLocaleDateString();
  }
};

window.App = App;
document.addEventListener('DOMContentLoaded', () => App.init());
