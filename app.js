let folderData = [];
let chapterData = [];
let currentFolder = null;
let currentChapter = 1;

window.onload = async () => {
  document.getElementById('chapter-nav').classList.add('hidden');
  folderData = await fetchJSON('/txts/folder_lists.json');
  renderHomePage();
};

function goHome() {
  currentFolder = null;
  document.getElementById('chapter-nav').classList.add('hidden');
  renderHomePage();
}

function fetchJSON(path) {
  return fetch(path).then(res => res.json());
}

function renderHomePage() {
  document.getElementById('chapter-nav').classList.add('hidden');  
  const container = document.getElementById('container');
  container.innerHTML = '';
  folderData.forEach(book => {
    const card = document.createElement('div');
    card.className = 'card';
    card.onclick = () => openBook(book);
    card.innerHTML = `
      <img src="txts/${book.trueName}/${book.cover}" alt="cover" />
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
  chapterData = await fetchJSON(`/txts/${book.trueName}/text_lists.json`);
  renderBookPage();
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
  const chapterFile = chapterData.find(ch => ch.No === currentChapter)?.trueName || '1';
  // ====== 针对txt的空行进行p段落处理 ======
  try {
    const txt = await fetch(`/txts/${currentFolder.trueName}/${chapterFile}.txt`).then(res => res.text());
    content.innerHTML = ''; // 清空容器
    
    // 按空行分割文本并创建段落
    txt.split(/\s*\n/) 
      .map(para => para.trim())
      .filter(para => para.length > 0)
      .forEach(para => {
        const p = document.createElement('p');
        p.textContent = para;
        content.appendChild(p);
      });
  } catch {
    content.innerHTML = '<p>[章节加载失败]</p>';
  }
  // ====== p段落处理修改结束 ======

  container.appendChild(content);

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
