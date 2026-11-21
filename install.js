const installButton = document.getElementById('install-app');
const offlineStatus = document.getElementById('offline-status');
let installPrompt;

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  installPrompt = event;
  installButton.hidden = false;
});

installButton.addEventListener('click', async () => {
  const prompt = installPrompt;
  if (!prompt) return;
  installPrompt = null;
  installButton.hidden = true;
  try {
    await prompt.prompt();
  } catch {
    offlineStatus.textContent = '可通过浏览器菜单添加到主屏幕。';
    offlineStatus.hidden = false;
  }
});

if (isSecureContext && /^https?:$/.test(location.protocol) && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js')
    .then(() => navigator.serviceWorker.ready)
    .then(() => {
      offlineStatus.textContent = '网页已缓存，可离线使用。';
      offlineStatus.hidden = false;
    })
    .catch(() => {
      offlineStatus.textContent = '当前仍可在线使用网页版。';
      offlineStatus.hidden = false;
    });
}
