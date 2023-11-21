// ? Librairies
import { useAppSelector } from '../../../../../hook/redux';

// ? Typage global
import { BurgerI } from '../../../../../@types/interface';

// ? Composants
import LogComponent from '../LogComponent/LogComponent';
import LogoutComponent from '../LogoutComponent/LogoutComponent';
import LinksComponent from '../LinksComponent/LinksComponent';
import Title from '../Title/Title';
import Login from '../../../../Form/Login/Login';
import Signin from '../../../../Form/Signin/signin';

// ? Fonction principale
function HeaderLarge() {
  // ? State
  // Redux
  const modalLogin = useAppSelector((state) => state.log.modalLogin); // On récupère la state modalLogin pour la gestion de l'affichage de la modale
  const modalSignin = useAppSelector((state) => state.log.modalSignin); // On récupère la state modalSignin pour la gestion de l'affichage de la modale
  const isLogged = useAppSelector((state) => state.user.login.logged); // On récupère la state logged pour savoir si l'utilisateur est connecté

  // ? Rendu JSX
  return (
    <>
      <div className="Header">
        <div>
          <Title />
        </div>
        <LinksComponent />
        {/** //! Affichage des composants de connexion/inscription ou profil/déconnexion
         * @param {boolean} isLogged - State pour savoir si l'utilisateur est connecté
         * On affiche le composant de connexion/inscription si isLogged est false
         * On affiche le composant de profil/déconnexion si isLogged est true
         */}
        {isLogged ? (
          <LogoutComponent {...({} as BurgerI)} /> // On est sur du typage vu qu'on utilisera pas ces props, on force donc le typage
        ) : (
          <LogComponent {...({} as BurgerI)} /> // On est sur du typage vu qu'on utilisera pas ces props, on force donc le typage
        )}{' '}
      </div>
      {/** //! Gestion des modales connexions inscription
       * @param {boolean} modalLogin - State pour gérer l'ouverture de la modale de connexion
       * @param {boolean} modalSignin - State pour gérer l'ouverture de la modale d'inscription
       * On affiche la modale de connexion si modalLogin est à true
       * On affiche la modale d'inscription si modalSignin est à true
       */}
      {modalLogin && <Login />}
      {modalSignin && <Signin />}
    </>
  );
}

export default HeaderLarge;
