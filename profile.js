// js/profile.js

document.addEventListener('DOMContentLoaded', () => {
  const currentUser = Storage.getCurrentUser();
  if (!currentUser) return;

  renderProfile(currentUser);
});

function renderProfile(user) {
  document.getElementById('profileUsername').textContent = user.username;
  document.getElementById('profileFullName').textContent = user.fullName;
  document.getElementById('profileBio').textContent = user.bio;
  document.getElementById('profileAvatar').src = user.avatar;

  const posts = Storage.get(STORAGE_KEYS.POSTS) || [];
  const userPosts = posts.filter(p => p.userId === user.id);
  document.getElementById('postCount').textContent = userPosts.length;

  const gridContainer = document.getElementById('userPostsGrid');
  if (!gridContainer) return;

  if (userPosts.length === 0) {
    gridContainer.innerHTML = '<div class="col-span-3 text-center py-10 text-gray-400">Belum ada postingan.</div>';
    return;
  }

  let html = '';
  userPosts.forEach(post => {
    html += `
      <div class="aspect-square bg-gray-100 relative group cursor-pointer overflow-hidden">
        <img src="${post.image}" class="w-full h-full object-cover" />
      </div>
    `;
  });
  gridContainer.innerHTML = html;
}

function openEditProfile() {
  const currentUser = Storage.getCurrentUser();
  const newName = prompt('Ubah Nama Lengkap:', currentUser.fullName);
  const newBio = prompt('Ubah Bio:', currentUser.bio);

  if (newName !== null && newBio !== null) {
    currentUser.fullName = newName;
    currentUser.bio = newBio;
    Storage.setCurrentUser(currentUser);

    let users = Storage.get(STORAGE_KEYS.USERS) || [];
    users = users.map(u => u.id === currentUser.id ? currentUser : u);
    Storage.set(STORAGE_KEYS.USERS, users);

    renderProfile(currentUser);
    showToast('Profil diperbarui!');
  }
}
