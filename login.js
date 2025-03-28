const errors = document.getElementById("errorss")

function goToRegister() {
    window.location.href = "./register.html"
}

function login(e) {
    e.preventDefault()

    let formData = new FormData(e.target)
    let formInfo = Object.fromEntries(formData)

    fetch("https://api.everrest.educata.dev/auth/sign_in", {
        method: "POST",
        headers: {
            accept: "*/*",
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formInfo)
    })
    .then(res => res.json())
    .then(data => {
        console.log(data)
        if(data.statusCode == 400 || data.statusCode == 409){
            data.errorKeys.forEach(error => {
                errors.innerHTML = `<span id="errors">${error.split(".")[1].split("_").join(" ")}</span>` 
                setInterval(() => {
                    errors.innerHTML = ""
                }, 10000);
            })
        }else {
            errors.innerHTML = `<span class="verify">Logged in succesfully!</span>`
            setInterval(() => {
                errors.innerHTML = ""
                window.location.href = "./shop.html"
            }, 3500);
            e.target.reset()
            Cookies.set("user", data.access_token)
        }
    })
    .catch(err => console.log(err))
    
    
}