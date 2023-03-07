import { useState, Dispatch, SetStateAction } from 'react'
import IUser, { IFiles } from '../types/user'
import { changePicture, deleteFiles } from '../services/user'
import { Box, Grid, CardMedia, IconButton, Menu, MenuItem } from '@mui/material'
import MoreVert from '@mui/icons-material/MoreVert'

const fileSize = {
    xs: '120px',
    sm: '150px',
    md: '200px',
    lg: '250px',
    xl: '300px'
}

const breakpoints = {
    xs: '320px',
    sm: '570px',
    md: '720px',
    lg: '1160px',
    xl: '1360px'
}

interface Props {
    userProfile: IUser,
    setUserProfile: Dispatch<SetStateAction<IUser>>,
    setAllFiles: Dispatch<SetStateAction<IFiles[]>>
}

export default function UserFiles({ userProfile, setUserProfile, setAllFiles }: Props) {
    const [anchorEl, setAnchorEl] = useState<Element | null>(null)
    const open = Boolean(anchorEl)
    const [file, setFile] = useState<IFiles>({
        id: '',
        url: '',
        type: '',
        date: ''
    })

    function handleClick(e: React.MouseEvent<HTMLButtonElement>, file: IFiles) {
        setAnchorEl(e.currentTarget)
        setFile(file)
    }

    function handleClose() {
        setAnchorEl(null)
    }

    async function removeFiles() {
        handleClose()
        const updateFiles = await deleteFiles(file.id, userProfile.userName)
        setUserProfile({
            ...userProfile,
            files: updateFiles
        })
        setAllFiles(updateFiles)
    }

    async function changeProfilePicture() {
        handleClose()
        const updatePicture = await changePicture(file.url, userProfile.userName)
        setUserProfile({
            ...userProfile,
            picture: updatePicture
        })
    }

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Grid
                container
                rowGap={3}
                sx={{ marginLeft: '40px', width: { ...breakpoints } }}
            >
                {userProfile?.files?.map((file, index) => {
                    return (
                        <Box
                            key={index}
                            sx={{ display: 'flex', alignItems: 'start' }}
                        >
                            {file.type === 'image'
                                ? <CardMedia
                                    src={file.url}
                                    component='img'
                                    alt='Image'
                                    sx={{
                                        width: { ...fileSize },
                                        height: { ...fileSize },
                                        objectFit: 'contain',
                                        backgroundColor: 'background.paper'
                                    }}
                                />
                                : <CardMedia
                                    src={file.url}
                                    component='video'
                                    autoPlay muted loop
                                    sx={{
                                        width: { ...fileSize },
                                        height: { ...fileSize },
                                        objectFit: 'contain',
                                        backgroundColor: 'background.paper'
                                    }}
                                />
                            }
                            <IconButton
                                onClick={(e) => handleClick(e, file)}
                                sx={{ position: 'relative', right: '40px' }}
                            >
                                <MoreVert />
                            </IconButton>
                        </Box>
                    )
                })}
                <Menu
                    elevation={1}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'center'
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center'
                    }}
                >
                    <MenuItem onClick={removeFiles}>Eliminar</MenuItem>
                    {file.type === 'image' &&
                        <MenuItem onClick={changeProfilePicture}>Foto de perfil</MenuItem>
                    }
                </Menu>
            </Grid>
        </Box>
    )
}