window.auth0 = null;
window.auth0ClientPromise = createAuth0Client({
  domain: 'dev-bm83wa86bo4gmb4x.auth0.com',
  client_id: 'dAlXWEe7JLEgOTsV3LgKLHnWspb91Ozo',
  cacheLocation: 'localstorage'
}).then(client => {
  window.auth0 = client;
  return client;
});
