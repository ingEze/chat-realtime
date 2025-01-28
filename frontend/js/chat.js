document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('/auth/protected', {
      method: 'GET',
      credentials: 'include'
    })

    if (!response.ok) {
      console.error('No token session, redirecting to login')
      window.location.href = '/notAuthorized.html'
    }
    localStorage.removeItem('profileImageUrl')
  } catch (err) {
    console.error('Fatal error:', err)
    window.location.href = '/notAuthorized.html'
  }
})

document.querySelector('.send-button').addEventListener('click', (e) => {
  e.preventDefault()

  const messageInput = document.querySelector('.chat-input')

  if (!messageInput) {
    console.error('No se encontró el input con la clase .chat-input')
    return
  }

  const message = messageInput.value.trim()

  if (message) {
    // Aquí puedes agregar la lógica para enviar el mensaje a tu backend
    console.log('Mensaje a enviar:', message)

    // Crear y agregar el nuevo mensaje al chat
    const chatMessages = document.querySelector('.chat-messages')
    const newMessage = createMessageElement(message)
    chatMessages.appendChild(newMessage)

    // Limpiar el input
    messageInput.value = ''

    // Scroll al último mensaje
    chatMessages.scrollTop = chatMessages.scrollHeight
  }
})

document.querySelector('.chat-container').addEventListener('submit', (e) => {
  e.preventDefault()
  const messageInput = e.target.querySelector('.chat-input')
  const message = messageInput.value.trim()

  if (message) {
    const chatMessages = document.querySelector('.chat-messages')
    const newMessage = createMessageElement(message)
    chatMessages.appendChild(newMessage)

    // Limpiar el input
    messageInput.value = ''

    // Scroll al último mensaje
    chatMessages.scrollTop = chatMessages.scrollHeight
  }
})

function createMessageElement (message) {
  const now = new Date()
  const time = now.toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit'
  })

  const chatMessages = document.querySelector('.chat-messages')

  const messageDiv = document.createElement('div')
  messageDiv.className = 'message message-sent'
  messageDiv.innerHTML = `
        <div class="message-content">${message}</div>
        <div class="message-info">
            <span class="message-time">${time}</span>   
            <div class="read-status">
                <i class="fa fa-check check"></i>
                <i class="fa fa-check check"></i>
            </div>
        </div>
    `

  chatMessages.appendChild(messageDiv)

  return messageDiv
}

document.addEventListener('DOMContentLoaded', () => {
  const chatMessages = document.querySelector('.chat-messages')
  chatMessages.scrollTop = chatMessages.scrollHeight
})

function preloadImage (url) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(url)
    img.onerror = () => reject(new Error('Error loading image'))
    img.src = url
  })
}

// get username and profileImage
const contentProfileImage = document.querySelector('#userPhoto')
document.addEventListener('DOMContentLoaded', async () => {
  const contentUsername = document.querySelector('#username')
  try {
    const usertagResponse = await fetch('/protected/usertag', {
      method: 'GET',
      credentials: 'include'
    })

    const usertagData = await usertagResponse.text()

    if (usertagResponse.ok) {
      contentUsername.textContent = usertagData
    }

    const storedImageUrl = localStorage.getItem('profileImageUrl')

    if (storedImageUrl) {
      contentProfileImage.src = storedImageUrl
    }

    if (!storedImageUrl) {
      await loadProfileImage()
    }
  } catch (err) {
    console.error('Error obtaining username:', err.message)
  }
})

async function loadProfileImage () {
  try {
    const userImageResponse = await fetch('/protected/user/profile-image', {
      method: 'GET',
      credentials: 'include'
    })

    const userImageData = await userImageResponse.json()

    if (userImageResponse.ok && userImageData.imageUrl) {
      await preloadImage(userImageData.imageUrl)
      contentProfileImage.src = userImageData.imageUrl
      localStorage.setItem('profileImageUrl', userImageData.imageUrl)
      localStorage.setItem('loadImage', 'true')
    }
  } catch (err) {
    console.error('Error loading profile image:', err.message)
  }
}
