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

function goHome() {
    window.location.href = "./index.html"
}



function ratingFilter(num) {
  productsContainer.innerHTML = "";
  paginationContainer.classList.add("hidden")
  fetch(`https://api.everrest.educata.dev/shop/products/all?page_index=1&page_size=40`)
  .then(data => data.json())
  .then(data => {
    data.products.filter(data => data.rating >= num).forEach(data => productsContainer.innerHTML += appear(data))
    productsIndicator.innerHTML = `Showing 1-${data.products.filter(data => data.rating >= num).length} of ${data.products.filter(data => data.rating >= num).length} products`
    productCount.innerHTML = `${data.products.filter(data => data.rating >= num).length} products`
  })
  document.getElementById("all").checked = true
}

function minMaxPriceFilter() {
  productsContainer.innerHTML = "";
  paginationContainer.classList.add("hidden")
  fetch(`https://api.everrest.educata.dev/shop/products/search?page_index=1&page_size=40&price_min=${rangeMin.value}&price_max=${rangeMax.value}`)
  .then(data => data.json())
  .then(data => {
    data.products.forEach(datas => productsContainer.innerHTML += appear(datas));
    productsIndicator.innerHTML = `Showing 1-${data.total} of ${data.total} products`
    productCount.innerHTML = `${data.total} products`
  })
  document.getElementById("all").checked = true
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

function categoryAppear(cate,num) {
  productsContainer.innerHTML = ""
  paginationContainer.classList.add("hidden")
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
                        <input type="radio" id="${data.name}" name="box2" onclick="categoryAppear('category',${data.id})">
                        <label for="${data.name}">${data.name}</label>
                    </div>`
}
function menuAppear2(data) {
  return `<div class="siderbar-menu-options">
                        <input type="radio" id="${data}" name="box2" onclick="categoryAppear('brand','${data.toLowerCase()}')">
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
                    <div class="image-container">
                      <img src="${datas.thumbnail}" alt="Modern Laptop" referrerpolicy="no-referrer">
                    </div>
                    <div class="content">
                      <div class="name">${datas.title}</div>
                      <div class="price-rating">
                        <div class="price">${datas.price.current}$</div>
                        <div class="rating">
                          <div id="stars" style="max-width: ${(Math.floor(datas.rating *10)/10) * 15 + (Math.floor(datas.rating *10)/10) * 2.7}px">★★★★★</div>
                          <div class="reviews">${Math.floor(datas.rating *10)/10}</div>
                        </div>
                      </div>
                      <button class="add-button">ADD TO CART</button>
                    </div>
                </div>`
}

let nums = 1

function pages( num) {
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