const netlifyIdentity = window.netlifyIdentity;

function updateUserMenu(user) {
  const menu = document.getElementById('user-menu');
  const name = document.getElementById('user-name');
  const loginBtn = document.getElementById('login-btn');
  const signupBtn = document.getElementById('signup-btn');
  if (!menu || !name) return;
  if (user) {
    name.textContent = user.user_metadata && user.user_metadata.full_name ? user.user_metadata.full_name : user.email;
    menu.classList.remove('d-none');
    if (loginBtn) loginBtn.style.display = 'none';
    if (signupBtn) signupBtn.style.display = 'none';
  } else {
    menu.classList.add('d-none');
    if (loginBtn) loginBtn.style.display = '';
    if (signupBtn) signupBtn.style.display = '';
  }
}

if (netlifyIdentity) {
  netlifyIdentity.on('init', user => updateUserMenu(user));
  netlifyIdentity.on('login', user => updateUserMenu(user));
  netlifyIdentity.on('logout', () => updateUserMenu(null));
  netlifyIdentity.init();
}

document.addEventListener('DOMContentLoaded', function () {
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function (e) {
      e.preventDefault();
      if (netlifyIdentity) {
        netlifyIdentity.logout();
      }
    });
  }
});
