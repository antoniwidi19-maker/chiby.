// js/app.js

document.addEventListener('DOMContentLoaded', () => {
  const currentUser = Storage.getCurrentUser();
  if (!currentUser) return;

  // Inject Navigasi Sidebar / Bottom Nav
  renderNavigation();
});

function renderNavigation() {
  const navContainer = document.getElementById('navigationContainer');
  if (!navContainer) return;

  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  const navItems = [
    { name: 'Home', icon: '🏠', href: 'index.html' },
    { name: 'Search', icon: '🔍', href: '#searchModal', action: 'openSearch' },
    { name: 'Explore', icon: '🧭', href: 'explore.html' },
    { name: 'Create', icon: '➕', href: '#uploadModal', action: 'openUpload' },
    { name: 'Notifications', icon: '❤️', href: 'notifications.html' },
    { name: 'Profile', icon: '👤', href: 'profile.html' }
  ];

  let html = `
    <div class="desktop-sidebar hidden md:flex flex-col justify-between p-6 border-r border-gray-200 h-screen sticky top-0 bg-white w-64">
      <div>
        <h1 class="text-2xl font-bold tracking-wider mb-8 font-serif">INSTAN</h1>
        <nav class="space-y-4">
  `;

  navItems.forEach(item => {
    const active = currentPath === item.href ? 'font-bold bg-gray-100 rounded-xl' : '';
    html += `<a href="${item.href}" class="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition ${active}" ${item.action ? `onclick="${item.action}(event)"` : ''}><span class="text-xl">${item.icon}</span> <span>${item.name}</span></a>`;
  });

  html += `
        </nav>
      </div>
      <button id="sidebarLogout" class="flex items-center gap-4 p-3 text-red-500 hover:bg-red-50 rounded-xl transition"><span>🚪</span> <span>Keluar</span></button>
    </div>

    <div class="mobile-bottom-nav md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16 z-50">
  `;

  navItems.forEach(item => {
    html += `<a href="${item.href}" class="text-2xl p-2" ${item.action ? `onclick="${item.action}(event)"` : ''}>${item.icon}</a>`;
  });

  html += `</div>`;

  navContainer.innerHTML = html;

  document.getElementById('sidebarLogout')?.addEventListener('click', () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    window.location.href = 'login.html';
  });
}

function showToast(message) {
  let toast = document.getElementById('toastNotification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastNotification';
    toast.className = 'fixed bottom-20 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded-full text-sm shadow-lg z-50 transition-opacity duration-300';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.opacity = '1';
  setTimeout(() => {
    toast.style.opacity = '0';
  }, 3000);
}
