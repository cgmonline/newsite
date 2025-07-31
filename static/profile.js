// File: static/profile.js
// Handles showing and updating user profile via Netlify Identity

function initProfile() {
  const identity = window.netlifyIdentity;
  const msg = document.getElementById('welcome-message');
  const form = document.getElementById('profile-form');
  const nameInput = document.getElementById('full-name');

  if (!identity || !msg || !form || !nameInput) return;

  const user = identity.currentUser();
  if (user) {
    msg.textContent = `Logged in as ${user.email}`;
    nameInput.value = user.user_metadata && user.user_metadata.full_name ? user.user_metadata.full_name : '';
    form.style.display = 'block';
  } else {
    msg.textContent = 'Please log in to edit your profile.';
    form.style.display = 'none';
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const newName = nameInput.value;
    const currentUser = identity.currentUser();
    if (!currentUser) return;
    currentUser.update({ data: { full_name: newName } })
      .then(function(updated) {
        msg.textContent = `Profile updated for ${updated.email}`;
      })
      .catch(function(err) {
        alert(err.message || 'Profile update failed');
      });
  });

  identity.on('login', () => location.reload());
  identity.on('logout', () => location.reload());
}

document.addEventListener('DOMContentLoaded', initProfile);
