window.auth0 = null;
window.auth0ClientPromise = createAuth0Client({
  domain: window.AUTH0_DOMAIN,
  client_id: window.AUTH0_CLIENT_ID,
  cacheLocation: 'localstorage',
  authorizationParams: {
    redirect_uri: window.location.origin,
  },
}).then(async (client) => {
  window.auth0 = client;
  // Handle the login redirect from Auth0
  if (window.location.search.includes('code=') &&
      window.location.search.includes('state=')) {
    try {
      await client.handleRedirectCallback();
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (err) {
      console.error('Auth0 callback error', err);
    }
  }
  return client;
});
