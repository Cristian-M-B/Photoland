import NextLink from 'next/link'
import { IPublication } from '../types/publication'
import getTime from '../utils/timeago'
import { Grid, Box, Avatar, CardMedia, Typography, Link } from '@mui/material'
import Videocam from '@mui/icons-material/Videocam'
import AutoAwesomeMotion from '@mui/icons-material/AutoAwesomeMotion'

const cardStyles = {
    width: { xs: '90%', md: '50%' },
    border: '1px solid #dbdbdb',
    backgroundColor: 'background.paper',
    padding: '10px',
    gap: '15px'
}

interface Props {
    publications: IPublication[]
}

export default function Publications({ publications }: Props) {
    return (
        <>
            {publications?.map(publication =>
                <Grid
                    key={publication?._id}
                    container
                    direction='column'
                    sx={cardStyles}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <Avatar
                                src={publication?.user?.picture?.url}
                                sx={{ width: '70px', height: '70px' }}
                            />
                            <NextLink href={`/${publication?.user?.userName}`} passHref legacyBehavior>
                                <Link underline='none'>
                                    {publication?.user?.userName}
                                </Link>
                            </NextLink>
                        </Box>
                        {publication?.files[0]?.type === 'video' &&
                            <Videocam sx={{ width: '30px', height: '30px', color: '#525151', marginRight: '20px' }} />
                        }
                        {publication?.files?.length > 1 &&
                            <AutoAwesomeMotion sx={{ width: '30px', height: '30px', color: '#525151', marginRight: '20px' }} />
                        }
                    </Box>
                    <NextLink href={`/${publication?.user?.userName}/${publication?._id}`} passHref legacyBehavior>
                        <Link underline='none'>
                            {publication?.files[0]?.type === 'image'
                                ? <CardMedia
                                    src={publication?.files[0]?.url}
                                    component='img'
                                    alt='Imagen'
                                    sx={{ height: '200px', objectFit: 'contain' }}
                                />
                                : <CardMedia
                                    src={publication?.files[0]?.url}
                                    component='video'
                                    controls
                                    sx={{ height: '200px', objectFit: 'contain' }}
                                />
                            }
                        </Link>
                    </NextLink>
                    <Typography>
                        {getTime(publication?.date)}
                    </Typography>
                </Grid>
            )}
        </>
    )
}