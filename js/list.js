document.addEventListener('DOMContentLoaded', () => {
  const postsPerPage = 5;
  let currentPage = 1;

  // localStorage에서 글 불러오기
  function loadPosts() {
    const data = localStorage.getItem('nfpdesign_posts');
    return data ? JSON.parse(data) : [];
  }

  let posts = loadPosts();
  let filteredPosts = [...posts];

  const postsContainer = document.getElementById('post-list');
  const paginationContainer = document.getElementById('pagination');
  const categoryFilter = document.getElementById('categoryFilter');

  function renderPosts() {
    postsContainer.innerHTML = '';
    const start = (currentPage - 1) * postsPerPage;
    const pagePosts = filteredPosts.slice(start, start + postsPerPage);

    if (pagePosts.length === 0) {
      postsContainer.innerHTML = '<p>게시글이 없습니다.</p>';
      return;
    }

    pagePosts.forEach(post => {
      const postEl = document.createElement('li');
      postEl.className = 'post-card';
      postEl.innerHTML = `
        <h2><a href="post.html?slug=${post.slug}">${post.title}</a></h2>
        <p class="date">${post.date}</p>
        <p class="category">${post.category}</p>
        <p class="excerpt">${post.content.substring(0, 100)}...</p>
      `;
      postsContainer.appendChild(postEl);
    });
  }

  function renderPagination() {
    paginationContainer.innerHTML = '';
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement('button');
      btn.textContent = i;
      btn.className = i === currentPage ? 'active' : '';
      btn.addEventListener('click', () => {
        currentPage = i;
        renderPosts();
        renderPagination();
      });
      paginationContainer.appendChild(btn);
    }
  }

  categoryFilter.addEventListener('change', () => {
    const selected = categoryFilter.value;
    posts = loadPosts(); // 최신 글 불러오기
    filteredPosts = selected === 'all' ? posts : posts.filter(p => p.category === selected);
    currentPage = 1;
    renderPosts();
    renderPagination();
  });

  renderPosts();
  renderPagination();
});
