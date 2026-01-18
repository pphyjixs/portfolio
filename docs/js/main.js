// 返回顶部按钮
(() => {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  const toggle = () => {
    btn.style.display = window.scrollY > 200 ? 'block' : 'none';
  };

  window.addEventListener('scroll', toggle, { passive: true });
  toggle();

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// 文章列表
(async () => {
  const list = document.getElementById('postList');
  if (!list) return;

  try {
    const res = await fetch('posts/posts.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const posts = await res.json(); // 这一步就是“把 JSON 文本变成 JS 数组”

    list.innerHTML = posts.map(p => `
      <article class="post-card" data-md="${p.md}">
        <h2 class="post-title">${p.title}</h2>
        <p class="post-meta">${p.date} · ${p.tags.join(' / ')}</p>
        <p class="post-excerpt">${p.excerpt}</p>
      </article>
    `).join('');
  } catch (err) {
    list.textContent = '文章列表加载失败：' + String(err);
  }
})();


// 文章卡片点击事件
(()=>{
  document.addEventListener('click', (e) => {
  const card = e.target.closest('.post-card');
  if (!card) return;
  const md = card.dataset.md;
  if (!md) return;
  location.href = `post.html?md=${encodeURIComponent(md)}`;
});
}) ();

// 页面导航高亮
(() => {
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.site-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path) a.classList.add('active');
  });
})();

// 复制邮箱
(()=> {
  document.addEventListener('click', async (e) => {
  const el = e.target.closest('.contact-email');
  if (!el) return;
  try {
    await navigator.clipboard.writeText(el.dataset.copy || el.textContent.trim());
  } catch {}
});
})();




