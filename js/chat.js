function handleSubmit (event) {
  event.preventDefault()

  const form = event.target
  const messageInput = form.querySelector('input[name="message"]')
  const message = messageInput.value.trim()

  if (message) {
    // Aquí puedes agregar la lógica para enviar el mensaje a tu backend
    console.log('Mensaje a enviar:', message)

    // Crear y agregar el nuevo mensaje al chat
    const chatMessages = document.getElementById('chatMessages')
    const newMessage = createMessageElement(message)
    chatMessages.appendChild(newMessage)

    // Limpiar el input
    messageInput.value = ''

    // Scroll al último mensaje
    chatMessages.scrollTop = chatMessages.scrollHeight
  }
}

function createMessageElement (message) {
  const now = new Date()
  const time = now.toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit'
  })

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

  return messageDiv
}

document.addEventListener('DOMContentLoaded', () => {
  const chatMessages = document.getElementById('chatMessages')
  chatMessages.scrollTop = chatMessages.scrollHeight
})
