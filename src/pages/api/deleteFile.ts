import type { NextApiRequest, NextApiResponse } from 'next'
import { IFiles } from '../../types/user'
import { v2 as cloudinary } from 'cloudinary'
import connectWithCloudinary from '../../utils/cloudinary'
import connectionDB from '../../utils/mongodb'
import User from '../../models/user'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        connectWithCloudinary()
        await cloudinary.uploader.destroy(`${req.query.fileID}`)
        await connectionDB()
        const user = await User.findOne({ userName: req.query.userName })
        const filteredFiles = user?.files?.filter((file: IFiles) => file.id !== req.query.fileID)
        await User.updateOne({ userName: req.query.userName }, { files: filteredFiles })
        const update = await User.findOne({ userName: req.query.userName })
        res.status(200).json(update.files)
    } catch (error) {
        console.log(error)
    }
}