document.querySelector('#btnRedirectionLogIn').addEventListener('click', () => {
  window.location.href = ' /login.html'
})

document.querySelectorAll('.toggle-password').forEach(icon => {
  icon.addEventListener('click', () => {
    const input = icon.closest('.form-group').querySelector('input')
    const inputType = input.getAttribute('type')

    input.setAttribute('type', inputType === 'password' ? 'text' : 'password')

    if (inputType === 'password') {
      icon.classList.remove('fa-eye')
      icon.classList.add('fa-eye-slash')
    } else {
      icon.classList.remove('fa-eye-slash')
      icon.classList.add('fa-eye')
    }
  })
})

document.querySelector('#formContainer').addEventListener('submit', async (e) => {
  e.preventDefault()

  const userEmail = document.querySelector('#userEmail').value
  const userPassword = document.querySelector('#userPassword').value
  const confirmPassword = document.querySelector('#confirmPassword').value

  const passwordErrorMatch = document.querySelector('.password-error-match')
  const emailError = document.querySelector('.email-error')

  passwordErrorMatch.classList.remove('active')
  emailError.classList.remove('active')

  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
  if (!emailPattern.test(userEmail)) {
    emailError.classList.add('active')
    emailError.textContent = 'Invalid email format'
    return
  }

  if (userPassword !== confirmPassword) {
    passwordErrorMatch.classList.add('active')
    passwordErrorMatch.textContent = 'Passwords do not match'
    return
  }

  if (userPassword.length < 8) {
    passwordErrorMatch.classList.add('active')
    passwordErrorMatch.textContent = 'Password must be at least 8 characters'
    return
  }

  const data = {
    email: userEmail,
    password: userPassword
  }

  try {
    const response = await fetch('/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(data)
    })

    if (response.ok) {
      console.log('Redireccion lastInstanseRegister.html')
      window.location.href = ' /lastInstanseRegister.html'
    } else {
      const errorData = await response.json()
      emailError.classList.add('active')
      emailError.textContent = errorData.message
    }
  } catch (err) {
    console.error('Error: ', err.message)
  }
})
