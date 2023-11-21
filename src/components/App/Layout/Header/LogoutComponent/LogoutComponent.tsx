// ? Librairies
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../../../../hook/redux';

// ? Fonctions externes
import logout from '../../../../../store/actions/logout';

// ? Typage global
import { BurgerI } from '../../../../../@types/interface';

// ? Fonction principale
function LogoutComponent(props: BurgerI) {
  const { setIsOpen } = props; // Props de la gestion du burger

  // ? State
  // Redux
  const userId = useAppSelector((state) => state.user.login.id); // Id de l'utilisateur connecté
  const windowWidth = useAppSelector((state) => state.main.windowWidth); // On récupère la state windowWidth du reducer main

  // ? useNavigate
  const navigate = useNavigate();

  // ? useDispatch
  const dispatch = useAppDispatch();

  // ? Fonctions
  /** //* Déconnexion
   * @param {void} handleLogout - Déconnexion de l'utilisateur
   * Au clic, on déconnecte l'utilisateur
   * et on redirige vers la page d'accueil
   *
   * Si windowWidth > 768, on ignore, sinon met la valeur de isOpen sur false pour fermer le burger.
   */
  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    if (windowWidth > 768) {
      return;
    }
    setIsOpen(false);
  };

  /** //* Mon Profil
   * @param {void} handleClick - Clic sur le bouton
   * Au clic sur le lien, on ferme le burger
   * Si windowWidth > 768, on ignore
   */
  const handleClick = () => {
    // Si windowWidth > 768, on ignore, sinon inverse la valeur de isOpen pour fermer le burger en ouvrant la modale
    if (windowWidth > 768) {
      return;
    }
    setIsOpen(false);
  };

  // ? Rendu JSX
  return (
    <div className="Header--connect">
      {/** //! Link
       * @param {string} to - Lien vers la page d'accueil
       * On utilise le composant Link pour créer un lien vers user/:id
       */}
      <Link to={`/users/${userId}`} className="Header--connect--profil-link">
        <button
          onClick={handleClick} // Au clic, on lance la fonction handleClick
          className="Header--connect--profil"
          type="button"
        >
          Mon Profil
        </button>
      </Link>
      <button
        onClick={handleLogout} // Au clic, on déconnecte l'utilisateur
        className="Header--connect--logout"
        type="button"
      >
        Déconnexion
      </button>
    </div>
  );
}

export default LogoutComponent;
