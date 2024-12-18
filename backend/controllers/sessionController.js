export class SessionController {
  static logout (req, res) {
    try {
      res
        .clearCookie('session')
        .status(200).json({
          message: 'Logout success'
        })
    } catch (err) {
      console.error('Error in logout: ', err)
    }
  }

  static async authorized (req, res) {
    try {
      const cookie = req.cookies.session

      if (!cookie) {
        res.status(401).json({
          success: false,
          message: 'User not authorized'
        })
      }

      res.status(200).json({
        success: true,
        message: 'User authorized'
      })
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Fatal error'
      })
    }
  }

  static async authorizedUsername (req, res) {
    try {
      const cookie = req.cookies.second_instance

      if (!cookie) {
        res.status(401).json({
          success: false,
          message: 'Not authorized'
        })
      }

      res.status(200).json({
        success: true,
        message: 'User authorized'
      })
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Fatal error'
      })
    }
  }
}
