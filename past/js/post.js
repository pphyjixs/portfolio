const postBody = document.getElementById ("postBody");
const toc = document.getElementById("toc");


function initPost () {
   const postBody = document.getElementById ("postBody");
   (async () => {
    const mdPath = new URLSearchParams(location.search).get('name');
    if (!mdPath || !postBody) {
      console.error('no mdpath or postbody');
      return;
    }

    const ext = mdPath.trim().toLowerCase().split('.').pop();

    try {
      switch (ext) {
        case 'md': {
          const res = await fetch(mdPath);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const mdText = await res.text();

          // 使用 marked 库解析 Markdown 内容并插入
          postBody.innerHTML = marked.parse(mdText);
          break;
        } 
        case 'pdf': {
          postBody.innerHTML = `<embed src="${mdPath}" type="application/pdf" width="100%" height="800" />`;
          break;
        }
        default: {
          postBody.textContent = '不支持的文件格式：' + ext;
        }
      }
      initToc();
    } catch (err) {
      postBody.textContent = '文章加载失败：' + String(err);
    }
  })();  // 立即执行异步函数
}

// 生成 ID 的辅助函数：将标题文本转化为 URL 友好的 ID
function generateIdFromText(text) {
  // 将文本转化为小写字母，去除空格，替换为连字符，去除非字母数字字符
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');  // 去除首尾多余的连字符
}

function initToc () {
  const headings = postBody.querySelectorAll ("h1,h2,h3");

  if (!headings.length) {
    console.error("No headings found in the post content.");
    return;
  }

  // 清空目录并重新生成
  toc.innerHTML = '';

  headings.forEach ((heading)=> {
    // 为每个标题生成 ID
    if (!heading.id) {
      heading.id = generateIdFromText(heading.textContent);
    }

    // 创建目录项链接
    const link = document.createElement ("a");
    const linkItem = document.createElement ("li");

    link.href = `#${heading.id}`;
    link.textContent = heading.textContent;
    linkItem.appendChild (link);
    toc.appendChild (linkItem);
  })
}

function upgradeProgress () {
  const progress = Math.min (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight),1)*100;
      const progressBar = document.getElementById ("progress-bar");
      if(!progressBar) return;
      progressBar.style.width = progress + "%";
}

document.addEventListener ("DOMContentLoaded", ()=> {

  initPost ();
  // initToc ();
  upgradeProgress ();

  window.addEventListener ("scroll",upgradeProgress);
  
});

document.addEventListener ('click', (e) => {
  if (e.target && e.target.closest ('toc')) {
    e.preventDefault ();
    e.target.scrollIntoView ({
      behavior: 'smooth 0.5s ease',
      block : 'start'
    });
  }
});



