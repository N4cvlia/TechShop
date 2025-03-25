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

fetch(`https://api.everrest.educata.dev/shop/products/id/${id}`)
.then(res => res.json())
.then(data => {
    appear(data)
    console.log(data)
})
let norm = 1
function quantityBtn(num) {
    console.log(norm)
    if(norm == 1 && num == -1) {
        false
    }else {
        norm+= num
    }
    quantityInput.value = norm
}

function login() {
    window.location.href = "./logIn.html"
}

let norm1 = 0;
let images = []

function appear(data) {
    images = data.images
    images.unshift(data.thumbnail)
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
appear()
function imageSwap(num) {
    if(norm1 === 0 && num === -1 || norm1 == images.length - 1 && num == +1) {
        norm1
    }else {
        norm1+= num
    }
    productImg.src = images[norm1]
}

