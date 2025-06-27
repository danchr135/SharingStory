import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import 'leaflet/dist/leaflet.css';
import './styles/main.css';

import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

import './scripts/app.js';
import webPushHelper from './scripts/utils/web-push-helper.js';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('/service-worker.js');

      console.log('Service worker registered:', reg);
    } catch (error) {
      console.error('Service worker registration or push init failed:', error);
    }
  });
}
import { registerSW } from 'virtual:pwa-register';

if (import.meta.env.PROD) {
  registerSW({
    onNeedRefresh() {
      console.log('New content available, click on reload button to update.');
    },
    onOfflineReady() {
      console.log('App ready to work offline');
    },
  });
}
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
});

