import { Schema, model, models } from 'mongoose'

const publicationSchema = new Schema({
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        files: {
            type: Array
        },
        date: {
            type: String
        },
        title: {
            type: String
        },
        description: {
            type: String
        },
        likes: {
            type: Array
        }
    },
    {
        timestamps: false,
        versionKey: false
    }
)

const Publication = models.Publication || model('Publication', publicationSchema)

export default Publication