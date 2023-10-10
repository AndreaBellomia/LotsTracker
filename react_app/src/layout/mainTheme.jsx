import { createTheme } from '@mui/material/styles';
import * as colors from '@mui/material/colors';

const theme = createTheme({

    palette: {
        background: {
            default: "#171717"
        },
        primary: {
            main: "#2F3746",
        },
        secondary: {
            main: colors.green[500],
        },

        text: {
            primary: 'inherit',
            secondary: 'inherit',
        },
    },

    status: {
        danger: colors.orange[500],
    },

    components: {
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: '#2F3746',
                    color: 'white',
                    padding: "10px"
                },
                icon: {
                    color: 'white',
                }
            },
        },
    },
})

theme.palette.text = {
    primary: theme.palette.primary.main,
    secondary: theme.palette.secondary.main,
};




export default theme;