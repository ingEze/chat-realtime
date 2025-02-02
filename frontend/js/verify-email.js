document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search)
  const token = urlParams.get('token')

  const loadingState = document.querySelector('#loadingState')
  const successState = document.querySelector('#successState')
  const errorState = document.querySelector('#errorState')
  const errorMessage = document.querySelector('#errorMessage')

  if (!token) {
    loadingState.classList.add('hidden')
    errorState.classList.remove('hidden')
    errorMessage.textContent = 'No valid verification token was found.'
    return
  }

  try {
    const response = await fetch(`/auth/verify-email?token=${token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })

    const data = await response.json()
    console.log('data', data)
    loadingState.classList.add('hidden')

    if (response.ok && data.success) {
      successState.classList.remove('hidden')
    } else {
      errorState.classList.remove('hidden')
      errorMessage.textContent = data.message || 'Error verifying email.'
    }
  } catch (err) {
    loadingState.classList.add('hidden')
    errorState.classList.remove('hidden')
    errorMessage.textContent = 'Connection error. Please try again later.'
  }
})
