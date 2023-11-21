/* eslint-disable no-nested-ternary */
// ? Librairies
import { useId, useState } from 'react';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { ThemeProvider } from '@mui/material/styles';
import customThemeMUI from '../../../utils/customInputUI';

// ? Styles
import './style.scss';

// ? Typage local
interface InputProps {
  name: string; //! Obligatoire
  placeholder: string;
  slot: string | null;
  [otherProps: string]: unknown; // On ne connait pas le type de ce qu'il peut y avoir => booléen, string, number, ...
}

// ? Fonction principale
function Input({ name, placeholder, slot, ...props }: InputProps) {
  // ? State
  // Local
  const [value, setValue] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  // ? useId
  const inputId = useId(); // Génère un id aléatoire pour le champ

  // ? Fonctions
  /** //* Mise à jour de la valeur de l'input
   * @param {React.ChangeEvent<HTMLInputElement>} event - On récupère l'évènement
   * On met à jour le state value avec la valeur de l'input
   */
  function handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setValue(event.target.value);
  }
  function handleClickVisibilityIcon() {
    setShowPassword(!showPassword);
  }

  // ? Rendu JSX
  return (
    <ThemeProvider theme={customThemeMUI}>
      <TextField
        key={inputId}
        variant="outlined"
        color="perso"
        id={inputId}
        slot={slot}
        label={slot}
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        {...props}
        type={
          (slot === 'Mot de passe' && showPassword) ||
          (slot === 'Confirmation' && showPassword) ||
          (slot === 'Anciene' && showPassword) ||
          (slot === 'Nouveau' && showPassword)
            ? 'text'
            : (slot === 'Mot de passe' && !showPassword) ||
              (slot === 'Confirmation' && !showPassword) ||
              (slot === 'Ancien' && !showPassword) ||
              (slot === 'Nouveau' && !showPassword)
            ? 'password'
            : slot === 'Photo de profil'
            ? 'file'
            : 'text'
        }
        sx={{ margin: '1rem auto' }}
        InputProps={
          slot === 'Mot de passe' ||
          slot === 'Confirmation' ||
          slot === 'Ancien' ||
          slot === 'Nouveau'
            ? {
                endAdornment: (
                  <InputAdornment
                    position="end"
                    onClick={handleClickVisibilityIcon}
                  >
                    {showPassword ? (
                      <VisibilityOffOutlinedIcon type="button" />
                    ) : (
                      <VisibilityOutlinedIcon type="button" />
                    )}
                  </InputAdornment>
                ),
              }
            : ''
        }
      />
    </ThemeProvider>
  );
}
export default Input;
