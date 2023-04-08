import NextLink from 'next/link'
import connectionDB from '../../utils/mongodb'
import Publication from '../../models/publication'
import { IPublication } from '../../types/publication'
import { Grid, CardMedia, Box, Avatar, Typography, Link } from '@mui/material'
import Carousel from 'react-material-ui-carousel'

const carouselStyles = {
    height: { xs: '50vh', md: '100vh' },
    width: { xs: '100%', md: '50%' },
    paddingLeft: '15px',
    paddingRight: '15px'
}

const fileStyles = {
    height: { xs: '50vh', md: '100vh' },
    objectFit: 'contain'
}

const infoStyles = {
    height: { xs: '50vh', md: '100vh' },
    width: { xs: '100%', md: '50%' },
    overflowX: { xs: 'none', md: 'hidden' },
    padding: '20px'
}

interface Props {
    publication: IPublication
}

export default function Publications({ publication }: Props) {
    return (
        <Grid container sx={{ flexDirection: { xs: 'column', md: 'row' } }}>
            <Carousel
                indicators={false}
                autoPlay={false}
                cycleNavigation={false}
                navButtonsAlwaysVisible={Boolean(publication?.files?.length > 1)}
                navButtonsAlwaysInvisible={Boolean(publication?.files?.length < 2)}
                sx={carouselStyles}
            >
                {publication?.files?.map(file => (
                    file?.type === 'image'
                        ? <CardMedia
                            key={file?.url}
                            src={file?.url}
                            component='img'
                            alt='Imagen'
                            sx={fileStyles}
                        />
                        : <CardMedia
                            key={file?.url}
                            src={file?.url}
                            component='video'
                            controls
                            sx={fileStyles}
                        />
                ))}
            </Carousel>
            <Grid sx={infoStyles}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                    <Avatar
                        src={publication?.user?.picture?.url}
                        sx={{ width: '100px', height: '100px' }}
                    />
                    <NextLink href={`/${publication?.user?.userName}`} passHref legacyBehavior>
                        <Link underline='none'>
                            <Typography>{publication?.user?.userName}</Typography>
                        </Link>
                    </NextLink>
                </Box>
                <Typography>
                    {publication?.text}
                </Typography>
            </Grid>
        </Grid>
    )
}

interface Props {
    params: IPublication
}

export async function getServerSideProps({ params }: Props) {
    connectionDB()

    try {
        const publication = await Publication.findOne({ _id: params._id }).populate('user').lean()
        if (publication) {
            return {
                props: {
                    publication: JSON.parse(JSON.stringify(publication))
                }
            }
        }
    } catch (error) {
        console.log(error)
    }

    return {
        notFound: true
    }
}