import createDetailTemplate from '../template/detail-template.js';
import MapHelper from '../../utils/map-helper.js';
import { saveStory } from '../../utils/idb-helper.js';

class DetailPage {
  constructor({ story = null, isLoading = false, error = null, container }) {
    this._story = story;
    this._isLoading = isLoading;
    this._error = error;
    this._container = container;
    this._mapHelper = new MapHelper();
    this._mapInitialized = false;
  }

  render() {
    this._container.innerHTML = createDetailTemplate({
      isLoading: this._isLoading,
      error: this._error,
      story: this._story,
    });

    if (this._story && !this._isLoading && !this._error) {
      this._initMap();
    }

    if (this._error) {
      this._attachRetryHandler();
    }

    this.afterRender();
  }

  _initMap() {
    const { lat, lon } = this._story;

    if (!lat || !lon || isNaN(lat) || isNaN(lon) || this._mapInitialized) {
      return;
    }

    const mapContainer = document.getElementById('detailMap');
    if (!mapContainer) {
      return;
    }

    const map = this._mapHelper.initMap(mapContainer, {
      center: [lat, lon],
      zoom: 15,
    });

    const marker = L.marker([lat, lon]).addTo(map);
    marker
      .bindPopup(
        `
      <div class="map-popup">
        <strong>${this._story.name}</strong>
        <p>Posted this story from here</p>
      </div>
    `
      )
      .openPopup();

    this._mapInitialized = true;
  }

  _attachRetryHandler() {
    const retryButton = document.getElementById('retryButton');
    if (retryButton && this._retryHandler) {
      retryButton.addEventListener('click', this._retryHandler);
    }
  }

  /**
   * Set retry handler function
   * @param {Function} handler - Retry handler function
   */
  setRetryHandler(handler) {
    this._retryHandler = handler;

    if (this._error) {
      this._attachRetryHandler();
    }
  }

  async afterRender() {
    const saveBtn = document.getElementById('saveDetailStoryBtn');
    if (saveBtn && this._story) {
      saveBtn.onclick = async () => {
        try {
          console.log('Menyimpan story:', this._story);
          await saveStory(this._story);
          alert('Story berhasil disimpan ke offline!');
        } catch (e) {
          alert('Gagal menyimpan story: ' + e.message);
        }
      };
    }
  }

  cleanup() {
    if (this._mapInitialized && this._mapHelper) {
      this._mapHelper.clearMarkers();
    }
  }
}

export default DetailPage;
