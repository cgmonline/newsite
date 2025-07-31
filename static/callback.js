window.addEventListener('DOMContentLoaded', async () => {
  const client = await window.auth0ClientPromise;
  if (window.location.search.includes('code=') &&
      window.location.search.includes('state=')) {
    try {
      const { appState } = await client.handleRedirectCallback();
      // remove code and state query parameters to keep URL clean
      window.history.replaceState({}, document.title, '/');
      const target = (appState && appState.targetUrl) || '/homepage';
      window.location.replace(target);
    } catch (err) {
      console.error('Auth0 callback processing failed', err);
    }
  } else {
    window.location.replace('/homepage');
  }
});
