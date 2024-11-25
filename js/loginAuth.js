document.querySelector('#btnRedirectionSignUp').addEventListener('click', () => {
  window.location.href = '/register.html'
})

document.querySelector('#formContainer').addEventListener('submit', async (e) => {
  e.preventDefault()

  const userCredentialInput = document.querySelector('#userCredential')
  const userPasswordInput = document.querySelector('#userPassword')
  const emailErrorElement = document.querySelector('.email-error')
  const passwordErrorElement = document.querySelector('.password-error')

  emailErrorElement.classList.remove('active')
  passwordErrorElement.classList.remove('active')

  let isValid = true

  if (!userCredentialInput.value.trim()) {
    emailErrorElement.classList.add('active')
    isValid = false
  }

  if (!userPasswordInput.value.trim()) {
    passwordErrorElement.classList.add('active')
    isValid = false
  } else if (userPasswordInput.value.length < 8) {
    passwordErrorElement.textContent = 'Password must be at least 8 characters'
    passwordErrorElement.classList.add('active')
    isValid = false
  }

  if (isValid) {
    const formData = {
      credentials: userCredentialInput.value.trim(),
      password: userPasswordInput.value
    }

    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        console.log('Login success')
        window.location.href = '/index.html'
      } else {
        const errorData = await response.json()
        console.error('Registration failed', errorData)
      }
    } catch (err) {
      console.error('Error: ', err)
    }
  }
})
