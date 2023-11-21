// ? Librairies
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { useAppSelector, useAppDispatch } from '../hook/redux';

// ? Composants
import Header from '../components/App/Layout/Header/Header';
import Footer from '../components/App/Layout/Footer/Footer';

// ? Fonctions externes
import { resetMessage } from '../store/reducer/main';

// ? Typage global
import { FlashI } from '../@types/interface';

// ? Fonction principale
function Root() {
  // ? State
  // Redux
  const flash: FlashI | null | undefined = useAppSelector(
    (state) => state.main.flash
  );
  const { modalLogin, modalSignin, modalDelete, modalPassword } =
    useAppSelector((state) => state.log);

  // ? Dispatch
  const dispatch = useAppDispatch();

  // ? useEffect
  /** //*Timer pour le message flash
   * @param {number} duration - Durée du timer
   * @param {resetMessage} dispatch - Dispatch de la fonction resetMessage
   * Fonction qui permet de reset le message flash après un certain temps
   * Se relance à chaque fois que le message flash change
   */
  useEffect(() => {
    if (flash) {
      const timeoutId = setTimeout(() => {
        dispatch(resetMessage());
      }, 5000);

      return () => clearTimeout(timeoutId);
    }
    return undefined;
  }, [dispatch, flash]);

  // ? Empêche le scroll sur le body quand une modale est ouverte
  if (modalLogin || modalSignin || modalDelete || modalPassword) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'unset';
  }

  return (
    <>
      {flash && (
        <Stack sx={{ width: '50%' }} spacing={2}>
          <Alert severity={flash?.type} sx={{ width: '100%' }}>
            {flash?.children}
          </Alert>
        </Stack>
      )}

      <div className="devsConnect">
        <Header />
        <Outlet /> {/* Equivalent de App */}
        <Footer />
      </div>
    </>
  );
}

export default Root;
