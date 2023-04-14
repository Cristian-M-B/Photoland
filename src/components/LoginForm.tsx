import { useState } from 'react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { getUser } from '../services/user'
import Swal from 'sweetalert2'
import { useTheme } from '@mui/material/styles'
import { Grid, Box, TextField, InputAdornment, IconButton, Button, Typography, Link } from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'

const boxStyles = {
    width: '300px',
    padding: '30px',
    border: '1px solid #dbdbdb',
    backgroundColor: 'background.paper'
}

interface Inputs {
    email: string,
    password: string
}

export default function LoginForm() {
    const theme = useTheme()
    const router = useRouter()
    const [passwordVisibility, setPasswordVisibility] = useState<Boolean>(false)
    const [inputs, setInputs] = useState<Inputs>({
        email: '',
        password: ''
    })

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setInputs({
            ...inputs,
            [e.target.name]: e.target.value
        })
    }

    async function handleSubmit() {
        const user = await getUser(inputs.email, inputs.password)
        if (user?.userName) {
            setInputs({
                email: '',
                password: ''
            })
            router.push(`/${user?.userName}`)
        } else {
            Swal.fire({
                icon: 'error',
                title: 'El email o la contraseña son incorrectos.',
                text: 'Por favor, inténtelo de nuevo.',
                confirmButtonColor: `${theme.palette.primary.main}`,
                background: `${theme.palette.background.default}`
            })
        }
    }

    return (
        <Grid container direction='column' alignItems='center'>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px', ...boxStyles }}>
                <TextField
                    placeholder='Correo electrónico'
                    name='email'
                    value={inputs.email}
                    onChange={handleChange}
                    sx={{ backgroundColor: 'background.default' }}
                />
                <TextField
                    placeholder='Contraseña'
                    name='password'
                    value={inputs.password}
                    onChange={handleChange}
                    sx={{ backgroundColor: 'background.default' }}
                    type={passwordVisibility ? 'text' : 'password'}
                    InputProps={{
                        endAdornment:
                            <InputAdornment position='end'>
                                <IconButton onClick={() => setPasswordVisibility(!passwordVisibility)}>
                                    {passwordVisibility
                                        ? <VisibilityOff />
                                        : <Visibility />
                                    }
                                </IconButton>
                            </InputAdornment>
                    }}
                />
                <Typography variant='body2'>
                    <NextLink href='/' passHref legacyBehavior>
                        <Link underline='none'>
                            Olvidé mi contraseña
                        </Link>
                    </NextLink>
                </Typography>
                <Button
                    variant='contained'
                    color='primary'
                    size='large'
                    onClick={handleSubmit}
                    sx={{ marginTop: '10px' }}
                >
                    Iniciar sesión
                </Button>
            </Box>
            <Box sx={{ ...boxStyles, padding: '10px', marginTop: '15px' }}>
                <Typography variant='body2' align='center'>
                    ¿No tenés una cuenta? {
                        <NextLink href='/register' passHref legacyBehavior>
                            <Link underline='none'>
                                Regístrate
                            </Link>
                        </NextLink>
                    }
                </Typography>
            </Box>
        </Grid>
    )
}