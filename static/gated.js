(async function() {
  const auth0 = await window.auth0ClientPromise;
  const isAuthenticated = await auth0.isAuthenticated();
  if (isAuthenticated) {
    showAuthenticatedContent();
  } else {
    showUnauthenticatedContent();
  }

  const loginBtn = document.getElementById('login-btn');
  if (loginBtn) {
    loginBtn.addEventListener('click', async () => {
      await auth0.loginWithRedirect({
        authorizationParams: {
          // Send users to the Auth0 callback page after authentication
          redirect_uri: window.location.origin + '/callback/'
        }
      });
    });
  }

  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await auth0.logout({ returnTo: window.location.origin });
      showUnauthenticatedContent();
    });
  }
})();

function showAuthenticatedContent() {
  document.getElementById('authenticated-content').style.display = 'block';
  document.getElementById('unauthenticated-content').style.display = 'none';
}

function showUnauthenticatedContent() {
  document.getElementById('authenticated-content').style.display = 'none';
  document.getElementById('unauthenticated-content').style.display = 'block';
}
