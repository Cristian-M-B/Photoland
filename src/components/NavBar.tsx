import { useState, Dispatch, SetStateAction } from 'react'
import NextLink from 'next/link'
import IUser from '../types/user'
import SearchBar from './SearchBar'
import Menu from './Menu'
import { Link, Typography, Avatar, IconButton } from '@mui/material'
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

interface Props {
    allUsers: IUser[],
    currentUser: IUser,
    setCurrentUser: Dispatch<SetStateAction<IUser>>
}

export default function NavBar({ allUsers, currentUser, setCurrentUser }: Props) {
    const theme = useTheme()
    const [open, setOpen] = useState<boolean>(false)

    const handleDrawerOpen = () => {
        setOpen(true)
    }

    const handleDrawerClose = () => {
        setOpen(false)
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
            <IconButton
                onClick={open ? handleDrawerClose : handleDrawerOpen}
                sx={{ zIndex: theme.zIndex.drawer + 1 }}
            >
                <Avatar src={currentUser?.picture?.url} />
            </IconButton>
            <Menu open={open} handleDrawerClose={handleDrawerClose} currentUser={currentUser} setCurrentUser={setCurrentUser} />
        </nav>
    )
}