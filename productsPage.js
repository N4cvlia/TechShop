const id = sessionStorage.getItem("Product-Id")
const name1 = document.getElementById("name1")
const name2 = document.getElementById("name2")
const releaseDate = document.getElementById("releaseDate")
const brand = document.getElementById("brand")
const price = document.getElementById("price")
const stars = document.getElementById("stars")
const stock = document.getElementById("stock")
const productImg = document.getElementById("productImg")
const rating = document.getElementById("rating")
const productInfo = document.getElementById("product-info-content")
const stockInfo = document.getElementById("stock-info")
const quantityInput = document.getElementById("quantity-input")
let userKey = Cookies.get("user");
let cartNum = document.getElementById("cartNum")
let loginIcon = document.getElementById('loginIcon')
let addCartBtn = document.getElementById("add-to-cart")
let hastCart = false
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

fetch(`https://api.everrest.educata.dev/shop/products/id/${id}`)
.then(res => res.json())
.then(data => {
    if(data.stock > 0) {
        addCartBtn.classList.remove("disabledButton")
        addCartBtn.disabled = false
    }else {
        addCartBtn.classList.add("disabledButton")
        addCartBtn.disabled = true
        addCartBtn.innerText = "No Stock"
    }
})

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
  

fetch(`https://api.everrest.educata.dev/shop/products/id/${id}`)
.then(res => res.json())
.then(data => {
    appear(data)
})
let norm = 1
function increaseQuantityBtn() {
    fetch(`https://api.everrest.educata.dev/shop/products/id/${id}`)
    .then(res => res.json())
    .then(data => {
        if(norm < data.stock) {
             norm++
        }
        quantityInput.value = norm
    }) 
}
function decreaseQuantityBtn() {
    if(norm > 1) {
        norm--
   }
   quantityInput.value = norm
}

function login() {
    window.location.href = "./logIn.html"
}

let norm1 = 0;
let imagesList = [];

function appear(data) {
    imagesList = data.images;
    imagesList.unshift(data.thumbnail)
    productImg.src = data.images[norm1]
    name1.innerText = data.title;
    name2.innerText = data.title;
    stock.innerText = `${data.stock} Units in stock`
    rating.innerText = `${Math.floor(data.rating *10)/10}`
    if(data.stock < 1) {
        stockInfo.style.color = "red"
        document.getElementById("xIcon").style.display = "flex"
        document.getElementById("checkIcon").style.display = "none"
    }else {
        stockInfo.style.color = "green"
        document.getElementById("xIcon").style.display = "none"
        document.getElementById("checkIcon").style.display = "flex"
    }
    stars.style.maxWidth = `${(Math.floor(data.rating *10)/10) * 15 + (Math.floor(data.rating *10)/10) * 2.7}px`
    productInfo.innerText = data.description
    price.innerText = "$" + data.price.current
    brand.innerText = data.brand[0].toUpperCase() + data.brand.slice(1)
    releaseDate.innerText = data.issueDate.split("T")[0]
}


function imageSwap(num) {
    if(norm1 === 0 && num === -1 || norm1 == imagesList.length - 1 && num == +1) {
        norm1
    }else {
        norm1+= num
    }
    productImg.src = imagesList[norm1]
}



function addToCart() {
    if(userKey) {
      let cardInfo = {
        id: id,
        quantity: quantityInput.value,
      };
      fetch("https://api.everrest.educata.dev/auth", {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${userKey}`,
      },
      })
      .then((res) => res.json())
      .then((data) => {
          (data.cartID ? (hastCart = true) : hastCart = false)
          addCartLogic(cardInfo)
      } );
    }else {
      alert("Please log in first to add items to your cart.")
    }
}
function addCartLogic(cardInfo) {
    fetch(`https://api.everrest.educata.dev/shop/products/id/${cardInfo.id}`)
    .then(res => res.json())
    .then(data => {
      if(data.stock > 0) {
        fetch("https://api.everrest.educata.dev/shop/cart/product", {
          method: `${hastCart ? "PATCH" : "POST"}`,
          headers: {
              accept: "application/json",
              Authorization: `Bearer ${userKey}`,
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(cardInfo)
        })
        .then(res => res.json())
        .then(data => data)
        .catch(err => console.log(err))
        
        setTimeout(() => {
          cartUpdate()
        }, 1000);
        
      }else {
        false
      }
    })
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