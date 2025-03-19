const productsContainer = document.getElementById("products")
const pagination = document.getElementById("pagination-middle")
const productsIndicator = document.getElementById("products-indicator")
const pageButton = document.getElementById("page-button")
const pageButton2 = document.getElementById("page-button2")
const pageButton3 = document.getElementById("page-button3")
const arrowButton1 = document.getElementById("arrow-button1")
const arrowButton2 = document.getElementById("arrow-button2")
const productCount = document.getElementById("product-count")

function goHome() {
    window.location.href = "./index.html"
}

function appearAll(num) {
    productsContainer.innerHTML = ""
    fetch(`https://api.everrest.educata.dev/shop/products/all?page_index=${num}&page_size=15`)
    .then(data => data.json())
    .then(data => data.products.forEach(datas => productsContainer.innerHTML += appear(datas)))
}

appearAll(1)

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

