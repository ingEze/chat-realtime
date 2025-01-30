let currentUserId
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('/protected/user/data', {
      method: 'GET',
      credentials: 'include'
    })

    const data = await response.json()

    if (!response.ok || !data.success) {
      localStorage.removeItem('profileImageUrl')
      window.location.href = '/notAuthorized.html'
      return
    }

    if (!data.user || !data.user._id) {
      console.log('missing user data. Full data recived:', data)
      throw new Error('No user data recived')
    }

    currentUserId = data.user._id
  } catch (err) {
    console.error('Fatal error:', err.message)
    console.error('error stack', err.stack)
    window.location.href = '/notAuthorized.html'
  }
})

const arraySendMessge = []
document.querySelector('.send-button').addEventListener('click', async (e) => {
  e.preventDefault()

  const messageInput = document.querySelector('.chat-input')
  const message = messageInput.value.trim()

  if (message) {
    try {
      const params = new URLSearchParams(window.location.search)
      const recipientUsername = params.get('username')

      const response = await fetch('/chat/send/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recipientUsername,
          message
        })
      })

      const { data } = await response.json()

      const newMessage = { message: data.message }

      if (response.ok) {
        arraySendMessge.push(newMessage.message)
      }
    } catch (err) {
      console.error('Error sending message', err.message)
    }
    const chatMessages = document.querySelector('.chat-messages')
    const newMessage = createMessageElement(message)
    chatMessages.appendChild(newMessage)

    messageInput.value = ''

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

    messageInput.value = ''

    chatMessages.scrollTop = chatMessages.scrollHeight
  }
})

function createMessageElement (message, senderId = currentUserId, timestamp) {
  const messageDiv = document.createElement('div')
  messageDiv.className = `message ${senderId === currentUserId ? 'message-sent' : 'message-received'}`
  messageDiv.innerHTML = `
        <div class="message-content">${message}</div>
        <div class="message-info">
          <span class="message-time">${timestamp}</span>   
          ${senderId === currentUserId
? `
            <div class="read-status">
              <i class="fa fa-check check"></i>
              <i class="fa fa-check check"></i>
          </div>
          `
: ''}
        </div>
    `

  return messageDiv
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('/chat/recent/message', {
      method: 'GET',
      credentials: 'include'
    })

    const data = await response.json()
    const { resultMap, timestamp } = data.data
    if (response.ok) {
      const chatMessages = document.querySelector('.chat-messages')
      resultMap.forEach((msg, index) => {
        const time = timestamp[index] || 'N/A'
        const messageElement = createMessageElement(msg.message, undefined, time)

        if (msg.sender === currentUserId) {
          messageElement.classList.add('message-sent')
        } else {
          messageElement.classList.add('message-received')
        }

        chatMessages.appendChild(messageElement)
      })
    }
  } catch (err) {
    console.error('Error recovery message', err.message)
  }
})

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
document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search)
  const usernameParams = params.get('username')
  const contentProfileImage = document.querySelector('#userPhoto')
  const contentUsername = document.querySelector('#username')
  try {
    const usertagResponse = await fetch(`/chat/user/data?username=${usernameParams}`, {
      method: 'GET',
      credentials: 'include'
    })

    const usertagData = await usertagResponse.json()

    const { data } = usertagData
    const { username } = data

    if (usertagResponse.ok) {
      contentUsername.textContent = username
    }

    const storedImageUrl = localStorage.getItem('profileImageUrl')
    if (storedImageUrl) {
      contentProfileImage.src = storedImageUrl
    }

    if (!storedImageUrl) {
      try {
        const userImageResponse = await fetch(`/chat/user/data?username=${usernameParams}`, {
          method: 'GET',
          credentials: 'include'
        })

        const userImageData = await userImageResponse.json()

        const { data } = userImageData

        const { profileImage } = data

        if (userImageResponse.ok && profileImage) {
          await preloadImage(profileImage)
          contentProfileImage.src = profileImage
          localStorage.setItem('profileImageUrl', profileImage)
          localStorage.setItem('loadImage', 'true')
        }
      } catch (err) {
        console.error('Error loading profile image:', err.message)
      }
    }
  } catch (err) {
    console.error('Error obtaining username:', err.message)
  }
})

document.querySelector('.back-button').addEventListener('click', () => {
  window.location.href = '/index.html'
})
