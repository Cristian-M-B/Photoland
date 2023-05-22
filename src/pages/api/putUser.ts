import type { NextApiRequest, NextApiResponse } from 'next'
import { v2 as cloudinary } from 'cloudinary'
import connectWithCloudinary from '../../utils/cloudinary'
import connectionDB from '../../utils/mongodb'
import User from '../../models/user'
import { INotification } from '../../types/user'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    connectionDB()
    if (req?.query?.notification === 'true') {
        try {
            const newNotification = { ...req.body.notification, user: req.body.notification.user._id }
            const user = await User.findById(req.body.publicationUserID).lean()
            const notifications = [newNotification, ...user.notifications]
            await User.findByIdAndUpdate(req.body.publicationUserID, { notifications })
            res.status(200)
        } catch (error) {
            console.log(error)
        }
    } else if (req?.query?.notificationRead === 'true') {
        try {
            const user = await User.findById(req.body.userID).lean()
            const updateNotifications = user.notifications.map((notification: INotification) => {
                if (notification?._id?.toString() === req.body.notificationID.toString()) {
                    return { ...notification, isRead: true }
                } else {
                    return { ...notification }
                }
            })
            const filteredNotifications = updateNotifications.filter((notification: INotification) => notification.isRead === false)
            await User.findByIdAndUpdate(req.body.userID, { notifications: filteredNotifications })
            res.status(200).json(filteredNotifications)
        } catch (error) {
            console.log(error)
        }
    } else {
        try {
            const user = await User.findOne({ userName: req.query.userName }).lean()
            if (user?.picture?.url) {
                connectWithCloudinary()
                await cloudinary.uploader.destroy(`${user.picture.name}`, { resource_type: `${user.picture.type}` })
            }
            await User.findOneAndUpdate({ userName: req.query.userName }, { picture: req.body })
            const update = await User.findOne({ userName: req.query.userName }).lean()
            res.status(200).json(update.picture)
        } catch (error) {
            console.log(error)
        }
    }
}