// ? Librairies
import { useAppSelector } from '../../../../../../hook/redux';

// ? Typage global
import { BurgerI } from '../../../../../../@types/interface';

// ? Composants
import LinksComponent from '../../LinksComponent/LinksComponent';
import LogoutComponent from '../../LogoutComponent/LogoutComponent';
import LogComponent from '../../LogComponent/LogComponent';
import Footer from '../../../Footer/Footer';

// ? Fonction principale
function LeftMenu(props: BurgerI) {
  const { isOpen, setIsOpen } = props; // Props de la gestion du burger

  // ? State
  // Redux
  const isLogged = useAppSelector((state) => state.user.login.logged); // On récupère la state logged pour savoir si l'utilisateur est connecté

  // ? Rendu JSX
  return (
    <div
      className={`LeftMenu ${isOpen ? 'active' : ''}`} // On ajoute la classe 'active' si isOpen est true > Gestion de l'animation du menu latéral en css
    >
      <LinksComponent
        isOpen={isOpen} // On transmet l'état de l'ouverture du burger en props au composant
        setIsOpen={setIsOpen} // On transmet la fonction de modifications du state en props au composant
      />

      {/** //! Affichage des composants de connexion/inscription ou profil/déconnexion
       * @param {boolean} isLogged - State pour savoir si l'utilisateur est connecté
       * On affiche le composant de connexion/inscription si isLogged est false
       * On affiche le composant de profil/déconnexion si isLogged est true
       */}
      {isLogged ? (
        <LogoutComponent
          isOpen={isOpen} // On transmet l'état de l'ouverture du burger en props au composant
          setIsOpen={setIsOpen} // On transmet la fonction de modifications du state en props au composant
        /> //
      ) : (
        <LogComponent
          isOpen={isOpen} // On transmet l'état de l'ouverture du burger en props au composant
          setIsOpen={setIsOpen} // On transmet la fonction de modifications du state en props au composant
        />
      )}
      <Footer />
    </div>
  );
}

export default LeftMenu;
