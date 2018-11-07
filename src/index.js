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
  productList: document.querySelector('#product-list').content,
  productItem: document.querySelector('#product-item').content

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
    drawProductList()
  })

  // 6. 템플릿을 문서에 삽입
  rootEl.textContent = ''
  rootEl.appendChild(frag)
  console.log('drawLoginForm well done')
}

// Function to draw post list
async function drawProductList() {
  // 1. 템플릿 복사
  const frag = document.importNode(templates.productList, true)

  // 2. 요소 선택
  const listEl = frag.querySelector('.product-list')

  // 3. 필요한 데이터 불러오기
  const { data: productList } = await api.get('/products?_expand=user')

  // 4. 내용 채우기
  for (const productItem of productList) {
    const frag = document.importNode(templates.productItem, true)

    const idEl = frag.querySelector('.id')
    const titleEl = frag.querySelector('.title')
    // const authorEl = frag.quereySelector('.author')

    idEl.textContent = productItem.idEl
    titleEl.textContent = productItem.title
    // authorEl.textContent = productItem.user.username

    titleEl.addEventListener('click', e => {
      drawProductDetail(productItem.id)
    })

    listEl.appendChild(frag)
  }

  // 5. 이벤트 리스너 등록하기
  // 6. 템플릿을 문서에 삽입
  rootEl.textContent = ''
  rootEl.appendChild(frag)
  console.log('drawProductList well done')
}

// 페이지 로드 시 그릴 화면 설정
if (localStorage.getItem('token')) {
  drawProductList()
} else {
  drawLoginForm()
}
