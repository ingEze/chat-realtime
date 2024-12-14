document.querySelector('#formUsername').addEventListener('submit', async (e) => {
  e.preventDefault()

  function usernameError (error) {
    const formGroup = document.querySelector('.form-group')
    const previousError = formGroup.querySelector('.error-auth')

    if (previousError) previousError.remove()

    const message = document.createElement('p')
    message.classList.add('error-auth')
    message.classList.add('active')
    message.innerText = `Username ${error}`
    formGroup.appendChild(message)
  }

  const profileImage = document.querySelector('.profile-image')
  const username = document.querySelector('#inputUsername').value
  if (username === '') {
    usernameError('is not valid')
  }

  try {
    const response = await fetch('/auth/register-username', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ username, profileImage })
    })

    const data = await response.json()

    if (data.profileImage) {
      const imgElement = document.createElement('img')
      imgElement.src = data.profileImage + '?raw=1'
      imgElement.alt = 'Imagen de perfil'

      document.querySelector('#profileImage').appendChild(imgElement)
    }

    if (response.ok) {
      console.log('registrarion successful')
      window.location.href = '/login.html'
    } else {
      console.error('Registration failed')
    }
  } catch (err) {
    console.error('Error: ', err)
  }
})
