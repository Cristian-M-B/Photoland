import connectionDB from '../utils/mongodb'
import User from '../models/user'
import IUser from '../types/user'
import RegisterForm from '../components/RegisterForm'
import { Grid } from '@mui/material'

interface Props {
    allUsers: IUser[]
}

export default function Register({ allUsers }: Props) {
    return (
        <Grid
            container
            alignItems='center'
            sx={{ height: '100vh' }}
        >
            <RegisterForm allUsers={allUsers} />
        </Grid>
    )
}

export async function getServerSideProps() {
    await connectionDB()
    const allUsers = await User.find({}).lean()

    return {
        props: {
            allUsers: JSON.parse(JSON.stringify(allUsers))
        }
    }

}