const errors = document.getElementById("errorss")

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
        console.log(data)
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

