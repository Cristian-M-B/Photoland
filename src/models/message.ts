import { Schema, model, models } from 'mongoose'

const messageSchema = new Schema({
        conversationID: {
            type: String
        },
        sender: {
            type: String
        },
        text: {
            type: String
        },
        date: {
            type: String
        }
    },
    {
        timestamps: false,
        versionKey: false
    }
)

const Message = models.Message || model('Message', messageSchema)

export default Message