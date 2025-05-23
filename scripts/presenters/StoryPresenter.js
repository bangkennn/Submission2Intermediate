import StoryModel from '../models/StoryModel.js';
import StoryView from '../views/StoryView.js';
import { likeStory, unlikeStory, isStoryLiked } from '../idb.js';
import DataCerita from '../models/StoryModel.js';

class PengelolaStory {
    constructor() {
        this._model = new StoryModel();
        this._view = new StoryView();
        this._data = new DataCerita();
    }

    async tampilkan() {
        if (!this._data.isLoggedIn()) {
            // Redirect to login if not logged in
            window.location.hash = '#/login';
            return;
        }

        try {
            this._view.showLoading();
            const stories = await this._model.getStories();
            
            // Check which stories are liked
            const storiesWithLikeStatus = await Promise.all(
                stories.map(async (story) => ({
                    ...story,
                    isLiked: await isStoryLiked(story.id)
                }))
            );
            
            this._view.showStories(storiesWithLikeStatus);
            
            // Add event listeners for like buttons
            document.querySelectorAll('.like-btn').forEach(button => {
                button.addEventListener('click', async (e) => {
                    const storyCard = e.target.closest('.story-item');
                    if (!storyCard) return;
                    const storyId = storyCard.dataset.id;
                    const isLiked = storyCard.dataset.liked === 'true';
                    
                    if (isLiked) {
                        await unlikeStory(storyId);
                        storyCard.dataset.liked = 'false';
                        button.innerHTML = '<i class="far fa-heart"></i> Like';
                    } else {
                        const storyToLike = stories.find(s => s.id === storyId);
                        if (storyToLike) {
                            await likeStory(storyToLike);
                            storyCard.dataset.liked = 'true';
                            button.innerHTML = '<i class="fas fa-heart"></i> Liked';
                        }
                    }
                });
            });
        } catch (error) {
            console.error('Error fetching stories:', error);
            this._view.showError(error.message);
        }
    }
}

export default PengelolaStory;