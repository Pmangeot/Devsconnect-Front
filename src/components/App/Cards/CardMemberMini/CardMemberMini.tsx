/* eslint-disable @typescript-eslint/naming-convention */
// ? Librairies
import { Link } from 'react-router-dom'; // Sert à gérer les liens
import { v4 as uuidv4 } from 'uuid';

// ? Styles
import './style.scss';

// ? Typage
import { MemberI } from '../../../../@types/interface';

// ? Interface globale
interface CardMemberI {
  member: MemberI;
}

// ? Fonction principale
function CardMemberMini({ member }: CardMemberI) {
  // On récupère les données de member depuis Members.tsx
  const { user_id, pseudo, picture } = member;

  // ? Rendu JSX
  return (
    <section className="CardMemberMini">
      {/** //! Link
       * @param {String} to - Lien vers la page du membre en fonction de son id
       * @param {String} key - Clé unique pour chaque membre (id)
       * On utilise Link sur le header uniquement pour garder les projets cliquables
       */}
      <div className="CardMemberMini--header">
        <Link to={`/users/${user_id}`} key={uuidv4()}>
          <div className="CardMemberMini--header--link">
            <div className="CardMemberMini--header--link--text">
              <h3 className="CardMemberMini--header--link--text--title">
                {pseudo}
              </h3>
            </div>
            <div className="CardMemberMini--header--link--container">
              <img
                src={picture}
                alt="profil"
                title={pseudo}
                className="CardMemberMini--header--link--container--img"
              />
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}

export default CardMemberMini;
