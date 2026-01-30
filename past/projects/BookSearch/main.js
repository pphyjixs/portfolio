const input = document.getElementById("queryInput");
const btnSearch = document.getElementById("btnSearch");
const btnLoadMore = document.getElementById("btnLoadMore");
const qstatus = document.getElementById("status");
const result = document.getElementById("result");

const API = "https://openlibrary.org/search.json";
const LIMIT = 12;

const state = {
    total: 0,
    offset: 0,
    items: [],
    searching: false,
    loadingMoreing: false,
}

let currentController = null;

const FIELDS = [
  "key",
  "title",
  "author_name",
  "first_publish_year",
  "cover_i"
].join(",");

function setButton() {
    btnSearch.disabled = state.searching || state.loadingMoreing;
    btnLoadMore.style.display = (state.offset < state.total) ?"block" : "none";
    btnLoadMore.disabled = state.searching || state.loadingMoreing;
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, ch => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[ch]));
}

async function fetchBooks ({query,offset} ) {
    if (currentController) currentController.abort();
    currentController = new AbortController();
    const timeOut = setTimeout(()=>{currentController.abort();},6000);

    function getUrl (query,offset) {
        const parms = new URLSearchParams ({
            q: query,
            limit: String(LIMIT),
            offset: String (offset),
            fields: FIELDS,
        });
        return `${API}?${parms.toString()}`;
    }

   try {
        const url =  getUrl (query,offset);
        console.log ("Fetch url:",url);

        const resp = await fetch (url,{signal:currentController.signal});
        if (!resp.ok) {
            throw new Error(`HTTP ${resp.status} ${resp.statusText}`);
        }

        const data = await resp.json ();
        const total = data.numFound ?? data.num_found ?? 0;
        const docs = data.docs ?? [];

        console.log ("fetch total:",total," docs:",docs.length);
        return {total,docs};
   } finally {
        clearTimeout (timeOut);
   }

}

async function render () {
    result.innerHTML = "";
    if (!state.items.length) return;

    const html = state.items.map (item => {
        const title = escapeHtml(item.title ?? "（无标题）");
        const author = escapeHtml((item.author_name && item.author_name[0]) ? item.author_name[0] : "未知作者");
        const year = escapeHtml(item.first_publish_year ?? "未知年份");
        const cover = item.cover_i
        // Covers API：用 cover_i 拼封面图（可选）
        ? `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg`
        : "";

        return `
        <div class="book-card">
            ${cover ? `<img src="${cover}" alt="${title}" style="width:100%;border-radius:8px;margin-bottom:8px;" loading="lazy" />` : ""}
            <p class="book-title">${title}</p>  
            <p class="book-meta">作者：${author}</p>
            <p class="book-meta">首次出版：${year}</p>
        </div>
        `;
    }).join("");
    
    result.innerHTML = html;
}

async function search () {
    const query = input.value.trim();
    if (!query) {
        qstatus.textContent = "请输入关键词再搜索";
        return;
    }

    state.query = query;
    state.total = 0;
    state.offset = 0;
    state.items = [];
    state.searching = true;
    qstatus.textContent = "Loading… 正在搜索中";
    setButton();

    try {
        const {total,docs} = await fetchBooks ({query:query,offset:state.offset});
        if (!docs.length) {
            qstatus.textContent = "没有搜到结果，换个关键词试试。";
        }
        state.total = total;
        state.items = docs;
        state.offset = state.items.length;
        qstatus.textContent = `找到条${state.total}结果，已加载${state.items.length}条`;
        render ();

    } catch (err){
        qstatus.textContent = `请求失败：请求超时`;
    } finally {
        state.searching = false;
        setButton();
    }
    
}

async function LoadMore () {
    if (!state.items.length) return;
    state.loadingMoreing = true;
    setButton();
    qstatus.textContent = `加载更多中… 已加载${state.items.length}条，共${state.total}条结果`;
    
    try {
        const {total,docs} = await fetchBooks ({query:state.query,offset:state.offset});
        state.total = total;
        state.items.push (...docs);
        state.offset = state.items.length;
        qstatus.textContent = `已加载${state.items.length}/${state.total}条结果`;
        render (); 
    } catch (err) {
        qstatus.textContent = `请求失败：${err.message}`;
    } finally {
        state.loadingMoreing = false;
        setButton();
    }
}


btnSearch.addEventListener("click", search);
btnLoadMore.addEventListener("click",LoadMore);
input.addEventListener("keydown",(e)=>{
    if (e.key === "Enter") {
        search();
    }
})