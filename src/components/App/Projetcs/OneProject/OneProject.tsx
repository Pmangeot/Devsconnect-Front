/* eslint-disable no-nested-ternary */
// ? Librairies
import { useEffect } from 'react';
import { Link } from 'react-router-dom'; // Sert à gérer les liens
import { v4 as uuidv4 } from 'uuid';
import { useNavigate, useParams } from 'react-router-dom';
import { Audio } from 'react-loader-spinner';
import { useAppSelector, useAppDispatch } from '../../../../hook/redux';

// ? Fonctions externes
import { fetchOneProject } from '../../../../store/reducer/projects';
import ProjectAddMember from '../../../../store/actions/ProjectAddMember';
import ProjectRemoveMember from '../../../../store/actions/ProjectRemoveMember';
import { resetMessage, updateFlash } from '../../../../store/reducer/main';
import { toggleModalLogin } from '../../../../store/reducer/log';

// ? Composants
import ProjectMemberMini from '../../Cards/CardMemberMini/CardMemberMini';
import NotFound from '../../../NotFound/NotFound';

// ? Styles
import './style.scss';

function OneProject() {
  // ? State
  // Store
  const project = useAppSelector((state) => state.projects.project.data); // On récupère les données du projet
  const loading = useAppSelector((state) => state.members.member.loading); // On récupère le loading
  const userId = useAppSelector((state) => state.user.login.id); // On récupère l'id du membre connecté
  const projectId = useAppSelector((state) => state.projects.project.data?.id); // On récupère l'id du projet

  // ? Navigate
  const navigate = useNavigate(); // Permet de naviguer entre les pages

  // ? Params
  const { id } = useParams(); // On récupère l'id du projet dans l'url

  // ? Dispatch
  const dispatch = useAppDispatch();

  // ? useEffect
  useEffect(() => {
    if (id) dispatch(fetchOneProject(id)); // On récupère les infos du membre avec l'id en url
  }, [dispatch, id, project?.users]); // On met à jour le useEffect si l'id change

  // ? Fonctions
  //* On vérifie si le membre est le propriétaire du projet
  const isMine = () => {
    if (project?.user_id === userId) {
      return true;
    }
    return false;
  };

  //* On vérifie si le membre est déjà membre du projet
  const isMember = () => {
    if (project?.users?.find((user) => user.user_id === userId)) {
      return true;
    }
    return false;
  };

  const handleAddMember = (projectId, userId) => {
    if (!userId) {
      dispatch(resetMessage()); // On reset le message flash

      dispatch(
        updateFlash({
          type: 'error',
          children: 'Connectez-vous pour postuler à un projet',
        })
      );
      dispatch(toggleModalLogin()); // On ouvre la modal de connexion
      return;
    }
    dispatch(ProjectAddMember({ projectId, userId }));
    dispatch(fetchOneProject(id));
  };

  const handleRemoveMember = (projectId, userId) => {
    dispatch(ProjectRemoveMember({ projectId, userId }));

    dispatch(fetchOneProject(id));
  };

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
  if (!project) {
    return (
      <NotFound
        errorMessage="Désolé, ce projet semble introuvable"
        errorStatus=""
      />
    );
  }
  return (
    <div className="Project">
      <div className="Project--return">
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
      <div className="Project--header">
        <div className="Project--header--title">{project.title}</div>
        <h4 className="Project--title">Propriétaire du projet :</h4>
        <Link to={`/users/${project.user_id}`} key={uuidv4()}>
          <p className="Project--header--owner">{project.user_pseudo}</p>
        </Link>
      </div>
      <div className="Project--firstField">
        <div className="Project--firstField--openToWork">
          <p className={project.availability ? 'open' : 'close'}>
            {/* On ajoute une classe pour css en fonction de availability */}{' '}
            {project.availability
              ? 'Ouvert au recrutement'
              : 'Fermé au recrutement'}
            {/* On affiche un texte en fonction de availability */}
          </p>
        </div>
        <div className="Project--firstField--description">
          {project.description}
        </div>
        <div className="Project--firstField--openToWork">
          {project.availability}
        </div>
      </div>
      <h4 className="Project--title">Languages utilisés :</h4>
      <div className="Project--secondField">
        {project.tags &&
          project.tags.map((tag) => (
            <div key={uuidv4()} className="Project--secondField--technos">
              <div className="Project--secondField--technos--group">
                <img
                  src={`/images/technos/${tag.name.toLowerCase()}.svg`}
                  alt="tag"
                  className="Project--secondField--technos--group--img"
                />
                <p>{tag.name}</p>
              </div>
            </div>
          ))}
      </div>
      <h4 className="Project--title">Participants :</h4>
      <div className="Project--thirdField">
        {project.users &&
          project.users.map((user) =>
            user.is_active ? (
              <ProjectMemberMini key={user.id} member={user} />
            ) : null
          )}
      </div>
      <h4 className="Project--title">Postulant :</h4>
      <div className="Project--thirdField">
        {project.users &&
          project.users
            .filter((user) => user.id !== project.user_id)
            .map((user) =>
              !user.is_active ? (
                <ProjectMemberMini key={user.id} member={user} />
              ) : null
            )}
      </div>
      <div className="Project--fourthField">
        {isMine() ? (
          <button
            type="button"
            onClick={() => navigate(`/projects/${projectId}/edit`)}
            className="Project--fourthField--container--edit"
          >
            Modifier mon projet
          </button>
        ) : project.availability && isMember() ? (
          <button
            type="button"
            onClick={(e) => handleRemoveMember(projectId, userId)}
            className="Project--fourthField--container--delete"
          >
            Quitter le projet
          </button>
        ) : project.availability ? (
          <button
            onClick={(e) => handleAddMember(projectId, userId)}
            type="button"
            className="Project--fourthField--container--submit"
          >
            postuler au projet
          </button>
        ) : (
          <div className="hidden" />
        )}
      </div>
    </div>
  );
}

export default OneProject;
