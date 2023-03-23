import { useState, Dispatch, SetStateAction } from 'react'
import NextLink from 'next/link'
import { IPublication } from '../types/publication'
import { deletePublication } from '../services/publication'
import { Box, Grid, CardMedia, IconButton, Menu, MenuItem, Link } from '@mui/material'
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
    publications: IPublication[],
    setPublications: Dispatch<SetStateAction<IPublication[]>>
}

export default function UserFiles({ publications, setPublications }: Props) {
    const [publicationToDelete, setPublicationToDelete] = useState<IPublication | null>(null)
    const [anchorEl, setAnchorEl] = useState<Element | null>(null)
    const open = Boolean(anchorEl)

    function handleClick(e: React.MouseEvent<HTMLButtonElement>, publication: IPublication) {
        setAnchorEl(e.currentTarget)
        setPublicationToDelete(publication)
    }

    function handleClose() {
        setAnchorEl(null)
    }

    async function removePublication() {
        handleClose()
        if (publicationToDelete) {
            const update = await deletePublication(publicationToDelete)
            setPublications(update)
        }
    }

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Grid
                container
                rowGap={3}
                sx={{ marginLeft: '40px', width: { ...breakpoints } }}
            >
                {publications?.map(publication => {
                    return (
                        <Box
                            key={publication?._id}
                            sx={{ display: 'flex', alignItems: 'start' }}
                        >
                            <NextLink href={`/${publication?.user?.userName}/${publication?._id}`} passHref legacyBehavior>
                                <Link underline='none'>
                                    {publication?.files[0]?.type === 'image'
                                        ? <CardMedia
                                            src={publication?.files[0]?.url}
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
                                            src={publication?.files[0]?.url}
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
                                </Link>
                            </NextLink>
                            <IconButton
                                onClick={(e) => handleClick(e, publication)}
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
                    <MenuItem onClick={removePublication}>
                        Eliminar
                    </MenuItem>
                </Menu>
            </Grid >
        </Box >
    )
}