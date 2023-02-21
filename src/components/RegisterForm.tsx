import { useState } from 'react'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import { IUserData } from '../types/user'
import IUser from '../types/user'
import { addNewUser } from '../services/user'
import { Grid, Box, TextField, InputAdornment, IconButton, Button, Typography, Link } from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'

const boxStyles = {
    width: '300px',
    padding: '30px',
    border: '1px solid #dbdbdb',
    backgroundColor: 'background.paper'
}

interface Props {
    allUsers: IUser[]
}

export default function RegisterForm({ allUsers }: Props) {
    const router = useRouter()
    const [passwordVisibility, setPasswordVisibility] = useState<Boolean>(false)
    const [inputs, setInputs] = useState<IUserData>({
        fullName: '',
        userName: '',
        email: '',
        password: ''
    })
    const [errors, setErrors] = useState<IUserData>({
        fullName: '',
        userName: '',
        email: '',
        password: ''
    })

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setInputs({
            ...inputs,
            [e.target.name]: e.target.value
        })
    }

    function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
        if (e.target.name === 'fullName') {
            if (!inputs.fullName) {
                setErrors({
                    ...errors,
                    fullName: 'Complete este campo'
                })
            } else if (!/^[a-z '`]{1,}$/i.test(inputs.fullName)) {
                setErrors({
                    ...errors,
                    fullName: 'Ingrese un nombre válido'
                })
            } else {
                setErrors({
                    ...errors,
                    fullName: ''
                })
            }
        }
        if (e.target.name === 'userName') {
            if (!inputs.userName) {
                setErrors({
                    ...errors,
                    userName: 'Complete este campo'
                })
            } else if (!/^[a-z '`]{1,}$/i.test(inputs.userName)) {
                setErrors({
                    ...errors,
                    userName: 'Ingrese un usuario válido'
                })
            } else if (validateUserName(inputs.userName)) {
                setErrors({
                    ...errors,
                    userName: 'Este nombre de usuario no esta disponible'
                })
            } else {
                setErrors({
                    ...errors,
                    userName: ''
                })
            }
        }
        if (e.target.name === 'email') {
            if (!inputs.email) {
                setErrors({
                    ...errors,
                    email: 'Complete este campo'
                })
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(inputs.email)) {
                setErrors({
                    ...errors,
                    email: 'Ingrese un email válido'
                })
            } else if (validateEmail(inputs.email)) {
                setErrors({
                    ...errors,
                    email: 'Este email no esta disponible'
                })
            } else {
                setErrors({
                    ...errors,
                    email: ''
                })
            }
        }
        if (e.target.name === 'password') {
            if (!inputs.password) {
                setErrors({
                    ...errors,
                    password: 'Complete este campo'
                })
            } else if (! /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&#.$($)$-$_])[A-Za-z\d$@$!%*?&#.$($)$-$_]{8,16}$/i.test(inputs.password)) {
                setErrors({
                    ...errors,
                    password: 'La contraseña debe tener entre 8 y 16 caracteres, al menos 1 número y 1 caracter especial'
                })
            } else {
                setErrors({
                    ...errors,
                    password: ''
                })
            }
        }
    }

    function validateUserName(userName: String): Boolean {
        return allUsers?.some(user => user.userName === userName)
    }

    function validateEmail(email: String): Boolean {
        return allUsers?.some(user => user.email === email)
    }

    function handleSubmit() {
        const emptyFields = Object.values(inputs).some(input => Boolean(input) === false)
        const fieldsWithErrors = Object.values(errors).some(error => Boolean(error) === true)
        if (emptyFields || fieldsWithErrors) {
            alert('Complete todos los campos correctamente.')
        } else {
            addNewUser(inputs)
            router.push(`/${inputs.userName}`)
        }
    }

    return (
        <Grid container direction='column' alignItems='center'>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px', ...boxStyles }}>
                <TextField
                    placeholder='Nombre completo'
                    name='fullName'
                    value={inputs.fullName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    helperText={Boolean(errors.fullName) && errors.fullName}
                    sx={{ backgroundColor: 'background.default' }}
                />
                <TextField
                    placeholder='Nombre de usuario'
                    name='userName'
                    value={inputs.userName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    helperText={Boolean(errors.userName) && errors.userName}
                    sx={{ backgroundColor: 'background.default' }}
                />
                <TextField
                    placeholder='Correo electrónico'
                    name='email'
                    value={inputs.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    helperText={Boolean(errors.email) && errors.email}
                    sx={{ backgroundColor: 'background.default' }}
                />
                <TextField
                    placeholder='Contraseña'
                    name='password'
                    value={inputs.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    helperText={Boolean(errors.password) && errors.password}
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
                <Button
                    variant='contained'
                    color='primary'
                    size='large'
                    onClick={handleSubmit}
                    sx={{ marginTop: '10px' }}
                >
                    Registrarse
                </Button>
            </Box>
            <Box sx={{ ...boxStyles, padding: '10px', marginTop: '15px' }}>
                <Typography variant='body2' align='center'>
                    ¿Tenés una cuenta? {
                        <NextLink href='/login' passHref legacyBehavior>
                            <Link underline='none'>
                                Inicia sesión
                            </Link>
                        </NextLink>
                    }
                </Typography>
            </Box>
        </Grid>
    )
}