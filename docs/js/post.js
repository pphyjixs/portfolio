(async () => {
  const mdPath = new URLSearchParams(location.search).get('md');
  const postBody = document.getElementById('postBody');
  if (!mdPath || !postBody) return;

  try {
    const res = await fetch(mdPath);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const mdText = await res.text();

    postBody.innerHTML = marked.parse(mdText);
  } catch (err) {
    postBody.textContent = '文章加载失败：' + String(err);
  }
})();
