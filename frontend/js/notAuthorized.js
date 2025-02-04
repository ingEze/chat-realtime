document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search)
  const reason = params.get('reason')

  const errorMessage = document.querySelector('#errorMessage')
  if (reason === 'email') {
    errorMessage.textContent = 'Email not verified'
  } else {
    errorMessage.textContent = 'User not authorized'
  }
})
