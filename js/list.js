document.addEventListener('DOMContentLoaded', () => {
  const postsPerPage = 5;
  let currentPage = 1;
  let posts = [
    {
      title: "디자인 작업 예시",
      date: "2025-05-18",
      category: "웹디자인",
      slug: "sample-post",
      excerpt: "클라이언트를 위한 반응형 홈페이지 디자인 사례입니다."
    },
    // 여기에 마크다운 글 메타데이터 추가
  ];

  let filteredPosts = [...posts];

  const postsContainer = document.getElementById('posts-container');
  const paginationContainer = document.getElementById('pagination');
  const categoryFilter = document.getElementById('category-filter');

  function renderPosts() {
    postsContainer.innerHTML = '';
    const start = (currentPage - 1) * postsPerPage;
    const pagePosts = filteredPosts.slice(start, start + postsPerPage);

    if (pagePosts.length === 0) {
      postsContainer.innerHTML = '<p>게시글이 없습니다.</p>';
      return;
    }

    pagePosts.forEach(post => {
      const postEl = document.createElement('article');
      postEl.className = 'post-card';
      postEl.innerHTML = `
        <h2><a href="post.html?slug=${post.slug}">${post.title}</a></h2>
        <p class="date">${post.date}</p>
        <p class="category">${post.category}</p>
        <p class="excerpt">${post.excerpt}</p>
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
    filteredPosts = selected === 'all' ? posts : posts.filter(p => p.category === selected);
    currentPage = 1;
    renderPosts();
    renderPagination();
  });

  renderPosts();
  renderPagination();
});
