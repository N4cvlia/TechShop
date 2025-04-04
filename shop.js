const productsContainer = document.getElementById("products")
const pagination = document.getElementById("pagination-middle")
const paginationContainer = document.querySelector(".pagination-container")
const productsIndicator = document.getElementById("products-indicator")
const pageButton = document.getElementById("page-button")
const pageButton2 = document.getElementById("page-button2")
const pageButton3 = document.getElementById("page-button3")
const arrowButton1 = document.getElementById("arrow-button1")
const arrowButton2 = document.getElementById("arrow-button2")
const productCount = document.getElementById("product-count")
const menus = document.querySelectorAll("#siderbar-menus")
const menusArrow = document.querySelectorAll(".filter-icon")
const menusArrow2 = document.querySelectorAll(".filter-icon1")
const rangeInput = document.querySelectorAll(".range-input input");
const priceInput = document.querySelectorAll(".price-input input");
const progress = document.querySelector(".progress");
const rangeMin = document.querySelector(".range-min")
const rangeMax = document.querySelector(".range-max")
const sortBy1 = document.getElementById("sortBy1")
const allButton = document.getElementById("allButton")
let userKey = Cookies.get("user");
let cartNum = document.getElementById("cartNum")
let loginIcon = document.getElementById('loginIcon')
let cartExist;
let minMaxPriceBoolean = false;
const searchInput = document.querySelector('.search-input');
const searchResults = document.querySelector('.search-results')
let auth = sessionStorage.getItem("auth")
const customPopupMenu = document.getElementById('customPopupMenu');
const customLogoutBtn = document.getElementById('customLogoutBtn')
const loginIconImage = document.getElementById("customUserMenuBtn")


loginIconImage.addEventListener('click', function(e) {
  e.stopPropagation();
  if (customPopupMenu.style.display === 'block') {
    customPopupMenu.style.display = 'none';
  } else {
    customPopupMenu.style.display = 'block';
  }
})
document.addEventListener('click', function(e) {
  if (e.target !== loginIconImage && e.target !== customPopupMenu) {
    customPopupMenu.style.display = 'none';
  }
});
customLogoutBtn.addEventListener('click', function() {
  customPopupMenu.style.display = 'none';
  Cookies.set("user", "")
  sessionStorage.setItem("auth", false)
  setTimeout(() => {
    window.location.reload();
  }, 2000);
});

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
      })
      .catch(err => console.log(err))
}


