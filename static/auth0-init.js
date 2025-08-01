(function () {
  const fallback = window._env_ || {};
  const domain = window.AUTH0_DOMAIN || fallback.AUTH0_DOMAIN;
  const clientId = window.AUTH0_CLIENT_ID || fallback.AUTH0_CLIENT_ID;

  if (!domain || !clientId) {
    console.error("Missing Auth0 configuration: AUTH0_DOMAIN or AUTH0_CLIENT_ID");
    return;
  }

  // Helper to detect if we're on the /callback/ page
  function isOnCallbackPage() {
    return (
      window.location.pathname === "/callback/" &&
      window.location.search.includes("code=") &&
      window.location.search.includes("state=")
    );
  }

  // Initialize the client and handle redirect if on callback page
  window.auth0ClientPromise = createAuth0Client({
    domain,
    client_id: clientId,
    cacheLocation: "localstorage",
    useRefreshTokens: true,
    redirect_uri: window.location.origin + "/callback/",
  })
    .then(async (client) => {
      window.auth0 = client;
      window.dispatchEvent(new Event("auth0-ready"));
      window.dispatchEvent(new Event("auth0Ready"));

      if (isOnCallbackPage()) {
        try {
          console.log("🔄 Handling Auth0 redirect callback...");
          await client.handleRedirectCallback();

          const user = await client.getUser();
          console.log("✅ Login complete. User:", user);

          const returnTo = sessionStorage.getItem("auth0_return_to") || "/";
          sessionStorage.removeItem("auth0_return_to");

          // Optional: show user info or redirect
          const statusEl = document.getElementById("callback-status");
          if (statusEl) {
            statusEl.textContent = `欢迎您, ${user.name || user.email}`;
          }

          // Short delay to let UI update before redirect
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
