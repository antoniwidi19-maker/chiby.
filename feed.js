// js/feed.js

document.addEventListener('DOMContentLoaded', () => {
  const currentUser = Storage.getCurrentUser();
  if (!currentUser) return;

  renderStories();
  renderFeed();
});

function renderStories() {
  const storiesContainer = document.getElementById('storiesContainer');
  if (!storiesContainer) return;

  const stories = Storage.get(STORAGE_KEYS.STORIES) || [];
  
  let html = `
    <div class="flex flex-col items-center cursor-pointer flex-shrink-0" onclick="openAddStoryModal()">
      <div class="w-16 h-16 rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center text-xl bg-gray-50">+</div>
      <span class="text-xs mt-1 truncate w-16 text-center">Cerita Saya</span>
    </div>
  `;

  stories.forEach(story => {
    html += `
      <div class="flex flex-col items-center cursor-pointer flex-shrink-0" onclick="viewStory('${story.id}')">
        <div class="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 to-pink-600">
          <img src="${story.userAvatar}" class="w-full h-full object-cover rounded-full border-2 border-white" />
        </div>
        <span class="text-xs mt-1 truncate w-16 text-center">${story.username}</span>
      </div>
    `;
  });

  storiesContainer.innerHTML = html;
}

function renderFeed() {
  const feedContainer = document.getElementById('feedContainer');
  if (!feedContainer) return;

  const currentUser = Storage.getCurrentUser();
  const posts = Storage.get(STORAGE_KEYS.POSTS) || [];

  if (posts.length === 0) {
    feedContainer.innerHTML = '<div class="text-center py-10 text-gray-400">Belum ada postingan.</div>';
    return;
  }

  let html = '';
  posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).forEach(post => {
    const isLiked = post.likes.includes(currentUser.id);
    const likeIconColor = isLiked ? 'text-red-500 fill-red-500' : 'text-black';

    html += `
      <article class="bg-white border border-gray-200 rounded-xl mb-6 max-w-md mx-auto">
        <div class="flex items-center justify-between p-3">
          <div class="flex items-center gap-3">
            <img src="${post.userAvatar}" class="w-8 h-8 rounded-full object-cover" />
            <span class="font-semibold text-sm">${post.username}</span>
          </div>
          <span class="text-xs text-gray-400">${timeAgo(post.createdAt)}</span>
        </div>
        
        <div class="relative bg-black aspect-square flex items-center justify-center overflow-hidden" ondblclick="doubleClickLike('${post.id}')">
          <img src="${post.image}" class="w-full h-full object-cover" />
        </div>

        <div class="p-3">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-4">
              <button onclick="toggleLike('${post.id}')" class="text-2xl transition transform active:scale-125"><span class="${likeIconColor}">♥</span></button>
              <button onclick="focusComment('${post.id}')" class="text-2xl">💬</button>
            </div>
          </div>
          <p class="font-semibold text-sm mb-1">${post.likes.length} Suka</p>
          <p class="text-sm mb-2"><span class="font-semibold mr-2">${post.username}</span>${post.caption}</p>
          
          <div class="space-y-1 mb-2 max-h-24 overflow-y-auto">
            ${post.comments.map(c => `
              <div class="text-sm flex justify-between items-center">
                <div><span class="font-semibold mr-2">${c.username}</span>${c.content}</div>
                ${c.username === currentUser.username ? `<button onclick="deleteComment('${post.id}', '${c.id}')" class="text-xs text-gray-400 hover:text-red-500">Hapus</button>` : ''}
              </div>
            `).join('')}
          </div>

          <div class="flex items-center border-t border-gray-100 pt-2 mt-2">
            <input type="text" id="commentInput_${post.id}" placeholder="Tambah komentar..." class="w-full text-sm bg-transparent focus:outline-none" />
            <button onclick="addComment('${post.id}')" class="text-blue-500 font-semibold text-sm ml-2">Kirim</button>
          </div>
        </div>
      </article>
    `;
  });

  feedContainer.innerHTML = html;
}

function toggleLike(postId) {
  const currentUser = Storage.getCurrentUser();
  let posts = Storage.get(STORAGE_KEYS.POSTS) || [];
  
  posts = posts.map(post => {
    if (post.id === postId) {
      if (post.likes.includes(currentUser.id)) {
        post.likes = post.likes.filter(id => id !== currentUser.id);
      } else {
        post.likes.push(currentUser.id);
        createNotification(post.userId, currentUser.username, 'menyukai postingan Anda.');
      }
    }
    return post;
  });

  Storage.set(STORAGE_KEYS.POSTS, posts);
  renderFeed();
}

function doubleClickLike(postId) {
  const currentUser = Storage.getCurrentUser();
  let posts = Storage.get(STORAGE_KEYS.POSTS) || [];
  
  posts = posts.map(post => {
    if (post.id === postId && !post.likes.includes(currentUser.id)) {
      post.likes.push(currentUser.id);
      createNotification(post.userId, currentUser.username, 'menyukai postingan Anda.');
    }
    return post;
  });

  Storage.set(STORAGE_KEYS.POSTS, posts);
  renderFeed();
  showToast('❤️ Disukai');
}

function addComment(postId) {
  const currentUser = Storage.getCurrentUser();
  const input = document.getElementById(`commentInput_${postId}`);
  const content = input.value.trim();
  if (!content) return;

  let posts = Storage.get(STORAGE_KEYS.POSTS) || [];
  posts = posts.map(post => {
    if (post.id === postId) {
      post.comments.push({
        id: 'c_' + Date.now(),
        username: currentUser.username,
        content,
        createdAt: new Date().toISOString()
      });
      createNotification(post.userId, currentUser.username, `mengomentari: "${content}"`);
    }
    return post;
  });

  Storage.set(STORAGE_KEYS.POSTS, posts);
  renderFeed();
}

function deleteComment(postId, commentId) {
  let posts = Storage.get(STORAGE_KEYS.POSTS) || [];
  posts = posts.map(post => {
    if (post.id === postId) {
      post.comments = post.comments.filter(c => c.id !== commentId);
    }
    return post;
  });
  Storage.set(STORAGE_KEYS.POSTS, posts);
  renderFeed();
}

function createNotification(targetUserId, senderUsername, message) {
  const currentUser = Storage.getCurrentUser();
  if (targetUserId === currentUser.id) return;

  let notifs = Storage.get(STORAGE_KEYS.NOTIFICATIONS) || [];
  notifs.push({
    id: 'n_' + Date.now(),
    userId: targetUserId,
    text: `${senderUsername} ${message}`,
    createdAt: new Date().toISOString()
  });
  Storage.set(STORAGE_KEYS.NOTIFICATIONS, notifs);
}

function timeAgo(dateString) {
  const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' tahun lalu';
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' bulan lalu';
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' hari lalu';
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' jam lalu';
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' menit lalu';
  return 'Baru saja';
}
