import { useState } from 'react'
import connectionDB from '../../utils/mongodb'
import User from '../../models/user'
import Publication from '../../models/publication'
import IUser from '../../types/user'
import { IPublication } from '../../types/publication'
import ProfileData from '../../components/ProfileData'
import IconsMenu from '../../components/IconsMenu'
import UserFiles from '../../components/UserFiles'

interface Props {
    user: IUser,
    allPublications: IPublication[]
}

export default function Profile({ user, allPublications }: Props) {
    const [userProfile, setUserProfile] = useState<IUser>(user)
    const [publications, setPublications] = useState<IPublication[]>(allPublications)

    return (
        <>
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
    params: IUser
}

export async function getServerSideProps({ params }: Props) {
    connectionDB()
    const user = await User.findOne({ userName: params.userName }).lean()

    if (user) {
        let allPublications = await Publication.find({}).populate('user').lean()
        allPublications = allPublications?.filter(publication => publication.user.userName === params.userName)
        return {
            props: {
                user: JSON.parse(JSON.stringify(user)),
                allPublications: JSON.parse(JSON.stringify(allPublications.reverse()))
            }
        }
    }

    return {
        notFound: true
    }

}