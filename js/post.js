document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');

  if (!slug) {
    document.getElementById('post-content').innerHTML = '<p>게시글을 찾을 수 없습니다.</p>';
    return;
  }

  fetch(`posts/${slug}.md`)
    .then(res => {
      if (!res.ok) throw new Error('게시글 로드 실패');
      return res.text();
    })
    .then(md => {
      document.getElementById('post-content').innerHTML = marked.parse(md);
    })
    .catch(err => {
      document.getElementById('post-content').innerHTML = `<p>${err.message}</p>`;
    });
});
