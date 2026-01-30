const state = {
    posts: [],
    keyWord: ''
};
const themeToggleButton = document.getElementById('theme-toggle');
const backToTopButton = document.getElementById('backToTop');
const localHref = location.pathname.split('/').pop() || 'index.html';
const isIndex = localHref === 'index.html';
const isProject = localHref === 'project.html';
const isContact = localHref === 'contact.html';
const isPost = localHref === 'post.html';
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
        themeToggleButton.textContent = "☀️";
    }
    else {
        document.documentElement.classList.remove('dark');
        themeToggleButton.textContent = "🌙";
    }
}
function toggleTheme() {
    if (document.documentElement.classList.contains('dark')) {
        localStorage.setItem('theme', 'light');
        themeToggleButton.textContent = "🌙";
        document.documentElement.classList.remove('dark');
    }
    else {
        localStorage.setItem('theme', 'dark');
        themeToggleButton.textContent = "☀️";
        document.documentElement.classList.add('dark');
    }
}
function openCard(e) {
    const card = e.target.closest('.post-card');
    if (!card)
        return;
    const kind = card.dataset.kind;
    const name = card.dataset.name;
    switch (kind) {
        case 'project': {
            location.href = `./projects/${name}`;
            break;
        }
        case 'article': {
            location.href = `post.html?name=${encodeURIComponent(name)}`;
            break;
        }
        default: {
            console.log('未识别类别');
        }
    }
}
async function renderCards() {
    const postList = document.getElementById('postList');
    if (!postList)
        return;
    try {
        let posts = state.posts.length ? state.posts : [];
        if (state.keyWord.length) {
            const kw = state.keyWord.toLowerCase();
            posts = posts.filter(p => {
                const tags = Array.isArray(p.tags) ? p.tags : [];
                const hay = `${p.title} ${p.excerpt} ${tags.join(' ')}`.toLowerCase();
                return hay.includes(kw);
            });
        }
        postList.innerHTML = '';
        postList.innerHTML = posts.length ? posts.map(p => {
            return `
                <article class="post-card" data-name="${p.name}" data-kind="${p.kind || ""}">
                    <h2 class="post-title">${p.title}</h2>
                    <p class="post-meta">${p.date} · ${p.tags.join(' / ')}</p>
                    <p class="post-excerpt">${p.excerpt}</p>
                </article>
            `;
        }).join('')
            : `<p> 没有匹配的文章 </p>`;
    }
    catch (error) {
        console.error('Error fetching post data: ', error);
    }
}
async function initPosts() {
    try {
        const response = await fetch('./posts/posts.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        state.posts = await response.json();
        renderCards();
    }
    catch (error) {
        console.error('Error fetching post data: ', error);
    }
}
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    if (isProject) {
        initPosts();
        renderCards();
    }
    // 导航栏当前页高亮
    (() => {
        const path = location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('nav a').forEach(element => {
            if (element.getAttribute('href') === path)
                element.classList.add('active');
        });
    })();
});
document.addEventListener('scroll', () => {
    backToTopButton.style.display = window.scrollY > 300 ? 'block' : 'none';
});
document.addEventListener('click', (e) => {
    // 主题切换按钮
    if (e.target === themeToggleButton) {
        toggleTheme();
        // 回到顶部按钮
    }
    else if (e.target === backToTopButton) {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        //复制邮箱
    }
    else if (isContact && e.target.closest('.contact-email')) {
        (async () => {
            try {
                await navigator.clipboard.writeText((e.target.closest('.contact-email')).textContent.trim());
            }
            catch (err) {
                console.error('Failed to copy email: ', err);
            }
        })();
        // 卡片点击事件
    }
    else if (isProject && e.target.closest('.post-card')) {
        openCard(e);
    }
});
//搜索功能
if (isProject) {
    const clearbtn = document.getElementById('clearSearch');
    const searchInput = document.getElementById('searchInput');
    if (clearbtn && searchInput) {
        clearbtn.addEventListener('click', () => {
            searchInput.value = '';
            state.keyWord = '';
            renderCards();
        });
        searchInput.addEventListener('input', () => {
            state.keyWord = searchInput.value.trim();
            renderCards();
        });
    }
}
