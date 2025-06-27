import { getAllStories, deleteStory } from '../../utils/idb-helper.js';

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const SavedStoriesPage = {
  async render() {
    return `
      <section class="saved-stories">
        <h2 class="home__title">Saved Offline Stories</h2>
        <div id="savedStoriesList"></div>
      </section>
    `;
  },

  async afterRender() {
    const container = document.getElementById('savedStoriesList');
    const stories = await getAllStories();

    if (!stories.length) {
      container.innerHTML = `<p>Tidak ada story offline yang tersimpan.</p>`;
      return;
    }

    container.innerHTML = stories
      .map(
        (story, idx) => `
      <div class="story-card story-card-animate"
        style="display:flex;align-items:stretch;margin-bottom:2rem;box-shadow:0 2px 8px #0001;border-radius:12px;overflow:hidden;animation-delay:${
          idx * 80
        }ms;">
        <div style="flex:0 0 220px;background:#eee;">
          <img src="${story.photoUrl || ''}" alt="Story by ${
          story.name
        }" style="width:220px;height:160px;object-fit:cover;">
        </div>
        <div style="flex:1;padding:1.5rem;">
          <div style="color:#6b7280;font-size:0.95rem;margin-bottom:0.5rem;">
            <i class="fas fa-user"></i> ${story.name || '-'}
            &nbsp; <i class="fas fa-calendar-alt"></i> ${formatDate(
              story.createdAt
            )}
            &nbsp; <i class="fas fa-map-marker-alt"></i> ${
              story.lat && story.lon ? 'Location Available' : 'No Location'
            }
          </div>
          <h3 style="margin:0 0 0.5rem 0;font-size:1.3rem;font-weight:700;">Story by ${
            story.name || '-'
          }</h3>
          <div style="margin-bottom:1rem;">${story.description || ''}</div>
          <a href="#/detail/${
            story.id
          }" class="button" style="margin-right:0.5rem;">Read More</a>
          <button class="button delete-saved-story-btn" data-id="${
            story.id
          }" style="background:#e11d48;border:none;">
            <i class="fas fa-trash"></i> Hapus
          </button>
        </div>
      </div>
    `
      )
      .join('');

    // Event handler untuk hapus
    container.querySelectorAll('.delete-saved-story-btn').forEach((btn) => {
      btn.onclick = async () => {
        const id = btn.getAttribute('data-id');
        await deleteStory(id);
        btn.parentElement.parentElement.remove();
        if (!container.querySelector('.story-card')) {
          container.innerHTML = `<p>Tidak ada story offline yang tersimpan.</p>`;
        }
      };
    });
  },
};

export default SavedStoriesPage;
