(function () {
  const fallback = window._env_ || {};
  const domain = window.AUTH0_DOMAIN || fallback.AUTH0_DOMAIN;
  const clientId = window.AUTH0_CLIENT_ID || fallback.AUTH0_CLIENT_ID;

  if (!domain || !clientId) {
    console.error(
      "Missing Auth0 configuration: AUTH0_DOMAIN or AUTH0_CLIENT_ID"
    );
    return;
  }

  window.auth0ClientPromise = createAuth0Client({
    domain,
    client_id: clientId,
    cacheLocation: "localstorage",
    redirect_uri: window.location.origin + "/callback/",
  })
    .then((client) => {
      window.auth0 = client;
      window.dispatchEvent(new Event("auth0-ready"));
      return client;
    })
    .catch((err) => {
      console.error("Error initializing Auth0:", err);
      throw err;
    });
})();
