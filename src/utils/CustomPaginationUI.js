import { createTheme } from '@mui/material/styles';

const paginationUITheme = createTheme({
  components: {
    MuiTablePagination: {
      styleOverrides: {
        root: {
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          '@media (min-width: 1080px)': {
            justifyContent: 'center',
          },
          '@media (max-width: 1080px)': {
            justifyContent: 'center',
          },
          '@media (max-width: 768px)': {
            justifyContent: 'left',
          },
          background: '#454545',
          borderTop: '1.5px dashed #D3D3D3',
          opacity: '0.8',
        },
        toolbar: {
          '@media (min-width: 1080px)': {
            width: '65rem',
          },
          '@media (max-width: 1080px)': {
            width: '55rem',
          },
          '@media (max-width: 768px)': {
            padding: '0 1.5rem',
            width: '50rem',
          },
        },
        select: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '@media (min-width: 1080px)': {
            fontSize: '2rem',
          },
          '@media (max-width: 1080px)': {
            fontSize: '2rem',
          },
          '@media (max-width: 768px)': {
            fontSize: '1.5rem',
          },
          '@media (max-width: 500px)': {
            fontSize: '1rem',
          },
          '@media (max-width: 324px)': {
            fontSize: '0.6rem',
          },
        },
        selectLabel: {
          '@media (min-width: 1080px)': {
            width: '40%',
            fontSize: '2rem',
          },
          '@media (max-width: 1080px)': {
            width: '35%',
            fontSize: '2rem',
          },
          '@media (max-width: 768px)': {
            fontSize: '1.5rem',
          },
          '@media (max-width: 500px)': {
            width: '30%',
            fontSize: '1rem',
          },
          '@media (max-width: 324px)': {
            fontSize: '0.6rem',
          },
        },
        // Résultats par page (1 - 10 de 100)
        displayedRows: {
          '@media (min-width: 1080px)': {
            width: '20%',
            fontSize: '1.5rem',
          },
          '@media (max-width: 1080px)': {
            width: '25%',
            fontSize: '1.5rem',
          },
          '@media (max-width: 768px)': {
            width: '20%',
            fontSize: '1rem',
          },
          '@media (max-width: 500px)': {
            width: '25%',
          },
          '@media (max-width: 324px)': {
            width: '22%',
            fontSize: '0.6rem',
          },
        },
        // Boutons de navigation (Précédent, Suivant)
        actions: {
          margin: '0',
          '@media (min-width: 1080px)': {
            width: '15%',
          },
          '@media (max-width: 1080px)': {
            width: '15%',
          },
          '@media (max-width: 500px)': {
            width: '22%',
          },
          '@media (max-width: 324px)': {
            width: '25%',
          },
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        // Style commun des composants
        root: {
          color: '#D3D3D3',
          zIndex: '0',
          '@media (min-width: 600px)': {
            paddingLeft: '0', // Retire la marge par défaut qui prenait la tête!
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        // Largeur du select
        root: {
          '@media (min-width: 1080px)': {
            width: '25%',
          },
          '@media (max-width: 1080px)': {
            width: '25%',
          },
          '@media (max-width: 768px)': {
            width: '25%',
          },
          '@media (max-width: 500px)': {
            width: '15%',
          },
        },
      },
    },
  },
});

export default paginationUITheme;
