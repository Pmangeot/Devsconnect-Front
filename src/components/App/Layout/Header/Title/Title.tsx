// ? Librairie
import { Link } from 'react-router-dom';

// ? Fonction principale
function Title() {
  // ? Rendu JSX
  return (
    /** //! Link
     * @param {string} to - Lien vers la page d'accueil
     * On utilise le composant Link pour créer un lien vers la page d'accueil
     */
    <Link to="/" className="Header--brand">
      <h1>DevsConnect</h1>
    </Link>
  );
}

export default Title;
