(function () {
  const fallback = window._env_ || {};
  const domain = window.AUTH0_DOMAIN || fallback.AUTH0_DOMAIN;
  const clientId = window.AUTH0_CLIENT_ID || fallback.AUTH0_CLIENT_ID;

  if (!domain || !clientId) {
    console.error("Missing Auth0 configuration: AUTH0_DOMAIN or AUTH0_CLIENT_ID");
    return;
  }

  // Define all callback paths to support
  const allowedCallbackPaths = [
    "/callback/",
    "/admin/callback/",
    "/user/callback/",
    "/dashboard/callback/"
  ];

  // Detect if current URL is a callback URL with Auth0 query params
  function isOnCallbackPage() {
    return (
      allowedCallbackPaths.includes(window.location.pathname) &&
      window.location.search.includes("code=") &&
      window.location.search.includes("state=")
    );
  }

  // Use current path for redirect URI, so it's role-aware
  const redirectUri = window.location.origin + window.location.pathname;

  // Initialize the Auth0 client globally
  window.auth0ClientPromise = createAuth0Client({
    domain,
    client_id: clientId,
    cacheLocation: "localstorage",
    useRefreshTokens: true,
    redirect_uri: redirectUri,
  })
    .then(async (client) => {
      window.auth0 = client;
      window.dispatchEvent(new Event("auth0-ready"));
      window.dispatchEvent(new Event("auth0Ready"));

      // Handle callback flow if applicable
      if (isOnCallbackPage()) {
        try {
          console.log("🔄 Handling Auth0 redirect callback...");
          await client.handleRedirectCallback();

          const user = await client.getUser();
          console.log("✅ Login complete. User:", user);

          const returnTo = sessionStorage.getItem("auth0_return_to") || "/";
          sessionStorage.removeItem("auth0_return_to");

          const statusEl = document.getElementById("callback-status");
          if (statusEl) {
            statusEl.textContent = `欢迎您, ${user.name || user.email}`;
          }

          setTimeout(() => {
            window.location.href = returnTo;
          }, 1000);

        } catch (err) {
          console.error("❌ Error handling Auth0 callback:", err);
          const statusEl = document.getElementById("callback-status");
          if (statusEl) {
            statusEl.textContent = "登录失败，请重试。";
          }
        }
      }

      return client;
    })
    .catch((err) => {
      console.error("Error initializing Auth0:", err);
      throw err;
    });
})();