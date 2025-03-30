let userKey = Cookies.get("user");
let cartNum = document.getElementById("cartNum")
let loginIcon = document.getElementById('loginIcon')
let cartExist;

function login() {
    window.location.href = "./login.html"
}

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
                totalCal()
                cartUpdate()
                getCart()
            }else {
                cartExist = false
            }
        } );
}
cartExists()

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
            if(data.statusCode !== 409) {
                updateCartInfo(data)
            }
        })
        .catch(err => console.log(err))
}

function updateTotalItems() {
    setTimeout(() => {
        fetch("https://api.everrest.educata.dev/shop/cart", {
            method: "GET",
            headers: {
              accept: 'application/json',
              Authorization: `Bearer ${userKey}`
            }
          })
            .then(res => res.json())
            .then(data => {
                if(data.statusCode !== 409) {
                    document.getElementById("cartItemCount").innerHTML = data.total.quantity
                    cartNum.innerText = data.total.quantity
                }
            })
            .catch(err => console.log(err))
    }, 1000);
    
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
            if(data.statusCode == 409) {
                document.getElementById("totalAmount").innerText = `$0`
            }else {
                document.getElementById("totalAmount").innerText = `$${data.total.price.current}`
            }
        })
        .catch(err => console.log(err))
}


function updateCartInfo(data) {
    updateTotalItems()
    data.products.forEach(product => cartAppear(product.productId, product.quantity))
}

function cartAppear(id, quantity) {
    fetch(`https://api.everrest.educata.dev/shop/products/id/${id}`)
    .then(res => res.json())
    .then(data => {
        document.getElementById("sc_cart_table").innerHTML += appear(data)
    })
    function appear(data) {
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
                                        <input type="text" value="${quantity}" min="1" id="quantityInput${data._id}1" class="sc_quantity_input">
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
                            <input type="text" value="${quantity}" min="1" id="quantityInput${data._id}2" class="sc_quantity_input">
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
    .then(data => {
        totalCal()
        cartUpdate()
        updateTotalItems()
    })
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
                  updateTotalItems()
                  
            }
            document.getElementById(`quantityInput${id}1`).value = quantity
            document.getElementById(`quantityInput${id}2`).value = quantity
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
                      updateTotalItems()
                      
                }
                document.getElementById(`quantityInput${id}1`).value = quantity
                document.getElementById(`quantityInput${id}2`).value = quantity
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
        .then(data => cartNum.innerText = data.total.quantity)
    }else {
      cartNum.innerText = 0
    }
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
    document.getElementById("sc_cart_table").innerHTML = ""
    document.getElementById("totalAmount").innerText = `$0`
    document.getElementById("cartItemCount").innerHTML = 0
    cartNum.innerText = 0
    setTimeout(() => {
        window.location.href = "./shop.html"
        alert("Succesfully checked out!")
    }, 2000);
    
}