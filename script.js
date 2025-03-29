const bannerImage = document.getElementById("banner-image")
let userKey = Cookies.get("user");
let cartNum = document.getElementById("cartNum")
let loginIcon = document.getElementById('loginIcon')

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
        .then(data => cartNum.innerText = data.products.length)
    }else {
      cartNum.innerText = 0
    }
  }
  
  cartUpdate()