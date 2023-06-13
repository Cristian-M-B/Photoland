import { Schema, model, models } from 'mongoose'

const conversationSchema = new Schema({
        members: {
            type: Array
        }
    },
    {
        timestamps: false,
        versionKey: false
    }
)

const Conversation = models.Conversation || model('Conversation', conversationSchema)

export default Conversation