document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('/auth/protected', {
      method: 'GET',
      credentials: 'include'
    })

    if (!response.ok) {
      console.error('No token session, redirecting to login')
      window.location.href = '/public/notAuthorized.html'
    }
    localStorage.removeItem('profileImageUrl')
  } catch (err) {
    console.error('Fatal error:', err)
    window.location.href = '/public/notAuthorized.html'
  }
})

// load profile image user
async function handleProfileImage () {
  try {
    const cachedImageUrl = localStorage.getItem('profileImageUrl')
    let imageUrl = cachedImageUrl

    if (!cachedImageUrl) {
      const response = await fetch('/protected/user/profile-image', {
        method: 'GET',
        credentials: 'include'
      })

      if (!response.ok) {
        console.error('Error loaded profile image', response.status, response.statusText)
        return null
      }

      const data = await response.json()
      imageUrl = data.imageUrl

      if (imageUrl) {
        localStorage.setItem('profileImageUrl', imageUrl)
      }
    }

    return new Promise((resolve, reject) => {
      const img = new Image()
      img.src = imageUrl
      img.onload = () => resolve(imageUrl)
      img.oneerror = () => {
        localStorage.removeItem('profileImageUrl')
        reject(new Error('Error load profile image'))
      }
    })
  } catch (err) {
    console.error('Error load profile image:', err)
    return null
  }
}

// animation load (main)
document.addEventListener('DOMContentLoaded', async () => {
  const body = document.body
  const mainContainer = document.querySelector('.container')
  const userTagContainer = document.querySelector('#userTag')
  const logoutBox = document.querySelector('.logout-box')
  const animationLoad = JSON.parse(localStorage.getItem('animationLoad')) || false
  const cachedImageUrl = localStorage.getItem('profileImageUrl')

  const toggleVisibility = (elements, displayStyle) => {
    elements.forEach((element) => {
      if (element) element.style.display = displayStyle
    })
  }

  if (cachedImageUrl) loadImageToHeader(cachedImageUrl)

  if (!animationLoad) {
    toggleVisibility([mainContainer, userTagContainer, logoutBox], 'none')
    createAnimationLoad(body)

    try {
      if (!cachedImageUrl) {
        const imageUrl = await handleProfileImage()
        if (imageUrl) loadImageToHeader(imageUrl)
      }

      await Promise.all([
        new Promise((resolve) => setTimeout(resolve, 2500)),
        imageUrl ? Promise.resolve() : Promise.resolve()
      ])

      await new Promise((resolve) => setTimeout(resolve, 2500))

      removeAnimationLoad(body)
      localStorage.setItem('animationLoad', true)
      toggleVisibility([mainContainer], 'flex')
      toggleVisibility([userTagContainer, logoutBox], 'block')
    } catch (err) {
      console.error('Error in initalization:', err)
      removeAnimationLoad(body)
      toggleVisibility([mainContainer], 'flex')
      toggleVisibility([userTagContainer, logoutBox], 'block')
    }
  } else {
    if (!cachedImageUrl) {
      const imageUrl = await handleProfileImage()
      if (imageUrl) loadImageToHeader(imageUrl)
    }
  }

  if (!animationLoad) {
    toggleVisibility([mainContainer, userTagContainer, logoutBox], 'none')
    const loaderContainer = createAnimationLoad(body)

    setTimeout(() => {
      loaderContainer.style.display = 'none'
      localStorage.setItem('animationLoad', true)
      toggleVisibility([mainContainer], 'flex')
      toggleVisibility([userTagContainer, logoutBox], 'block')
    }, 2500)
  }
})

// connect to backend for imageUrl
function loadImageToHeader (imageUrl) {
  const existingImage = document.querySelector('.profile-image-container')

  if (!existingImage) {
    const header = document.querySelector('.header')
    const profileImageContainer = document.createElement('div')
    profileImageContainer.classList.add('profile-image-container')

    const img = new Image()
    img.onload = () => {
      profileImageContainer.innerHTML = `
          <img src="${imageUrl}" alt="" class="profile-image">
      `
      header.insertBefore(profileImageContainer, header.firstChild)
      viewUserImage(profileImageContainer, imageUrl)
    }
    img.src = imageUrl
  }
}

