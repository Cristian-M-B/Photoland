import { Dispatch, SetStateAction, useState } from 'react'
import { useRouter } from 'next/router'
import { notificationRead, allNotificationsRead } from '../services/user'
import IUser, { INotification } from '../types/user'
import { IconButton, Badge, Grid, Typography, Card, Avatar, Divider } from '@mui/material'
import Notifications from '@mui/icons-material/Notifications'

const size = {
    width: '25vw',
    '@media(max-width: 500px)': {
        width: '250px'
    }
}

const styles = {
    maxHeight: '272px',
    border: '1px solid #dbdbdb',
    borderRadius: '1px',
    backgroundColor: 'background.paper',
    overflowX: 'hidden',
    position: 'absolute',
    zIndex: '20',
    top: '12%',
    left: '99.99%',
    transform: 'translate(-100%)',
    '&::-webkit-scrollbar': {
        backgroundColor: 'rgb(219, 219, 219, 0.5)'
    },
    '&::-webkit-scrollbar-thumb': {
        backgroundColor: 'rgb(219, 219, 219)'
    }
}

const buttonStyles = {
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    padding: '0px'
}

interface Props {
    currentUser: IUser,
    notifications: INotification[],
    setNotifications: Dispatch<SetStateAction<INotification[]>>
}

export default function NotificationsBox({ currentUser, notifications, setNotifications }: Props) {
    const router = useRouter()
    const [seeNotifications, setSeeNotifications] = useState<boolean>(false)

    async function handleClick(url: string, notificationID: string) {
        const updateNotifications = await notificationRead(currentUser._id, notificationID)
        setNotifications(updateNotifications)
        router.push(url)
    }

    async function handleAllNotifications() {
        const updateNotifications = await allNotificationsRead(currentUser._id)
        setNotifications(updateNotifications)
    }

    return (
        <>
            {currentUser?._id &&
                <IconButton
                    onClick={() => setSeeNotifications(!seeNotifications)}
                    onBlur={() => setTimeout(() => setSeeNotifications(false), 200)}
                    sx={{ marginRight: '5px' }}
                >
                    <Badge badgeContent={notifications?.length} color='secondary'>
                        <Notifications sx={{ color: 'white' }} />
                    </Badge>
                </IconButton>
            }
            {seeNotifications &&
                <Grid sx={{ ...size, ...styles }}>
                    {notifications.length > 0 &&
                        <Grid
                            container
                            justifyContent='center'
                            alignItems='center'
                            onClick={handleAllNotifications}
                            sx={{ cursor: 'pointer', height: '35px', '&:hover': { backgroundColor: 'primary.light', color: 'background.default' } }}
                        >
                            <Typography variant='body2'>
                                Marcar las notificaciones como leídas
                            </Typography>
                        </Grid>
                    }
                    {notifications?.map((notification) => (
                        <Card key={notification._id}>
                            <button
                                onClick={() => handleClick(`/${currentUser?.userName}/${notification.publicationID}`, notification._id as string)}
                                style={buttonStyles}
                            >
                                <Grid
                                    container
                                    alignItems='center'
                                    gap={2}
                                    wrap='nowrap'
                                    sx={{ paddingLeft: '10px', minHeight: '60px', '&:hover': { backgroundColor: 'primary.light', color: 'background.default' } }}
                                >
                                    <Avatar
                                        src={notification?.user?.picture?.url}
                                        variant='rounded'
                                        sx={{ width: '40px', height: '40px' }}
                                    />
                                    <Typography align='left'>
                                        {notification.type === 'like'
                                            ? `A ${notification?.user?.userName} le gusta tu publicación.`
                                            : `${notification?.user?.userName} ha comentado tu publicación.`
                                        }
                                    </Typography>
                                </Grid>
                            </button>
                            <Divider />
                        </Card>
                    ))}
                </Grid>
            }
        </>
    )
}
