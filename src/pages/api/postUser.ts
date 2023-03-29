import type { NextApiRequest, NextApiResponse } from 'next'
import connectionDB from '../../utils/mongodb'
import User from '../../models/user'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectionDB()
    const newUser = new User({
      fullName: req.body.fullName,
      userName: req.body.userName,
      email: req.body.email,
      password: req.body.password
    })
    const userSaved = await newUser.save()
    res.status(200).json(userSaved)
  } catch (error) {
    console.log(error)
  }
}