// search user (existing)
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('addNewUser')
  const userContainer = document.querySelector('.add-user-search-box')
  const searchIcon = document.querySelector('.add-new-user-search i')
  const arrayUsers = []

  async function searchUsers (query) {
    if (!query || query.trim() === '') {
      return
    }

    try {
      userContainer.innerHTML = ''
      arrayUsers.length = 0
      createAnimationLoad(userContainer)

      const response = await fetch(`/friends/search?q=${encodeURIComponent(query)}`, {
        method: 'GET',
        credentials: 'include'
      })

      if (!response.ok) throw new Error('No se pudieron obtener los usuarios')

      const users = await response.json()
      const usersWithImagesLoaded = await loadImage(users)

      removeAnimationLoad(userContainer)
      arrayUsers.push(...usersWithImagesLoaded)

      renderUsers(arrayUsers)
    } catch (err) {
      userContainer.innerHTML = `
            <div class="new-user">
              <span class="user-error">Error al buscar usuarios</span>
            </div>
          `
    }
  }

  function loadImage (users) {
    const imagePromises = users.map(async (user) => {
      return new Promise(resolve => {
        const img = new Image()
        img.src = user.profileImage
        img.onload = () => {
          user.imageLoad = true
          resolve(user)
        }
        img.onerror = () => {
          user.imageLoad = false
          resolve(user)
        }
      })
    })
    return Promise.all(imagePromises)
  }

  async function renderUsers (users) {
    if (users.length === 0) {
      userContainer.innerHTML = `
            <div class="new-user">
              <span class="user-error">No se encontraron usuarios</span>
            </div>
          `
      return
    }

    userContainer.innerHTML = ''

    users.forEach(user => {
      const userElement = document.createElement('div')
      userElement.classList.add('new-user')

      userElement.innerHTML = `
            <div class="data-user">
              <img src="${user.profileImage}" alt="${user.username}">
              <span class="username">${user.username}</span>
            </div>
            <i class="fas fa-plus-circle add-friend-btn"></i>
          `

      const addButton = userElement.querySelector('.add-friend-btn')
      addButton.addEventListener('click', () => addFriend(user.username))

      userContainer.appendChild(userElement)
    })
  }

  searchIcon.addEventListener('click', () => {
    searchUsers(searchInput.value)
  })

  searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      searchUsers(searchInput.value)
    }
  })
})

// float container (add user)
document.addEventListener('DOMContentLoaded', () => {
  const addUserContainer = document.querySelector('.add-user-container')
  const addUserFloat = document.getElementById('addUserFloat')

  addUserContainer.addEventListener('click', () => {
    const currentIcon = addUserContainer.querySelector('i')

    if (currentIcon.classList.contains('fa-user-plus')) {
      currentIcon.classList.remove('fa-user-plus')
      currentIcon.classList.add('fa-times')
      addUserFloat.style.display = 'block'
    } else {
      currentIcon.classList.remove('fa-times')
      currentIcon.classList.add('fa-user-plus')
      addUserFloat.style.display = 'none'
    }
  })
})