function goToCart() {
  window.location.href = "./cart.html"
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

function goHome() {
    window.location.href = "./index.html"
}

let allBoolean = true;

function allClick() {
  appearAll(1)
  allBoolean = true
}
function removeDisability() {
  document.getElementById("sortBy1").disabled = false
  allBoolean = true
}
  
function ratingFilter(num) {
  productsContainer.innerHTML = "";
  paginationContainer.classList.add("hidden")
  minMaxPriceBoolean = false
  document.getElementById("sortBy1").disabled = true
  fetch(`https://api.everrest.educata.dev/shop/products/all?page_index=1&page_size=40`)
  .then(data => data.json())
  .then(data => {
    data.products.filter(data => data.rating >= num).forEach(data => productsContainer.innerHTML += appear(data))
    productsIndicator.innerHTML = `Showing 1-${data.products.filter(data => data.rating >= num).length} of ${data.products.filter(data => data.rating >= num).length} products`
    productCount.innerHTML = `${data.products.filter(data => data.rating >= num).length} products`
  })
  document.getElementById("allButton").checked = true
}

function resetRating() {
  document.getElementById("rating-radio1").checked = true
}

function minMaxPriceFilter() {
  productsContainer.innerHTML = "";
  paginationContainer.classList.add("hidden")
  chosenCategoryNum = 0;
  chosenBrand = ""
  minMaxPriceBoolean = true
  document.getElementById("sortBy1").disabled = false
  allBoolean = false;
  fetch(`https://api.everrest.educata.dev/shop/products/search?page_index=1&page_size=40&price_min=${rangeMin.value}&price_max=${rangeMax.value}`)
  .then(data => data.json())
  .then(data => {
    data.products.forEach(datas => productsContainer.innerHTML += appear(datas));
    productsIndicator.innerHTML = `Showing 1-${data.total} of ${data.total} products`
    productCount.innerHTML = `${data.total} products`
  })
  document.getElementById("allButton").checked = true
}

function appearAll(num) {
    productsContainer.innerHTML = ""
    paginationContainer.classList.remove("hidden")
    fetch(`https://api.everrest.educata.dev/shop/products/all?page_index=${num}&page_size=15`)
    .then(data => data.json())
    .then(data => {
      data.products.forEach(datas => productsContainer.innerHTML += appear(datas))
      productsIndicator.innerHTML = `Showing 1-15 of ${data.total} products`
      productCount.innerHTML = `${data.total} products`
    })
}

fetch("https://api.everrest.educata.dev/shop/products/categories")
.then(data => data.json())
.then(data => data.forEach(data => menus[0].innerHTML += menuAppear1(data)))

let chosenCategoryNum;
let chosenCategory;
let chosenBrand;

function categoryAppear(cate,num) {
  productsContainer.innerHTML = ""
  paginationContainer.classList.add("hidden")
  chosenCategoryNum = num
  chosenCategory = cate
  document.getElementById("sortBy1").disabled = false
  if(cate == "brand") {
    chosenBrand = num
  }else if(cate == "category") {
    chosenBrand = ""
  }
  allBoolean = false;
  minMaxPriceBoolean = false;
  fetch(`https://api.everrest.educata.dev/shop/products/${cate}/${num}?page_index=1&page_size=30`)
  .then(data => data.json())
  .then(data => {
    data.products.forEach(data => productsContainer.innerHTML += appear(data))
    productsIndicator.innerHTML = `Showing 1-${data.total} of ${data.total} products`
    productCount.innerHTML = `${data.total} products`
  })
}



function menuAppear1(data) {
  return `<div class="siderbar-menu-options">
                        <input type="radio" id="${data.name}" name="box2" onclick="categoryAppear('category',${data.id}); resetSortBy(); resetRating()">
                        <label for="${data.name}">${data.name}</label>
                    </div>`
}
function menuAppear2(data) {
  return `<div class="siderbar-menu-options">
                        <input type="radio" id="${data}" name="box2" onclick="categoryAppear('brand','${data.toLowerCase()}'); resetSortBy(); resetRating()">
                        <label for="${data}">${data}</label>
                    </div>`
}

function menuClick(num) {
  menus[num].classList.toggle("show")
  menusArrow[num].classList.toggle("hidden")
  menusArrow2[num].classList.toggle("show")
}

document.addEventListener('click', function(event) {
  if (!event.target.closest('.filter-option')) {
    menus.forEach(menu => menu.classList.remove('show'))
    menusArrow.forEach(arrow => arrow.classList.remove("hidden"))
    menusArrow2.forEach(arrow => arrow.classList.remove("show"))
  }
})

fetch("https://api.everrest.educata.dev/shop/products/brands")
.then(data => data.json())
.then(data => data.forEach(data => menus[1].innerHTML += menuAppear2(data.split("")[0].toUpperCase()+ data.slice(1))))

function appear(datas) {
    return `<div class="card">
                    <div class="image-container" onclick="goToPage('${datas._id}')">
                      <img src="${datas.thumbnail}" alt="Modern Laptop" referrerpolicy="no-referrer">
                    </div>
                    <div class="content">
                      <div class="name" onclick="goToPage('${datas._id}')">${datas.title}</div>
                      <div class="price-rating" onclick="goToPage('${datas._id}')">
                        <div class="price">${datas.price.current}$</div>
                        <div class="rating">
                          <div id="stars" style="max-width: ${(Math.floor(datas.rating *10)/10) * 15 + (Math.floor(datas.rating *10)/10) * 2.7}px">★★★★★</div>
                          <div class="reviews">${Math.floor(datas.rating *10)/10}</div>
                        </div>
                      </div>
                      <button class="add-button" onclick="addToCart('${datas._id}')">ADD TO CART</button>
                      <span id="noStock${datas._id}" class="Hidden noStock">No stock</span>
                      <span id="yesStock${datas._id}" class="Hidden yesStock">Added to cart</span>
                    </div>
                </div>`
}

function goToPage(id) {
  window.location.href = "./productPage.html"
  sessionStorage.setItem("Product-Id", id)
}

let hastCart = false;

function addToCart(id) {
  if(userKey) {
    let cardInfo = {
      id: id,
      quantity: 1,
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

const noStock = document.querySelectorAll("noStock")
const yesStock = document.querySelectorAll("yesStock")

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
      let stock = `yesStock${cardInfo.id}`
        document.getElementById(`${stock}`).classList.remove("Hidden")
          setTimeout(() => {
            document.getElementById(`${stock}`).classList.add("Hidden")
          }, 3000);
      setTimeout(() => {
        cartUpdate()
      }, 1000);
    }else {
      let stock = `noStock${cardInfo.id}`
        document.getElementById(`${stock}`).classList.remove("Hidden")
        setTimeout(() => {
          document.getElementById(`${stock}`).classList.add("Hidden")
        }, 2500);
    }
  })
}

