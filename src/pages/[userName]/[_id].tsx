import { useState, useEffect } from 'react'
import NextLink from 'next/link'
import connectionDB from '../../utils/mongodb'
import Publication from '../../models/publication'
import User from '../../models/user'
import { IPublication } from '../../types/publication'
import IUser from '../../types/user'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getCookie } from 'cookies-next'
import jwt from 'jsonwebtoken'
import NavBar from '../../components/NavBar'
import LikeButton from '../../components/LikeButton'
import { Grid, CardMedia, Box, Avatar, Typography, Link } from '@mui/material'
import Carousel from 'react-material-ui-carousel'

const carouselStyles = {
    height: { xs: '60vh', md: '88vh' },
    width: { xs: '100%', md: '50%' },
    paddingLeft: '15px',
    paddingRight: '15px'
}

const fileStyles = {
    height: { xs: '60vh', md: '88vh' },
    objectFit: 'contain'
}

const infoStyles = {
    height: { xs: '28vh', md: '88vh' },
    width: { xs: '100%', md: '50%' },
    overflowX: { xs: 'none', md: 'hidden' },
    padding: '20px'
}

interface Props {
    publication: IPublication,
    userSession: IUser,
    allUsers: IUser[]
}

export default function Publications({ publication, userSession, allUsers }: Props) {
    const [currentUser, setCurrentUser] = useState<IUser>(userSession)
    const [currentPublication, setCurrentPublication] = useState<IPublication>(publication)

    useEffect(() => {
        setCurrentPublication(publication)
    }, [publication])

    return (
        <div>
            <NavBar allUsers={allUsers} currentUser={currentUser} setCurrentUser={setCurrentUser} />
            <Grid container sx={{ flexDirection: { xs: 'column', md: 'row' } }}>
                <Carousel
                    indicators={false}
                    autoPlay={false}
                    cycleNavigation={false}
                    navButtonsAlwaysVisible={Boolean(currentPublication?.files?.length > 1)}
                    navButtonsAlwaysInvisible={Boolean(currentPublication?.files?.length < 2)}
                    sx={carouselStyles}
                >
                    {currentPublication?.files?.map(file => (
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
                            src={currentPublication?.user?.picture?.url}
                            sx={{ width: { xs: '50px', md: '80px' }, height: { xs: '50px', md: '80px' } }}
                        />
                        <NextLink href={`/${currentPublication?.user?.userName}`} passHref legacyBehavior>
                            <Link underline='none'>
                                <Typography>{currentPublication?.user?.userName}</Typography>
                            </Link>
                        </NextLink>
                    </Box>
                    <Typography>
                        {currentPublication?.text}
                    </Typography>
                    <LikeButton
                        currentUser={currentUser}
                        currentPublication={currentPublication}
                        setCurrentPublication={setCurrentPublication}
                    />
                </Grid>
            </Grid>
        </div>
    )
}

interface Props {
    params: IPublication,
    req: NextApiRequest,
    res: NextApiResponse
}

interface Token {
    userID: string,
    iat: number,
    expiresIn: number
}

export async function getServerSideProps({ params, req, res }: Props) {
    connectionDB()

    const token = getCookie('Photoland', { req, res })
    let userID: string = ''
    let userSession

    try {
        const session = jwt.verify((token as string), process.env.JWT_SECRET || '')
        userID = (session as Token).userID
        userSession = await User.findById(userID).populate({
            path: 'notifications',
            populate: {
                path: 'user',
                model: 'User',
                select: 'userName picture'
            }
        }).lean()
    } catch (error) {
        // console.log(error)
    }

    try {
        const allUsers = await User.find({}).lean()
        const publication = await Publication.findOne({ _id: params._id }).populate('user').lean()
        if (publication) {
            return {
                props: {
                    publication: JSON.parse(JSON.stringify(publication)),
                    userSession: JSON.parse(JSON.stringify(userSession || null)),
                    allUsers: JSON.parse(JSON.stringify(allUsers))
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