console.log('🔧 Initializing header authentication...');
class HeaderAuth {
  constructor() {
    this.isInitialized = false;
    this.currentUser = null;
    this.elements = {};
    this.init();
  }
  async init() {
    // Get DOM elements
    this.elements = {
      authLoading: document.getElementById('auth-loading'),
      authButtons: document.getElementById('auth-buttons'),
      userMenu: document.getElementById('user-menu'),
      userName: document.getElementById('user-name'),
      loginBtn: document.getElementById('login-btn'),
      signupBtn: document.getElementById('signup-btn'),
      logoutBtn: document.getElementById('logout-btn'),
      userDropdownBtn: document.getElementById('user-dropdown-btn')
    };
    // Show loading state
    this.showLoading();
    try {
      // Wait for Auth0 to be ready
      const auth0Client = await window.auth0ClientPromise;
      console.log('✅ Auth0 client ready');
      // Check authentication status
      await this.checkAuthStatus(auth0Client);
      // Set up event listeners
      this.setupEventListeners(auth0Client);
      this.isInitialized = true;
      console.log('✅ Header auth initialized');
    } catch (error) {
      console.error('❌ Header auth initialization failed:', error);
      this.showError();
    }
  }
  async checkAuthStatus(auth0Client) {
    try {
      const isAuthenticated = await auth0Client.isAuthenticated();
      if (isAuthenticated) {
        const user = await auth0Client.getUser();
        this.updateUIForUser(user);
      } else {
        // Check if we just came back from callback
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('code') && urlParams.has('state')) {
          // We're on a callback - wait a moment for processing
          setTimeout(async () => {
            const user = await auth0Client.getUser();
            if (user) {
              this.updateUIForUser(user);
            } else {
              this.updateUIForGuest();
            }
          }, 1000);
        } else {
          this.updateUIForGuest();
        }
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      this.updateUIForGuest();
    }
  }
  updateUIForUser(user) {
    console.log('👤 User authenticated:', user?.email);
    this.currentUser = user;
    // Hide loading and auth buttons
    this.hideLoading();
    if (this.elements.authButtons) {
      this.elements.authButtons.style.display = 'none';
    }
    // Show user menu
    if (this.elements.userMenu) {
      this.elements.userMenu.style.display = 'block';
      this.elements.userMenu.classList.remove('d-none');
    }
    // Update user name
    if (this.elements.userName && user) {
      this.elements.userName.textContent = user.name || user.email || 'User';
    }
  }
  updateUIForGuest() {
    console.log('👤 User not authenticated');
    this.currentUser = null;
    // Hide loading and user menu
    this.hideLoading();
    if (this.elements.userMenu) {
      this.elements.userMenu.style.display = 'none';
      this.elements.userMenu.classList.add('d-none');
    }
    // Show auth buttons
    if (this.elements.authButtons) {
      this.elements.authButtons.style.display = 'flex';
    }
  }
  setupEventListeners(auth0Client) {
    // Login button
    if (this.elements.loginBtn) {
      this.elements.loginBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        this.showLoading();
        // Store current page to return to after login
        sessionStorage.setItem('auth0_return_to', window.location.pathname);
        try {
          await auth0Client.loginWithRedirect({
            authorizationParams: {
              redirect_uri: window.location.origin + '/callback/'
            }
          });
        } catch (error) {
          console.error('Login failed:', error);
          this.hideLoading();
        }
      });
    }
    // Signup button
    if (this.elements.signupBtn) {
      this.elements.signupBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        this.showLoading();
        sessionStorage.setItem('auth0_return_to', window.location.pathname);
        try {
          await auth0Client.loginWithRedirect({
            authorizationParams: {
              redirect_uri: window.location.origin + '/callback/',
              screen_hint: 'signup'
            }
          });
        } catch (error) {
          console.error('Signup failed:', error);
          this.hideLoading();
        }
      });
    }
    // Logout button
    if (this.elements.logoutBtn) {
      this.elements.logoutBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        this.showLoading();
        try {
          await auth0Client.logout({
            logoutParams: { returnTo: window.location.origin }
          });
        } catch (error) {
          console.error('Logout failed:', error);
          // Force logout by clearing localStorage and redirecting
          localStorage.clear();
          window.location.href = '/';
        }
      });
    }
    // User dropdown toggle
    if (this.elements.userDropdownBtn) {
      this.elements.userDropdownBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const dropdown = document.getElementById('user-dropdown');
        if (dropdown) {
          dropdown.classList.toggle('show');
        }
      });
    }
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('#user-menu')) {
        const dropdown = document.getElementById('user-dropdown');
        if (dropdown) {
          dropdown.classList.remove('show');
        }
      }
    });
  }
  showLoading() {
    if (this.elements.authLoading) {
      this.elements.authLoading.style.display = 'block';
    }
    if (this.elements.authButtons) {
      this.elements.authButtons.style.display = 'none';
    }
  }
  hideLoading() {
    if (this.elements.authLoading) {
      this.elements.authLoading.style.display = 'none';
    }
  }
  showError() {
    this.hideLoading();
    console.error('Auth system unavailable');
    // Could show a message to user here if needed
  }
}
// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new HeaderAuth();
  });
} else {
  new HeaderAuth();
}
// Also listen for Auth0 ready event as backup
window.addEventListener('auth0Ready', () => {
  if (!window.headerAuth || !window.headerAuth.isInitialized) {
    window.headerAuth = new HeaderAuth();
  }
});

