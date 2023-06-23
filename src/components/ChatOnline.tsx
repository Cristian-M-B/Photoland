import { Dispatch, SetStateAction, useState, useEffect } from 'react'
import IUser from '../types/user'
import IConversation from '../types/conversation'
import { getAllOnlineUsers } from '../utils/socketio'
import { getConversation, newConversation } from '../services/chat'
import { Grid, Badge, Avatar, Typography } from '@mui/material'

const styles = {
    flex: '3',
    padding: '10px'
}

const buttonStyles = {
    border: 'none',
    padding: '0px',
    backgroundColor: 'transparent',
    width: '100%'
}

interface Props {
    currentUser: IUser,
    setCurrentChat: Dispatch<SetStateAction<IConversation | null>>
}

export default function ChatOnline({ currentUser, setCurrentChat }: Props) {
    const [onlineUsers, setOnlineUsers] = useState<IUser[]>([])

    useEffect(() => {
        getAllOnlineUsers(setOnlineUsers)
    }, [])

    async function handleClick(userIdTwo: string) {
        let conversation = await getConversation(currentUser?._id, userIdTwo)
        if (conversation) {
            setCurrentChat(conversation)
        } else {
            conversation = await newConversation(currentUser?._id, userIdTwo)
            setCurrentChat(conversation)
        }
    }

    return (
        <div style={styles}>
            {onlineUsers?.map(user =>
                <button
                    key={user?._id}
                    onClick={() => handleClick(user?._id)}
                    style={buttonStyles}
                >
                    <Grid
                        container
                        alignItems='center'
                        gap={1}
                        sx={{ padding: '10px', cursor: 'pointer', '&:hover': { backgroundColor: '#dbdbdb' } }}
                    >
                        <Badge
                            color='success'
                            variant='dot'
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            sx={{ '.MuiBadge-badge': { bottom: '5px', right: '5px' } }}
                        >
                            <Avatar src={user?.picture?.url} />
                        </Badge>
                        <Typography>{user?.userName}</Typography>
                    </Grid>
                </button>
            )}
        </div>
    )
}
