document.querySelector('#formUsername').addEventListener('submit', (e) => {
    e.preventDefault()

    function usernameError(error) {
        const formGroup = document.querySelector('.form-group')
        const previousError = formGroup.querySelector('.error-auth')

        if (previousError) previousError.remove()

        const message = document.createElement('p')
        message.classList.add('error-auth')
        message.classList.add('active')
        message.innerText = `Username ${error}`
        formGroup.appendChild(message)
    }

    // username already used
    // username is not valid
    // username most be 3 characters

    const username = document.querySelector('#inputUsername').value
    if (username === '') {
       usernameError('is not valid')
    } 

    const dataUser = {
        username: username
    }

    try {
        const response = fetch('/api/auth/username', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataUser)
        })

        if (response.ok) {
            console.log('registrarion successful')
            window.location.href('../login.html')
        } else {
            console.error('Registration failed')
        }

    } catch (err) {
        console.error('Error: ', err)
    }
})