const bannerImage = document.getElementById("banner-image")
let userKey = Cookies.get("user");
let cartNum = document.getElementById("cartNum")
let loginIcon = document.getElementById('loginIcon')
let cartExist;
let auth = sessionStorage.getItem("auth")
const searchInput = document.querySelector('.search-input');
const searchResults = document.querySelector('.search-results')

if (userKey) {
    sessionStorage.setItem("auth", true)
  }else {
    sessionStorage.setItem("auth", false)
  }

function checkAuth() {
  if(auth == "true") {
    cartExists()
  }
}
checkAuth()

function cartExists() {
  fetch("https://api.everrest.educata.dev/auth", {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${userKey}`,
      },
      })
      .then((res) => res.json())
      .then((data) => {
          if (data.cartID) {
              cartExist = true
              cartUpdate()
          }else {
              cartExist = false
          }
      } );
}

function goToCart() {
    window.location.href = "./cart.html"
  }

let bannerImages = ["https://static.wixstatic.com/media/c837a6_837f9cd4f59146c3ad47a2bd882fedfd~mv2.png/v1/fill/w_1920,h_922,al_r,q_90,enc_avif,quality_auto/c837a6_837f9cd4f59146c3ad47a2bd882fedfd~mv2.png", "https://static.wixstatic.com/media/c837a6_9c1280daaeb0481abc58e6e236efdf59~mv2.png/v1/fill/w_1920,h_734,al_br,q_90,enc_avif,quality_auto/c837a6_9c1280daaeb0481abc58e6e236efdf59~mv2.png", "https://static.wixstatic.com/media/c837a6_f58829a26e594ca3aa72383e19cf39b9~mv2.png/v1/fill/w_1920,h_922,al_r,q_90,enc_avif,quality_auto/c837a6_f58829a26e594ca3aa72383e19cf39b9~mv2.png"] 
let num = -1
setInterval(() => {
    num++
    num > 2 ? num = 0 : false
    bannerImage.src= bannerImages[num]
}, 5000);

function goToShop() {
    window.location.href = "./shop.html"
}
function login() {
    window.location.href = "./logIn.html"
}

function loginUpdate() {
    if(userKey) {
      loginIcon.classList.add("hidden")
      document.getElementById("loginImage").classList.remove("hidden")
      fetch(`https://api.everrest.educata.dev/auth`, {
        method: "GET",
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${userKey}`
        }
      })
      .then(res => res.json())
      .then(data => document.getElementById("loginImage").src = data.avatar)
    } else {
      document.getElementById("loginImage").classList.add("hidden")
      loginIcon.classList.remove("hidden")
    }
  }
  
  loginUpdate()

  function cartUpdate() {
    if(userKey) {
        fetch("https://api.everrest.educata.dev/shop/cart", {
          method: "GET",
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${userKey}`
          }
        })
          .then(res => res.json())
          .then(data => cartNum.innerText = data.total.quantity)
      }else {
        cartNum.innerText = 0
      }
  }
  let filteredInfo;

async function filterProducts(query) {
  if (!query) return [];
  
  query = query.toLowerCase();
try {
  const response = await fetch("https://api.everrest.educata.dev/shop/products/all?page_index=1&page_size=40")
  const data = await response.json()
  filteredInfo = data.products.filter(product => product.title.toLowerCase().includes(query))
  return filteredInfo
}catch (error) {
  console.error('Error fetching products:', error);
  return [];
}}

function renderResults(results) {
  searchResults.innerHTML = '';

  if (results.length === 0) {
    searchResults.innerHTML = '<div class="no-results-found">No products found</div>';
    return;
  }
  
  results.forEach(product => {
    const productElement = document.createElement('div');
    productElement.className = 'product-item';
    productElement.innerHTML = `
      <img class="product-image" src="${product.thumbnail}"></img>
      <div class="product-info">
        <h3 class="product-name">${product.title}</h3>
        <p class="product-price">$${product.price.current}</p>
      </div>
    `;
    
    productElement.addEventListener('click', () => {
      searchInput.value = product.title;
      searchResults.style.display = 'none';
      goToPage(`${product._id}`)
    });
    
    searchResults.appendChild(productElement);
  })
}

searchInput.addEventListener('input', () => {
  const query = searchInput.value.trim();
  
  if (query === '') {
    searchResults.style.display = 'none';
  } else {
    filterProducts(query)
    .then( result => {
      renderResults(result)
    })
    ;
    searchResults.style.display = 'block';
  }
});

document.addEventListener('click', (event) => {
  if (!searchInput.contains(event.target) && !searchResults.contains(event.target)) {
    searchResults.style.display = 'none';
  }
});

searchInput.addEventListener('click', (event) => {
  if (searchInput.value.trim() !== '') {
    searchResults.style.display = 'block';
  }
  event.stopPropagation();
})
function goToPage(id) {
    window.location.href = "./productPage.html"
    sessionStorage.setItem("Product-Id", id)
  }
  