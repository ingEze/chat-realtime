# Chat en Tiempo Real

Este es un proyecto de **Chat en Tiempo Real** que permite a los usuarios registrarse, iniciar sesión, agregar amigos y comunicarse en tiempo real de manera segura y eficiente. Además, incluye validación de correo electrónico para mayor seguridad.

## 🚀 Funcionalidades

- **Registro de usuario**: Los usuarios pueden registrarse proporcionando su correo electrónico y un nombre de usuario único.
- **Inicio de sesión**: Autenticación segura con JWT mediante correo electrónico y contraseña.
- **Validación por correo electrónico**: Se envía un correo de verificación para activar la cuenta.
- **Gestión de amigos**: Buscar y agregar amigos por nombre de usuario.
- **Chat en tiempo real**: Comunicación instantánea con WebSockets.
- **Configuración de cuenta**:
  - Modificación de foto de perfil.
  - Cambio de nombre de usuario.
  - Actualización de correo electrónico.
  - Cambio de contraseña.
- **Almacenamiento en la nube**: Las imágenes de perfil se almacenan en Dropbox.

## 🔧 Tecnologías utilizadas

### 📌 Backend:

- **Node.js** + **Express.js** (para manejar el servidor y API REST).
- **MongoDB** (base de datos NoSQL para almacenar usuarios y mensajes).
- **JWT (JSON Web Token)** (autenticación segura).
- **Socket.io** (comunicación en tiempo real).
- **Google Cloud APIs** (para futuras mejoras y servicios en la nube).

### 🎨 Frontend:

- **HTML, CSS y JavaScript** (interfaz de usuario).
- **Socket.io-client** (para la comunicación en tiempo real con el servidor).

### ☁️ Almacenamiento:

- **Dropbox** (para almacenar y gestionar imágenes de perfil de los usuarios).

## 📌 Instalación y configuración

1. Clonar el repositorio:

   ```sh
   git clone https://github.com/tu_usuario/chat-en-tiempo-real.git
   cd chat-en-tiempo-real
   ```

2. Instalar dependencias:

   ```sh
   npm install
   ```

3. Configurar las variables de entorno en un archivo `.env` en la raíz del proyecto:

   ```env
   PORT=3055  # Puerto en el que se ejecutará el servidor
   MONGO_URI=tu_conexion_mongodb  # URL de conexión a la base de datos MongoDB
   JWT_SECRET=tu_secreto_jwt  # Clave secreta para la autenticación con JWT
   ACCESS_TOKEN_DROPBOX=tu_access_token_dropbox  # Token de acceso para Dropbox
   FRONTEND_URL=https://flopichat.up.railway.app  # URL del frontend desplegado
   GMAIL_CLIENT_ID=tu_client_id_de_gmail  # Credenciales para el servicio de correos
   GMAIL_CLIENT_SECRET=tu_client_secret_de_gmail
   GMAIL_REFRESH_TOKEN=tu_refresh_token_de_gmail
   GMAIL_USER=tu_correo_gmail
   GMAIL_SUPPORT=tu_correo_de_soporte
   ```

4. Iniciar el servidor:

   ```sh
   npm start
   ```

## 🌍 Despliegue

El proyecto está desplegado en **Railway**, permitiendo su acceso en la web.

## 📌 Próximas funcionalidades

- Mejoras en la interfaz gráfica.
- Indicadores de estado (en línea/desconectado).
- Encriptación de mensajes para mayor privacidad.

## 📜 Licencia

Este proyecto es de código abierto y se encuentra bajo la licencia MIT.

---

¡Si te gusta el proyecto, no dudes en darle una estrella ⭐ y contribuir con mejoras! 😊

