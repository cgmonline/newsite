window.addEventListener('DOMContentLoaded', async () => {
  const client = await window.auth0ClientPromise;
  if (window.location.search.includes('code=') &&
      window.location.search.includes('state=')) {
    try {
      await client.handleRedirectCallback();
      const user = await client.getUser();
      updateUserMenu(user);
      // remove code and state query parameters to keep URL clean
      window.history.replaceState({}, document.title, window.location.pathname);
      displayUserInfo(user);
    } catch (err) {
      console.error('Auth0 callback processing failed', err);
    }
  } else {
    window.location.replace('/');
  }
});

function displayUserInfo(user) {
  const container = document.getElementById("user-info");
  if (!container || !user) return;
  container.innerHTML = `<h2>Welcome, ${user.name || user.email}</h2>\n<pre>${JSON.stringify(user, null, 2)}</pre>`;
}

