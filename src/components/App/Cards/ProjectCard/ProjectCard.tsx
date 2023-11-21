/* eslint-disable @typescript-eslint/naming-convention */
// ? Librairies
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

// ? Styles
import './style.scss';

// ? Typage globale
import { MemberI, ProjectI, TagI } from '../../../../@types/interface';

// ? Fonction principale
function ProjectCard(project: ProjectI) {
  const {
    id,
    title,
    availability,
    user_id,
    user_pseudo,
    tags,
    description,
    users,
  } = project.project;

  // ? Rendu JSX
  if (!project) {
    return null; // Si project est null, ne rien afficher
  }

  return (
    /** //! Lien vers le projet
     * @param {Function} Link - Permet de naviguer entre les pages
     * @param {string} to - On envoie l'ID du projet dans l'url
     * @param {string} project.id - On récupère l'ID du projet
     * Permet de naviguer vers la page du projet correspondant a l'id récupéré en state
     */

    <section className="CardProject" key={uuidv4()}>
      <Link to={`/projects/${id}`}>
        <div className="ProjectCard">
          <div className="ProjectCard--firstField">
            <h4 className="ProjectCard--firstField--title">{title}</h4>
            <p
              className={`ProjectCard--firstField--availability ${
                availability ? 'open' : 'close'
              }`}
            >
              {/* On ajoute une classe pour css en fonction de availability */}{' '}
              {availability ? 'Ouvert au recrutement' : 'Fermé au recrutement'}{' '}
              {/* On affiche un texte en fonction de availability */}
            </p>
            <div className="ProjectCard--firstField--owner">
              <p className="ProjectCard--firstField--owner--title">
                Propriétaire :{' '}
              </p>
              <Link to={`/users/${user_id}`}>
                <span className="ProjectCard--firstField--owner--name">
                  {user_pseudo}
                </span>
              </Link>
            </div>
          </div>
          <div className="ProjectCard--secondField--technos">
            {/** //! Affichage des technos
             * @param {Array} tags - On récupère la liste des tags du projet
             * On map sur la liste des tags du projet
             * On limite à 4 l'affichage
             * On affiche l'image de la techno avec le nom en alt et title
             */}
            {tags &&
              tags.map((tag: TagI) => (
                <img
                  key={uuidv4()}
                  src={`/images/technos/${tag.name.toLowerCase()}.svg`}
                  alt={tag.name}
                  title={tag.name}
                />
              ))}
          </div>
          <div className="ProjectCard--thirdField">
            <div className="ProjectCard--thirdField--description">
              {description}
            </div>
          </div>
          <div className="ProjectCard--fourthField">
            <p className="ProjectCard--fourthField--title">Participants :</p>
            {/* Si il n'y a aucun postulant dans le projet : */}
            {users &&
            users.filter(
              (user: MemberI) => user.is_active === false || user.id !== user_id
            ).length === 0 ? (
              <p className="ProjectCard--fourthField--noValidated">
                Aucun participant pour le moment
              </p>
            ) : (
              <div className="ProjectCard--fourthField--users">
                {/** //! Affichage des membres
                 * @param {Array} users - On récupère la liste des membres du projet
                 * On map sur la liste des membres du projet
                 */}
                {users &&
                  users
                    .filter((user: MemberI) => user.id !== user_id)
                    .map((user: MemberI) =>
                      user.is_active ? (
                        <Link to={`/users/${user.id}`} key={uuidv4()}>
                          <li className="ProjectCard--fourthField--users--name">
                            {user.pseudo}
                          </li>
                        </Link>
                      ) : null
                    )}
              </div>
            )}
          </div>
        </div>
      </Link>
    </section>
  );
}
export default ProjectCard;
