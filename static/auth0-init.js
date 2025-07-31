window.auth0 = null;
window.auth0ClientPromise = createAuth0Client({
  domain: 'YOUR_AUTH0_DOMAIN',
  client_id: 'YOUR_AUTH0_CLIENT_ID',
  cacheLocation: 'localstorage'
}).then(client => {
  window.auth0 = client;
  return client;
});
