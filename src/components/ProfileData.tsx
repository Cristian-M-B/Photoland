import IUser, { IFiles } from '../types/user'
import { Dispatch, SetStateAction } from 'react'
import { saveFilesToCloudinary, saveFilesToDB } from '../services/user'
import { Grid, Avatar, Typography } from '@mui/material'

interface Props {
    userProfile: IUser,
    setUserProfile: Dispatch<SetStateAction<IUser>>,
    setAllFiles: Dispatch<SetStateAction<IFiles[]>>
}

export default function ProfileData({ userProfile, setUserProfile, setAllFiles }: Props) {

    function exploreFiles() {
        let input = document.getElementById('explore')
        if (input) (input as HTMLInputElement).click()
    }

    async function uploadFiles(e: React.ChangeEvent<HTMLInputElement>) {
        const files = e.target.files
        let mediaFiles = []
        if (files) {
            for (let i = 0; i < files.length; i++) {
                mediaFiles.push(files[i])
            }
        }
        const fileData = await saveFilesToCloudinary(mediaFiles)
        if (fileData) {
            const updateFiles = await saveFilesToDB(fileData, userProfile?.userName)
            setUserProfile({
                ...userProfile,
                files: updateFiles
            })
            setAllFiles(updateFiles)
        }
    }

    return (
        <Grid
            container
            justifyContent='center'
            alignItems='center'
            gap={3}
            sx={{ marginTop: '5vh' }}
        >
            <button
                onClick={exploreFiles}
                style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}
            >
                <Avatar
                    src={userProfile?.picture}
                    alt='Imagen de perfil'
                    sx={{ width: '100px', height: '100px' }}
                />
            </button>
            <input
                id='explore'
                type='file'
                accept='image/*, video/*'
                multiple
                onChange={(e) => uploadFiles(e)}
                style={{ display: 'none' }}
            />
            <Grid item>
                <Typography variant='h5' component='h5'>{userProfile?.fullName}</Typography>
                <Typography variant='h5' component='h5'>{userProfile?.userName}</Typography>
            </Grid>
        </Grid>
    )
}