import mongose from 'mongose'

const userSchema = new mongose.Schema({
    username: { 
        type: String,
        required: true, 
        unique: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    createdAt: { 
        type: Data, 
        default: Data.now 
    }
})

const User = mongose.model('User', userSchema)

export default User