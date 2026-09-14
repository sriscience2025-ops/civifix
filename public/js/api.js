/**
 * CIVICFIX - Core API Client & Authentication Layer
 * Built with Vanilla JavaScript
 */

const API = {
  BASE_URL: '', // relative to origin, routes through proxy to Spring Boot

  getToken() {
    return localStorage.getItem('civicfix_token');
  },

  getUser() {
    const raw = localStorage.getItem('civicfix_user');
    try {
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  },

  setAuth(token, user) {
    localStorage.setItem('civicfix_token', token);
    localStorage.setItem('civicfix_user', JSON.stringify(user));
  },

  clearAuth() {
    localStorage.removeItem('civicfix_token');
    localStorage.removeItem('civicfix_user');
  },

  isAuthenticated() {
    return !!this.getToken();
  },

  hasRole(roleName) {
    const user = this.getUser();
    if (!user || !user.role) return false;
    const cleanRole = user.role.replace('ROLE_', '');
    const cleanTarget = roleName.replace('ROLE_', '');
    return cleanRole === cleanTarget;
  },

  getRoleRedirectUrl(role) {
    if (!role) return '/login.html';
    const r = role.replace('ROLE_', '');
    switch (r) {
      case 'CITIZEN': return '/citizen/dashboard.html';
      case 'DEPARTMENT_OFFICER': return '/officer/dashboard.html';
      case 'FIELD_WORKER': return '/worker/dashboard.html';
      case 'ADMIN': return '/admin/dashboard.html';
      default: return '/index.html';
    }
  },

  async request(endpoint, options = {}) {
    const url = `${this.BASE_URL}${endpoint}`;
    const headers = { ...options.headers };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (!(options.body instanceof FormData) && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (response.status === 401) {
        // Unauthorized
        console.warn('Session expired or unauthorized');
      }

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const errorMsg = (data && data.message) || `HTTP error ${response.status}`;
        throw new Error(errorMsg);
      }

      return data;
    } catch (err) {
      console.error(`API Error on [${endpoint}]:`, err.message);
      throw err;
    }
  },

  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  },

  async post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  },

  async put(endpoint, body) {
    return this.request(endpoint, {
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  },

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  },

  // Auth Operations
  async login(email, password) {
    const res = await this.post('/api/auth/login', { email, password });
    if (res.success && res.data) {
      this.setAuth(res.data.token, res.data);
    }
    return res;
  },

  async register(data) {
    const res = await this.post('/api/auth/register', data);
    if (res.success && res.data) {
      this.setAuth(res.data.token, res.data);
    }
    return res;
  },

  logout() {
    this.clearAuth();
    window.location.href = '/login.html';
  },

  // Image Upload
  async uploadImage(file) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await this.post('/api/upload/image', formData);
    return res.data ? (res.data.fileUrl || res.data.url) : null;
  }
};

/**
 * Toast Notification system
 */
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Global expose
window.API = API;
window.showToast = showToast;
