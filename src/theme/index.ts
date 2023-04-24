import { createTheme } from '@mui/material/styles'

const theme = createTheme({
    palette: {
        primary: {
            light: '#3b84ce',
            main: '#0a66c2',
            dark: '#074787'
        },
        secondary: {
            light: '#ffac33',
            main: '#ff9800',
            dark: '#b26a00'
        },
        background: {
            default: '#fafafa',
            paper: '#ffffff'
        },
        divider: '#dbdbdb',
    },
    shape: {
        borderRadius: 1
    }
})

export default theme