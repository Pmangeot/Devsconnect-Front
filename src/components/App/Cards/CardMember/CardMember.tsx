// ? Librairies
import { Link } from 'react-router-dom'; // Sert à gérer les liens
import { v4 as uuidv4 } from 'uuid';

// ? Styles
import './style.scss';

// ? Typage
import { ProjectI, MemberI } from '../../../../@types/interface';

// ? Interface globale
interface CardMemberI {
  member: MemberI;
}

// ? Fonction principale
function CardMember({ member }: CardMemberI) {
  // On récupère les données de member depuis Members.tsx
  const {
    id,
    firstname,
    lastname,
    pseudo,
    availability,
    description,
    picture,
    projects,
  } = member;

  // ? Rendu JSX
  return (
    <section className="CardMember">
      {/** //! Link
       * @param {String} to - Lien vers la page du membre en fonction de son id
       * @param {String} key - Clé unique pour chaque membre (id)
       * On utilise Link sur le header uniquement pour garder les projets cliquables
       */}
      <Link to={`/users/${id}`} key={uuidv4()}>
        <div className="CardMember--header">
          <div className="CardMember--header--link">
            <div className="CardMember--header--link--text">
              <h3 className="CardMember--header--link--text--title">
                {firstname} {lastname}
              </h3>
              <p
                className={`CardMember--header--link--text--availability ${
                  availability ? 'open' : 'close'
                }`}
              >
                {/* On ajoute une classe pour css en fonction de availability */}{' '}
                {availability ? 'Disponible' : 'Indisponible'}{' '}
                {/* On affiche un texte en fonction de availability */}
              </p>
            </div>
            <img
              src={picture}
              alt="profil"
              title={pseudo}
              className="CardMember--header--link--img"
            />
          </div>
          <h4 className="CardMember--header--technos--title">
            Languages maitrisés :
          </h4>
          <div className="CardMember--header--technos--list">
            {/** //! Affichage des technos
             * Si member.tags existe et qu'il y a au moins une techno
             * On map sur la liste des technos
             * On affiche l'image de la techno avec le nom en alt et title
             *
             * Sinon on affiche un message pour dire qu'il n'y a pas de techno
             */}
            {member.tags && member.tags.length > 0 ? (
              member.tags.map((tag) => (
                <img
                  src={`/images/technos/${tag.name.toLowerCase()}.svg`}
                  alt={tag.name}
                  title={tag.name}
                  key={uuidv4()}
                  className="CardMember--header--technos--list--img"
                />
              ))
            ) : (
              <p>Aucune techno</p>
            )}
          </div>
        </div>
        <div className="CardMember--body">
          <h4 className="CardMember--body--title">Description :</h4>
          <p className="CardMember--body--description">{description}</p>
        </div>
        <div className="CardMember--footer">
          <h4 className="CardMember--footer--title">Derniers projets :</h4>
          {/* //! On map dessus en dur et limite à 3 l'affichage */}
          <ul className="CardMember--footer--list">
            {/** //! Affichage des projets
             * Si member.projects existe et qu'il y a au moins un projet
             * On map sur la liste des projets
             * On limite à 3 l'affichage
             *
             *  Sinon on affiche un message pour dire qu'il n'y a pas de projet
             */}
            {projects && projects.length > 0 ? (
              member.projects.slice(0, 3).map((project: ProjectI) => (
                /** //! Link
                 * @param {String} to - Lien vers la page du projet en fonction de son id
                 * @param {String} key - Clé unique pour chaque projet (id)
                 * Pendant la boucle, on génère un lien pour chaque projet
                 * en lui donnant une clé unique et le titre du projet
                 */
                <Link key={uuidv4()} to={`/projects/${project.id}`}>
                  <li className="CardMember--footer--list--item" key={uuidv4()}>
                    {' '}
                    {project.title}
                  </li>
                </Link>
              ))
            ) : (
              <li className="CardMember--footer--list--noitem">
                Ne participe à aucun projet.
              </li>
            )}
          </ul>
        </div>
      </Link>
    </section>
  );
}

export default CardMember;
