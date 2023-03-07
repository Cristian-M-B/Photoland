import { Dispatch, SetStateAction } from 'react'
import IUser, { IFiles } from '../types/user'
import { Box, Divider, Grid, Tooltip, Zoom, IconButton } from '@mui/material'
import Apps from '@mui/icons-material/Apps'
import PhotoCamera from '@mui/icons-material/PhotoCamera'
import Videocam from '@mui/icons-material/Videocam'

interface Props {
    userProfile: IUser,
    setUserProfile: Dispatch<SetStateAction<IUser>>,
    allFiles: IFiles[]
}

export default function IconsMenu({ userProfile, setUserProfile, allFiles }: Props) {

    function filterByFileType(type: string) {
        type === 'all'
            ? setUserProfile({
                ...userProfile,
                files: allFiles
            })
            : setUserProfile({
                ...userProfile,
                files: allFiles?.filter(file => file.type === type)
            })
    }

    return (
        <Box sx={{ marginTop: '5vh', marginBottom: '8vh' }}>
            <Divider />
            <Grid container justifyContent='center' gap={5} sx={{ marginTop: '1vh', marginBottom: '1vh' }}>
                <Tooltip TransitionComponent={Zoom} title='Ver todo' arrow>
                    <IconButton onClick={() => filterByFileType('all')}>
                        <Apps />
                    </IconButton>
                </Tooltip>
                <Tooltip TransitionComponent={Zoom} title='Ver fotos' arrow>
                    <IconButton onClick={() => filterByFileType('image')}>
                        <PhotoCamera />
                    </IconButton>
                </Tooltip>
                <Tooltip TransitionComponent={Zoom} title='Ver videos' arrow>
                    <IconButton onClick={() => filterByFileType('video')}>
                        <Videocam />
                    </IconButton>
                </Tooltip>
            </Grid>
            <Divider />
        </Box>
    )
}