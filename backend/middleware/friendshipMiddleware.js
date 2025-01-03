import { Friendship } from '../models/friendModel.js'
import { User } from '../models/sessionModel.js'

Friendship.post('save', async function (doc) {
  if (doc.status === 'accepted') {
    await User.findByIdAndUpdate(doc.requester, {
      $addToSet: { friends: doc.recipient }
    })
  }

  await User.findByIdAndUpdate(doc.recipient, {
    $addToSet: { friends: doc.requester }
  })
})
