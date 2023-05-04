import type { NextApiRequest, NextApiResponse } from 'next'
import connectionDB from '../../utils/mongodb'
import User from '../../models/user'
import Publication from '../../models/publication'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        connectionDB()
        const user = await User.findById(req.query.userID)
        const newPublication = new Publication({
            user: user,
            files: req.body.files,
            text: req.body.text,
            date: Date.now()
        })
        await newPublication.save()
        res.status(200).json(newPublication)
    } catch (error) {
        console.log(error)
    }
}