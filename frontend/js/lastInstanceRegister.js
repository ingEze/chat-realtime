const arrayImage = []

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('/auth/protected-username', {
      method: 'GET',
      credentials: 'include'
    })

    if (!response.ok) {
      console.error('User not authorized')
      window.location.href = '/notAuthorized.html'
    }
  } catch (err) {
    console.error('Error:', err)
  }
})

document.addEventListener('DOMContentLoaded', async () => {
  const loader = document.querySelector('.loader')
  const container = document.querySelector('.container-username')
  const profileImageElement = document.querySelector('#profileImage')
  let selectedImageInput = document.querySelector('#selectedProfileImage').value

  let profileImageId = null
  selectedImageInput = null

  container.style.display = 'none'

  setTimeout(() => {
    container.style.display = 'block'
    loader.style.display = 'none'
  }, 2500)

  try {
    const response = await fetch('/auth/profile-images', {
      credentials: 'include'
    })

    const data = await response.json()

    const form = document.querySelector('#formUsername')
    const imgContainer = document.querySelector('.container-image')

    const handleImageSelection = async (imageId, imageUrl) => {
      profileImageElement.src = imageUrl

      const images = document.querySelectorAll('img[data-image-id]')
      images.forEach(img => {
        img.classList.remove('selected-image')
        if (img.dataset.imageId === imageId) {
          img.classList.add('selected-image')
        }
      })
    }

    if (data.length > 0) {
      data.forEach((image) => {
        const imgElement = document.createElement('img')
        imgElement.src = image.dropboxUrl
        imgElement.alt = image.name
        imgElement.dataset.imageId = image._id

        imgElement.addEventListener('click', () => {
          form.style.display = 'flex'
          imgContainer.style.display = 'none'

          profileImageId = image._id
          selectedImageInput = image.dropboxUrl
          console.log('selected input on imgElement:', selectedImageInput)
          handleImageSelection(image._id, image.dropboxUrl)
        })
        arrayImage.push(imgElement)
      })
    }
  } catch (err) {}

  document.querySelector('#profileImage').addEventListener('click', () => {
    const form = document.querySelector('#formUsername')
    const imgContainer = document.querySelector('.container-image')

    form.style.display = 'none'
    imgContainer.style.display = 'grid'

    imgContainer.innerHTML = ''

    async function loadProfileImages () {
      try {
        arrayImage.forEach(image => {
          imgContainer.appendChild(image)
        })
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

    if (username === '') {
      usernameError('is not valid')
      return
    }

    if (!selectedImageInput) {
      usernameError('No image selectd')
      return
    }

    selectedImageInput = profileImageId

    if (!profileImageId) {
      usernameError('Please select a profile image')
      return
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
          profileImageId
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
})
