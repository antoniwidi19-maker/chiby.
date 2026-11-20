// js/storage.js

const STORAGE_KEYS = {
  USERS: 'instan_users',
  CURRENT_USER: 'instan_current_user',
  POSTS: 'instan_posts',
  STORIES: 'instan_stories',
  NOTIFICATIONS: 'instan_notifications',
  FOLLOWS: 'instan_follows'
};

const Storage = {
  get(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  },

  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  initDefaultData() {
    if (!this.get(STORAGE_KEYS.USERS)) {
      const defaultUsers = [
        {
          id: 'user_1',
          username: 'johndoe',
          fullName: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
          bio: 'Photography enthusiast & Traveler 🌍',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
        },
        {
          id: 'user_2',
          username: 'janedoe',
          fullName: 'Jane Doe',
          email: 'jane@example.com',
          password: 'password123',
          bio: 'UI/UX Designer & Minimalist art lover ✨',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
        }
      ];
      this.set(STORAGE_KEYS.USERS, defaultUsers);
    }

    if (!this.get(STORAGE_KEYS.POSTS)) {
      const defaultPosts = [
        {
          id: 'post_1',
          userId: 'user_2',
          username: 'janedoe',
          userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
          image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
          caption: 'Beautiful morning by the ocean. 🌊✨',
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          likes: ['user_1'],
          comments: [
            { id: 'c_1', username: 'johndoe', content: 'So relaxing!', createdAt: new Date(Date.now() - 3600000).toISOString() }
          ]
        }
      ];
      this.set(STORAGE_KEYS.POSTS, defaultPosts);
    }

    if (!this.get(STORAGE_KEYS.STORIES)) {
      const defaultStories = [
        {
          id: 'story_1',
          userId: 'user_2',
          username: 'janedoe',
          userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
          image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=500',
          createdAt: new Date().toISOString()
        }
      ];
      this.set(STORAGE_KEYS.STORIES, defaultStories);
    }

    if (!this.get(STORAGE_KEYS.NOTIFICATIONS)) {
      this.set(STORAGE_KEYS.NOTIFICATIONS, []);
    }
  },

  getCurrentUser() {
    return this.get(STORAGE_KEYS.CURRENT_USER);
  },

  setCurrentUser(user) {
    this.set(STORAGE_KEYS.CURRENT_USER, user);
  }
};

Storage.initDefaultData();
