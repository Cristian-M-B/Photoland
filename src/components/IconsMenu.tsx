import { useState, Dispatch, SetStateAction } from 'react'
import {IPublication} from '../types/publication'
import { Box, Divider, Grid, Tooltip, Zoom, IconButton } from '@mui/material'
import Apps from '@mui/icons-material/Apps'
import PhotoCamera from '@mui/icons-material/PhotoCamera'
import Videocam from '@mui/icons-material/Videocam'

interface Props {
    publications: IPublication[],
    setPublications: Dispatch<SetStateAction<IPublication[]>>
}

export default function IconsMenu({ publications, setPublications }: Props) {
    const [allPublications, setAllPublications] = useState<IPublication[]>(publications)

    function filterByFileType(type: string) {
        type === 'all'
            ? setPublications(allPublications)
            : setPublications(allPublications.filter(publication => publication.files[0].type === type))
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