import './settings-watermark.css';

function addWatermark() {
  const settings = document.querySelector('.settings');
  if (!settings || settings.querySelector('.settings-watermark')) return;
  const watermark = document.createElement('p');
  watermark.className = 'settings-watermark';
  watermark.innerHTML = 'Made with <span>♥</span> for you, by Yours.';
  settings.append(watermark);
}

new MutationObserver(addWatermark).observe(document.body, { childList: true, subtree: true });
addWatermark();
