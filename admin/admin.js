// admin.js 파일
// 사용자 인증 상태 확인
function checkAuthentication() {
  const user = netlifyIdentity.currentUser();
  if (!user) {
    // 사용자가 로그인되어 있지 않으면 관리자 콘텐츠 숨기기
    document.getElementById('admin-content').style.display = 'none';
    document.getElementById('login-container').style.display = 'block';
    return false;
  }
  return true;
}

// 페이지 로드 시 인증 확인
document.addEventListener('DOMContentLoaded', () => {
  // 기존 관리자 기능 코드는 여기에 추가
  // 예: 게시글 로드, 폼 제출 핸들러 등
  
  // 폼 제출 핸들러
  const postForm = document.getElementById('postForm');
  postForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // 인증 확인
    if (!checkAuthentication()) return;
    
    // 여기에 게시글 저장 로직 추가
    const postData = {
      title: document.getElementById('postTitle').value,
      date: document.getElementById('postDate').value,
      category: document.getElementById('postCategory').value,
      content: document.getElementById('postContent').value,
      slug: document.getElementById('postSlug').value || generateSlug(document.getElementById('postTitle').value)
    };
    
    savePost(postData);
  });
  
  // 초기화 버튼 핸들러
  document.getElementById('resetBtn').addEventListener('click', resetForm);
  
  // 게시글 목록 로드
  loadPosts();
});

// 게시글 저장 함수
function savePost(postData) {
  // 인증 확인
  if (!checkAuthentication()) return;
  
  // 여기에 게시글 저장 API 호출 또는 로컬 스토리지 저장 로직 추가
  console.log('게시글 저장:', postData);
  
  // 예시: 로컬 스토리지에 저장
  let posts = JSON.parse(localStorage.getItem('posts') || '[]');
  
  // 게시글 업데이트 또는 새 게시글 추가
  const existingIndex = posts.findIndex(post => post.slug === postData.slug);
  if (existingIndex >= 0) {
    posts[existingIndex] = postData;
  } else {
    posts.push(postData);
  }
  
  localStorage.setItem('posts', JSON.stringify(posts));
  
  // 폼 초기화 및 게시글 목록 갱신
  resetForm();
  loadPosts();
}

// 게시글 목록 로드 함수
function loadPosts() {
  // 인증 확인
  if (!checkAuthentication()) return;
  
  // 여기에 게시글 로드 API 호출 또는 로컬 스토리지 로드 로직 추가
  const posts = JSON.parse(localStorage.getItem('posts') || '[]');
  const postList = document.getElementById('postList');
  
  // 게시글 목록 렌더링
  postList.innerHTML = '';
  posts.forEach(post => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span><strong>${post.title}</strong></span>
      <span>${post.date}</span>
      <span>${post.category}</span>
      <div class="post-actions">
        <button type="button" data-slug="${post.slug}" class="edit-btn">수정</button>
        <button type="button" data-slug="${post.slug}" class="delete-btn">삭제</button>
      </div>
    `;
    postList.appendChild(li);
  });
  
  // 수정 버튼 이벤트 핸들러 추가
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const slug = this.getAttribute('data-slug');
      editPost(slug);
    });
  });
  
  // 삭제 버튼 이벤트 핸들러 추가
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const slug = this.getAttribute('data-slug');
      deletePost(slug);
    });
  });
}

// 게시글 수정 함수
function editPost(slug) {
  // 인증 확인
  if (!checkAuthentication()) return;
  
  const posts = JSON.parse(localStorage.getItem('posts') || '[]');
  const post = posts.find(p => p.slug === slug);
  
  if (post) {
    document.getElementById('postTitle').value = post.title;
    document.getElementById('postDate').value = post.date;
    document.getElementById('postCategory').value = post.category;
    document.getElementById('postContent').value = post.content;
    document.getElementById('postSlug').value = post.slug;
  }
}

// 게시글 삭제 함수
function deletePost(slug) {
  // 인증 확인
  if (!checkAuthentication()) return;
  
  if (confirm('정말 이 게시글을 삭제하시겠습니까?')) {
    let posts = JSON.parse(localStorage.getItem('posts') || '[]');
    posts = posts.filter(post => post.slug !== slug);
    localStorage.setItem('posts', JSON.stringify(posts));
    loadPosts();
  }
}

// 폼 초기화 함수
function resetForm() {
  document.getElementById('postForm').reset();
  document.getElementById('postSlug').value = '';
}

// 슬러그 생성 함수
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}