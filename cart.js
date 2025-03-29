let userKey = Cookies.get("user");
let cartNum = document.getElementById("cartNum")
let loginIcon = document.getElementById('loginIcon')

function getCart() {
    fetch("https://api.everrest.educata.dev/shop/cart", {
        method: "GET",
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${userKey}`
        }
      })
        .then(res => res.json())
        .then(data => {
            updateCartInfo(data)
        })
}

function checkOut() {
    fetch("https://api.everrest.educata.dev/shop/cart/checkout", {
        method: 'POST',
        headers: {
            accept: "*/*",
            Authorization: `Bearer ${userKey}`
        }
    })
    .then(res => res.json())
    .then(data => console.log(data))
}

function totalCal() {
    fetch("https://api.everrest.educata.dev/shop/cart", {
        method: "GET",
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${userKey}`
        }
      })
        .then(res => res.json())
        .then(data => {
            document.getElementById("totalAmount").innerText = `$${data.total.price.current}`
        })
}
totalCal()

function updateCartInfo(data) {
    document.getElementById("cartItemCount").innerText = data.total.quantity
    data.products.forEach(product => cartAppear(product.productId, product.quantity))
}

function cartAppear(id, quantity) {
    fetch(`https://api.everrest.educata.dev/shop/products/id/${id}`)
    .then(res => res.json())
    .then(data => {
        document.getElementById("sc_cart_table").innerHTML += appear(data)
    })
    function appear(data) {
        console.log(data.price.current)
        return `
                <tr>
                    <td>
                        <div class="sc_product">
                            <div class="sc_product_image">
                                <img src="${data.thumbnail}" alt="">
                            </div>
                            <div class="sc_product_details">
                                <h2>${data.title}</h2>
                                <div class="stock-cart">
                                    <span>In Stock: <span>${data.stock}</span></span>
                                    <div class="rating-cart">
                                        <span>${Math.floor(data.rating *10)/10}</span>
                                        <i class="fas fa-star" style="color: rgb(255, 149, 0);"></i>
                                    </div>
                                </div>
                                <div class="reviews-cart">
                                    <span>Reviews:</span>
                                    <span>${data.ratings.length}</span>
                                </div>
                                <div class="sc_price_quantity">
                                    <span class="sc_price1">$${data.price.current}</span>
                                    <div class="sc_quantity1">
                                        <button class="sc_quantity_btn" onclick="decreaseQuantity('${data._id}')">-</button>
                                        <input type="text" value="${quantity}" min="1" id="quantityInput${data._id}" class="sc_quantity_input">
                                        <button class="sc_quantity_btn" onclick="increaseQuantity('${data._id}')">+</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </td>
                    <td class="sc_price2">$${data.price.current}</td>
                    <td class="sc_reviews">${data.ratings.length}</td>
                    <td class="sc-quantity2-container">
                        <div class="sc_quantity2">
                            <button class="sc_quantity_btn" onclick="decreaseQuantity('${data._id}')">-</button>
                            <input type="text" value="${quantity}" min="1" id="quantityInput${data._id}" class="sc_quantity_input">
                            <button class="sc_quantity_btn" onclick="increaseQuantity('${data._id}')">+</button>
                        </div>
                    </td>
                    <td class="total-x">
                        <div class="sc_total" id="price${data._id}">$${data.price.current * quantity}</div>
                        
                    </td>
                    <td><button class="sc_remove_btn" onclick="cartRemoval('${data._id}', event)">×</button></td>
                </tr>
            `
    }
    
}

getCart()

function cartRemoval(id, e) {
    e.target.parentElement.parentElement.remove()
    let trash = {
        id: id
    }
    fetch("https://api.everrest.educata.dev/shop/cart/product", {
        method: "DELETE",
        headers: {
            accept: 'application/json',
            "Content-Type": "application/json",
            Authorization: `Bearer ${userKey}`
          },
        body: JSON.stringify(trash)
    })
    .then(res => res.json())
    .then(data => totalCal())
}

function decreaseQuantity(id) {
    fetch("https://api.everrest.educata.dev/shop/cart", {
        method: "GET",
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${userKey}`
        }
      })
        .then(res => res.json())
        .then(data => {
            let array1 = data.products.filter(product => product.productId.includes(id))
            let quantity = array1[0].quantity
            
            if (quantity > 1) {
                quantity--
                
                let cardInfo = {
                    id: id,
                    quantity: quantity,
                  };
                fetch("https://api.everrest.educata.dev/shop/cart/product", {
                    method: "PATCH",
                    headers: {
                        accept: "application/json",
                        Authorization: `Bearer ${userKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(cardInfo)
                  })
                  .then(res => res.json())
                  .then(data => totalCal())
                  .catch(err => console.log(err))
            }
            document.getElementById(`quantityInput${id}`).value = quantity
            document.getElementById(`price${id}`).innerText = quantity * array1[0].pricePerQuantity
            
        })
}

function increaseQuantity(id) {
    fetch("https://api.everrest.educata.dev/shop/cart", {
        method: "GET",
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${userKey}`
        }
      })
        .then(res => res.json())
        .then(data => {
            let array1 = data.products.filter(product => product.productId.includes(id))
            let quantity = array1[0].quantity
            fetch(`https://api.everrest.educata.dev/shop/products/id/${id}`)
            .then(res => res.json())
            .then(data => {
                if (quantity < data.stock) {
                    quantity++
                    
                    let cardInfo = {
                        id: id,
                        quantity: quantity,
                      };
                    fetch("https://api.everrest.educata.dev/shop/cart/product", {
                        method: "PATCH",
                        headers: {
                            accept: "application/json",
                            Authorization: `Bearer ${userKey}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(cardInfo)
                      })
                      .then(res => res.json())
                      .then(data => totalCal())
                      .catch(err => console.log(err))
                }
                document.getElementById(`quantityInput${id}`).value = quantity
                document.getElementById(`price${id}`).innerText = quantity * array1[0].pricePerQuantity
            })
            
            
            
        })
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

