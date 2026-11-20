// js/auth.js

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const logoutBtn = document.getElementById('logoutBtn');

  // Proteksi Halaman
  const currentUser = Storage.getCurrentUser();
  const publicPages = ['login.html', 'register.html'];
  const currentPage = window.location.pathname.split('/').pop();

  if (!currentUser && !publicPages.includes(currentPage)) {
    window.location.href = 'login.html';
  } else if (currentUser && publicPages.includes(currentPage)) {
    window.location.href = 'index.html';
  }

  // Toggle Password Visibility
  document.querySelectorAll('.toggle-password').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const input = e.target.previousElementSibling;
      if (input.type === 'password') {
        input.type = 'text';
        e.target.textContent = 'Sembunyikan';
      } else {
        input.type = 'password';
        e.target.textContent = 'Tampilkan';
      }
    });
  });

  // Handle Login
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const identifier = document.getElementById('identifier').value.trim();
      const password = document.getElementById('password').value;
      const errorMsg = document.getElementById('errorMsg');

      const users = Storage.get(STORAGE_KEYS.USERS) || [];
      const user = users.find(u => u.username === identifier || u.email === identifier);

      if (!user || user.password !== password) {
        errorMsg.textContent = 'Username, email, atau password salah.';
        errorMsg.classList.remove('hidden');
        return;
      }

      Storage.setCurrentUser(user);
      window.location.href = 'index.html';
    });
  }

  // Handle Register
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fullName = document.getElementById('fullName').value.trim();
      const username = document.getElementById('username').value.trim().toLowerCase();
      const email = document.getElementById('email').value.trim().toLowerCase();
      const password = document.getElementById('password').value;
      const errorMsg = document.getElementById('errorMsg');

      const users = Storage.get(STORAGE_KEYS.USERS) || [];

      if (users.some(u => u.username === username)) {
        errorMsg.textContent = 'Username sudah digunakan.';
        errorMsg.classList.remove('hidden');
        return;
      }

      if (users.some(u => u.email === email)) {
        errorMsg.textContent = 'Email sudah terdaftar.';
        errorMsg.classList.remove('hidden');
        return;
      }

      const newUser = {
        id: 'user_' + Date.now(),
        username,
        fullName,
        email,
        password,
        bio: 'Halo, saya pengguna baru INSTAN!',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
      };

      users.push(newUser);
      Storage.set(STORAGE_KEYS.USERS, users);
      Storage.setCurrentUser(newUser);
      window.location.href = 'index.html';
    });
  }

  // Handle Logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      window.location.href = 'login.html';
    });
  }
});
