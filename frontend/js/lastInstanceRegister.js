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
      body: JSON.stringify({ username, profileImage: profileImage ? profileImage.src : null })
    })

    const data = await response.json()
    if (response.ok) {
      if (data.profileImage) {
        const imgElement = document.createElement('img')
        imgElement.src = data.profileImage + '?raw=1'
        imgElement.alt = 'Imagen de perfil'

        document.querySelector('#profileImage').appendChild(imgElement)
      }

      console.log('registrarion successful')
      window.location.href = '/login.html'
    } else {
      console.error('Registration failed', data.message)
      usernameError(data.message || 'registration failed')
    }
  } catch (err) {
    console.error('Error: ', err)
    usernameError('An unexpected error occurred')
  }
})

document.querySelector('#profileImage').addEventListener('click', () => {
  const form = document.querySelector('#formUsername')
  const containerImage = document.querySelector('.container-image')
  const images = document.querySelectorAll('.image')

  form.style.display = 'none'
  containerImage.style.display = 'grid'

  const handleClick = (image, index) => {
    console.log(`You clicked on image ${index + 1}`)
  }

  images.forEach((image, index) => {
    image.addEventListener('click', () => handleClick(image, index))
  })
})
