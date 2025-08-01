async function updateUserMenu(user) {
  const menu = document.getElementById('user-menu');
  const name = document.getElementById('user-name');
  const loginBtns = document.querySelectorAll('#login-btn');
  const signupBtns = document.querySelectorAll('#signup-btn');
  if (!menu || !name) return;
  if (user) {
    name.textContent = user.name || user.email || 'User';
    menu.classList.remove('d-none');
    loginBtns.forEach((el) => (el.style.display = 'none'));
    signupBtns.forEach((el) => (el.style.display = 'none'));
  } else {
    menu.classList.add('d-none');
    loginBtns.forEach((el) => (el.style.display = ''));
    signupBtns.forEach((el) => (el.style.display = ''));
  }
}

document.addEventListener('DOMContentLoaded', async function () {
  const auth0 = await window.auth0ClientPromise;
  updateUserMenu(await auth0.getUser());

  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async function (e) {
      e.preventDefault();
      await auth0.logout({ returnTo: window.location.origin });
      updateUserMenu(null);
    });
  }
});
