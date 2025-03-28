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
        .then(data => cartNum.innerText = data.products.length)
    }else {
      cartNum.innerText = 0
    }
  }
  
  cartUpdate()

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
let imagesList = []

function appear(data) {
    imagesList = data.images
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
appear()

function imageSwap(num) {
    if(norm1 === 0 && num === -1 || norm1 == imagesList.length - 1 && num == +1) {
        norm1
    }else {
        norm1+= num
    }
    productImg.src = imagesList[norm1]
}

let hastCart = false;

function addToCart() {
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
        .then(data => console.log(data))
        .catch(err => console.log(err))
        
        setTimeout(() => {
          cartUpdate()
        }, 1000);
      }else {
        
      }
    })
  }
