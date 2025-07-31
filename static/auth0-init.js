window.auth0 = null;
window.auth0ClientPromise = createAuth0Client({
  domain: window.AUTH0_DOMAIN,
  client_id: window.AUTH0_CLIENT_ID,
  cacheLocation: 'localstorage',
  authorizationParams: {
    redirect_uri: window.location.origin
  }
}).then(client => {
  window.auth0 = client;
  return client;
});
