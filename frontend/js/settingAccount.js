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
        <span class="username-error error-credential"></span>
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

  const form = settingContent.querySelector('#form')
  const passwordError = settingContent.querySelector('.password-error')
  const usernameError = settingContent.querySelector('.username-error')

  // Evento de submit dependiendo de la acción
  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const input = form.querySelector(`#${idElement}`).value
    const password = form.querySelector('#password')?.value || ''

    passwordError && (passwordError.textContent = '')
    usernameError && (usernameError.textContent = '')

    try {
      let endpoint, method, bodyData

      switch (idElement) {
        case 'changeGmail':
          endpoint = '/setting/change-email'
          method = 'PATCH'
          bodyData = { newEmail: input, password }
          break
        case 'newUsername':
          endpoint = '/setting/change-username'
          method = 'PATCH'
          bodyData = { newUsername: input, password }
          break
        // Puedes agregar más casos para otras configuraciones
        default:
          throw new Error('Endpoint no configurado')
      }

      const response = await fetch(endpoint, {
        method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyData)
      })

      const result = await response.json()

      if (response.ok) {
        console.log(`${idElement} updated`)
        window.location.href = '/index.html'
      } else {
        // Manejo de errores específicos
        const errorMap = {
          'Password invalid': passwordError,
          'Username invalid': usernameError,
          'Username already existed': usernameError,
          'Email already exists': usernameError
        }

        const errorElement = errorMap[result.message]
        if (errorElement) {
          errorElement.textContent = result.message
        } else {
          console.error('Error:', result.message)
        }
      }
    } catch (err) {
      console.error(`Error al cambiar ${idElement}:`, err)
    }
  })
}

// Eventos para cada opción de configuración
menuContainer.addEventListener('click', (e) => {
  const clickedItem = e.target.closest('[id]')

  if (clickedItem) {
    // Remover selección de todos los elementos
    document.querySelectorAll('.container-setting [id]').forEach(item => {
      item.classList.remove('select')
    })
    clickedItem.classList.add('select')

    // Configuraciones para cada opción
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
        idElement: 'changeGmail',
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

const form = document.querySelector('#form')
const passwordError = document.querySelector('.password-error')
const usernameError = document.querySelector('.username-error')

// change username
form.addEventListener('submit', async (e) => {
  e.preventDefault()
  const newUsername = document.querySelector('#newUsername').value
  const password = document.querySelector('#password').value

  passwordError.textContent = ''
  usernameError.textContent = ''

  try {
    const response = await fetch('/setting/change-username', {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        newUsername,
        password
      })
    })

    const result = await response.json()

    if (response.ok) {
      console.log('Username updated')
      window.location.href = '/index.html'
    } else {
      switch (result.message) {
        case 'Password invalid':
          passwordError.textContent = 'Password invalid'
          break
        case 'Username invalid':
          usernameError.textContent = 'Username invalid'
          break
        case 'Username already existed':
          usernameError.textContent = 'Username already existed'
          break
        default:
          console.error('Error:', result.message)
      }
    }
  } catch (err) {
    console.error('Error al cambiar el username:', err)
  }
})
