let arrayImage = []

document.querySelector('#redirectHome').addEventListener('click', () => {
  window.location.href = '/public/index.html'
})

// routh protected
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('/auth/protected', {
      method: 'GET',
      credentials: 'include'
    })

    if (!response.ok) {
      console.error('No session token')
      window.location.href = '/public/notAuthorized.html'
    }
  } catch (err) {
    console.error('Fatal error:', err)
    window.location.href = '/public/notAuthorized.html'
  }
})
// load option selected
document.addEventListener('DOMContentLoaded', () => {
  const config = {
    title: 'Change Username',
    firstLabel: 'New Username',
    idElement: 'newUsername',
    placeholder: 'Enter new username',
    firstInputType: 'text',
    firstInputName: 'NewUsername',
    showPasswordField: true
  }
  settingContentElement(config)
})

// function main
async function handleFormSubmit () {
  const newValue = document.querySelector('#form .form-input[required]').value
  const password = document.querySelector('#password')?.value
  const selectedOption = document.querySelector('.container-setting [id].select')

  if (newValue || !selectedOption) {
    throw new Error('No valid select option')
  }

  try {
    let endpoint = ''
    let bodyData = {}

    switch (selectedOption.id) {
      case 'changeUsername':
        endpoint = '/setting/change-username'
        bodyData = { newUsername: newValue, password }
        break
      case 'changeEmail':
        endpoint = '/setting/change-email'
        bodyData = { newEmail: newValue, password }
        break
      case 'changePassword':
        endpoint = '/setting/change-password'
        bodyData = { newPassword: newValue, password }
        break
      default:
        throw new Error('No valid select option')
    }

    console.log('Data sent:', bodyData)

    const response = await fetch(endpoint, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyData)
    })

    console.log('Response server:', response.status, response.statusText)

    const result = await response.json()

    if (response.ok) {
      if (result.redirectUrl) {
        window.location.replace(result.redirectUrl)
      } else {
        window.location.href = '/public/index.html'
      }
    } else {
      console.error('Error al cambiar la contraseña:', result.message)
      const passwordError = settingContent.querySelector('.password-error')
      const firstSpanError = settingContent.querySelector('#firstSpanError')

      switch (result.message) {
        case 'Password invalid':
          passwordError.textContent = 'Password invalid'
          break
        case 'Username invalid':
          firstSpanError.textContent = 'Username invalid'
          break
        case 'Username already existed':
          firstSpanError.textContent = 'Username already existed'
          break
        case 'Email invalid':
          firstSpanError.textContent = 'Email invalid'
          break
        case 'Email already existed':
          firstSpanError.textContent = 'Email already existed'
          break
        case 'New password invalid':
          firstSpanError.textContent = 'New password invalid'
          break
        default:
          console.error('Error:', result.message)
      }
    }
  } catch (err) {
    console.error('Error al actualizar:', err)
  }
}

// funtion manipulation DOM
const menuContainer = document.querySelector('.container-setting')
const settingContent = document.querySelector('.container-setting-content')
function settingContentElement (config) {
  const {
    title,
    firstLabel,
    idElement,
    placeholder,
    firstInputType = 'email',
    firstInputName = idElement,
    showPasswordField = true
  } = config

  settingContent.innerHTML = ''

  const contentBox = document.createElement('div')
  contentBox.classList.add('content-box')
  contentBox.innerHTML = `
    <h3 class="content-title">${title}</h3>

    <form class="content" id="form">
      <div class="form-group">
        <label for="${idElement}" class="content-label">${firstLabel}</label>
        <input type="${firstInputType}" name="${firstInputName}" id="${idElement}" class="form-input" placeholder="${placeholder}" required autocomplete="off">
        <span id='firstSpanError' class="error-credential"></span>
      </div>
      ${showPasswordField
  ? `
      <div class="form-group">
        <label for="password" class="content-label">Password</label>
        <input type="password" name="Password" id="password" class="form-input" placeholder="*********" required autocomplete="off">
        <span class="password-error error-credential"></span>
      </div>
      `
  : ''}
      <div class="button-box">
        <button type="submit" id="btnSubmit">Submit</button>
      </div>
    </form>
  `

  settingContent.appendChild(contentBox)

  const form = document.querySelector('#form')
  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    await handleFormSubmit()
  })
}

