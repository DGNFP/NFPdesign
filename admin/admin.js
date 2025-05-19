// admin.js
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('postForm');
  const postList = document.getElementById('postList');
  const resetBtn = document.getElementById('resetBtn');

  // 로컬스토리지 키
  const STORAGE_KEY = 'nfpdesign_posts';

  // 현재 수정중인 글 슬러그
  let editingSlug = null;

  // 저장된 게시글 불러오기
  function loadPosts() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  // 저장된 게시글 저장하기
  function savePosts(posts) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  }

  // 게시글 목록 화면에 표시
  function renderPosts() {
    const posts = loadPosts();
    postList.innerHTML = '';

    if (posts.length === 0) {
      postList.innerHTML = '<li>저장된 게시글이 없습니다.</li>';
      return;
    }

    posts.forEach(post => {
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>${post.title}</strong> (${post.date}) [${post.category}]
        <div class="post-actions">
          <button data-slug="${post.slug}" class="editBtn">수정</button>
          <button data-slug="${post.slug}" class="deleteBtn">삭제</button>
        </div>
      `;
      postList.appendChild(li);
    });
  }

  // 유니크 슬러그 생성 (제목에서 특수문자 제거 + 날짜 + 랜덤 숫자)
  function generateSlug(title) {
    const slugBase = title.toLowerCase().replace(/[^a-z0-9가-힣]+/g, '-').replace(/^-|-$/g, '');
    const randomNum = Math.floor(Math.random() * 10000);
    return `${slugBase}-${Date.now()}-${randomNum}`;
  }

  // 폼 초기화
  function resetForm() {
    editingSlug = null;
    form.reset();
    document.getElementById('postSlug').value = '';
  }

  // 폼에 데이터 채우기 (수정용)
  function fillForm(post) {
    editingSlug = post.slug;
    document.getElementById('postSlug').value = post.slug;
    document.getElementById('postTitle').value = post.title;
    document.getElementById('postDate').value = post.date;
    document.getElementById('postCategory').value = post.category;
    document.getElementById('postContent').value = post.content;
  }

  // 글 저장 (새 글 또는 수정)
  form.addEventListener('submit', e => {
    e.preventDefault();

    const title = document.getElementById('postTitle').value.trim();
    const date = document.getElementById('postDate').value.trim();
    const category = document.getElementById('postCategory').value;
    const content = document.getElementById('postContent').value.trim();

    if (!title || !date || !category || !content) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    const posts = loadPosts();

    if (editingSlug) {
      // 수정: 기존 글 찾아 업데이트
      const index = posts.findIndex(p => p.slug === editingSlug);
      if (index > -1) {
        posts[index] = { slug: editingSlug, title, date, category, content };
      }
    } else {
      // 새 글: 슬러그 생성 후 추가
      const slug = generateSlug(title);
      posts.push({ slug, title, date, category, content });
    }

    savePosts(posts);
    renderPosts();
    resetForm();
  });

  // 게시글 수정 버튼 이벤트 처리
  postList.addEventListener('click', e => {
    if (e.target.classList.contains('editBtn')) {
      const slug = e.target.getAttribute('data-slug');
      const posts = loadPosts();
      const post = posts.find(p => p.slug === slug);
      if (post) fillForm(post);
    }

    // 게시글 삭제 버튼 이벤트 처리
    if (e.target.classList.contains('deleteBtn')) {
      if (!confirm('정말 삭제하시겠습니까?')) return;
      const slug = e.target.getAttribute('data-slug');
      let posts = loadPosts();
      posts = posts.filter(p => p.slug !== slug);
      savePosts(posts);
      renderPosts();
      if (editingSlug === slug) resetForm();
    }
  });

  // 초기화 버튼 클릭 시 폼 초기화
  resetBtn.addEventListener('click', () => {
    resetForm();
  });

  // 초기 게시글 목록 표시
  renderPosts();
});
