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
  } catch (err) {
    console.error('Fatal error:', err)
    window.location.href = '/notAuthorized.html'
  }
})

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('addNewUser')
  const userContainer = document.querySelector('.add-user-search-box')
  const searchIcon = document.querySelector('.add-new-user-search i')

  async function searchUsers (query) {
    userContainer.innerHTML = ''

    if (!query || query.trim() === '') {
      return
    }

    try {
      const response = await fetch(`/friends/search?q=${encodeURIComponent(query)}`, {
        method: 'GET',
        credentials: 'include'
      })

      if (!response.ok) throw new Error('No se pudieron obtener los usuarios')

      const users = await response.json()
      renderUsers(users)
    } catch (err) {
      userContainer.innerHTML = `
            <div class="new-user">
              <span class="user-error">Error al buscar usuarios</span>
            </div>
          `
    }
  }

  function renderUsers (users) {
    if (users.length === 0) {
      userContainer.innerHTML = `
            <div class="new-user">
              <span class="user-error">No se encontraron usuarios</span>
            </div>
          `
      return
    }

    users.forEach(user => {
      const userElement = document.createElement('div')
      userElement.classList.add('new-user')

      userElement.innerHTML = `
            <div class="data-user">
              <img src="${user.profilePicture || 'path/to/default/image.jpg'}" alt="${user.username}">
              <span class="username">${user.username}</span>
            </div>
            <i class="fas fa-plus-circle add-friend-btn"></i>
          `

      // Añadir evento para agregar amigo
      const addButton = userElement.querySelector('.add-friend-btn')
      addButton.addEventListener('click', () => addFriend(user.username))

      userContainer.appendChild(userElement)
    })
  }

  // Función para agregar amigo

  searchIcon.addEventListener('click', () => {
    searchUsers(searchInput.value)
  })

  searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      searchUsers(searchInput.value)
    }
  })
})

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

// logout

document.querySelector('#logout').addEventListener('click', async () => {
  try {
    const response = await fetch('/auth/logout', {
      method: 'POST',
      credentials: 'include'
    })

    if (response.ok) {
      console.log('Logout success')
      window.location.href = '/login.html'
    } else {
      console.error('Error when logging out')
    }
  } catch (err) {
    console.error('Error logout:', err)
  }
})

// Modificación del main.js
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
      console.log(result.message)
    } else {
      console.log(result.message)
    }
  } catch (error) {
    console.error('Error al agregar amigo:', error)
    console.log('No se pudo agregar al amigo')
  }
}

// Función para cargar solicitudes pendientes
async function loadFriendRequests () {
  try {
    const response = await fetch('/friends/requests', {
      method: 'GET',
      credentials: 'include'
    })

    const result = await response.json()

    if (response.ok) {
      renderFriendRequests(result.requests)
    } else {
      console.error('Error al cargar solicitudes')
    }
  } catch (error) {
    console.error('Error de red:', error)
  }
}

function renderFriendRequests (requests) {
  const requestContainer = document.getElementById('friend-requests')
  requestContainer.innerHTML = ''

  requests.forEach(request => {
    const requestElement = document.createElement('div')
    requestElement.innerHTML = `
      <img src="${request.requester.profilePicture}" alt="Perfil">
      <span>${request.requester.username}</span>
      <button onclick="acceptFriendRequest('${request._id}')">Aceptar</button>
    `
    requestContainer.appendChild(requestElement)
  })
}

document.addEventListener('DOMContentLoaded', async (username) => {
  const userTag = document.querySelector('#userTag')

  try {
    const response = await fetch('/setting/usertag', {
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

document.querySelector('#userTag').addEventListener('click', () => {
  window.location.href = '/settingAccount.html'
})
