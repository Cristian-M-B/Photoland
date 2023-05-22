import { useState, useEffect, Dispatch, SetStateAction } from 'react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import IUser, { INotification } from '../types/user'
import SearchBar from './SearchBar'
import Menu from './Menu'
import { notificationRead } from '../services/user'
import connect, { newUser, showNotification, deleteUser, disconnect } from '../utils/socketio'
import { Link, Typography, Avatar, IconButton, Badge, Grid, Card, Divider } from '@mui/material'
import Notifications from '@mui/icons-material/Notifications'
import { useTheme } from '@mui/material/styles'

const navStyles = {
    height: '12vh',
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: '2vw',
    paddingRight: '2vw'
}

const size = {
    width: '25vw',
    '@media(max-width: 500px)': {
        width: '250px'
    }
}

const styles = {
    maxHeight: '242px',
    border: '1px solid #dbdbdb',
    borderRadius: '1px',
    backgroundColor: 'background.paper',
    overflowX: 'hidden',
    position: 'absolute',
    zIndex: '20',
    top: '12%',
    left: '99.99%',
    transform: 'translate(-100%)'
}

const buttonStyles = {
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    padding: '0px'
}

interface Props {
    allUsers: IUser[],
    currentUser: IUser,
    setCurrentUser: Dispatch<SetStateAction<IUser>>
}

export default function NavBar({ allUsers, currentUser, setCurrentUser }: Props) {
    const filteredNotifications = currentUser?.notifications?.filter(notification => notification?.isRead === false)
    const theme = useTheme()
    const router = useRouter()
    const [open, setOpen] = useState<boolean>(false)
    const [notifications, setNotifications] = useState<INotification[]>(filteredNotifications)
    const [notificationIcon, setNotificationIcon] = useState<boolean>(false)

    const handleDrawerOpen = () => {
        setOpen(true)
    }

    const handleDrawerClose = () => {
        setOpen(false)
    }

    useEffect(() => {
        if (currentUser?._id) {
            connect()
            newUser(currentUser)
            showNotification(notifications, setNotifications)
            return () => {
                deleteUser(currentUser)
                disconnect()
            }
        }
    }, [currentUser?._id])

    async function handleClick(url: string, notificationID: string) {
        const updateNotifications = await notificationRead(currentUser._id, notificationID)
        setNotifications(updateNotifications)
        router.push(url)
    }

    return (
        <nav style={{ ...navStyles, backgroundColor: theme.palette.primary.main }}>
            <NextLink href='/' passHref legacyBehavior>
                <Link underline='none'>
                    <Typography sx={{ color: 'background.default' }}>
                        Photoland
                    </Typography>
                </Link>
            </NextLink>
            <SearchBar allUsers={allUsers} />
            <div>
                {currentUser?._id &&
                    <IconButton
                        onClick={() => setNotificationIcon(!notificationIcon)}
                        onBlur={() => setTimeout(() => setNotificationIcon(false), 200)}
                        sx={{ marginRight: '5px' }}
                    >
                        <Badge badgeContent={notifications?.length} color='secondary'>
                            <Notifications sx={{ color: 'white' }} />
                        </Badge>
                    </IconButton>
                }
                {notificationIcon &&
                    <Grid sx={{ ...size, ...styles }}>
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
                                        sx={{ paddingLeft: '10px', minHeight: '60px', '&:hover': { backgroundColor: 'primary.light' } }}
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
                <IconButton
                    onClick={open ? handleDrawerClose : handleDrawerOpen}
                    sx={{ zIndex: theme.zIndex.drawer + 1 }}
                >
                    <Avatar src={currentUser?.picture?.url} />
                </IconButton>
            </div>
            <Menu
                open={open}
                handleDrawerClose={handleDrawerClose}
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
            />
        </nav >
    )
}