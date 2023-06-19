import { useState } from 'react'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getCookie } from 'cookies-next'
import jwt from 'jsonwebtoken'
import connectionDB from '../utils/mongodb'
import User from '../models/user'
import IUser from '../types/user'
import Conversation from '../models/conversation'
import IConversation from '../types/conversation'
import NavBar from '../components/NavBar'
import ChatMenu from '../components/ChatMenu'
import ChatBox from '../components/ChatBox'
import ChatOnline from '../components/ChatOnline'

interface Props {
    allUsers: IUser[],
    userSession: IUser,
    conversations: IConversation[]
}

export default function Messenger({ allUsers, userSession, conversations }: Props) {
    const [currentUser, setCurrentUser] = useState<IUser>(userSession)
    const [currentChat, setCurrentChat] = useState<IConversation | null>(null)

    return (
        <>
            <NavBar
                allUsers={allUsers}
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
            />
            <div style={{ display: 'flex', height: '88vh' }}>
                <ChatMenu
                    conversations={conversations}
                    currentUser={currentUser}
                    setCurrentChat={setCurrentChat}
                />
                <ChatBox
                    currentChat={currentChat}
                    currentUser={currentUser}
                />
                <ChatOnline
                    currentUser={currentUser}
                    setCurrentChat={setCurrentChat}
                />
            </div>
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

    const token = getCookie('Photoland', { req, res })
    let userID: string = ''
    let userSession
    let conversations

    try {
        const session = jwt.verify((token as string), process.env.JWT_SECRET || '')
        userID = (session as Token).userID
        userSession = await User.findById(userID).populate({
            path: 'notifications',
            populate: {
                path: 'user',
                model: 'User',
                select: 'userName picture'
            }
        }).lean()
        conversations = await Conversation.find({
            members: {
                $in: [userID]
            }
        })
    } catch (error) {
        // console.log(error)
    }

    return {
        props: {
            allUsers: JSON.parse(JSON.stringify(allUsers)),
            userSession: JSON.parse(JSON.stringify(userSession || null)),
            conversations: JSON.parse(JSON.stringify(conversations || null))
        }
    }
}
