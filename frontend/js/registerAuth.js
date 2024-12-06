document.querySelector('#btnRedirectionLogIn').addEventListener('click', () => {
  window.location.href = '/login.html'
})

document.querySelector('#formContainer').addEventListener('submit', async (e) => {
  e.preventDefault()

  const userEmail = document.querySelector('#userEmail').value
  const userPassword = document.querySelector('#userPassword').value
  const confirmPassword = document.querySelector('#confirmPassword').value
  const passwordErrorMatch = document.querySelector('.password-error-match')
  const emailError = document.querySelector('.email-error')
  const emptyFieldError = document.querySelector('.empty-field-error')

  passwordErrorMatch.classList.remove('active')
  emailError.classList.remove('active')
  if (emptyFieldError) emptyFieldError.classList.remove('active')

  if (!userEmail || !userPassword || !confirmPassword) {
    if (!emptyFieldError) {
      const formGroup = document.querySelector('.button-box')
      const newError = document.createElement('p')
      newError.classList.add('error-auth', 'empty-field-error')
      newError.textContent = 'All fields are required'
      formGroup.appendChild(newError)
    }
    return
  }

  if (userPassword !== confirmPassword) {
    passwordErrorMatch.classList.add('active')
    return
  }

  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
  if (!emailPattern.test(userEmail)) {
    emailError.classList.add('active')
    return
  }

  console.log('Sending data:', {
    email: userEmail,
    password: userPassword
  })

  try {
    console.log('Making fetch request...')
    const response = await fetch('/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        email: userEmail,
        password: userPassword
      })
    })

    if (response.ok) {
      console.log('Redireccion lastInstanseRegister.html')
      window.location.href = '/lastInstanseRegister.html'
    } else {
      const errorData = await response.json()
      console.error('Registration failed', errorData)
    }
  } catch (err) {
    console.error('Error: ', err)
  }
})
