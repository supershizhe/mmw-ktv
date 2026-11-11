const ids = ['intro', 'features', 'author', 'download', 'api', 'faq', 'releases'];
const downloadPlatform = document.getElementById('download-platform');
function loadDownloads() {
  const folder = document.getElementById('drive-folder');
  const frame = document.getElementById('download-list');
  const platform = downloadPlatform.value;
  folder.href = folder.dataset[platform];
  const id = new URL(folder.href).pathname.split('/').at(-1);
  frame.title = (platform === 'mac' ? 'Mac' : 'Windows') + ' 下载文件列表';
  frame.src = 'https://drive.google.com/embeddedfolderview?id=' + id + '#list';
}
downloadPlatform.addEventListener('change', loadDownloads);
function showPage() {
  const requested = decodeURIComponent(location.hash.slice(1));
  const id = ids.includes(requested) ? requested : requested.startsWith('二、') ? 'api' : 'intro';
  const index = ids.indexOf(id);
  for (const section of document.querySelectorAll('.page')) section.hidden = section.id !== id;
  for (const link of document.querySelectorAll('nav a')) {
    if (link.hash === '#' + id) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  }
  const prev = document.getElementById('previous-page');
  const next = document.getElementById('next-page');
  prev.href = '#' + ids[Math.max(0, index - 1)]; prev.hidden = index === 0;
  next.href = '#' + ids[Math.min(ids.length - 1, index + 1)]; next.hidden = index === ids.length - 1;
  document.getElementById('page-count').textContent = `0${index + 1} / 07`;
  const pageTitle = document.querySelector('nav a[aria-current]').textContent.slice(2).replace('↗', '').trim();
  document.getElementById('current-page-title').textContent = pageTitle;
  document.title = `${pageTitle} · 妙妙屋狂欢夜`;
  if (id === 'download') loadDownloads();
  window.scrollTo(0, 0);
}
window.addEventListener('hashchange', showPage);
showPage();
