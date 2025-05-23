import { getLikedStories, unlikeStory } from '../idb.js';

class LikedStoriesPresenter {
    async tampilkan() {
        const contentElement = document.querySelector('#content');
        if (!contentElement) {
            console.error('#content element not found');
            return;
        }
        contentElement.innerHTML = `
            <div class="liked-stories">
                <h2>Stories You Liked</h2>
                <div id="liked-stories-list" class="story-list"></div>
            </div>
        `;

        await this._renderLikedStories();
    }

    async _renderLikedStories() {
        const likedStoriesList = document.querySelector('#liked-stories-list');
        if (!likedStoriesList) {
            console.error('#liked-stories-list element not found');
            return;
        }
        const stories = await getLikedStories();

        if (stories.length === 0) {
            likedStoriesList.innerHTML = '<p class="empty-message">You haven\'t liked any stories yet.</p>';
            return;
        }

        likedStoriesList.innerHTML = stories.map(story => `
            <article class="story-item" data-id="${story.id}">
                <img src="${story.photoUrl}" alt="${story.description}" loading="lazy">
                <div class="story-item__content">
                    <h3>${story.name}</h3>
                    <p>${story.description}</p>
                    <div class="story-actions">
                        <button class="unlike-btn" aria-label="Unlike story">
                            <i class="fas fa-heart"></i> Unlike
                        </button>
                    </div>
                </div>
            </article>
        `).join('');

        // Add event listeners for unlike buttons
        document.querySelectorAll('.unlike-btn').forEach(button => {
            button.addEventListener('click', async (e) => {
                const storyItem = e.target.closest('.story-item');
                if (!storyItem) return;
                const storyId = storyItem.dataset.id;
                await unlikeStory(storyId);
                storyItem.remove();
                
                // If no stories left, show empty message
                if (document.querySelectorAll('.story-item').length === 0) {
                    likedStoriesList.innerHTML = '<p class="empty-message">You haven\'t liked any stories yet.</p>';
                }
            });
        });
    }
}

export default LikedStoriesPresenter; 