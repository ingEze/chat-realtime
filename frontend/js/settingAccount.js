const form = document.querySelector('#form')

form.addEventListener('submit', async (e) => {
  e.preventDefault()
  const newUsername = document.querySelector('#newUsername').value
  const password = document.querySelector('#password').value

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

    const user = await response.json()

    if (response.ok) {
      console.log('username changed exited')
      console.log(user.message)
      window.location.href = '/index.html'
    } else {
      console.error('Error al actualizar nombre de usuario')
    }

    try {
      const response = await fetch('/setting/password-error', {
        method: 'GET',
        body: JSON.stringify({ password })
      })

      if (!response.ok) {
        console.error('password invalid')
      }
    } catch (err) {}
  } catch (err) {
    console.error('Error al cambiar el username:', err)
  }
})
