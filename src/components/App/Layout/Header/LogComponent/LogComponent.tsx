// ? Librairies
import { useAppSelector, useAppDispatch } from '../../../../../hook/redux';

// ? Fonctions externes
import {
  toggleModalLogin,
  toggleModalSignin,
} from '../../../../../store/reducer/log';

// ? Typage global
import { BurgerI } from '../../../../../@types/interface';

// ? Fonction principale
function LogComponent(props: BurgerI) {
  const { setIsOpen } = props; // Props de la gestion du burger

  // ? State
  // Redux
  const windowWidth = useAppSelector((state) => state.main.windowWidth); // On récupère la state windowWidth du reducer main

  // ? useDispatch
  const dispatch = useAppDispatch();

  // ? Fonctions
  /** //* Connexion
   * @param {void} handleLogin - On ouvre la modale de connexion
   * Au clic sur le bouton, on ouvre la modale de connexion
   */
  const handleLogin = () => {
    dispatch(toggleModalLogin());
    // Si windowWidth > 768, on ignore
    if (windowWidth > 768) {
      return;
    }
    // sinon on met la valeur de isOpen sur false pour fermer le burger en ouvrant la modale
    setIsOpen(false);
  };

  /** //* Inscription
   * @param {void} handleSignin - On ouvre la modale d'inscription
   * Au clic sur le bouton, on ouvre la modale d'inscription
   */
  const handleSignin = () => {
    dispatch(toggleModalSignin());
    // Si windowWidth > 768, on ignore
    if (windowWidth > 768) {
      return;
    }
    // sinon on met la valeur de isOpen sur false pour fermer le burger en ouvrant la modale
    setIsOpen(false);
  };

  // ? Rendu JSX
  return (
    <div className="Header--connect">
      <button
        onClick={handleLogin} // Au clic sur le bouton, on ouvre la modale de connexion
        className="Header--connect--login"
        type="button"
      >
        Connexion
      </button>
      <button
        onClick={handleSignin} // Au clic sur le bouton, on ouvre la modale d'inscription
        className="Header--connect--subscribe"
        type="button"
      >
        Inscription
      </button>
    </div>
  );
}

export default LogComponent;
