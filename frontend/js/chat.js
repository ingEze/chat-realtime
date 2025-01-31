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
          const messageElement = this.createMessageElement(
            msg.message,
            msg.sender,
            time
          )
          chatMessages.appendChild(messageElement)
        })
        chatMessages.scrollTop = chatMessages.scrollHeight
      }
    } catch (err) {
      console.error('Error recovery message', err.message)
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
      window.location.href = '/notAuthorized.html'
    }

    chat.setCurrentUser(data.user._id)

    const params = new URLSearchParams(window.location.search)
    const recipientUsername = params.get('username')

    if (recipientUsername) {
      chat.joinChat(recipientUsername)
    }

    document.querySelector('.send-button').addEventListener('click', async (e) => {
      e.preventDefault()
      const messageInput = document.querySelector('.chat-input')
      const message = messageInput.value.trim()

      if (message && recipientUsername) {
        try {
          await fetch('/chat/send/message', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
              recipientUsername,
              message
            })
          })

          if (response.ok) {
            chat.sendMessage(recipientUsername, { message })
            messageInput.value = ''
          }
        } catch (err) {
          console.error('Error sending message', err.message)
        }
      }
    })
  } catch (err) {
    console.error('Fatal error:', err.message)
    window.location.href = '/notAuthorized.html'
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
