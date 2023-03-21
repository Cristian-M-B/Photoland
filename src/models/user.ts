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
        }
    },
    {
        timestamps: false,
        versionKey: false
    }
)

const User = models.User || model('User', userSchema)

export default User