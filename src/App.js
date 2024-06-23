import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import '@fontsource/manrope';
import Root from './Routes';
import { Provider } from 'react-redux';
import store from './redux/store/store';
import { ToastContainer } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';

const theme = createTheme({
  typography: {
    fontFamily: 'Manrope, Arial, sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          '::-webkit-scrollbar': {
            width: '6px',
            height: '8px',
          },
          '::-webkit-scrollbar-thumb': {
            backgroundColor: '#FF3F25',
            borderRadius: '8px',
          },
          '::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#FF5733',
          },
          '::-webkit-scrollbar-track': {
            backgroundColor: '#F0F0F0',
            borderRadius: '8px',
          },
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      xm: 900,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Root />
          <ToastContainer />
        </LocalizationProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
