class ChatSocket {
  constructor () {
    this.socket = io()
    this.currentUser = null
    this.currentRoom = null
    this.recipient = null
    this.recipientId = null
    this.initialize()
  }

  initialize () {
    this.socket.on('connect', () => {
      console.log('Connected to server')
      if (this.currentUser && this.recipient) this.joinChat(this.recipient)
    })

    this.socket.on('joinedChat', ({ room }) => {
      this.currentRoom = room
    })

    this.socket.on('messagesRead', ({ recipient, sender }) => {
      console.log(`Messages read by ${recipient}`)

      document.querySelectorAll(`.message-sent[data-recipient="${sender}"] .read-status i`).forEach(status => {
        status.classList.add('read')
      })
    })

    this.socket.on('receiveMessage', (messageData) => {
      const chatMessage = document.querySelector('.chat-messages')
      if (!chatMessage) {
        console.error('Chat message element not found')
        return
      }
      if (messageData.sender !== this.currentUser) {
        const messageElement = this.createMessageElement(
          messageData.message,
          messageData.sender,
          messageData.recipient,
          messageData.timestamp,
          messageData.isRead
        )
        chatMessage.appendChild(messageElement)
        chatMessage.scrollTop = chatMessage.scrollHeight
      }
    })

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server')
      this.currentRoom = null
    })

    this.socket.on('messageError', (error) => {
      console.error('Error message:', error)
      createAlert(error.message)
    })
  }

  async joinChat (recipientUsername) {
    if (!this.currentUser) {
      console.log('no user connected')
      return
    }

    this.recipient = recipientUsername
    console.log(`Joining chat with ${recipientUsername}`)

    try {
      const response = await fetch(`/chat/user/data?username=${recipientUsername}`, {
        methiod: 'GET',
        credentials: 'include'
      })

      const data = await response.json()
      const recipientId = data.data._id
      if (response.ok && data.success) {
        this.recipientId = recipientId
      }
    } catch (err) {
      console.error('Error getting recipient ID:', err.message)
      return
    }
    this.socket.emit('joinChat', {
      sender: this.currentUser,
      recipient: recipientUsername
    })
  }

  markMessageAsRead () {
    this.socket.emit('messagesRead', {
      sender: this.currentUser,
      recipient: this.recipientId
    })
  }

  sendMessage (recipient, message) {
    console.log('sending message to:', recipient)
    if (!this.currentUser) {
      console.error('No user connected')
      return
    }

    const messageData = {
      sender: this.currentUser,
      recipient: this.recipientId,
      message,
      timestamp: new Date().toISOString()
    }

    const chatMessage = document.querySelector('.chat-messages')
    if (chatMessage) {
      const messageElement = this.createMessageElement(
        message,
        this.currentUser,
        new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })
      )

      chatMessage.appendChild(messageElement)
      chatMessage.scrollTop = chatMessage.scrollHeight
    }

    this.socket.emit('sendMessage', messageData)
    document.querySelector('.chat-input').value = ''
  }

  createMessageElement (message, senderId, timestamp, isRead, recipientId) {
    const messageDiv = document.createElement('div')
    messageDiv.className = `message ${senderId === this.currentUser ? 'message-sent' : 'message-received'}`
    messageDiv.setAttribute('data-recipient', recipientId)

    const readStatus = isRead ? 'read' : ''

    messageDiv.innerHTML = `
       <div class="message-content">${message}</div>
    <div class="message-info">
      <span class="message-time">${timestamp}</span>
      ${senderId === this.currentUser
        ? `<div class="read-status ${readStatus ? 'read' : ''}">
             <i class="fa fa-check ${readStatus ? 'read' : ''}"></i>
             <i class="fa fa-check ${readStatus ? 'read' : ''}"></i>
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
      window.location.href = '/index.html'
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
            time,
            msg.isRead || false
          )
          fragment.appendChild(messageElement)
        })

        chatMessages.appendChild(fragment)
        chatMessages.scrollTop = chatMessages.scrollHeight

        this.markMessageAsRead()
      } catch (err) {
        console.error('Error recovery message', err.message)
        createAlert(err.message)
      }
    }
  }
}

