// ? Librairies
import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate, useParams } from 'react-router-dom';
import { Audio } from 'react-loader-spinner';
import Carousel from 'react-multi-carousel';
import responsive from '../../../../utils/CustomCarousel';
import 'react-multi-carousel/lib/styles.css';

import { useAppSelector, useAppDispatch } from '../../../../hook/redux';

// ? Fonctions externes
import { fetchOneMember } from '../../../../store/reducer/members';

// ? Composants
import ProjectCard from '../../Cards/ProjectCard/ProjectCard';
import NotFound from '../../../NotFound/NotFound';

// ? Styles
import '../../Cards/ProjectCard/style.scss';

// ? Fonction principale
function OneMember() {
  // ? State
  // Store
  const member = useAppSelector((state) => state.members.member.data); // On récupère les données du membre
  const loading = useAppSelector((state) => state.members.member.loading); // On récupère le loading

  // ? Navigate
  const navigate = useNavigate(); // Permet de naviguer entre les pages

  // ? Params
  const { id } = useParams(); // On récupère l'id du membre dans l'url

  // ? Dispatch
  const dispatch = useAppDispatch();

  // ? useEffect
  useEffect(() => {
    if (id) dispatch(fetchOneMember(id)); // On récupère les infos du membre avec l'id en url
  }, [dispatch, id]); // On met à jour le useEffect si l'id change

  // En cas de chargement des membres, on affiche un indicateur de chargement
  if (loading) {
    return (
      <div className="Loader">
        <Audio
          height="80"
          width="80"
          radius="9"
          color="grey"
          ariaLabel="three-dots-loading"
          wrapperStyle
          // wrapperClass
        />
        <p>loading</p>
      </div>
    );
  }

  // Si la réponse ne vient pas, on affiche une erreur serveur
  if (!member) {
    return (
      <NotFound
        errorMessage="Désolé, ce membre semble introuvable"
        errorStatus=""
      />
    );
  }

  // ? Rendu JSX
  return (
    <div className="Member">
      <div className="Member--return">
        {/** //! Retour
         * @param {Function} navigate - Permet de naviguer entre les pages
         * On envoie au composant la fonction navigate
         * A chaque clic sur le bouton, on retourne à la page précédente
         */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className={window.history.length > 1 ? '' : 'hidden'}
        >
          Retour
        </button>
      </div>
      <div className="Member--header">
        <div className="Member--header--container">
          <div className="Member--header--container--image">
            <img
              className="Member--header--container--image--profil"
              src={member?.picture}
              alt="profil"
            />
            <div className="Member--header--container--image--contact">
              <a href={`mailto:${member.email}`}>Me contacter</a>
            </div>
          </div>
          <h2 className="Member--header--container--title">
            {member?.firstname} {member?.lastname}
          </h2>
        </div>
      </div>
      <div className="Member--content">
        <fieldset className="Member--content--firstField">
          {/* Pour chaque input, on désactive le champ si on est pas en mode édition */}
          <legend className="Member--legend">Informations personnelles</legend>
          <div className="Member--content--firstField--openToWork--reading">
            <p className={member.availability ? 'open' : 'close'}>
              {/* On ajoute une classe pour css en fonction de availability */}{' '}
              {member.availability
                ? 'Disponible pour de nouveaux projets'
                : 'Non disponible pour de nouveaux projets'}
              {/* On affiche un texte en fonction de availability */}
            </p>
          </div>
          <div className="Member--content--firstField--description--reading">
            {member.description}
          </div>
        </fieldset>
        <fieldset className="Member--content--secondField">
          <div className="Member--content--secondField--container">
            <legend className="Member--legend">Languages favoris</legend>

            <div className="Member--content--secondField--container--technos">
              {member?.tags &&
                member.tags.map((tag) => (
                  <div
                    className="Member--content--secondField--container--technos--group"
                    key={tag.id}
                  >
                    <img
                      src={`/images/technos/${tag.name.toLowerCase()}.svg`}
                      alt={tag.name}
                      title={tag.name}
                    />
                    <p>{tag.name}</p>
                  </div>
                ))}
            </div>
          </div>
        </fieldset>
        <fieldset className="Member--content--thirdField">
          <div className="Member--thirdField--projects">
            <legend className="Member--legend">Projets</legend>
            {/** //! Projets du membre
             * @param {array} member.projects - Les projets du membre
             * Si on a au moins un projet, on les affiche avec un map() sur les projets du membre
             * Pour chaque projet, on envoie au composant <ProjectCard /> une key et le projet
             */}
            {member.projects && member.projects.length > 0 && (
              <Carousel
                // ? Paramètres du carousel
                responsive={responsive} // Gère des paramètres spécifiques en fonction de la taille de l'écran
                swipeable // Swipe sur mobile (false === interdit)
                draggable={false} // Drag sur mobile (false === interdit)
                // ? Affichage/Position des éléments
                // centerMode // Affiche partiellement les cartes gauches et droites
                showDots={member.projects.length > 1} // Affiche les points de navigation
                renderDotsOutside // Affiche les points de navigation en dehors du carousel
                removeArrowOnDeviceType="mobile" // Supprime les flèches de navigation sur mobile
                renderButtonGroupOutside={false} // Affiche les boutons de navigation en dehors du carousel
                arrows={member.projects.length > 1} // Affiche les flèches de navigation
                // ? Animations
                // rewind // Permet de revenir au début de la liste après la dernière carte
                // rewindWithAnimation // Revenir au début de la liste avec une animation
                infinite // Permet de revenir au début de la liste
                autoPlay={member.projects.length > 1} // Défilement automatique
                autoPlaySpeed={7000} // Vitesse de défilement (temps entre chaque slide)
                customTransition="transform 2000ms ease-in-out" // Transition entre chaque slide
                shouldResetAutoplay // Reset l'autoplay à chaque interaction
                transitionDuration={2000}
              >
                {/** //! ProjectCard.tsx
                 * @param {Object} projectID - Données du projet
                 * @param {Number} key - Clé unique pour chaque projet
                 * On envoie au composant ProjectCard les données de chaque projet
                 * et une clé unique
                 */}
                {member.projects.map((project) => {
                  return <ProjectCard key={uuidv4()} project={project} />;
                })}
              </Carousel>
            )}
          </div>
        </fieldset>
      </div>
    </div>
  );
}

export default OneMember;
