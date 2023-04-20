import { Dispatch, SetStateAction } from 'react'
import NextLink from 'next/link'
import IUser from '../types/user'
import { logOut } from '../services/user'
import { Drawer, Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Link } from '@mui/material'
import HistoryEdu from '@mui/icons-material/HistoryEdu'
import Login from '@mui/icons-material/Login'
import Person from '@mui/icons-material/Person'
import Edit from '@mui/icons-material/Edit'
import Logout from '@mui/icons-material/Logout'

interface Props {
    open: boolean,
    handleDrawerClose: () => void,
    currentUser: IUser,
    setCurrentUser: Dispatch<SetStateAction<IUser>>
}

export default function Menu({ open, handleDrawerClose, currentUser, setCurrentUser }: Props) {

    async function handleClick() {
        setCurrentUser(await logOut())
        handleDrawerClose()
    }

    return (
        <Drawer
            anchor='right'
            open={open}
            onClose={handleDrawerClose}
            sx={{ '& .MuiBackdrop-root': { backgroundColor: 'transparent' } }}
        >
            <Box sx={{ width: 'auto' }}>
                <Box sx={{ height: '12vh', backgroundColor: 'primary.main' }} />
                <List>
                    {currentUser?._id
                        ? <>
                            <NextLink href={`/${currentUser.userName}`} passHref legacyBehavior>
                                <Link underline='none'>
                                    <ListItem>
                                        <ListItemButton>
                                            <ListItemIcon>
                                                <Person />
                                            </ListItemIcon>
                                            <ListItemText primary='Perfil' sx={{ color: 'primary.main' }} />
                                        </ListItemButton>
                                    </ListItem>
                                </Link>
                            </NextLink>
                            <ListItem>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <Edit />
                                    </ListItemIcon>
                                    <ListItemText primary='Editar' sx={{ color: 'primary.main' }} />
                                </ListItemButton>
                            </ListItem>
                            <ListItem>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <Logout />
                                    </ListItemIcon>
                                    <ListItemText primary='Cerrar sesión' onClick={handleClick} sx={{ color: 'primary.main' }} />
                                </ListItemButton>
                            </ListItem>
                        </>
                        : <>
                            <NextLink href='/register' passHref legacyBehavior>
                                <Link underline='none'>
                                    <ListItem>
                                        <ListItemButton>
                                            <ListItemIcon>
                                                <HistoryEdu />
                                            </ListItemIcon>
                                            <ListItemText primary='Registrarse' />
                                        </ListItemButton>
                                    </ListItem>
                                </Link>
                            </NextLink>
                            <NextLink href='/login' passHref legacyBehavior>
                                <Link underline='none'>
                                    <ListItem>
                                        <ListItemButton>
                                            <ListItemIcon>
                                                <Login />
                                            </ListItemIcon>
                                            <ListItemText primary='Iniciar sesión' />
                                        </ListItemButton>
                                    </ListItem>
                                </Link>
                            </NextLink>
                        </>
                    }
                </List>
            </Box>
        </Drawer>
    )
}