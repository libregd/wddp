let folderData = [];
let chapterData = [];
let currentFolder = null;
let currentChapter = 1;

window.onload = async () => {
  document.getElementById('chapter-nav').classList.add('hidden');
  
  // 添加加载提示
  document.getElementById('container').innerHTML = '<p>加载中...</p>';
  
  try {
    folderData = await fetchJSON('txts/folder_lists.json');
    renderHomePage();
  } catch (error) {
    console.error('初始化失败:', error);
    document.getElementById('container').innerHTML = `
      <div class="error">
        <h2>加载失败</h2>
        <p>${error.message}</p>
        <p>请检查文件路径是否正确</p>
      </div>
    `;
  }
};

function goHome() {
  currentFolder = null;
  document.getElementById('chapter-nav').classList.add('hidden');
  renderHomePage();
}

async function fetchJSON(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`HTTP错误! 状态码: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error('加载JSON失败:', error);
    throw new Error(`无法加载文件: ${path}`);
  }
}

function renderHomePage() {
  document.getElementById('chapter-nav').classList.add('hidden');  
  const container = document.getElementById('container');
  container.innerHTML = '';
  
  if (folderData.length === 0) {
    container.innerHTML = '<div class="error"><h2>没有找到书籍</h2><p>请检查txts/folder_lists.json文件是否存在</p></div>';
    return;
  }
  
  folderData.forEach(book => {
    const card = document.createElement('div');
    card.className = 'card';
    card.onclick = () => openBook(book);
    card.innerHTML = `
      <img src="txts/${book.trueName}/${book.cover}" alt="封面" />
      <div class="card-content">
        <h2>${book.showName}</h2>
        <p>${book.des}</p>
      </div>
    `;
    container.appendChild(card);
  });
}

async function openBook(book) {
  currentFolder = book;
  currentChapter = 1;
  
  try {
    chapterData = await fetchJSON(`txts/${book.trueName}/text_lists.json`);
    renderBookPage();
  } catch (error) {
    console.error('打开书籍失败:', error);
    document.getElementById('container').innerHTML = `
      <div class="error">
        <h2>加载失败</h2>
        <p>${error.message}</p>
        <button onclick="goHome()">返回首页</button>
      </div>
    `;
  }
}

async function renderBookPage() {
  const container = document.getElementById('container');
  container.innerHTML = '';

  const header = document.createElement('div');
  header.className = 'chapter-header';
  const dropdown = document.createElement('select');
  dropdown.className = 'chapter-select';
  dropdown.onchange = e => {
    currentChapter = parseInt(e.target.value);
    renderBookPage();
  };

  chapterData.forEach(ch => {
    const opt = document.createElement('option');
    opt.value = ch.No;
    opt.textContent = ch.showName;
    if (ch.No === currentChapter) opt.selected = true;
    dropdown.appendChild(opt);
  });

  const title = document.createElement('strong');
  title.textContent = `${currentFolder.showName}`;
  header.appendChild(title);
  header.appendChild(dropdown);
  container.appendChild(header);

  const content = document.createElement('div');
  content.className = 'chapter-content';
  
  // 添加加载提示
  content.innerHTML = '<p>加载章节内容中...</p>';
  container.appendChild(content);
  
  try {
    const chapterFile = chapterData.find(ch => ch.No === currentChapter)?.trueName || '1';
    const txt = await fetch(`txts/${currentFolder.trueName}/${chapterFile}.txt`).then(res => {
      if (!res.ok) throw new Error(`加载失败: ${res.status}`);
      return res.text();
    });
    
    content.innerHTML = '';
    txt.split(/\s*\n/)
      .map(para => para.trim())
      .filter(para => para.length > 0)
      .forEach(para => {
        const p = document.createElement('p');
        p.textContent = para;
        content.appendChild(p);
      });
  } catch (error) {
    console.error('加载章节失败:', error);
    content.innerHTML = `
      <div class="error">
        <p>章节加载失败</p>
        <p>${error.message}</p>
      </div>
    `;
  }

  document.getElementById('chapter-nav').classList.remove('hidden');
}

document.getElementById('prev-chapter').onclick = () => {
  if (currentChapter > 1) {
    currentChapter--;
    renderBookPage();
  }
};

document.getElementById('next-chapter').onclick = () => {
  if (currentChapter < chapterData.length) {
    currentChapter++;
    renderBookPage();
  }
};