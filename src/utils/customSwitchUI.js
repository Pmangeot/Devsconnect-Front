// ? Définition du style du composant Switch de Material-UI
// ? A insérer dans nimporte quel composant à la place du composant Switch classique

import Switch from '@mui/material/Switch';
import { styled } from '@mui/material/styles';

const CustomSwitch = styled(Switch)(() => ({
  //! Checked
  // ? Bouton de commutation lorsqu'il est dans l'état "checked".
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: '#76c479',
    '& + .MuiSwitch-track': {
      backgroundColor: '#4CAF50',
    },
  },
  // ? Piste associée lorsque le bouton de commutation est dans l'état "checked" et "hover"
  '& .MuiSwitch-switchBase.Mui-checked:hover + .MuiSwitch-track': {
    backgroundColor: '#3d8c40',
  },

  //! Unchecked
  // ? Bouton de commutation lorsqu'il est dans l'état "unchecked".
  '& .MuiSwitch-switchBase:not(.Mui-checked)': {
    color: '#fe4830',
    '& + .MuiSwitch-track': {
      backgroundColor: '#ff0000',
    },
  },
  // ? Piste associée lorsque le bouton de commutation est dans l'état "unchecked" et "hover"
  '& .MuiSwitch-switchBase:not(.Mui-checked):hover + .MuiSwitch-track': {
    backgroundColor: '#cc0000',
  },

  //! Sélecteur
  // ? Supprimer l'effet de survol sur le sélecteur
  '& .MuiSwitch-switchBase:hover': {
    backgroundColor: 'transparent',
  },
}));

export default CustomSwitch;
