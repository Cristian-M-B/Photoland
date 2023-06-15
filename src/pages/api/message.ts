import type { NextApiRequest, NextApiResponse } from 'next'
import connectionDB from '../../utils/mongodb'
import Message from '../../models/message'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    connectionDB()
    if (req.method === 'POST') {
        try {
            const newMessage = new Message(req.body)
            const savedMessage = await newMessage.save()
            res.status(200).json(savedMessage)
        } catch (error) {
            console.log(error)
        }
    }
    if (req.method === 'GET') {
        try {
            const messages = await Message.find({
                conversationID: req.query.conversationID
            })
            res.status(200).json(messages)
        } catch (error) {
            console.log(error)
        }
    }
}