import '@babel/polyfill' // 이 라인을 지우지 말아주세요!

import axios from 'axios'

const api = axios.create({
  baseURL: "https://juicy-rover.glitch.me/"
});

api.interceptors.request.use(function (config) {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers = config.headers || {}
    config.headers['Authorization'] = 'Bearer ' + token
  }
  return config
});

const templates = {
  loginForm: document.querySelector('#login-form').content,
  postList: document.querySelector('#post-list').content,
  postItem: document.querySelector('#post-item').content,

}

const rootEl = document.querySelector('.root')

// 페이지 그리는 함수 작성 순서
// 1. 템플릿 복사
// 2. 요소 선택
// 3. 필요한 데이터 불러오기
// 4. 내용 채우기
// 5. 이벤트 리스너 등록하기
// 6. 템플릿을 문서에 삽입

// Function to draw login form
async function drawLoginForm() {
  // 1. 템플릿 복사
  const frag = document.importNode(templates.loginForm, true)

  // 2. 요소 선택
  const formEl = frag.querySelector('.login-form')

  // 3. 필요한 데이터 불러오기
  // 4. 내용 채우기
  // 5. 이벤트 리스너 등록하기
  formEl.addEventListener('submit', async e => {
    e.preventDefault()
    const username = e.target.elements.username.value
    const password = e.target.elements.password.value

    const res = await api.post('/users/login', {
      username,
      password
    })
    localStorage.setItem('token', res.data.token)
    drawPostList()
  })

  // 6. 템플릿을 문서에 삽입
  rootEl.textContent = ''
  rootEl.appendChild(frag)
  console.log('drawLoginForm well done')
}

// drawLoginForm()

// Function to draw post list
async function drawPostList() {
  // 1. 템플릿 복사
  const frag = document.importNode(templates.postList, true)

  // 2. 요소 선택
  const listEl = frag.querySelector('.post-list')

  // 3. 필요한 데이터 불러오기
  const {data: postList} = await api.get('/posts?_expand=user')

  // 4. 내용 채우기
  for (const postItem of postList) {
    const frag = document.importNode(templates.postItem, true)

    const idEl = frag.querySelector('.id')
    const titleEl = frag.querySeletor('.title')
    const authorEl = frag.quereySelector('.author')

    idEl.textContent = postItem.idEl
    titleEl.textContent = postItem.title
    authorEl.textContent = postItem.user.username

    titleEl.addEventListener('click', e => {
      drawPostDetail(postItem.id)
    })

    listEl.appendChild(frag)
  }

  // 5. 이벤트 리스너 등록하기
  // 6. 템플릿을 문서에 삽입
  rootEl.textContent = ''
  rootEl.appendChild(frag)
  console.log('drawPostList well done')
}

// // 1. 템플릿 복사
// const frag = document.importNode(templates.postList, true)

// // 2. 요소 선택
// const listEl = frag.querySelector('.post-list')
// const createEl = frag.querySelector('.create')

// // 3. 필요한 데이터 불러오기
// const { data: postList } = await api.get('/posts?_expand=user')
// // const res = await api.get('/posts?_embed=user')
// // const postList = res.data

// // 4. 내용 채우기
// for (const postItem of postList) {
//   const frag = document.importNode(templates.postItem, true)

//   const idEl = frag.querySelector('.id')
//   const titleEl = frag.querySelector('.title')
//   const authorEl = frag.querySelector('.author')

//   idEl.textContent = postItem.id
//   titleEl.textContent = postItem.title
//   authorEl.textContent = postItem.user.username

//   titleEl.addEventListener('click', e => {
//     drawPostDetail(postItem.id)
//   })

//   listEl.appendChild(frag)
// }

// // 5. 이벤트 리스너 등록하기
// createEl.addEventListener('click', e => {
//   drawNewPostForm()
// })

// // 6. 템플릿을 문서에 삽입
// rootEl.textContent = ''
// rootEl.appendChild(frag)

// 페이지 로드 시 그릴 화면 설정
if (localStorage.getItem('token')) {
  drawPostList()
} else {
  drawLoginForm()
}
