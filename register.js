const errors = document.getElementById("errorss")
const searchInput = document.querySelector('.search-input');
const searchResults = document.querySelector('.search-results')

function goToLogin() {
    window.location.href = "./login.html"
}

function register(e) {
    e.preventDefault()

    let formData = new FormData(e.target)
    let formInfo = Object.fromEntries(formData)

    fetch("https://api.everrest.educata.dev/auth/sign_up", {
        method: "POST",
        headers: {
            accept: "*/*",
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formInfo)
    })
    .then(res => res.json())
    .then(data => {
        if(data.statusCode == 400 || data.statusCode == 409){
            data.errorKeys.forEach(error => {
                errors.innerHTML += `<span id="errors">${error.split(".")[1].split("_").join(" ")}</span>` 
                setInterval(() => {
                    errors.innerHTML = ""
                }, 10000);
            })
        }else {
            errors.innerHTML = `<span class="verify">Verify Your Email!</span>`
            setInterval(() => {
                errors.innerHTML = ""
                window.location.href = "./login.html"
            }, 10000);
            e.target.reset()
        }
    })
    .catch(err => console.log(err))

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
