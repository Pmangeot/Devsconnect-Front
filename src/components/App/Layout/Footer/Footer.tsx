// ? Style
import { Link } from 'react-router-dom';
import './style.scss';

// ? Fonction principale
function Footer() {
  // ? Rendu JSX
  return (
    <div className="Footer">
      <a className="Footer--contact" href="mailto:exemple@gmail.com">
        Me contacter
      </a>
      <p className="Footer--copyright">
        Copyright © 2023 - Tous droits réservés.
      </p>
      <Link to="/cgu" className="Footer--cgu">
        <p className="Footer--cgu">CGU</p>
      </Link>
    </div>
  );
}

export default Footer;
