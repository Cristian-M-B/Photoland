import { useState, useEffect } from 'react'
import IUser from '../types/user'
import IMessage from '../types/message'
import { getFriend } from '../services/user'
import getTime from '../utils/timeago'
import { Grid, Avatar, Typography } from '@mui/material'

interface Props {
    currentUser: IUser,
    message: IMessage,
    own: boolean
}

export default function Message({ currentUser, message, own }: Props) {
    const [friend, setFriend] = useState<IUser>()

    useEffect(() => {
        async function getData() {
            const friendID = message?.sender !== currentUser?._id ? message?.sender : null
            if (friendID) setFriend(await getFriend(friendID))
        }
        getData()
    }, [])

    return (
        <Grid
            container
            direction='column'
            gap={1}
            sx={{ padding: '5px' }}
        >
            <Grid
                container
                direction={own ? 'row-reverse' : 'row'}
                gap={2}
            >
                <Avatar src={own ? currentUser?.picture?.url : friend?.picture?.url} />
                <Typography
                    sx={{ padding: '10px', maxWidth: '250px', borderRadius: '20px', backgroundColor: own ? 'primary.light' : 'secondary.light', color: 'background.default' }}
                >
                    {message?.text}
                </Typography>
            </Grid>
            <Typography variant='body2' align={own ? 'right' : 'left'}>
                {getTime(message?.date)}
            </Typography>
        </Grid>
    )
}
