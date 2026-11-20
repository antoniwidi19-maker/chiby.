// js/upload.js

document.addEventListener('DOMContentLoaded', () => {
  const uploadForm = document.getElementById('uploadForm');
  const imageInput = document.getElementById('imageInput');
  const previewImage = document.getElementById('previewImage');

  if (imageInput) {
    imageInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          previewImage.src = event.target.result;
          previewImage.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (uploadForm) {
    uploadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const currentUser = Storage.getCurrentUser();
      const caption = document.getElementById('captionInput').value.trim();
      const imageSrc = previewImage.src;

      if (!imageSrc || previewImage.classList.contains('hidden')) {
        showToast('Pilih foto terlebih dahulu.');
        return;
      }

      const newPost = {
        id: 'post_' + Date.now(),
        userId: currentUser.id,
        username: currentUser.username,
        userAvatar: currentUser.avatar,
        image: imageSrc,
        caption,
        createdAt: new Date().toISOString(),
        likes: [],
        comments: []
      };

      let posts = Storage.get(STORAGE_KEYS.POSTS) || [];
      posts.unshift(newPost);
      Storage.set(STORAGE_KEYS.POSTS, posts);

      window.location.href = 'index.html';
    });
  }
});

function openUpload(e) {
  if (e) e.preventDefault();
  // Buat modal upload dinamis jika belum ada di halaman
  let modal = document.getElementById('uploadModalGlobal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'uploadModalGlobal';
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
      <div class="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-bold text-lg">Buat Postingan Baru</h3>
          <button onclick="closeUploadModal()" class="text-xl">✕</button>
        </div>
        <form id="globalUploadForm" class="space-y-4">
          <input type="file" id="globalImageInput" accept="image/*" required class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800" />
          <div class="aspect-square bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
            <img id="globalPreview" class="w-full h-full object-cover hidden" />
            <span id="globalPlaceholder" class="text-gray-400 text-sm">Preview Foto</span>
          </div>
          <textarea id="globalCaption" placeholder="Tulis caption..." class="w-full border rounded-xl p-3 text-sm focus:outline-none"></textarea>
          <button type="submit" class="w-full bg-black text-white py-3 rounded-xl font-semibold">Bagikan</button>
        </form>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('globalImageInput').addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const prev = document.getElementById('globalPreview');
          prev.src = event.target.result;
          prev.classList.remove('hidden');
          document.getElementById('globalPlaceholder').classList.add('hidden');
        };
        reader.readAsDataURL(file);
      }
    });

    document.getElementById('globalUploadForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const currentUser = Storage.getCurrentUser();
      const caption = document.getElementById('globalCaption').value.trim();
      const imageSrc = document.getElementById('globalPreview').src;

      const newPost = {
        id: 'post_' + Date.now(),
        userId: currentUser.id,
        username: currentUser.username,
        userAvatar: currentUser.avatar,
        image: imageSrc,
        caption,
        createdAt: new Date().toISOString(),
        likes: [],
        comments: []
      };

      let posts = Storage.get(STORAGE_KEYS.POSTS) || [];
      posts.unshift(newPost);
      Storage.set(STORAGE_KEYS.POSTS, posts);
      window.location.reload();
    });
  }
  modal.classList.remove('hidden');
}

function closeUploadModal() {
  const modal = document.getElementById('uploadModalGlobal');
  if (modal) modal.classList.add('hidden');
}
