import { User } from '../models/sessionModel.js'

export class Search {
  static async searchUsers (req, res) {
    try {
      const { q } = req.query

      if (!q || q.trim() === '') {
        return res.status(400).json({
          message: 'Query is required'
        })
      }

      const users = await User.find({
        username: { $regex: q, $options: 'i' },
        _id: { $ne: req.user._id }
      }).select('username')

      res.json(users)
    } catch (err) {
      console.error('Error searching users: ', err)
      res.status(500).json({ message: 'Error al buscar usuarios' })
    }
  }

  static async userTag (req, res) {
    try {
      if (!req.user || !req.user._id) {
        return res.status(401).json({
          success: false,
          message: 'No authenticate'
        })
      }

      if (!req.user.username) return res.send('Invited')

      res.send(req.user.username)
    } catch (err) {
      console.error('error en userTag:', err)
      res.status(500).json({
        success: false,
        message: 'Error in server, not username'
      })
    }
  }
}
