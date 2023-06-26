// Initialize Netlify Identity
const netlifyIdentity = window.netlifyIdentity;
netlifyIdentity.init();

// Check if user is already authenticated
if (netlifyIdentity.currentUser()) {
  showAuthenticatedContent();
} else {
  showUnauthenticatedContent();
}

// Show authenticated content and set up logout button
function showAuthenticatedContent() {
  document.getElementById('authenticated-content').style.display = 'block';
  document.getElementById('unauthenticated-content').style.display = 'none';

  // Logout button event listener
  document.getElementById('logout-btn').addEventListener('click', () => {
    netlifyIdentity.logout();
    showUnauthenticatedContent();
  });
}

// Show unauthenticated content and set up login button
function showUnauthenticatedContent() {
  document.getElementById('authenticated-content').style.display = 'none';
  document.getElementById('unauthenticated-content').style.display = 'block';

  // Login button event listener
  document.getElementById('login-btn').addEventListener('click', () => {
    netlifyIdentity.open();
  });
}

// Listen for authentication events
netlifyIdentity.on('login', () => {
  showAuthenticatedContent();
});

netlifyIdentity.on('logout', () => {
  showUnauthenticatedContent();
});
