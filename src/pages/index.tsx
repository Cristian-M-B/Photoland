import { useState } from 'react'
import Head from 'next/head'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getCookie } from 'cookies-next'
import jwt from 'jsonwebtoken'
import connectionDB from '../utils/mongodb'
import User from '../models/user'
import Publication from '../models/publication'
import IUser from '../types/user'
import { IPublication } from '../types/publication'
import NavBar from '../components/NavBar'
import PublicationBar from '../components/PublicationBar'
import Publications from '../components/Publications'
import { Grid } from '@mui/material'

interface Props {
  allUsers: IUser[],
  allPublications: IPublication[],
  userSession: IUser
}

export default function Home({ allUsers, allPublications, userSession }: Props) {
  const [publications, setPublications] = useState<IPublication[]>(allPublications)
  const [currentUser, setCurrentUser] = useState<IUser>(userSession)

  return (
    <>
      <Head>
        <title>Photoland</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Grid
        container
        direction='column'
        alignItems='center'
        gap={2}
      >
        <NavBar allUsers={allUsers} currentUser={currentUser} setCurrentUser={setCurrentUser} />
        {currentUser?._id &&
          <PublicationBar publications={publications} setPublications={setPublications} userID={currentUser._id} />
        }
        <Publications publications={publications} />
      </Grid>
    </>
  )
}

interface Props {
  req: NextApiRequest,
  res: NextApiResponse
}

interface Token {
  userID: string,
  iat: number,
  expiresIn: number
}

export async function getServerSideProps({ req, res }: Props) {
  connectionDB()
  const allUsers = await User.find({}).lean()
  const allPublications = await Publication.find({}).populate('user').lean()

  const token = getCookie('Photoland', { req, res })
  let userID: string = ''
  let userSession

  try {
    const session = jwt.verify((token as string), process.env.JWT_SECRET || '')
    userID = (session as Token).userID
    userSession = await User.findById(userID).lean()
  } catch (error) {
    // console.log(error)
  }

  return {
    props: {
      allUsers: JSON.parse(JSON.stringify(allUsers)),
      allPublications: JSON.parse(JSON.stringify(allPublications.reverse())),
      userSession: JSON.parse(JSON.stringify(userSession || null))
    }
  }
}