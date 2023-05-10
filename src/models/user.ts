import { Schema, model, models } from 'mongoose'

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    userName: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    private: {
        type: Boolean,
        default: false
    },
    picture: {
        type: Object
    },
    notifications: [{
        type: { type: String },
        isRead: { type: Boolean },
        isIgnored: { type: Boolean },
        publicationID: { type: String },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    }]
},
    {
        timestamps: false,
        versionKey: false
    }
)

const User = models.User || model('User', userSchema)

export default User