import { useState, Dispatch, SetStateAction } from 'react'
import { IPublication } from '../types/publication'
import { saveFilesToCloudinary, saveFilesToDB } from '../services/publication'
import { Grid, Box, TextField, Button } from '@mui/material'
import PhotoCamera from '@mui/icons-material/PhotoCamera'
import Videocam from '@mui/icons-material/Videocam'

const containerStyles = {
    width: '40%',
    padding: '15px',
    border: '1px solid #dbdbdb',
    backgroundColor: 'background.paper'
}

interface Props {
    publications: IPublication[],
    setPublications: Dispatch<SetStateAction<IPublication[]>>,
    userID: string
}

export default function PublicationBar({ publications, setPublications, userID }: Props) {
    const [text, setText] = useState<string>('')
    let files: File[] = []

    function explorePhotos() {
        let input = document.getElementById('explorePhotos')
        if (input) (input as HTMLInputElement).click()
    }

    function exploreVideos() {
        let input = document.getElementById('exploreVideos')
        if (input) (input as HTMLInputElement).click()
    }

    function uploadFiles(e: React.ChangeEvent<HTMLInputElement>) {
        files = []
        const fileList = e.target.files
        if (fileList) {
            for (let i = 0; i < fileList.length; i++) {
                files.push(fileList[i])
            }
        }
    }

    async function handleSubmit() {
        if (files.length > 0) {
            const data = await saveFilesToCloudinary(files)
            if (data) {
                const newPublication = await saveFilesToDB(data, text, userID)
                setPublications([newPublication, ...publications])
            }
            setText('')
        }
    }

    return (
        <Grid
            container
            direction='column'
            gap={1}
            sx={containerStyles}
        >
            <TextField
                multiline
                rows={3}
                value={text}
                onChange={(e) => setText(e.target.value)}
                sx={{ backgroundColor: 'background.default' }}
            />
            <Grid
                container
                justifyContent='space-between'
                alignItems='center'
            >
                <Box>
                    <Button
                        variant='outlined'
                        color='primary'
                        onClick={explorePhotos}
                        sx={{ marginRight: '15px' }}
                    >
                        <PhotoCamera />
                    </Button>
                    <Button
                        variant='outlined'
                        color='primary'
                        onClick={exploreVideos}
                    >
                        <Videocam />
                    </Button>
                    <input
                        id='explorePhotos'
                        type='file'
                        accept='image/*'
                        multiple
                        onChange={(e) => uploadFiles(e)}
                        style={{ display: 'none' }}
                    />
                    <input
                        id='exploreVideos'
                        type='file'
                        accept='video/*'
                        onChange={(e) => uploadFiles(e)}
                        style={{ display: 'none' }}
                    />
                </Box>
                <Button
                    variant='contained'
                    color='primary'
                    onClick={handleSubmit}
                >
                    Publicar
                </Button>
            </Grid>
        </Grid>
    )
}