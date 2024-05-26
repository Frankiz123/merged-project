import React from 'react';

import { CacheProvider, EmotionCache } from '@emotion/react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';

import { AuthContextProvider } from '@context/AuthContext';
import createEmotionCache from '@utils/mui/createEmotionCache';
import theme from '@utils/mui/muiTheme';
import { AppWrapper } from '@components/wrapper';
import CustomHeader from '@components/CustomHeader';

import 'react-toastify/dist/ReactToastify.css';
import '../sass/global.scss';
import '../sass/main.scss';
import '../sass/auth.scss';
import '../sass/toastify.scss';

const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const App: React.FC<MyAppProps> = ({ Component, pageProps, emotionCache = clientSideEmotionCache }) => (
  <CacheProvider value={emotionCache}>
    <CustomHeader />
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthContextProvider>
        <AppWrapper Component={Component} pageProps={pageProps} />
        <ToastContainer
          position='top-right'
          autoClose={3000}
          hideProgressBar
          newestOnTop
          closeOnClick
          rtl
          pauseOnFocusLoss
          draggable={false}
          pauseOnHover
          theme='dark'
        />
      </AuthContextProvider>
    </ThemeProvider>
  </CacheProvider>
);

export default App;
