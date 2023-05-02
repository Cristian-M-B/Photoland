import type { NextApiRequest, NextApiResponse } from 'next'
import connectionDB from '../../utils/mongodb'
import Publication from '../../models/publication'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        connectionDB()
        await Publication.findByIdAndUpdate(
            req.body.publicationID,
            { $addToSet: { likes: [req.body.userLike] } }
        )
        const update = await Publication.findById(req.body.publicationID).populate('user').lean()
        res.status(200).json(update.likes)
    } catch (error) {
        console.log(error)
    }
}