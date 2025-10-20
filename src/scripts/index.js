// CSS imports
import '../styles/styles.css';
import '../styles/responsives.css';
import 'leaflet/dist/leaflet.css';
import 'tiny-slider/dist/tiny-slider.css';

import App from './pages/app';
import Camera from './utils/camera';
import { registerServiceWorker } from './utils';

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
    skipLinkButton: document.querySelector('#skip-link'),
  });
  console.log('Sudah masuk index.js dan mau render page');
  await app.renderPage();
  console.log('Sudah render page dan mau daftar service worker');
  await registerServiceWorker();
  window.addEventListener('hashchange', async () => {
    await app.renderPage();
    Camera.stopAllStreams();
  });
});