// Eventos para cada opción de configuración
menuContainer.addEventListener('click', (e) => {
  const clickedItem = e.target.closest('[id]')

  if (clickedItem) {
    document.querySelectorAll('.container-setting [id]').forEach(item => {
      item.classList.remove('select')
    })
    clickedItem.classList.add('select')

    const settingsConfig = {
      changeUsername: {
        title: 'Change Username',
        firstLabel: 'New Username',
        firstInputType: 'text',
        idElement: 'newUsername',
        placeholder: 'Enter new username'
      },
      changeEmail: {
        title: 'Change Email',
        firstLabel: 'New Email',
        idElement: 'newEmail',
        placeholder: 'flopi@example.com'
      },
      changePassword: {
        title: 'Change Password',
        firstLabel: 'New Password',
        idElement: 'newPassword',
        placeholder: '********',
        firstInputType: 'password',
        showPasswordField: true
      }
    }

    // Llamar a la función con la configuración correspondiente
    if (settingsConfig[clickedItem.id]) {
      settingContentElement(settingsConfig[clickedItem.id])
    }
  }
})

// change photo
menuContainer.querySelector('#changePhoto').addEventListener('click', async () => {
  const cachedImageUrl = localStorage.getItem('profileImageUrl')
  settingContent.innerHTML = ''
  if (cachedImageUrl) {
    loadProfileImage(cachedImageUrl)
  } else {
    const photoUrl = await fetchRecoverUserImage()
    if (photoUrl) {
      localStorage.setItem('profileImageUrl', photoUrl)
      loadProfileImage(photoUrl)
    }
  }
})

async function fetchRecoverUserImage () {
  try {
    const response = await fetch('/protected/user/profile-image', {
      method: 'GET',
      credentials: 'include'
    })

    console.log('response', response)

    if (!response.ok) {
      throw new Error(`Error HTTP! Status: ${response.status}`)
    }

    const data = await response.json()
    return data.imageUrl
  } catch (err) {
    console.error('Error al recuperar la imagen del usuario:', err)
    return null
  }
}

let photosLoaded = false
async function loadProfileImage (photoUrl) {
  const containerSettingContent = document.querySelector('.container-setting-content')
  const contentBox = document.createElement('form')
  contentBox.classList.add('content-box', 'photo-selection-container')
  contentBox.innerHTML = `
    <h3 class="content-title">Select profile image</h3>
    
    <div class="current-photo">
      <img src="${photoUrl}" alt="Foto actual">
      <p>Tu foto actual</p>
    </div>

    <input type="hidden" id="selectedProfileImage" name="profileImageId" value="">
    
    <div class="photos-grid" id="photosGrid"></div>

    <div class="button-box">
      <button type="button" id="btnSavePhoto" disabled>Save</button>
    </div>
  `

  containerSettingContent.innerHTML = ''
  containerSettingContent.appendChild(contentBox)

  const currentPhotoImage = contentBox.querySelector('.current-photo img')
  const photosGrid = contentBox.querySelector('#photosGrid')

  currentPhotoImage.addEventListener('click', () => {
    togglePhotoGrid(photosGrid)
  })

  if (!photosLoaded) {
    await createPhotoArea(contentBox)
    photosLoaded = true
  }
}

function togglePhotoGrid (photosGrid) {
  if (photosGrid.style.display === 'none') {
    photosGrid.style.display = 'grid'
  } else {
    photosGrid.style.display = 'none'
  }
}

// create element contentBox
async function createPhotoArea (contentBox) {
  const btnSavePhoto = contentBox.querySelector('#btnSavePhoto')
  const createInputHidden = contentBox.querySelector('#selectedProfileImage')
  let selectedPhotoId = null
  const currentPhoto = contentBox.querySelector('.current-photo img')
  const photoGrid = contentBox.querySelector('#photosGrid')

  photoGrid.style.display = 'none'

  currentPhoto.addEventListener('click', async () => {
    if (arrayImage.length === 0) {
      try {
        const response = await fetch('/auth/profile-images', {
          method: 'GET',
          credentials: 'include'
        })

        if (!response) {
          throw new Error(`Error HTTP! Status: ${response.status}`)
        }

        const data = await response.json()
        arrayImage = data

        data.forEach(photo => {
          const photoOption = document.createElement('div')
          photoOption.classList.add('photo-option')
          photoOption.dataset.imageId = photo._id
          photoOption.innerHTML = `
            <img src="${photo.dropboxUrl}" alt="${photo.title}">
          `
          photoOption.addEventListener('click', () => {
            handleImageSelection(photo._id, photo.dropboxUrl)
          })
          photoGrid.appendChild(photoOption)
        })
      } catch (err) {
        console.error('error: ', err.message)
      }
    }
    photoGrid.style.display = 'grid'
  })

  const handleImageSelection = (imageId, imageUrl) => {
    currentPhoto.src = imageUrl
    createInputHidden.value = imageId
    selectedPhotoId = imageId

    const images = photoGrid.querySelectorAll('.photo-option')
    images.forEach(img => {
      img.classList.remove('selected')
      if (img.dataset.imageId === imageId) {
        img.classList.add('selected-image')
      }
    })
    btnSavePhoto.disabled = false
  }

  btnSavePhoto.addEventListener('click', async () => {
    if (!selectedPhotoId) return

    try {
      const response = await fetch('/setting/update-profile-image', {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ profileImageId: selectedPhotoId })
      })

      if (response.ok) {
        localStorage.removeItem('profileImageUrl')
        localStorage.setItem('profileImageUrl', currentPhoto.src)
        window.location.href = '/public/index.html'
      } else {
        console.error('Error al actualizar la imagen de perfil')
        throw new Error('Error al actualizar la imagen de perfil')
      }
    } catch (err) {
      console.error('Error: ', err)
    }
  })
}

