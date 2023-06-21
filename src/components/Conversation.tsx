import { useState, useEffect } from 'react'
import IUser from '../types/user'
import IConversation from '../types/conversation'
import { getFriend } from '../services/user'
import { Grid, Avatar, Typography } from '@mui/material'

interface Props {
    conversation: IConversation,
    currentUser: IUser
}

export default function Conversation({ conversation, currentUser }: Props) {
    const [friend, setFriend] = useState<IUser>()

    useEffect(() => {
        async function getData() {
            const friendID = conversation.members.find(id => id !== currentUser._id)
            if (friendID) setFriend(await getFriend(friendID))
        }
        getData()
    }, [])

    return (
        <Grid
            container
            alignItems='center'
            gap={1}
            sx={{ padding: '10px', cursor: 'pointer', '&:hover': { backgroundColor: '#dbdbdb' } }}
        >
            <Avatar src={friend?.picture?.url} />
            <Typography>{friend?.userName}</Typography>
        </Grid>
    )
}
