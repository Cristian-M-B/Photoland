import type { NextApiRequest, NextApiResponse } from 'next'
import connectionDB from '../../utils/mongodb'
import User from '../../models/user'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        await connectionDB()
        if (req.query.file) {
            const user = await User.findOne({ userName: req.query.userName })
            await User.updateOne({ userName: req.query.userName }, { picture: req.query.file })
            const update = await User.findOne({ userName: req.query.userName })
            res.status(200).json(update.picture)
        } else {
            const user = await User.findOne({ userName: req.query.userName })
            await User.updateOne({ userName: req.query.userName }, { files: [...req.body, ...user.files] })
            const update = await User.findOne({ userName: req.query.userName })
            res.status(200).json(update.files)
        }
    } catch (error) {
        console.log(error)
    }
}