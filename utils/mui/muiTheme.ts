import { createTheme } from '@mui/material';

const theme = createTheme({
  typography: {
    fontFamily: ['Poppins-Regular', 'Poppins-Bold', 'Poppins-Medium'].join(','),
  },
  palette: {
    primary: {
      main: '#fc594a',
    },
    secondary: {
      main: '#232323',
    },
    success: {
      main: '#4FD000',
    },
    error: {
      main: '#ec321f',
    },
    info: {
      main: '#CBCBCB',
    },
  },
});

export default theme;
