import { createTheme } from '@mui/material/styles'

const theme = createTheme({
    palette: {
        primary: {
            light: '#4dabf5',
            main: '#2196f3',
            dark: '#1769aa'
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