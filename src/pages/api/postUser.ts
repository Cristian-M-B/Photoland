import type { NextApiRequest, NextApiResponse } from 'next'
import connectionDB from '../../utils/mongodb'
import User from '../../models/user'
import jwt from 'jsonwebtoken'
import { setCookie } from 'cookies-next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    connectionDB()
    const newUser = new User({
      fullName: req.body.fullName,
      userName: req.body.userName,
      email: req.body.email,
      password: req.body.password
    })
    const userSaved = await newUser.save()
    const token = jwt.sign({
      expiresIn: '30d',
      userID: `${userSaved._id}`
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
    res.status(200).json(userSaved)
  } catch (error) {
    console.log(error)
  }
}