// add friend
async function addFriend (username) {
  try {
    const response = await fetch('/friends/add', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username })
    })

    const result = await response.json()

    if (response.ok) {
      showAlertMessage('Friend request accepted', 3000)
      window.location.reload()
    } else {
      showAlertMessage(result.message, 3000)
    }
  } catch (err) {
    console.error('Error adding friend', err.message)
    showAlertMessage('Error accepting friend request', 3000)
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const toggleRequestIcon = document.querySelector('.toggleRequestIcon')
  const containerMain = document.querySelector('.container-main')
  const requestContainer = document.querySelector('.request-container')

  let isShowingRequests = false

  toggleRequestIcon.addEventListener('click', async () => {
    isShowingRequests = !isShowingRequests

    if (isShowingRequests) {
      requestContainer.style.display = 'block'
      containerMain.style.display = 'none'

      toggleRequestIcon.classList.remove('fa-user-plus')
      toggleRequestIcon.classList.add('fa-times')
      await loadFriendRequest()
    } else {
      requestContainer.style.display = 'none'
      containerMain.style.display = 'block'

      toggleRequestIcon.classList.remove('fa-times')
      toggleRequestIcon.classList.add('fa-user-plus')
    }
  })

  async function loadFriendRequest () {
    requestContainer.innerHTML = ''
    createAnimationLoad(requestContainer)

    try {
      const response = await fetch('/friends/requests', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()
      removeAnimationLoad(requestContainer)

      if (response.ok) {
        if (data.data.length === 0) {
          requestContainer.innerHTML = `
            <div class="requests-container">
              <div class="new-user">
                <span class="user-error">No friend requests</span>
              </div>
            </div>
          `
        } else {
          data.data.forEach(request => {
            createRequestCard(request.username, request.timestamp, request.profileImage)
          })
        }
      }
    } catch (err) {
      console.error('Error obtaining friend requests', err)
      requestContainer.innerHTML = `
        <div class="requests-container">
          <div class="new-user">
            <span class="user-error">Error obtaining friend requests</span>
          </div>
        </div>
      `
    }
  }

  function createRequestCard (username, timestamp, profileImage) {
    const requestCard = document.createElement('div')
    requestCard.classList.add('requests-container')
    requestCard.innerHTML = `
      <div class="request-card">
        <img src="${profileImage}" alt="Profile" class="profile-image">
        <div class="request-info">
          <div class="username">${username}</div>
          <div class="timestamp">${timestamp}</div>
        </div>
        <div class="action-buttons">
          <button class="btn btn-accept">Accept</button>
          <button class="btn btn-reject">Reject</button>
        </div>
      </div>
    `

    requestContainer.appendChild(requestCard)

    const btnAccept = requestCard.querySelector('.btn-accept')
    const btnReject = requestCard.querySelector('.btn-reject')

    btnAccept.addEventListener('click', async () => {
      try {
        const response = await fetch('/friends/accepted', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username })
        })

        if (response.ok) {
          showAlertMessage('Friend request accepted', 3000)
          requestCard.remove()
          if (requestContainer.children.length === 0) {
            loadFriendRequest()
          }
        } else {
          showAlertMessage('Error accepting friend request', 3000)
        }
      } catch (err) {
        console.error('Error accepting friend request', err)
        showAlertMessage('Error accepting friend request', 3000)
      }
    })

    btnReject.addEventListener('click', async () => {
      try {
        const response = await fetch('/friends/rejected', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username })
        })

        const data = await response.json()
        console.log('data', data)

        if (response.ok) {
          showAlertMessage('Friend request rejected', 3000)
          requestCard.remove()
          if (requestContainer.children.length === 0) {
            loadFriendRequest()
          }
        } else {
          showAlertMessage('Error rejecting friend request', 3000)
        }
      } catch (err) {
        console.error('Error rejecting friend request', err)
        showAlertMessage('Error rejecting friend request', 3000)
      }
    })
  }
})

// chats
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('/friends/user/friend', {
      method: 'GET',
      credentials: 'include'
    })

    const data = await response.json()

    const result = data.data

    if (response.ok) {
      result.forEach(friend => {
        if (friend.timestamp === 'N/A') {
          createChat(friend.username, friend.profileImage, friend.message, 'N/A')
        } else {
          console.log('typeof friend string', friend)
          createChat(friend.username, friend.profileImage, friend.message, friend.timestamp)
        }
      })
    }
  } catch (err) {
    console.error('Error obtaining friends', err.message)
  }
})

