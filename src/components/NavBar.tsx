import { Dispatch, SetStateAction, useState, useEffect } from 'react'
import NextLink from 'next/link'
import IUser, { INotification } from '../types/user'
import SearchBar from './SearchBar'
import NotificationsBox from './NotificationsBox'
import Menu from './Menu'
import connect, { newUser, showNotification, deleteUser, disconnect } from '../utils/socketio'
import { Link, Typography, IconButton, Badge, Avatar } from '@mui/material'
import Message from '@mui/icons-material/Message'
import { useTheme } from '@mui/material/styles'

const navStyles: React.CSSProperties  = {
    height: '12vh',
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: '2vw',
    paddingRight: '2vw',
    top: '0px',
    position: 'sticky',
    zIndex: '20'
}

interface Props {
    allUsers: IUser[],
    currentUser: IUser,
    setCurrentUser: Dispatch<SetStateAction<IUser>>
}

export default function NavBar({ allUsers, currentUser, setCurrentUser }: Props) {
    const filteredNotifications = currentUser?.notifications?.filter(notification => notification?.isRead === false)
    const [notifications, setNotifications] = useState<INotification[]>(filteredNotifications)
    const [open, setOpen] = useState<boolean>(false)
    const theme = useTheme()

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
                    <IconButton>
                        <Badge color='secondary'>
                            <Message sx={{ color: 'background.default' }} />
                        </Badge>
                    </IconButton>
                }
                <NotificationsBox
                    currentUser={currentUser}
                    notifications={notifications}
                    setNotifications={setNotifications}
                />
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
        </nav>
    )
}