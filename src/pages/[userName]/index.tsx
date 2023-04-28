import { useState } from 'react'
import connectionDB from '../../utils/mongodb'
import User from '../../models/user'
import Publication from '../../models/publication'
import IUser from '../../types/user'
import { IPublication } from '../../types/publication'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getCookie } from 'cookies-next'
import jwt from 'jsonwebtoken'
import NavBar from '../../components/NavBar'
import ProfileData from '../../components/ProfileData'
import IconsMenu from '../../components/IconsMenu'
import UserFiles from '../../components/UserFiles'

interface Props {
    user: IUser,
    allPublications: IPublication[],
    allUsers: IUser[],
    userSession: IUser
}

export default function Profile({ user, allPublications, allUsers, userSession }: Props) {
    const [userProfile, setUserProfile] = useState<IUser>(user)
    const [publications, setPublications] = useState<IPublication[]>(allPublications)
    const [currentUser, setCurrentUser] = useState<IUser>(userSession)

    return (
        <>
            <NavBar allUsers={allUsers} currentUser={currentUser} setCurrentUser={setCurrentUser} />
            <ProfileData
                userProfile={userProfile}
                setUserProfile={setUserProfile}
            />
            <IconsMenu
                publications={publications}
                setPublications={setPublications}
            />
            <UserFiles
                publications={publications}
                setPublications={setPublications}
            />
        </>
    )
}

interface Props {
    params: IUser,
    req: NextApiRequest,
    res: NextApiResponse
}

interface Token {
    userID: string,
    iat: number,
    expiresIn: number
}

export async function getServerSideProps({ params, req, res }: Props) {
    connectionDB()
    const allUsers = await User.find({}).lean()
    const user = await User.findOne({ userName: params.userName }).lean()

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


    if (user) {
        let allPublications = await Publication.find({}).populate('user').lean()
        allPublications = allPublications?.filter(publication => publication.user.userName === params.userName)
        return {
            props: {
                allUsers: JSON.parse(JSON.stringify(allUsers)),
                user: JSON.parse(JSON.stringify(user)),
                allPublications: JSON.parse(JSON.stringify(allPublications.reverse())),
                userSession: JSON.parse(JSON.stringify(userSession || null))
            }
        }
    }

    return {
        notFound: true
    }

}