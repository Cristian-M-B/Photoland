import { useState } from 'react'
import connectionDB from '../utils/mongodb'
import User from '../models/user'
import IUser, { IFiles } from '../types/user'
import ProfileData from '../components/ProfileData'
import IconsMenu from '../components/IconsMenu'
import UserFiles from '../components/UserFiles'

interface Props {
    user: IUser
}

export default function Profile({ user }: Props) {
    const [userProfile, setUserProfile] = useState<IUser>(user)
    const [allFiles, setAllFiles] = useState<IFiles[]>(user?.files)

    return (
        <>
            <ProfileData
                userProfile={userProfile}
                setUserProfile={setUserProfile}
                setAllFiles={setAllFiles}
            />
            <IconsMenu
                userProfile={userProfile}
                setUserProfile={setUserProfile}
                allFiles={allFiles}
            />
            <UserFiles
                userProfile={userProfile}
                setUserProfile={setUserProfile}
                setAllFiles={setAllFiles}
            />
        </>
    )
}


interface Props {
    params: IUser
}

export async function getServerSideProps({ params }: Props) {
    await connectionDB()
    const user = await User.findOne({ userName: params.userName }).lean()

    return {
        props: {
            user: JSON.parse(JSON.stringify(user))
        }
    }

}