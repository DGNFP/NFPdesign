document.addEventListener('DOMContentLoaded', () => {
  // URL 쿼리에서 slug 가져오기
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');

  const postContainer = document.getElementById('post-content');

  if (!slug) {
    postContainer.innerHTML = '<p>잘못된 접근입니다. 게시글을 찾을 수 없습니다.</p>';
    return;
  }

  // localStorage에서 글 불러오기
  const data = localStorage.getItem('nfpdesign_posts');
  const posts = data ? JSON.parse(data) : [];

  const post = posts.find(p => p.slug === slug);

  if (!post) {
    postContainer.innerHTML = '<p>게시글을 찾을 수 없습니다.</p>';
    return;
  }

  // 마크다운 파서 (간단한 예시로 marked 라이브러리 사용)
  // https://cdn.jsdelivr.net/npm/marked/marked.min.js 스크립트를 post.html에 추가해야 합니다.
  const mdContent = marked.parse(post.content);

  postContainer.innerHTML = `
    <h1>${post.title}</h1>
    <p class="date">${post.date}</p>
    <p class="category">${post.category}</p>
    <div class="content">${mdContent}</div>
  `;
});