let chat
document.addEventListener('DOMContentLoaded', async () => {
  chat = new ChatSocket()
  await friendVerify()

  try {
    const response = await fetch('/protected/user/data', {
      method: 'GET',
      credentials: 'include'
    })

    const data = await response.json()
    if (!response.ok) {
      localStorage.removeItem('profileImageUrl')
      window.location.href = '/notAuthorized.html'
    }

    if (!data.success) {
      throw new Error('Invalid user data')
    }

    chat.setCurrentUser(data.user._id)

    const params = new URLSearchParams(window.location.search)
    const recipientUsername = params.get('username')

    if (!recipientUsername) {
      console.error('No recipient username provided')
      window.location.href = '/notAuthorized.html'
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
        const messageContent = document.querySelector('.chat-input').value.trim()
        if (messageContent) {
          await sendMessage(recipientUsername, messageContent)
        }
      })
    }
    const chatInput = document.querySelector('.chat-input')
    if (chatInput) {
      chatInput.addEventListener('keydown', async (e) => {
        if (e.key === 'Enter') {
          e.preventDefault()
          const messageContent = document.querySelector('.chat-input').value.trim()
          if (messageContent) {
            await sendMessage(recipientUsername, messageContent)
          }
        }
      })
    }
  } catch (err) {
    console.error('Fatal error:', err.message)
    window.location.href = '/notAuthorized.html'
  }
})

async function sendMessage (recipient, messageContent) {
  try {
    if (messageContent && recipient) {
      if (!chat) {
        console.error('Chat instance not initialized')
        return
      }
      chat.sendMessage(recipient, messageContent)
      document.querySelector('.chat-input').value = ''
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

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search)
  const usernameParams = params.get('username')

  if (!usernameParams) {
    console.error('No username provided')
    window.location.href = '/notAuthorized.html'
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
  window.location.href = '/index.html'
  localStorage.removeItem('friendProfileImage')
})

const deleteFriendContainer = document.querySelector('.delete-friend')
document.querySelector('.fa-trash').addEventListener('click', () => {
  createFloatContainer()
})

function createFloatContainer () {
  if (document.querySelector('.float-warning')) return

  const floatContainer = document.createElement('div')
  floatContainer.classList.add('float-warning')
  floatContainer.innerHTML = `
      <p>Are you sure you want to remove this friend?</p>
      <button type="button" class="yes-button">Yes</button>
      <button type="button" class="no-button">No</button>
  `
  deleteFriendContainer.appendChild(floatContainer)

  floatContainer.querySelector('.no-button').addEventListener('click', () => floatContainer.remove())

  floatContainer.querySelector('.yes-button').addEventListener('click', async () => {
    await removeFriend()
    floatContainer.remove()
  })
}

async function removeFriend () {
  const Urlparams = new URLSearchParams(window.location.search)
  const username = Urlparams.get('username')
  try {
    const response = await fetch('/friends/remove', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username })
    })

    if (!response.ok) {
      console.error('error in response')
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()

    if (!data || !data.success) {
      console.error('Invalid response format')
      return
    }

    window.location.href = '/index.html'
  } catch (err) {}
}

function createAlert (message) {
  const alert = document.createElement('div')
  alert.classList.add('alert')
  alert.innerHTML = `<p>${message}</p>`
  document.body.appendChild(alert)
}

async function friendVerify () {
  const urlParams = new URLSearchParams(window.location.search)
  const username = urlParams.get('username')
  try {
    const response = await fetch(`/friends/verify?username=${username}`, {
      method: 'GET',
      credentials: 'include'
    })

    if (!response.ok) {
      console.error('Error! Status:', response.status)
      window.location.href = '/index.html'
    }
  } catch (err) {
    console.error('error in response', err.message)
    window.location.href = '/index.html'
  }
}
