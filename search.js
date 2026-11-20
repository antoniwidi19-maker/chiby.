// js/search.js

function openSearch(e) {
  if (e) e.preventDefault();
  let modal = document.getElementById('searchModalGlobal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'searchModalGlobal';
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
      <div class="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl h-3/4 flex flex-col">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-bold text-lg">Pencarian</h3>
          <button onclick="closeSearchModal()" class="text-xl">✕</button>
        </div>
        <input type="text" id="searchInputQuery" placeholder="Cari username atau caption..." class="w-full border rounded-xl p-3 text-sm focus:outline-none mb-4" oninput="handleSearchInput(event)" />
        <div id="searchResults" class="overflow-y-auto flex-1 space-y-3"></div>
      </div>
    `;
    document.body.appendChild(modal);
  }
  modal.classList.remove('hidden');
}

function closeSearchModal() {
  const modal = document.getElementById('searchModalGlobal');
  if (modal) modal.classList.add('hidden');
}

function handleSearchInput(e) {
  const query = e.target.value.toLowerCase();
  const resultsContainer = document.getElementById('searchResults');
  if (!query) {
    resultsContainer.innerHTML = '';
    return;
  }

  const users = Storage.get(STORAGE_KEYS.USERS) || [];
  const posts = Storage.get(STORAGE_KEYS.POSTS) || [];

  const matchedUsers = users.filter(u => u.username.toLowerCase().includes(query) || u.fullName.toLowerCase().includes(query));
  const matchedPosts = posts.filter(p => p.caption.toLowerCase().includes(query) || p.username.toLowerCase().includes(query));

  let html = '<h4 class="text-xs font-semibold text-gray-400 uppercase">Pengguna</h4>';
  matchedUsers.forEach(u => {
    html += `
      <div class="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-xl cursor-pointer">
        <img src="${u.avatar}" class="w-10 h-10 rounded-full object-cover" />
        <div>
          <p class="font-semibold text-sm">${u.username}</p>
          <p class="text-xs text-gray-400">${u.fullName}</p>
        </div>
      </div>
    `;
  });

  html += '<h4 class="text-xs font-semibold text-gray-400 uppercase mt-4">Postingan</h4>';
  matchedPosts.forEach(p => {
    html += `
      <div class="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-xl cursor-pointer">
        <img src="${p.image}" class="w-10 h-10 rounded-xl object-cover" />
        <p class="text-sm truncate">${p.caption}</p>
      </div>
    `;
  });

  resultsContainer.innerHTML = html;
}
