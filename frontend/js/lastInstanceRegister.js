document.querySelector('#profileImage').addEventListener('click', () => {
  const form = document.querySelector('#formUsername')
  const imgContainer = document.querySelector('.container-image')

  form.style.display = 'none'
  imgContainer.style.display = 'grid'

  imgContainer.innerHTML = ''

  const handleImageSelection = async (imageId) => {
    console.log(`Imagen seleccionada: ${imageId}`)

    document.querySelector('#selectedProfileImage').value = imageId
  }
  async function loadProfileImages () {
    try {
      const response = await fetch('/auth/profile-images')
      const data = await response.json()
      console.log('data:', data)

      if (data.length > 0) {
        data.forEach((image) => {
          const imgElement = document.createElement('img')
          imgElement.src = image.dropboxUrl
          imgElement.alt = image.name
          imgElement.dataset.imageId = image._id

          imgElement.addEventListener('click', () => handleImageSelection(image._id))

          imgContainer.appendChild(imgElement)
        })
      }
    } catch (err) {
      console.error('Error loaded images:', err)
    }
  }
  loadProfileImages()
})

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

  const username = document.querySelector('#inputUsername').value
  const selectedImageId = document.querySelector('#selectedProfileImage').value
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
      body: JSON.stringify({
        username,
        profileImageId: selectedImageId
      })
    })

    const data = await response.json()
    if (response.ok) {
      console.log('registrarion successful')
      window.location.href = '/login.html'
    } else {
      console.error('Registration failed', data.message)
    }
  } catch (err) {
    console.error('Error: ', err)
    usernameError('An unexpected error occurred')
  }
})
