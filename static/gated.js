(async function() {
  const auth0 = await window.auth0ClientPromise;
  const isAuthenticated = await auth0.isAuthenticated();
  if (isAuthenticated) {
    showAuthenticatedContent();
  } else {
    showUnauthenticatedContent();
  }

  document.getElementById('login-btn').addEventListener('click', async () => {
    await auth0.loginWithRedirect({
      authorizationParams: {
        redirect_uri: window.location.origin
      }
    });
  });

  document.getElementById('logout-btn').addEventListener('click', async () => {
    await auth0.logout({ returnTo: window.location.origin });
    showUnauthenticatedContent();
  });
})();

function showAuthenticatedContent() {
  document.getElementById('authenticated-content').style.display = 'block';
  document.getElementById('unauthenticated-content').style.display = 'none';
}

function showUnauthenticatedContent() {
  document.getElementById('authenticated-content').style.display = 'none';
  document.getElementById('unauthenticated-content').style.display = 'block';
}