function login() {
  window.location.href = "./logIn.html"
}

let nums = 1

function pages(num) {
  nums = num
  appearAll(nums)
  if (num == 1) {
    pageButton.classList.add("active")
    pageButton2.classList.remove("active")
    pageButton3.classList.remove("active")
  }else if(num ==2) {
    pageButton2.classList.add("active")
    pageButton3.classList.remove("active")
    pageButton.classList.remove("active")
  }else if(num == 3){
    pageButton3.classList.add("active")
    pageButton2.classList.remove("active")
    pageButton.classList.remove("active")
  }
  fetch(`https://api.everrest.educata.dev/shop/products/all?page_index=1&page_size=15`)
    .then(data => data.json())
    .then(data => {
      productsIndicator.innerHTML = `Showing ${nums * 15 - 14}-${nums * 15 > data.total ? data.total : nums * 15} of ${data.total} products`;
      productCount.innerHTML = `${data.total} products`
    })
}
pages(1)
arrowButton1.addEventListener("click", () => {
  if (nums > 1) {
    nums--
    pages(nums)
  }
})
arrowButton2.addEventListener("click", () => {
  if (nums < 3) {
    nums++
    pages(nums)
  }
})

const minRange = 50;
const maxRange = 8000;
const rangeStep = 10;
        
priceInput.forEach(input => {
input.addEventListener("input", e => {
                let minVal = parseInt(priceInput[0].value);
                let maxVal = parseInt(priceInput[1].value);
                
                if((maxVal - minVal >= rangeStep) && maxVal <= maxRange) {
                    if(e.target.className === "input-min") {
                        rangeInput[0].value = minVal;
                        updateProgress();
                    } else {
                        rangeInput[1].value = maxVal;
                        updateProgress();
                    }
                }
            });
        });
        
        rangeInput.forEach(input => {
            input.addEventListener("input", e => {
                let minVal = parseInt(rangeInput[0].value);
                let maxVal = parseInt(rangeInput[1].value);
                
                if(maxVal - minVal < rangeStep) {
                    if(e.target.className === "range-min") {
                        rangeInput[0].value = maxVal - rangeStep;
                    } else {
                        rangeInput[1].value = minVal + rangeStep;
                    }
                } else {
                    priceInput[0].value = minVal;
                    priceInput[1].value = maxVal;
                    updateProgress();
    }
  });
});
        
  function updateProgress() {
  let minVal = parseInt(rangeInput[0].value);
  let maxVal = parseInt(rangeInput[1].value);
            
  let percent1 = (minVal / maxRange) * 100;
  let percent2 = (maxVal / maxRange) * 100;
            
  progress.style.left = percent1 + "%";
  progress.style.right = (100 - percent2) + "%";
}        
updateProgress();

