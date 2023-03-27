import type { NextApiRequest, NextApiResponse } from 'next'
import { v2 as cloudinary } from 'cloudinary'
import connectWithCloudinary from '../../utils/cloudinary'
import connectionDB from '../../utils/mongodb'
import User from '../../models/user'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        connectionDB()
        const user = await User.findOne({ userName: req.query.userName }).lean()
        if(user?.picture?.url) {
            connectWithCloudinary()
            await cloudinary.uploader.destroy(`${user.picture.name}`, { resource_type: `${user.picture.type}` })
        }
        await User.findOneAndUpdate({userName: req.query.userName}, {picture: req.body})
        const update = await User.findOne({userName: req.query.userName}).lean()
        res.status(200).json(update.picture)
    } catch (error) {
        console.log(error)
    }
}