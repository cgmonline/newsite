async function populateForm(user) {
  if (!user) return;
  const nameInput = document.getElementById('full_name');
  if (nameInput) {
    nameInput.value = user.name || '';
  }
}

document.addEventListener('DOMContentLoaded', async function () {
  const auth0 = await window.auth0ClientPromise;
  const user = await auth0.getUser();
  populateForm(user);
  const form = document.getElementById('profile-form');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    alert('Profile updated');
    window.location.href = '/dashboard/';
  });
});
