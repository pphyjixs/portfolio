// DOM reference;
const themeToggleBtn = document.getElementById('theme-toggle');
const btn = document.getElementById('backToTop');

function initTheme (){
  const saved = localStorage.getItem("theme");
  if (saved == "dark") {
      document.documentElement.classList.add ("dark");
      themeToggleBtn.textContent = "☀️";
  } else {
      document.documentElement.classList.remove ("dark");
      themeToggleBtn.textContent = "🌙";
  }
}

function toggleTheme () {
  const current = document.documentElement.classList.toggle ("dark");
  localStorage.setItem ("theme",current? "dark" :"light");
  themeToggleBtn.textContent = current? "☀️" : "🌙";
}

function setupPostList() {
  const list = document.getElementById('postList');
  if (!list) return; // 没有列表容器的页面直接跳过

  const searchInput = document.getElementById('searchInput');   
  const clearBtn = document.getElementById('clearSearch');     
  const state = {
    posts: [],
    keyword: ''
  };

  const norm = (s) => (s ?? '').toString().toLowerCase().trim();

  function getFiltered() {
    const kw = norm(state.keyword);
    if (!kw) return state.posts;

    return state.posts.filter(p => {
      const tags = Array.isArray(p.tags) ? p.tags : [];
      const hay = `${p.title} ${p.excerpt} ${tags.join(' ')}`.toLowerCase();
      return hay.includes(kw);
    });
  }

  function render() {
    const posts = getFiltered();
    list.innerHTML = posts.length
      ? posts.map(p => {
          const tags = Array.isArray(p.tags) ? p.tags : [];
          return `
            <article class="post-card" data-md="${p.md}">
              <h2 class="post-title">${p.title}</h2>
              <p class="post-meta">${p.date} · ${tags.join(' / ')}</p>
              <p class="post-excerpt">${p.excerpt}</p>
            </article>
          `;
        }).join('')
      : `<p class="empty">没有匹配的文章</p>`;
  }

  function debounce(fn, delay = 200) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), delay);
    };
  }

  // 绑定搜索事件
  if (searchInput) {
    searchInput.addEventListener('input', debounce((e) => {
      state.keyword = e.target.value;
      render();
    }));
  }

  // 清空搜索
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      state.keyword = '';
      if (searchInput) searchInput.value = '';
      render();
    });
  }

  // 加载文章数据
  (async () => {
    try {
      const res = await fetch('posts/posts.json');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      state.posts = await res.json();
      render();
    } catch (err) {
      console.error('posts load error:', err);
      list.textContent = '文章列表加载失败：' + String(err);
    }
  })();
}



document.addEventListener ("DOMContentLoaded", ()=>{

  setupPostList();
  // 主题切换
  initTheme ();
  if (themeToggleBtn)
    themeToggleBtn.addEventListener ("click",toggleTheme);

  // 回到顶部按钮
  if (btn) {
    const toggle = () => {
      btn.style.display = window.scrollY > 200 ? 'block' : 'none';
    };

    window.addEventListener('scroll', toggle, { passive: true });
    toggle();

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


});


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






