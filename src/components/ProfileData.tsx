import { Dispatch, SetStateAction } from 'react'
import IUser from '../types/user'
import { saveFilesToCloudinary } from '../services/publication'
import { changePicture } from '../services/user'
import { Grid, Avatar, Typography } from '@mui/material'

interface Props {
    userProfile: IUser,
    setUserProfile: Dispatch<SetStateAction<IUser>>
}

export default function ProfileData({ userProfile, setUserProfile }: Props) {

    function explorePhotos() {
        let input = document.getElementById('explore')
        if (input) (input as HTMLInputElement).click()
    }

    async function uploadPhoto(e: React.ChangeEvent<HTMLInputElement>) {
        const files = e.target.files
        let mediaFiles = []
        if (files) {
            for (let i = 0; i < files.length; i++) {
                mediaFiles.push(files[i])
            }
        }
        const fileData = await saveFilesToCloudinary(mediaFiles)
        if (fileData) {
            const update = await changePicture(fileData[0], userProfile?.userName)
            setUserProfile({
                ...userProfile,
                picture: update
            })
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
                onClick={explorePhotos}
                style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}
            >
                <Avatar
                    src={userProfile?.picture?.url}
                    alt='Imagen de perfil'
                    sx={{ width: '100px', height: '100px' }}
                />
            </button>
            <input
                id='explore'
                type='file'
                accept='image/*'
                onChange={(e) => uploadPhoto(e)}
                style={{ display: 'none' }}
            />
            <Grid item>
                <Typography variant='h5' component='h5'>{userProfile?.fullName}</Typography>
                <Typography variant='h5' component='h5'>{userProfile?.userName}</Typography>
            </Grid>
        </Grid>
    )
}