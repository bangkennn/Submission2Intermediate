const DB_NAME = 'storyapp-db';
const STORE_NAME = 'stories';
const LIKE_STORE = 'likes';

function openDB() {
  console.log('openDB called');
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 2);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains(LIKE_STORE)) {
        db.createObjectStore(LIKE_STORE, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveStory(story) {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  if (Array.isArray(story)) {
    story.forEach(s => store.put(s));
  } else {
    store.put(story);
  }
  return tx.complete;
}

export async function getStories() {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function deleteStory(id) {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  tx.objectStore(STORE_NAME).delete(id);
  return tx.complete;
}

export async function isStoryLiked(id) {
  const db = await openDB();
  return new Promise((resolve) => {
    const tx = db.transaction(LIKE_STORE, 'readonly');
    const store = tx.objectStore(LIKE_STORE);
    const req = store.get(id);
    req.onsuccess = () => resolve(!!req.result);
    req.onerror = () => resolve(false);
  });
}

export async function likeStory(story) {
  const db = await openDB();
  const tx = db.transaction(LIKE_STORE, 'readwrite');
  tx.objectStore(LIKE_STORE).put({ id: story.id, ...story });
  return tx.complete;
}

export async function unlikeStory(id) {
  const db = await openDB();
  const tx = db.transaction(LIKE_STORE, 'readwrite');
  tx.objectStore(LIKE_STORE).delete(id);
  return tx.complete;
}

export async function getLikedStories() {
  const db = await openDB();
  const tx = db.transaction(LIKE_STORE, 'readonly');
  const store = tx.objectStore(LIKE_STORE);
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
