import { createTheme } from '@mui/material/styles';

const customThemeMUI = createTheme({
  status: {
    danger: '#e53e3e',
  },
  palette: {
    primary: {
      main: '#0971f1',
      darker: '#053e85',
    },
    perso: {
      main: '#454545',
      contrastText: '#D3D3D3',
    },
    lightestPerso: {
      main: '#D3D3D3',
      contrastText: '#454545',
      label: '#000000',
    },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '1.3rem',
        },
      },
    },
  },
});

export default customThemeMUI;
