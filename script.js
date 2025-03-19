const bannerImage = document.getElementById("banner-image")


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