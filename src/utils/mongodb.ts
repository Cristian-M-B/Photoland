import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI || ''

export default function connectionDB() {
    mongoose.connect(MONGODB_URI)
}

