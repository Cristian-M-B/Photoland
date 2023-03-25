import type { NextApiRequest, NextApiResponse } from 'next'
import { v2 as cloudinary } from 'cloudinary'
import connectWithCloudinary from '../../utils/cloudinary'
import connectionDB from '../../utils/mongodb'
import Publication from '../../models/publication'
import { IFile } from '../../types/publication'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        connectWithCloudinary()
        await Promise.all(req.body.files.map(async (file: IFile) => (
            await cloudinary.uploader.destroy(`${file.name}`, { resource_type: `${file.type}` })
        )))
        await connectionDB()
        await Publication.findByIdAndDelete(req.body._id).lean()
        const allPublications = await Publication.find({}).populate('user').lean()
        const publicationsByUser = allPublications?.filter(publication => publication.user.userName === req.body.user.userName)
        res.status(200).json(publicationsByUser.reverse())
    } catch (error) {
        console.log(error)
    }
}