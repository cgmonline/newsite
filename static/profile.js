const netlifyIdentity = window.netlifyIdentity;

function populateForm(user) {
  if (!user) return;
  const nameInput = document.getElementById('full_name');
  if (nameInput) {
    nameInput.value = user.user_metadata && user.user_metadata.full_name ? user.user_metadata.full_name : '';
  }
}

if (netlifyIdentity) {
  netlifyIdentity.on('init', user => populateForm(user));
  netlifyIdentity.on('login', user => populateForm(user));
  netlifyIdentity.init();
}

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('profile-form');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const user = netlifyIdentity && netlifyIdentity.currentUser();
    if (!user) return;
    const fullName = document.getElementById('full_name').value;
    user.update({ data: { full_name: fullName } })
      .then(() => alert('Profile updated'))
      .catch(err => console.error('Profile update failed', err));
  });
});

