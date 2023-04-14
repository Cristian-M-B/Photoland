import LoginForm from '../components/LoginForm'
import { Grid } from '@mui/material'

export default function Login() {
    return (
        <Grid
            container
            alignItems='center'
            sx={{ height: '100vh' }}
        >
            <LoginForm />
        </Grid>
    )
}