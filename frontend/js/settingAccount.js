document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('/setting/change-email', {
      method: 'GET',
      credentials: 'include'
    })

    if (response.ok) {
      console.error('No session token')
      window.location.href = '/login.html'
    }
  } catch (err) {
    console.error('Fatal error:', err)
    window.location.href = '/login.html'
  }
})

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
    console.log('Form send')
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

// clase select
menuContainer.addEventListener('click', (e) => {
  const clickedItem = e.target.closest('[id]')

  if (clickedItem) {
    document.querySelectorAll('.container-setting [id]').forEach(item => {
      item.classList.remove('select')
    })
  }
  clickedItem.classList.add('select')
})

const passwordError = document.querySelector('.password-error')
const firstSpanError = document.querySelector('#firstSpanError')

// informacion de errores

function informationErrorInValidate (result) {
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
      firstSpanError.textContent = 'Password invalid'
      break
    default:
      console.error('Error:', result.message)
  }
}

async function handleFormSubmit () {
  const newValue = document.querySelector('#form .form-input[required]').value
  const password = document.querySelector('#password')?.value
  const selectedOption = document.querySelector('.container-setting [id].select')

  console.log('Selected option:', selectedOption.id)
  console.log('Value entered:', newValue, 'password:', password)

  passwordError.textContent = ''
  firstSpanError.textContent = ''

  try {
    let endpoint = ''
    let bodyData = {}
    console.log('Endpoint:', endpoint, 'data sent:', bodyData)

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
        throw new Error('No se seleccionó una opción válida')
    }

    const response = await fetch(endpoint, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyData)
    })

    const result = await response.json()

    if (response.ok) {
      if (result.redirectUrl) {
        window.location.replace(result.redirectUrl)
      } else {
        window.location.href = '/index.html'
      }
    } else {
      console.error('Response error:', response)
      informationErrorInValidate(result)
    }
  } catch (err) {
    console.error('Error al actualizar:', err)
  }
}

// change username
// form.addEventListener('submit', async (e) => {
//   e.preventDefault()
//   const newValue = document.querySelector('#form .form-input[required]').value
//   const password = document.querySelector('#password').value

//   const selectedOption = document.querySelector('.container-setting [id].select')

//   passwordError.textContent = ''
//   firstSpanError.textContent = ''

//   try {
//     let endpoint = ''
//     let bodyData = {}

//     switch (selectedOption.id) {
//       case 'changeUsername':
//         endpoint = '/setting/change-username'
//         bodyData = { newUsername: newValue, password }
//         break
//       case 'changeEmail':
//         endpoint = '/setting/change-email'
//         bodyData = { newEmail: newValue, password }
//         break
//       case 'changePassword':
//         endpoint = '/setting/change-password'
//         bodyData = { newPassword: newValue, password }
//         break
//       default:
//         throw new Error('No se seleccionó una opción válida')
//     }

//     console.log('Endpoint:', endpoint)
//     console.log('Body Data:', bodyData)

//     const response = await fetch(endpoint, {
//       method: 'PATCH',
//       credentials: 'include',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(bodyData)
//     })

//     console.log('Response status:', response.status)
//     console.log('Response ok:', response.ok)

//     const result = await response.json()
//     console.log('result:', result)

//     if (response.ok) {
//       console.log('redirecting...')
//       if (result.redirectUrl) {
//         console.log('redirect url:', result.redirectUrl)
//         window.location.replace(result.redirectUrl)
//       } else {
//         window.location.href = '/index.html'
//       }
//     } else {
//       console.log('error handling:', result)
//       informationErrorInValidate(result)
//     }
//   } catch (err) {
//     console.error('Error al actualizar:', err)
//   }
// })
