import { useState, useEffect, useRef } from 'react'
import IUser from '../types/user'
import IConversation from '../types/conversation'
import IMessage from '../types/message'
import Message from './Message'
import { getMessages, addMessage } from '../services/chat'
import { showMessage, newMessageSocket } from '../utils/socketio'
import { Grid, TextField, Button, Typography } from '@mui/material'

const styles = {
    flex: '6',
    padding: '10px'
}

interface Props {
    currentChat: IConversation | null,
    currentUser: IUser
}

export default function ChatBox({ currentChat, currentUser }: Props) {
    const [messages, setMessages] = useState<IMessage[]>([])
    const [arrivalMessage, setArrivalMessage] = useState<IMessage>()
    const [newMessage, setNewMessage] = useState<string>('')
    const scrollRef = useRef<null | HTMLDivElement>(null)

    useEffect(() => {
        async function getData() {
            if (currentChat?._id) {
                const data = await getMessages(currentChat?._id)
                if (data) setMessages(data)
            }
        }
        getData()
    }, [currentChat?._id])

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    useEffect(() => {
        showMessage(setArrivalMessage)
    }, [])

    useEffect(() => {
        arrivalMessage &&
            currentChat?.members.includes(arrivalMessage?.sender) &&
            setMessages((prev) => [...prev, arrivalMessage])
    }, [arrivalMessage, currentChat])

    async function handleSubmit() {
        const message = {
            text: newMessage,
            sender: currentUser?._id,
            conversationID: currentChat?._id as string,
            date: Date.now()
        }
        const receiverID = currentChat?.members.find(id => id !== currentUser?._id)
        if (receiverID) newMessageSocket(receiverID, { ...message, _id: '12345', date: message.date.toString() })
        const data = await addMessage(message)
        setMessages([...messages, data])
        setNewMessage('')
    }

    return (
        <div style={styles}>
            {currentChat?._id
                ? <>
                    <div style={{ height: '74%', overflowX: 'hidden' }}>
                        {messages?.map(message =>
                            <div key={message?._id} ref={scrollRef}>
                                <Message
                                    currentUser={currentUser}
                                    message={message}
                                    own={message.sender === currentUser?._id ? true : false}
                                />
                            </div>
                        )}
                    </div>
                    <Grid
                        container
                        justifyContent='center'
                        alignItems='center'
                        gap={1}
                        sx={{ marginTop: '20px' }}
                    >
                        <TextField
                            multiline
                            rows={3}
                            variant='outlined'
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            sx={{ width: '80%' }}
                        />
                        <Button
                            color='primary'
                            variant='contained'
                            onClick={handleSubmit}
                            sx={{ height: '50px' }}
                        >
                            Enviar
                        </Button>
                    </Grid>
                </>
                : <Grid
                    container
                    justifyContent='center'
                    alignItems='center'
                    sx={{ height: '100%' }}
                >
                    <Typography
                        variant='h2'
                        component='h2'
                        sx={{ color: '#dbdbdb' }}
                    >
                        Abre un chat
                    </Typography>
                </Grid>
            }
        </div>
    )
}
