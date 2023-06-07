import { Dispatch, SetStateAction } from 'react'
import { addLike } from '../services/publication'
import { addNotification } from '../services/user'
import { newNotification } from '../utils/socketio'
import IUser, { INotification, notificationsTypes } from '../types/user'
import { IPublication } from '../types/publication'
import { Box, Typography, Button } from '@mui/material'

interface Props {
    currentUser: IUser,
    currentPublication: IPublication,
    setCurrentPublication: Dispatch<SetStateAction<IPublication>>
}

export default function LikeButton({ currentUser, currentPublication, setCurrentPublication }: Props) {

    async function handleLike() {
        const notification: INotification = {
            type: notificationsTypes.like,
            isRead: false,
            isIgnored: false,
            publicationID: currentPublication._id,
            user: currentUser
        }
        const updateLikes = await addLike(currentPublication._id, currentUser._id)
        setCurrentPublication({
            ...currentPublication,
            likes: updateLikes
        })
        newNotification(currentPublication.user._id, notification)
        await addNotification(currentPublication.user._id, notification)
    }

    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {currentUser?._id &&
                (currentPublication?.likes?.some(post => post == currentUser?._id)
                    ? <Typography>A ti te gusta</Typography>
                    : <Button onClick={handleLike}>Me gusta</Button>
                )
            }
            {currentPublication?.likes?.length > 0 &&
                <Typography sx={{ marginLeft: '10px' }}>
                    {currentPublication?.likes?.length} Me gusta
                </Typography>
            }
        </Box>
    )
}
