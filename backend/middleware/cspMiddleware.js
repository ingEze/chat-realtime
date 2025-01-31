export const cspMiddleware = (req, res, next) => {
  const cspHeader = "default-src 'self'; " +
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:3000 https://cdn.socket.io; " +
  "img-src 'self' http://localhost:3000 https://www.dropbox.com https://*.dropboxusercontent.com; " +
  "style-src 'self' https://cdnjs.cloudflare.com; " +
  "font-src 'self' https://cdnjs.cloudflare.com;"

  res.setHeader('Content-Security-Policy', cspHeader)

  next()
}
