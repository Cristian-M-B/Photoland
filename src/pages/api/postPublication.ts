import type { NextApiRequest, NextApiResponse } from 'next'
import connectionDB from '../../utils/mongodb'
import User from '../../models/user'
import Publication from '../../models/publication'
import { getDate } from '../../utils/functions'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        await connectionDB()
        const user = await User.findOne({ userName: req.query.userName })
        const newPublication = new Publication({
            user: user,
            files: req.body,
            date: getDate()
        })
        await newPublication.save()
        res.status(200).json(newPublication)
    } catch (error) {
        console.log(error)
    }
}