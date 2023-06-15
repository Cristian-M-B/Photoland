import type { NextApiRequest, NextApiResponse } from 'next'
import connectionDB from '../../utils/mongodb'
import User from '../../models/user'
import jwt from 'jsonwebtoken'
import { setCookie } from 'cookies-next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    connectionDB()
    if(req?.query?.id) {
        try {
            const user = await User.findById(req.query.id)
            res.status(200).json(user)
        } catch (error) {
            console.log(error)
        }
    } else {
        try {
            const user = await User.findOne({ email: req.body.email }).lean()
            const password = user?.password === req.body.password ? true : false
            if (password) {
                const token = jwt.sign({
                    expiresIn: '30d',
                    userID: `${user._id}`
                }, process.env.JWT_SECRET || '')
                setCookie('Photoland', token, {
                    req,
                    res,
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 30 * 24 * 60 * 60,
                    path: '/'
                })
                return res.status(200).json(user)
            }
        } catch (error) {
            console.log(error)
        }
        res.status(200).send('El email o la contraseña son incorrectos')
    }
}