// about us
menuContainer.querySelector('#aboutUs').addEventListener('click', () => {
  settingContent.innerHTML = ''

  const contentBox = document.createElement('div')
  contentBox.classList.add('about-me-info')
  contentBox.innerHTML = `
  <h3 class="content-title">About Us</h3>
    
    <div class="social-media-links">
      <a href="https://x.com/IgEzequiel_" class="social-link" target="_blank">
        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="50" height="50" viewBox="0 0 50 50">
          <path d="M 5.9199219 6 L 20.582031 27.375 L 6.2304688 44 L 9.4101562 44 L 21.986328 29.421875 L 31.986328 44 L 44 44 L 28.681641 21.669922 L 42.199219 6 L 39.029297 6 L 27.275391 19.617188 L 17.933594 6 L 5.9199219 6 z M 9.7167969 8 L 16.880859 8 L 40.203125 42 L 33.039062 42 L 9.7167969 8 z"></path>
        </svg>
        </a>
        Contact Me
    </div>

    <div class="social-media-links">
        <a href="https://www.linkedin.com/in/ezequiel-rodrigo-saucedo-50451a294/" class="social-link" target="_blank">
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="50" height="50" viewBox="0 0 30 30">
            <path d="M24,4H6C4.895,4,4,4.895,4,6v18c0,1.105,0.895,2,2,2h18c1.105,0,2-0.895,2-2V6C26,4.895,25.105,4,24,4z M10.954,22h-2.95 v-9.492h2.95V22z M9.449,11.151c-0.951,0-1.72-0.771-1.72-1.72c0-0.949,0.77-1.719,1.72-1.719c0.948,0,1.719,0.771,1.719,1.719 C11.168,10.38,10.397,11.151,9.449,11.151z M22.004,22h-2.948v-4.616c0-1.101-0.02-2.517-1.533-2.517 c-1.535,0-1.771,1.199-1.771,2.437V22h-2.948v-9.492h2.83v1.297h0.04c0.394-0.746,1.356-1.533,2.791-1.533 c2.987,0,3.539,1.966,3.539,4.522V22z"></path>
          </svg>
        </a>
        LinkedIn
    </div>
    <div class="social-media-links">
        <a href="https://github.com/ingEze" class="social-link" target="_blank">
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="50" height="50" viewBox="0 0 30 30">
            <path d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z"></path>
          </svg>
        </a>
        Projects
    </div>
  `

  settingContent.appendChild(contentBox)
})

// DELETE ACCOUNT
menuContainer.querySelector('#deleteAccount').addEventListener('click', () => {
  settingContent.innerHTML = ''

  const contentBox = document.createElement('div')
  contentBox.classList.add('content-box')
  contentBox.innerHTML = `
    <h3 class="content-title">Delete Account</h3>

    <form class="content" id="form">
      <div class="form-group">
        <p>Important! Deleting the account will make it permanent.</p>
      </div>

      <div class="form-group">
        <label for="password" class="content-label">Password</label>
        <input type="password" name="Password" id="password" class="form-input" placeholder="*********" required autocomplete="off">
        <span class="password-error error-credential"></span>
      </div>
      
      <div class="button-box delete">
          <button type="submit" id="btnDeleteAccount">DELETE</button>
        </div>
    </form>
  `

  settingContent.appendChild(contentBox)

  const form = document.querySelector('#form')

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const password = document.querySelector('#password')?.value
    try {
      const response = await fetch('/setting/delete-account', {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
      })

      const result = await response.json()

      if (response.ok) {
        console.log('Delete account successful')
        window.location.replace(result.redirectUrl)
      } else {
        window.location.href = '/public/login.html'
      }
    } catch (err) {
      console.error('Error delete account', err)
    }
  })
})