function createChat (username, profileImage, message, timestamp) {
  const containerMain = document.querySelector('.container-main')
  const chatsContainer = document.createElement('div')
  chatsContainer.classList.add('chats-container')
  chatsContainer.innerHTML = `
    <div class="data-user">
        <div class="chat-left">
            <div class="container-photo">
                <img src="${profileImage}" class="user-photo" alt="${username}">
            </div>
            <span class="chat-username">${username}</span>
        </div>
        <span class="message-date">${timestamp}</span>
      </div>
      <div class="chat-content">
        <span class="last-message">${message}</span>
        <span class="new-message-indicator">•</span>
    </div>
    `
  containerMain.appendChild(chatsContainer)

  containerMain.querySelectorAll('.chats-container').forEach(chat => {
    chat.addEventListener('click', () => {
      const username = chat.querySelector('.chat-username').textContent
      window.location.href = `/public/chat.html?username=${username}`
    })
  })
}
// userTag
document.addEventListener('DOMContentLoaded', async () => {
  const userTag = document.querySelector('#userTag')

  try {
    const response = await fetch('/protected/usertag', {
      method: 'GET',
      credentials: 'include'
    })

    if (response.ok) {
      const username = await response.text()
      userTag.textContent = username
    } else {
      console.error('Error al recuperar username')
      userTag.textContent = 'Invited'
    }
  } catch (err) {
    console.error('Error al obtener el username:', err)
  }
})

// redirect
document.querySelector('#userTag').addEventListener('click', () => {
  window.location.href = '/public/settingAccount.html'
})

// logout
document.querySelector('#logout').addEventListener('click', async () => {
  try {
    const response = await fetch('/auth/logout', {
      method: 'POST',
      credentials: 'include'
    })

    if (response.ok) {
      localStorage.clear()
      window.location.href = '/public/login.html'
    } else {
      console.error('Error when logging out')
    }
  } catch (err) {
    console.error('Error logout:', err)
  }
})

// function view profile image
function viewUserImage (element, imageUrl) {
  element.addEventListener('click', () => {
    const body = document.body
    const container = document.querySelector('.container')
    const viewUserImageContainer = document.createElement('div')
    viewUserImageContainer.classList.add('view-user-image-container')
    viewUserImageContainer.innerHTML = `
                <i class="fa fa-times"></i>
                <img src="${imageUrl}" alt="User profile image">
    `

    const overlay = document.createElement('div')
    overlay.classList.add('overlay')

    if (!container.classList.contains('blurred')) {
      body.appendChild(viewUserImageContainer)
      container.classList.add('blurred')
      container.appendChild(overlay)
    } else {
      container.classList.remove('blurred')
      body.removeChild(viewUserImageContainer)
      container.removeChild(overlay)
    }

    viewUserImageContainer.querySelector('.fa-times').addEventListener('click', () => {
      body.removeChild(viewUserImageContainer)
      container.removeChild(overlay)
      container.classList.remove('blurred')
    })
  })
}

// funcion loader
function createAnimationLoad (container) {
  const loader = document.createElement('div')
  loader.classList.add('loader')
  loader.innerHTML = `
    <div class="dot"></div>
    <div class="dot"></div>
    <div class="dot"></div>
  `
  container.appendChild(loader)
  return loader
}

function removeAnimationLoad (container) {
  const animationLoad = container.querySelector('.loader')
  if (animationLoad) {
    container.removeChild(animationLoad)
  }
}

// alert message
function showAlertMessage (message, duration) {
  if (typeof message !== 'string') {
    return console.error('The message must be a string')
  }

  const alert = document.createElement('div')
  alert.classList.add('alert')
  alert.innerHTML = `<p>${message}</p>`

  document.body.appendChild(alert)

  alert.style.animation = 'fadeIn 1s ease-in-out forwards'

  setTimeout(() => {
    alert.style.animation = 'fadeOut .5s ease-in-out forwards'

    setTimeout(() => {
      if (alert.parentNode) document.body.removeChild(alert)
    }, 800)
  }, duration || 1000)
}
