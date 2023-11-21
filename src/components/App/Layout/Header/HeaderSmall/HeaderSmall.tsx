// ? Librairies
import { useState } from 'react';
import { useAppSelector } from '../../../../../hook/redux';

// ? Composants
import Burger from './Burger/Burger';
import Title from '../Title/Title';
import LeftMenu from './LeftMenu/LeftMenu';
import Login from '../../../../Form/Login/Login';
import Signin from '../../../../Form/Signin/signin';

// ? Fonction principale
function HeaderSmall() {
  // ? State
  // Redux
  const modalLogin = useAppSelector((state) => state.log.modalLogin); // On récupère la state modalLogin pour la gestion de la modale
  const modalSignin = useAppSelector((state) => state.log.modalSignin); // On récupère la state modalSignin pour la gestion de la modale
  // Local
  const [isOpen, setIsOpen] = useState(false); // State pour gérer l'ouverture du burger

  // ? Rendu JSX
  return (
    <>
      <div className="Header">
        {/** //! Gestion du burger
         * @param {boolean} isOpen - State pour gérer l'ouverture du burger
         * @param {function} setIsOpen - State pour gérer l'ouverture du burger
         * On envoie les props de l'ouverture du burger dans le composant Burger
         */}
        <Burger isOpen={isOpen} setIsOpen={setIsOpen} />
        <Title />
      </div>
      {/* On envoie les props de l'ouverture du burger dans la gestion des modales connexions inscription */}
      {/** //! Gestion du menu latéral
       * @param {boolean} isOpen - State pour gérer l'ouverture du burger
       * @param {function} setIsOpen - State pour gérer l'ouverture du burger
       * On envoie les props de l'ouverture du burger dans le composant LeftMenu
       * L'ouverture du menu latéral se gère dans le composant LeftMenu
       */}
      <LeftMenu isOpen={isOpen} setIsOpen={setIsOpen} />
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

export default HeaderSmall;