function appearSortBy(sortBy, direction) {
  productsContainer.innerHTML = ""
  fetch(`https://api.everrest.educata.dev/shop/products/search?page_index=1&page_size=40&category_id=${chosenCategoryNum > 0 ? chosenCategoryNum : ""}&sort_by=${sortBy}&sort_direction=${direction}`)
  .then(res => res.json())
  .then(data => {
    data.products.forEach(data => productsContainer.innerHTML += appear(data))
    productsIndicator.innerHTML = `Showing 1-${data.total} of ${data.total} products`
    productCount.innerHTML = `${data.total} products`
  })
  
}

function appearSortByBrands(sortBy, direction) {
  productsContainer.innerHTML = ""
  fetch(`https://api.everrest.educata.dev/shop/products/search?page_index=1&page_size=40&brand=${chosenBrand}&sort_by=${sortBy}&sort_direction=${direction}`)
  .then(res => res.json())
  .then(data => {
    data.products.forEach(data => productsContainer.innerHTML += appear(data))
    productsIndicator.innerHTML = `Showing 1-${data.total} of ${data.total} products`
    productCount.innerHTML = `${data.total} products`
  })
}


function appearSortByPrice(sortBy, direction) {
  productsContainer.innerHTML = ""
  let minimumPrice = document.getElementById("input-min").value
  let maximumPrice = document.getElementById("input-max").value

  fetch(`https://api.everrest.educata.dev/shop/products/search?page_index=1&page_size=40&price_min=${minimumPrice}&price_max=${maximumPrice}&sort_by=${sortBy}&sort_direction=${direction}`)
  .then(res => res.json())
  .then(data => {
    data.products.forEach(data => productsContainer.innerHTML += appear(data))
    productsIndicator.innerHTML = `Showing 1-${data.total} of ${data.total} products`
    productCount.innerHTML = `${data.total} products`
  })
}

sortBy1.addEventListener("change", (e) => {
  switch(e.target.value) {
    case 'option1':
      if (allBoolean) {
        chosenCategoryNum = 0;
        appearSortBy("price", "asc")
        paginationContainer.classList.add("hidden")
        nums = 1
      }else {
        if (chosenBrand) {
          appearSortByBrands("price", "asc")
        }else if(minMaxPriceBoolean) {
          appearSortByPrice("price", "asc")
        }else{
          appearSortBy("price", "asc")
        }
        paginationContainer.classList.add("hidden")
      }
      break;
    case "option2":
      if (allBoolean) {
        chosenCategoryNum = 0;
        appearSortBy("price", "desc")
        paginationContainer.classList.add("hidden")
        nums = 1
      }else {
        if (chosenBrand) {
          appearSortByBrands("price", "desc")
        }else if(minMaxPriceBoolean) {
          appearSortByPrice("price", "desc")
        }else {
          appearSortBy("price", "desc")
        }
        paginationContainer.classList.add("hidden")
      }
      break;
    case "option3":
      if (allBoolean) {
        chosenCategoryNum = 0;
        appearSortBy("title", "asc")
        paginationContainer.classList.add("hidden")
        nums = 1
      }else {
        if (chosenBrand) {
          appearSortByBrands("title", "asc")
        }else if(minMaxPriceBoolean) {
          appearSortByPrice("title", "asc")
        }else {
          appearSortBy("title", "asc")
        }
        paginationContainer.classList.add("hidden")
      }
      break;
    case "option4":
      if (allBoolean) {
        chosenCategoryNum = 0;
        appearSortBy("title", "desc")
        paginationContainer.classList.add("hidden")
        nums = 1
      }else {
        if (chosenBrand) {
          appearSortByBrands("title", "desc")
        }else if(minMaxPriceBoolean) {
          appearSortByPrice("title", "desc")
        }else {
          appearSortBy("title", "desc")
        }
        paginationContainer.classList.add("hidden")
      }
      break;
    default:
      if(allBoolean) {
        pages(1)
        paginationContainer.classList.remove("hidden")
        nums = 1
      }else {
        if (chosenBrand) {
          categoryAppear('brand', `${chosenBrand}`)
        }else if(minMaxPriceBoolean) {
          minMaxPriceFilter()
        }else {
          categoryAppear(chosenCategory,chosenCategoryNum)
        }
        paginationContainer.classList.add("hidden")
      } 
  }
})

function resetSortBy() {
  sortBy1.selectedIndex = 0 
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