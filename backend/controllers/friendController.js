import { Friendship } from '../models/friendModel.js'
import { User } from '../models/sessionModel.js'

export class FriendAdd {
  static async sendFriendRequest (req, res) {
    try {
      const { username } = req.body
      const requester = req.user._id

      const recipient = await User.findOne({ username })

      if (!recipient) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        })
      }

      const friendRequest = new Friendship({
        requester,
        recipient: recipient._id,
        status: 'pending'
      })

      await friendRequest.save()

      res.status(201).json({
        success: true,
        message: 'Solicitud de amistad enviada'
      })
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Error al enviar solicitud de amistad',
        error: err.message
      })
    }
  }

  static async acceptedFriendRequest (req, res) {
    try {
      const { requestId } = req.body
      const recipient = req.user._id

      const friendRequest = await Friendship.findByIdAndUpdate(
        { _id: requestId, recipient, status: 'pending' },
        { status: 'accepted' },
        { new: true }
      )

      if (!friendRequest) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        })
      }

      res.status(200).json({
        succes: true,
        message: 'Solicitud aceptada'
      })
    } catch (err) {
      res.status(500).json({
        succes: false,
        message: 'Error al aceptar solicitud',
        error: err.message
      })
    }
  }

  static async getPendingFriendRequests (req, res) {
    try {
      const pendingRequests = await Friendship.find({
        recipient: req.user._id,
        status: 'pending'
      }).populate('requester', 'username')

      res.status(200).json({
        success: true,
        requests: pendingRequests
      })
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener solicitudes',
        error: err.message
      })
    }
  }
}
