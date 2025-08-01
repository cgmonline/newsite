window.addEventListener("DOMContentLoaded", async () => {
  const statusEl = document.getElementById("callback-status");
  const setStatus = (msg) => {
    if (statusEl) statusEl.textContent = msg;
  };

  let client;
  try {
    client = await window.auth0ClientPromise;
  } catch (err) {
    console.error("Auth0 failed to initialize", err);
    setStatus("Authentication service unavailable.");
    return;
  }

  const params = new URLSearchParams(window.location.search);
  if (params.has("code") && params.has("state")) {
    setStatus("Processing login...");
    try {
      await client.handleRedirectCallback();
      const user = await client.getUser();
      updateUserMenu(user);
      window.history.replaceState({}, document.title, window.location.pathname);
      displayUserInfo(user);
      setStatus("Logged in");
    } catch (err) {
      console.error("Auth0 callback processing failed", err);
      setStatus("Login failed.");
    }
  } else {
    setStatus("Invalid callback parameters.");
    window.location.replace("/");
  }
});

function displayUserInfo(user) {
  const container = document.getElementById("user-info");
  if (!container || !user) return;
  container.innerHTML = `<h2>Welcome, ${
    user.name || user.email
  }</h2>\n<pre>${JSON.stringify(user, null, 2)}</pre>`;
}
