import { isStoryLiked, likeStory, unlikeStory, getLikedStories } from '../idb.js';

class StoryView {
    constructor() {
        this._content = document.getElementById('content');
        this._setupLikedNavButton();
    }

    _setupLikedNavButton() {
        // Tambahkan tombol ke navbar jika belum ada
        const nav = document.getElementById('navigationDrawer');
        if (nav && !nav.querySelector('.liked-stories-link')) {
            const ul = nav.querySelector('ul');
            const li = document.createElement('li');
            li.innerHTML = '<a href="#/liked" class="liked-stories-link">Liked Stories</a>';
            ul.appendChild(li);
        }
        // Event listener untuk route liked
        window.addEventListener('hashchange', () => {
            if (window.location.hash === '#/liked') {
                this.showLikedStories();
            }
        });
    }

    async showStories(stories) {
        this._content.innerHTML = `
            <div class="story-list">
                ${stories.map(story => this._createStoryElement(story)).join('')}
            </div>
        `;

        // Initialize map
        this._initMap(stories);

        // Tambahkan logika tombol like
        await this._setupLikeButtons(stories);
    }

    async showLikedStories() {
        const stories = await getLikedStories();
        this._content.innerHTML = `
            <h2>Liked Stories</h2>
            <div class="story-list">
                ${stories.length === 0 ? '<p>Tidak ada story yang di-like.</p>' : stories.map(story => this._createLikedStoryElement(story)).join('')}
            </div>
        `;
        await this._setupUnlikeButtons(stories);
    }

    _createStoryElement(story) {
        return `
            <article class="story-item">
                <img src="${story.photoUrl}" alt="${story.description}" loading="lazy">
                <div class="story-item__content">
                    <h2>${story.name}</h2>
                    <p>${story.description}</p>
                    <p>Created: ${new Date(story.createdAt).toLocaleDateString()}</p>
                    <button class="like-btn" data-id="${story.id}">Like</button>
                </div>
            </article>
        `;
    }

    _createLikedStoryElement(story) {
        return `
            <article class="story-item">
                <img src="${story.photoUrl}" alt="${story.description}" loading="lazy">
                <div class="story-item__content">
                    <h2>${story.name}</h2>
                    <p>${story.description}</p>
                    <p>Created: ${new Date(story.createdAt).toLocaleDateString()}</p>
                    <button class="unlike-btn" data-id="${story.id}">Unlike</button>
                </div>
            </article>
        `;
    }

    _initMap(stories) {
        // Create map container
        const mapContainer = document.createElement('div');
        mapContainer.id = 'map';
        this._content.insertBefore(mapContainer, this._content.firstChild);

        // Initialize Leaflet map
        const map = L.map('map').setView([0, 0], 2);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Add markers for stories with location
        stories.forEach(story => {
            if (story.lat && story.lon) {
                const marker = L.marker([story.lat, story.lon]).addTo(map);
                marker.bindPopup(`
                    <h3>${story.name}</h3>
                    <p>${story.description}</p>
                    <img src="${story.photoUrl}" alt="${story.description}" style="max-width:200px;max-height:200px;display:block;" width="200" />
                `);
            }
        });

        // Fit map bounds to show all markers
        const bounds = L.latLngBounds(stories
            .filter(story => story.lat && story.lon)
            .map(story => [story.lat, story.lon])
        );
        if (bounds.isValid()) {
            map.fitBounds(bounds);
        }
    }

    async _setupLikeButtons(stories) {
        const buttons = this._content.querySelectorAll('.like-btn');
        for (const btn of buttons) {
            const id = btn.getAttribute('data-id');
            const story = stories.find(s => String(s.id) === String(id));
            if (await isStoryLiked(id)) {
                btn.textContent = 'Unlike';
                btn.classList.add('liked');
            } else {
                btn.textContent = 'Like';
                btn.classList.remove('liked');
            }
            btn.onclick = async () => {
                if (await isStoryLiked(id)) {
                    await unlikeStory(id);
                    btn.textContent = 'Like';
                    btn.classList.remove('liked');
                } else {
                    await likeStory(story);
                    btn.textContent = 'Unlike';
                    btn.classList.add('liked');
                }
            };
        }
    }

    async _setupUnlikeButtons(stories) {
        const buttons = this._content.querySelectorAll('.unlike-btn');
        for (const btn of buttons) {
            const id = btn.getAttribute('data-id');
            btn.onclick = async () => {
                await unlikeStory(id);
                // Hapus dari UI setelah di-unlike
                btn.closest('article').remove();
                // Jika sudah tidak ada liked story, tampilkan pesan
                if (this._content.querySelectorAll('.unlike-btn').length === 0) {
                    this._content.querySelector('.story-list').innerHTML = '<p>Tidak ada story yang di-like.</p>';
                }
            };
        }
    }

    showError(message) {
        this._content.innerHTML = `
            <div class="error-message">
                <h2>Error</h2>
                <p>${message}</p>
            </div>
        `;
    }

    showLoading() {
        this._content.innerHTML = `
            <div class="loading">
                <p>Loading stories...</p>
            </div>
        `;
    }
}

export default StoryView; 