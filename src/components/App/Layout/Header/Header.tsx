// ? Librairies
import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../../../hook/redux';

// ? Fonctions externes
import { resizeWindow } from '../../../../store/reducer/main';

// ? Composants
import HeaderLarge from './HeaderLarge/HeaderLarge';
import HeaderSmall from './HeaderSmall/HeaderSmall';
import FlashMessage from '../../../Form/FlashMessage/FlashMessage';

// ? Styles
import './style.scss';

// ? Typage global
import { FlashI } from '../../../../@types/interface';

// ? Fonction principale
function Header() {
  // ? State
  // Redux
  const windowWidth = useAppSelector((state) => state.main.windowWidth); // Largeur de la fenêtre navigateur
  const isLogged = useAppSelector((state) => state.user.login.logged); // Booléen pour savoir si l'utilisateur est connecté
  const flash: FlashI | null | undefined = useAppSelector(
    (state) => state.user.login.message
  ); // Todo : à déplacer quand les messages flash seront utilisés

  // ? Dispatch
  const dispatch = useAppDispatch();

  // ? useEffect
  // On utilise useEffect pour mettre à jour la state windowWidth à chaque fois que la largeur de la fenêtre navigateur change
  useEffect(() => {
    const handleWindowResize = () => {
      // On met à jour et on fait un nouveau rendu avec la nouvelle largeur de la fenêtre navigateur
      dispatch(resizeWindow());
    };
    // On ajoute un écouteur d'évènement sur le resize de la fenêtre navigateur
    window.addEventListener('resize', handleWindowResize);

    // On retourne une fonction de nettoyage pour supprimer l'écouteur d'évènement
    return () => window.removeEventListener('resize', handleWindowResize);
  }, [dispatch]);

  return (
    <div>
      {/* On retourne le composant HeaderLarge si la largeur de la fenêtre navigateur est supérieure à 768px */}
      {/* Sinon on retourne le composant HeaderSmall */}
      {windowWidth > 768 ? <HeaderLarge /> : <HeaderSmall />}
    </div>
  );
}

export default Header;
