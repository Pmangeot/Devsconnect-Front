/* eslint-disable no-lonely-if */
/* eslint-disable no-nested-ternary */
// ? Librairies
import { useState, useRef, useEffect } from 'react';

import { useNavigate, useParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../../../../hook/redux';

// ? Fonctions externes
import { fetchAllTags } from '../../../../../store/reducer/tag';
import updateProject from '../../../../../store/actions/projectUpdate';
import ProjectAcceptMember from '../../../../../store/actions/ProjectAcceptMember';
import ProjectDeleteMember from '../../../../../store/actions/ProjectDeleteMember';
import checkTitle from '../../../../../store/actions/checkTitle';

import { toggleModalDeleteProject } from '../../../../../store/reducer/log';

import { resetMessage, updateFlash } from '../../../../../store/reducer/main';
import {
  classMapping,
  validateField,
  isFormValid,
  errorMessages,
} from '../../../../../utils/validate form/validateForm';

// ? Composants
import CustomSwitch from '../../../../../utils/customSwitchUI';
import Input from '../../../../Form/Input';
import DeleteProjectModale from './DeleteProjectModale/DeleteProjectModale';

// ? Styles
import '../../CreateProject/style.scss';

// ? Typage global
import { ProjectI, TagSelectedI } from '../../../../../@types/interface';
import { fetchOneProject } from '../../../../../store/reducer/projects';

// ? Typage local
interface ObjectI {
  title?: string;
  description?: string;
  availability?: boolean;
  tags?: (string | number)[];
}

// ? Fonction principale
function MyProject() {
  // ? State
  const project: ProjectI | null = useAppSelector(
    (state) => state.projects.project.data
  ); // Projet récupéré depuis l'API
  const allTags: TagSelectedI[] = useAppSelector(
    (state) => state.tag.list.data
  ); // Tableau des tags récupérés depuis l'API
  const { titleMessage, titleStatus } = useAppSelector((state) => state.ajax);
  const modaleDeleteProject = useAppSelector(
    (state) => state.log.modalDeleteProject
  ); // State pour la modale de suppression de projet
  const ownerId = useAppSelector((state) => state.user.login.id);

  // Local
  const [checked, setChecked] = useState(project?.availability); // State pour le check de open to work
  const [selectedTags, setSelectedTags] = useState<TagSelectedI[]>([]); // Tableau des tags sélectionnés par l'utilisateur
  const [oldTitle, setOldTitle] = useState(''); // Ancien titre de projet

  // États pour la gestion du formulaire et des erreurs associées
  const [formFields, setFormFields] = useState({
    title: { value: '', className: '' },
    description: { value: '', className: '' },
    tags: { value: '', className: '' },
  });

  // ? useRef
  const formRef = useRef<HTMLFormElement>(null); // Référence pour le formulaire

  // ? useParams
  const { id } = useParams(); // On récupère l'id du projet dans l'url

  // ? useNavigate
  const navigate = useNavigate();

  // ? Dispatch
  const dispatch = useAppDispatch();

  // ? useEffect
  /** //* UseEffect pour la récupération des tags
   * @param {fetchAllTags} dispatch - Dispatch de l'action pour récupérer les tags
   * Au chargement du composant, on dispatch l'action pour récupérer les tags
   * On ne met pas de dépendance car on veut que ça se lance qu'une seule fois
   */
  useEffect(() => {
    dispatch(fetchAllTags());
    setSelectedTags(project?.tags);
  }, [dispatch]);

  /** //* useEffect pour la récupération des données du projet
   * @param {updateProject} dispatch - Dispatch de l'action pour récupérer les données du projet
   * Au chargement du composant, on dispatch l'action pour récupérer les données du projet
   * On ne met pas de dépendance car on veut que ça se lance qu'une seule fois
   */
  useEffect(() => {
    const projectId = id.toString();
    dispatch(fetchOneProject(projectId));
  }, [dispatch, id, project?.availability, setSelectedTags, project?.users]);

  // ? Fonctions

  /** //* Fonction pour le bouton delete
   * @param {boolean} modalDelete - valeur du state modalDelete
   * Au clic, on inverse la valeur du state modalDelete
   * qui affiche ou non la modale de suppression
   */
  const handleDeleteProjectModale = () => {
    if (project?.users.length !== 1) {
      dispatch(
        updateFlash({
          type: 'error',
          children: 'Vous ne pouvez pas supprimer un projet avec des membres',
        })
      );
    } else {
      dispatch(toggleModalDeleteProject());
    }
  };

  /** //* Fonction reset du formulaire
   * @param {boolean} isEditMode - valeur du state isEditMode
   * Au clic, on inverse la valeur du state isEditMode
   */
  const handleResetForm = () => {
    // On réinitialise les messages d'erreur et isFormValid pour ne rien garder en mémoire
    setFormFields({
      ...formFields,
      title: { value: '', className: '' },
      description: { value: '', className: '' },
    });
    isFormValid.title = true;
    isFormValid.description = true;
  };

  /** //* Fonction pour le switch open to work
   * @param {setChecked} setChecked - State pour le check de open to work
   * Au clic, on inverse la valeur du state
   */
  const handleSwitch = () => {
    setChecked(!checked);
  };

  /** //* Fonction pour la selection des technos (au clic sur une techno)
   * @param {number} id - Id de la techno
   * @param {allTags} allTags - Tableau des tags récupérés depuis l'API
   * @param {selectedTags} selectedTags - Tableau des tags sélectionnés par l'utilisateur
   * @param {setSelectedTags} setSelectedTags - State pour le tableau des tags sélectionnés par l'utilisateur
   * Au clic sur une techno, on vérifie si elle est déjà sélectionnée ou non
   * Si elle est déjà sélectionnée, on la supprime du tableau des technos sélectionnées
   * Si elle n'est pas sélectionnée, on l'ajoute au tableau des technos sélectionnées
   * On met à jour le state des technos sélectionnées
   */
  const handleImageClick = (tagId: number) => {
    // On vérifie que le tag sélectionné existe bien dans le tableau des tags récupérés depuis l'API
    const selectedTag = allTags.find((tag) => tag.id === tagId);
    if (selectedTag) {
      // Si le tag existe
      // On vérifie si le tag est déjà sélectionné ou non
      if (selectedTags.find((tag) => tag.id === selectedTag.id)) {
        // On crée une variable qui récupère tous les tags sauf celui qui est déjà sélectionné
        const updatedTags = selectedTags.filter(
          (tag) => tag.id !== selectedTag.id
        );
        // On met à jour le state des technos sélectionnées
        setSelectedTags(updatedTags);

        // On retire la classe `selected` du tag
        const tagElement = document.getElementById(`tag-${selectedTag.id}`); // On cible l'element par son id spécifique
        if (tagElement)
          tagElement.className = 'CreateProject--secondField--technos--group'; // Si on trouve l'element avec l'id de selectedTag, on retire la classe `selected`
      } else {
        // On ajoute le tag à la variable updatedTags
        if (selectedTags.length < 10) {
          // Si le tableau des tags sélectionnés contient déjà 10 tags, on ne fait rien
          const updatedTags = [...selectedTags, selectedTag];
          // On met à jour le state des technos sélectionnées
          setSelectedTags(updatedTags);
          // On ajoute la classe `selected` au tag
          const tagElement = document.getElementById(`tag-${selectedTag.id}`); // On cible l'element par son id spécifique
          if (tagElement)
            tagElement.className =
              'CreateProject--secondField--technos--group--selected'; // Si on trouve l'element avec l'id de selectedTag, on retire la classe `selected`
        } else {
          // Sinon, on affiche un message d'erreur
          dispatch(
            updateFlash({
              type: 'error',
              children: 'Veuillez limiter le choix à 10 langages',
            })
          );
        }
      }
    }
  };

  /** //! Accessibilité
   * @param {React.KeyboardEvent<HTMLDivElement>} event - Événement clavier
   * @param {number} imageId - Id de l'image
   * * Une div n'est pas un element clickable par défaut.
   * On ajoute un fonction d’accessibilité pour le clavier.
   * Si la touche enter ou espace est pressée, on appelle la fonction handleImageClick() juste au dessus.
   */
  const handleImageKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
    imageId: string
  ) => {
    if (event.key === 'enter' || event.key === ' ') {
      handleImageClick(Number(imageId));
    }
  };

  /** //* Fonction pour accepter un membre
   * @param {ProjectAcceptMember} dispatch - Dispatch de l'action pour accepter un membre
   * @param {number} id - Id du projet
   * @param {number} userId - Id du membre
   * Au clic sur le bouton accepter, on dispatch l'action pour accepter un membre
   * On lui passe en paramètre l'id du projet et l'id du membre
   * On met à jour le state des membres
   */
  const acceptMemberToProject = (projectId: number, userId: number) => {
    dispatch(ProjectAcceptMember({ projectId, userId }));
  };
  /** //! Accessibilité
   * @param {React.KeyboardEvent<HTMLDivElement>} event - Événement clavier
   * @param {number} projectId - Id du projet
   * @param {number} userId - Id du membre
   * * Une div n'est pas un element clickable par défaut.
   * On ajoute un fonction d’accessibilité pour le clavier.
   * Si la touche enter ou espace est pressée, on appelle la fonction handleImageClick() juste au dessus.
   */
  const acceptMembreToProjectKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
    projectId: number,
    userId: number
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      acceptMemberToProject(Number(projectId), Number(userId));
    }
  };

  /** //* Fonction pour supprimer un membre
   * @param {ProjectDeleteMember} dispatch - Dispatch de l'action pour supprimer un membre
   * @param {number} id - Id du projet
   * @param {number} userId - Id du membre
   * Au clic sur le bouton supprimer, on dispatch l'action pour supprimer un membre
   * On lui passe en paramètre l'id du projet et l'id du membre
   * On met à jour le state des membres
   */
  const deleteMemberToProject = (projectId: number, userId: number) => {
    if (userId === ownerId) {
      dispatch(
        updateFlash({
          type: 'error',
          children: 'Vous ne pouvez pas vous supprimer du projet',
        })
      );
    } else {
      dispatch(ProjectDeleteMember({ projectId, userId }));
    }
  };
  /** //! Accessibilité
   * @param {React.KeyboardEvent<HTMLDivElement>} event - Événement clavier
   * @param {number} projectId - Id du projet
   * @param {number} userId - Id du membre
   * * Une div n'est pas un element clickable par défaut.
   * On ajoute un fonction d’accessibilité pour le clavier.
   * Si la touche enter ou espace est pressée, on appelle la fonction handleImageClick() juste au dessus.
   */
  const deleteMembreToProjectKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
    projectId: number,
    userId: number
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      deleteMemberToProject(Number(projectId), Number(userId));
    }
  };

  // ! ==== Requêtes Ajax ====
  // ! =======================
  // ? Verification titre du projet

  /** //* Fonction de vérification du titre
   * @param {React.ChangeEvent<HTMLInputElement>} event - Événement de changement de valeur
   * On récupère la valeur du champ
   * On appelle la fonction checkPseudo() du fichier actions/checkPseudo.ts
   * On lui passe en paramètre l'ancien Pseudo du membre connecté
   */
  const verifyTitle = (event) => {
    if (event.target.value) {
      dispatch(checkTitle({ oldTitle: event.target.value }));
    }
  };
  /** //* Fonction de vérification du statut de la requête Ajax
   * @param {string} status - Statut de la requête Ajax
   * Si le statut est success, on passe isFormValid.Pseudo à true
   * Sinon, on passe isFormValid.Pseudo à false
   */
  const checkTitleStatus = () => {
    if (titleStatus === 'success') {
      isFormValid.title = true;
    } else if (titleStatus === 'error') {
      isFormValid.title = false;
    }
  };
  /** //* useEffect pour relancer la verification du statut de la requête Ajax
   * Quand le statut change, on appelle la fonction checkStatus()
   * Pour avoir toujours l'état à jour
   */
  useEffect(() => {
    checkTitleStatus();
  }, [titleStatus, oldTitle]);

  // ! ==== Verification des champs ====
  // ! =================================

  const handleChange = (event, fieldName) => {
    // La propriété value qui servira a appelé la fonction validateField peut soit provenir de onChange de l'input pseudo,
    // soit du useEffect, qui lui relance la fonction handleChange avec oldPseudo (à jour)
    // Donc on initialise value à '' et on la met à jour selon le cas
    let value = '';
    // Si on a un event et que event.target existe, on récupère la valeur de l'input
    if (event && event.target) {
      value = event.target.value;
      // Sinon, en fonction du fieldName, on récupère la valeur de oldTitle
    } else if (fieldName === 'title') {
      // On récupère la valeur de oldTitle
      value = oldTitle;
    }

    const options = { titleStatus };

    let newClassName = '';

    if (value.length !== 0) {
      const validation = validateField(value, fieldName, options);

      if (validation) {
        const { className } = validation;
        newClassName = classMapping[className];
      }
    }

    setFormFields((prevState) => ({
      ...prevState,
      [fieldName]: {
        value,
        className: newClassName,
      },
    }));
  };
  //! Comme le status de la requête Ajax est asynchrone, et que la validation des champs se fait sur un fichier externe
  //! on doit utiliser un useEffect pour mettre à jour le state titleStatus
  useEffect(() => {
    handleChange(oldTitle, 'title');
  }, [titleStatus, oldTitle]);

  // ! ==== Envoie du formulaire ====
  // ! ==============================

  /** //* Fonction pour l'envoie du formulaire
   * @param {React.FormEvent<HTMLFormElement>} event - Événement formulaire
   * @param {FormData} formData - Données du formulaire
   * @param {selectedTags} selectedTags - Tableau des tags sélectionnés par l'utilisateur
   * Au submit du formulaire, on récupère les données du formulaire et on les envoie à l'API
   * On dispatch l'action pour fermer la Modale
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // On empêche le comportement par défaut du formulaire
    // ! Déclaration des variables
    const formData = new FormData();
    const objData: ObjectI = Object.fromEntries(formData.entries());

    // inputs
    const inputs = formRef.current
      ? formRef.current.querySelectorAll('input') // On cible tous les inputs du formulaire
      : null;

    const title = formFields.title.value;
    const description = formFields.description.value;

    // ! Gestion des erreurs
    dispatch(resetMessage()); // On reset le message flash

    // Gestion des erreurs tags
    if (selectedTags.length === 0) {
      // Si aucun tag n'est sélectionné, on passe isFormValid.tags à false
      isFormValid.tags = false;
    } else {
      // Sinon, on passe isFormValid.tags à true
      isFormValid.tags = true;
    }

    // On vérifie si les champs sont vides
    if (title === '') {
      // Si le champ est vide, on passe isFormValid[field] à true, car dans l'update on n'est pas obligé de tout modifier
      isFormValid.title = true;
    }
    if (description === '') {
      // Si le champ est vide, on passe isFormValid[field] à true, car dans l'update on n'est pas obligé de tout modifier
      isFormValid.description = true;
    }

    const validProfile = [
      isFormValid.title,
      isFormValid.description,
      isFormValid.tags,
    ];
    // On compte le nombre de false dans isFormValid
    const falseFieldCount = Object.values(validProfile).filter(
      (value) => value === false
    ).length;

    // Si un seul champ est vide, on affiche un message d'erreur spécifique à ce champ
    if (falseFieldCount === 1) {
      // On récupère le nom du champ qui est vide
      const invalidField = Object.keys(isFormValid).find(
        (field) => !isFormValid[field]
      );

      // On affiche le message d'erreur spécifique à ce champ
      if (invalidField) {
        dispatch(
          updateFlash({
            type: 'error',
            children: errorMessages[invalidField],
          })
        );
      }
    }

    // Si plusieurs champs sont vides, on affiche un message d'erreur général
    if (falseFieldCount > 1) {
      dispatch(
        updateFlash({
          type: 'error',
          children: errorMessages.multiple,
        })
      );
    }
    // ! Soumission du formulaire
    // Si tous les champs sont remplis, on envoie le formulaire
    // ? Gestion des inputs
    if (falseFieldCount === 0) {
      if (title !== '' && title !== project?.title) {
        objData.title = title;
      }
      if (description !== '' && description !== project?.description) {
        objData.description = description;
      }

      // ? Gestion du switch openToWork
      objData.availability = !!checked;

      // ? Gestion des tags
      if (selectedTags && selectedTags.length > 0) {
        // On vérifie que selectedTags existe et qu'il contient au moins un tag
        const selectedTagsData = selectedTags.map((tag) => tag.id); // On crée un tableau avec les id des tags sélectionnés

        objData.tags = selectedTagsData; // On ajoute le tableau selectedTagsData à objData
      }
      dispatch(
        // On dispatch l'action updateMember avec l'id du projet et les données du formulaire
        updateProject({
          id,
          objData,
        })
      );
      navigate(`/projects/${project?.id}`);
      handleResetForm(); // On réinitialise le formulaire
    }
  };
  // ? Rendu JSX
  return (
    <>
      <div className="CreateProject">
        <div className="CreateProject--return">
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
        <div className="CreateProject--header">
          <h2 className="CreateProject--header--title">
            Modification du projet
          </h2>
        </div>
        <form
          ref={formRef} // On ajoute la référence pour la Modale
          encType="multipart/form-data"
          onSubmit={handleSubmit} // On appelle la fonction handleSubmit() au submit
          className="CreateProject--container"
        >
          <legend className="CreateProject--legend">
            Informations du projet
          </legend>
          <fieldset className=">CreateProject--firstField">
            {/* Input maison, importé */}
            <Input
              id="title"
              name="title"
              slot={`Titre du projet : ${project?.title || ''}`}
              type="text"
              placeholder="Titre du projet"
              aria-label="Titre du projet"
              value={formFields.title.value}
              className={`CreateProject--firstField--description Input Input-darkest ${formFields.title.className}`}
              onChange={(event) => {
                setOldTitle(event.target.value);
                handleChange(event, 'title');
                verifyTitle(event);
                checkTitleStatus();
              }}
              helperText={
                formFields.title.value !== '' && titleStatus === 'error' ? (
                  <span className="wrong">{titleMessage}</span>
                ) : formFields.title.value !== '' &&
                  isFormValid.title === false ? (
                  <span className="wrong">{errorMessages.title}</span>
                ) : (
                  ''
                )
              }
              color={
                formFields.title.value === ''
                  ? 'lightestPerso'
                  : isFormValid.title === false
                  ? 'error'
                  : 'success'
              }
            />
            <Input
              id="description"
              name="description"
              slot={`Description : ${project?.description || ''}`}
              type="text"
              placeholder="A propos de projet"
              aria-label="A propos du projet"
              multiline
              rows={5}
              value={formFields.description.value}
              className={`CreateProject--firstField--description Input Input-darkest ${formFields.description.className}`}
              onChange={(event) => handleChange(event, 'description')}
              helperText={
                formFields.description.value !== '' &&
                isFormValid.description === false ? (
                  <span className="wrong">{errorMessages.description}</span>
                ) : (
                  ''
                )
              }
              color={
                formFields.description.value === ''
                  ? 'lightestPerso'
                  : isFormValid.description === false
                  ? 'error'
                  : 'success'
              }
            />
            <div className="CreateProject--firstField--openToWork">
              <p>Ouvert aux candidats</p>
              <CustomSwitch
                name="availability"
                checked={checked} // On récupère la valeur du state checked
                onChange={handleSwitch} // On appelle la fonction handleSwitch() au changement
              />
            </div>
          </fieldset>

          <fieldset className="CreateProject--secondField">
            <legend className="CreateProject--legend">
              Languages du projet
            </legend>
            <p className="CreateProject--secondField--text">
              (Sélectionnez 1 language minimum)
            </p>
            <div className="CreateProject--secondField--technos">
              {allTags.map((tag) => {
                const isMatchingTag =
                  project?.tags?.find(
                    (projectTag) => projectTag.id === tag.id // On vérifie si le tag est présent dans les tags du projet
                  ) !== undefined;
                const className = isMatchingTag ? '--selected' : ''; // Si le tag est présent dans les tags du projet, on ajoute la classe selected
                return (
                  <div
                    key={tag.id}
                    role="button"
                    onClick={() => handleImageClick(Number(tag.id))} // Au clic, on appelle la fonction handleImageClick() et on lui passe l'id de la techno, converti en number
                    onKeyDown={
                      (event) => handleImageKeyDown(event, String(tag.id)) // Au clavier, on lui passe l'id de la techno, converti en string
                    }
                    tabIndex={0} // On ajoute la propriété tabIndex pour rendre la div focusable
                    className={
                      'CreateProject--secondField--technos--group' +
                      `${className}`
                    }
                    id={`tag-${tag.id}`} // Sert de référence pour la fonction handleImageClick ( permet d'ajouter ou de retirer la classe selected quand on ajoute/supprime le tag)
                  >
                    <img
                      src={`/images/technos/${tag.name.toLowerCase()}.svg`}
                      title={tag.name.toLocaleLowerCase()}
                      alt={tag.name.toLocaleLowerCase()}
                    />
                    <p>{tag.name}</p>
                  </div>
                );
              })}
            </div>
          </fieldset>
          <legend className="CreateProject--legend">Participants</legend>
          <fieldset className="CreateProject--thirdField">
            <div className="CreateProject--thirdField--container">
              {project?.users &&
                project.users.map((user) =>
                  user.id === ownerId ? (
                    <div
                      className="CreateProject--thirdField--container--users"
                      key={user.id}
                    >
                      <p className="CreateProject--thirdField--container--users--text">
                        {user.pseudo}
                      </p>
                      <div className="CreateProject--thirdField--container--users--img-bloc">
                        <img
                          src="/images/icones/error_black.svg"
                          alt="Remove user"
                          title="Vous ne pouvez pas vous supprimer de votre projet"
                          className="CreateProject--thirdField--container--users--img-bloc--img"
                          onClick={() =>
                            deleteMemberToProject(project.id, user.id)
                          }
                          onKeyDown={(event) =>
                            deleteMembreToProjectKeyDown(
                              event,
                              project.id,
                              user.id
                            )
                          }
                          role="button"
                          tabIndex={0}
                        />
                      </div>
                    </div>
                  ) : // Si le membre est actif, on l'affiche dans la liste des membres
                  user.is_active === true ? (
                    <div
                      className="CreateProject--thirdField--container--users"
                      key={user.id}
                    >
                      <p className="CreateProject--thirdField--container--users--text">
                        {user.pseudo}
                      </p>
                      <div className="CreateProject--thirdField--container--users--img-bloc">
                        <img
                          src="/images/icones/error.svg"
                          alt="Remove user"
                          title={`Supprimer ${user.pseudo} du projet`}
                          className="CreateProject--thirdField--container--users--img-bloc--img"
                          onClick={() =>
                            deleteMemberToProject(project.id, user.id)
                          }
                          onKeyDown={(event) =>
                            deleteMembreToProjectKeyDown(
                              event,
                              project.id,
                              user.id
                            )
                          }
                          role="button"
                          tabIndex={0}
                        />
                      </div>
                    </div>
                  ) : (
                    ''
                  )
                )}
            </div>
          </fieldset>
          <legend className="CreateProject--legend">
            Postulants au projet
          </legend>
          <fieldset className="CreateProject--thirdField">
            <div className="CreateProject--thirdField--container">
              {project?.users &&
                project?.users.map((user) =>
                  user.is_active === false && user.id !== ownerId ? (
                    <>
                      <div
                        className="CreateProject--thirdField--container--users"
                        key={user.id}
                      >
                        <p className="CreateProject--thirdField--container--users--text">
                          {user.pseudo}
                        </p>
                        <div className="CreateProject--thirdField--container--users--img-bloc">
                          <img
                            src="/images/icones/error.svg"
                            alt="Remove user"
                            title={`Supprimer ${user.pseudo} du projet`}
                            className="CreateProject--thirdField--container--users--img-bloc--img"
                            onClick={() =>
                              deleteMemberToProject(project.id, user.id)
                            }
                            onKeyDown={(event) =>
                              deleteMembreToProjectKeyDown(
                                event,
                                project.id,
                                user.id
                              )
                            }
                            role="button"
                            tabIndex={0}
                          />
                          <img
                            src="/images/icones/good.svg"
                            alt="Accept user"
                            title={`Accepter ${user.pseudo} dans le projet`}
                            className="CreateProject--thirdField--container--users--img-bloc--img"
                            onClick={() =>
                              acceptMemberToProject(project.id, user.id)
                            }
                            onKeyDown={(event) =>
                              acceptMembreToProjectKeyDown(
                                event,
                                project.id,
                                user.id
                              )
                            }
                            role="button"
                            tabIndex={0}
                          />
                        </div>
                      </div>
                      <div className="CreateProject--thirdField--separate" />
                    </>
                  ) : null
                )}
            </div>
            {/* Si il n'y a aucun postulant dans le projet : */}
            {project?.users &&
              project.users.filter(
                (user) => user.is_active === false && user.id !== ownerId
              ).length === 0 && (
                <p className="CreateProject--thirdField--noWanted">
                  Aucun postulant pour le moment
                </p>
              )}
          </fieldset>
          <fieldset className="CreateProject--fourthField">
            <button
              type="submit"
              className="CreateProject--fourthField--submit"
            >
              Valider
            </button>
            <button // ? Bouton supprimer le projet
              type="button"
              className="CreateProject--fourthField--delete"
              onClick={handleDeleteProjectModale} // On appelle la fonction handleDeleteModale au clic sur le bouton
            >
              Supprimer le projet
            </button>
          </fieldset>
        </form>
      </div>
      {/* Modale de suppression de projet */}
      {modaleDeleteProject && <DeleteProjectModale />}
    </>
  );
}

export default MyProject;
