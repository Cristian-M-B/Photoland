import type { NextApiRequest, NextApiResponse } from 'next'
import connectionDB from '../../utils/mongodb'
import Conversation from '../../models/conversation'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    connectionDB()
    if (req.method === 'POST') {
        try {
            const newConversation = new Conversation({
                members: [req.body.senderID, req.body.receiverID]
            })
            const savedConversation = await newConversation.save()
            res.status(200).json(savedConversation)
        } catch (error) {
            console.log(error)
        }
    }
    if (req.method === 'GET') {
        if(req?.query?.userIdTwo){
            try {
                const conversation = await Conversation.findOne({
                    members: {
                        $all: [req.query.userIdOne, req.query.userIdTwo]
                    }
                })
                res.status(200).json(conversation)
            } catch (error) {
                console.log(error)
            }
        } else {
            try {
                const conversation = await Conversation.find({
                    members: {
                        $in: [req.query.userID]
                    }
                })
                res.status(200).json(conversation)
            } catch (error) {
                console.log(error)
            }
        }
    }
}