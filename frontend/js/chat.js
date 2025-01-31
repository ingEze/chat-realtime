const socket = io()

class ChatSocket {
  constructor () {
    this.socket = socket
    this.currentUser = null
    this.initalize()
  }

  initalize () {
    this.socket.on('connect', () => {
      console.log('Connected to server')
    })

    this.socket.on('receiveMessage', (message) => {
      this.handleIncomingMessage(message)
    })

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server')
    })
  }

  joinChat (recipient) {
    if (!this.currentUser) {
      console.log('no user connected')
      return
    }

    this.socket.emit('joinChat', {
      sender: this.currentUser,
      recipient
    })
  }

  sendMessage (recipient, message) {
    if (!this.currentUser) {
      console.error('No user connected')
      return
    }

    this.socket.emit('sendMessage', {
      sender: this.currentUser,
      recipient,
      message
    })
  }

  handleIncomingMessage (message) {
    const chatMessages = document.querySelector('.chat-messages')
    if (!chatMessages) return

    const messageElement = this.createMessageElement(
      message.message,
      message.sender,
      new Date(message.timestamp).toLocaleTimeString()
    )

    chatMessages.appendChild(messageElement)
    chatMessages.scrollTop = chatMessages.scrollHeight
  }

  createMessageElement (message, senderId, timestamp) {
    const messageDiv = document.createElement('div')
    messageDiv.className = `message ${senderId === this.currentUser ? 'message-sent' : 'message-received'}`

    messageDiv.innerHTML = `
      <div class="message-content">${message}</div>
      <div class="message-info">
        <span class="message-time">${timestamp}</span>
        ${senderId === this.currentUser
          ? `<div class="read-status">
               <i class="fa fa-check check"></i>
               <i class="fa fa-check check"></i>
             </div>`
          : ''}
      </div>
    `

    return messageDiv
  }

  setCurrentUser (userId) {
    this.currentUser = userId
  }

  async loadRecentMessages () {
    const urlSearchParams = new URLSearchParams(window.location.search)
    const usernameParams = urlSearchParams.get('username')
    if (!usernameParams) {
      console.error('No recipient specified in URL parameters')
      window.location.href = '/public/index.html'
    } else {
      try {
        const response = await fetch('/chat/recent/message', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            recipient: usernameParams
          })
        })

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data = await response.json()

        if (!data || !data.data) {
          console.error('Invalid response format')
          return
        }

        const { resultMap, timestamp } = data.data

        if (!Array.isArray(resultMap) || !Array.isArray(timestamp)) {
          console.error('Invalid data format')
          return
        }

        const chatMessages = document.querySelector('.chat-messages')
        if (!chatMessages) {
          console.error('Chat messages container not found')
          return
        }

        chatMessages.innerHTML = ''

        const fragment = document.createDocumentFragment()

        resultMap.forEach((msg, index) => {
          if (!msg || !msg.message || !msg.sender) {
            console.error('Invalid message format, skipping', msg)
            return
          }

          const time = timestamp[index] || 'N/A'
          const messageElement = this.createMessageElement(
            msg.message,
            msg.sender,
            time
          )
          fragment.appendChild(messageElement)
        })

        chatMessages.appendChild(fragment)
        chatMessages.scrollTop = chatMessages.scrollHeight
      } catch (err) {
        console.error('Error recovery message', err.message)
        createAlert(err.message)
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const chat = new ChatSocket()

  try {
    const response = await fetch('/protected/user/data', {
      method: 'GET',
      credentials: 'include'
    })

    const data = await response.json()
    if (!response.ok || !data.success) {
      localStorage.removeItem('profileImageUrl')
      window.location.href = '/public/notAuthorized.html'
    }

    chat.setCurrentUser(data.user._id)

    const params = new URLSearchParams(window.location.search)
    const recipientUsername = params.get('username')

    if (!recipientUsername) {
      console.error('No recipient username provided')
      window.location.href = '/public/notAuthorized.html'
      return
    }

    chat.joinChat(recipientUsername)

    try {
      await chat.loadRecentMessages()
    } catch (err) {
      console.error('Error loading recent messages:', err.message)
    }

    const sendButton = document.querySelector('.send-button')
    if (sendButton) {
      sendButton.addEventListener('click', async (e) => {
        e.preventDefault()
        const messageContent = document.querySelector('.chat-input').value
        await sendMessage(recipientUsername, messageContent, chat)
      })
    }
    const chatInput = document.querySelector('.chat-input')
    if (chatInput) {
      chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault()
          sendMessage(recipientUsername)
        }
      })
    }
  } catch (err) {
    console.error('Fatal error:', err.message)
    window.location.href = '/public/notAuthorized.html'
  }
})

async function sendMessage (recipient) {
  try {
    const messageInput = document.querySelector('.chat-input')
    const message = messageInput.value.trim()

    if (message && recipient) {
      console.log('sending message to backend', message)
      const response = await fetch('/chat/send/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          recipientUsername: recipient,
          message
        })
      })

      if (response.ok) {
        messageInput.value = ''
      }
    }
  } catch (err) {
    console.error('Error sending message', err.message)
  }
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
document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search)
  const usernameParams = params.get('username')

  if (!usernameParams) {
    console.error('No username provided')
    window.location.href = '/public/notAuthorized.html'
    return
  }

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

    const storedImageUrl = localStorage.getItem('friendProfileImage')
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
          localStorage.setItem('friendProfileImage', profileImage)
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
  window.location.href = '/public/index.html'
  localStorage.removeItem('friendProfileImage')
})

function createAlert (message) {
  const alert = document.createElement('div')
  alert.classList.add('alert')
  alert.innerHTML = `<p>${message}</p>`
  document.body.appendChild(alert)
}
