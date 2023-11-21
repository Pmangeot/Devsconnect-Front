/* eslint-disable no-lonely-if */
/* eslint-disable no-nested-ternary */
// ? Librairies
import { useState, useRef, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../../../hook/redux';

// ? Fonctions externes
import { fetchAllTags } from '../../../../store/reducer/tag';
import createProject from '../../../../store/actions/projectCreate';
import checkTitle from '../../../../store/actions/checkTitle';

import { resetMessage, updateFlash } from '../../../../store/reducer/main';
import {
  classMapping,
  validateField,
  isFormValid,
  errorMessages,
} from '../../../../utils/validate form/validateForm';

// ? Composants
import CustomSwitch from '../../../../utils/customSwitchUI';
import Input from '../../../Form/Input';

// ? Styles
import './style.scss';

// ? Typage global
import { TagSelectedI } from '../../../../@types/interface';

// ? Fonction principale
function CreateProject() {
  // ? State
  const allTags: TagSelectedI[] = useAppSelector(
    (state) => state.tag.list.data
  ); // Tableau des tags récupérés depuis l'API
  const { titleMessage, titleStatus } = useAppSelector((state) => state.ajax);
  const user_id = useAppSelector((state) => state.user.login.id); // Id du membre connecté
  // Local
  const [checked, setChecked] = useState(true); // State pour le check de open to work
  const [selectedTags, setSelectedTags] = useState<TagSelectedI[]>([]); // Tableau des tags sélectionnés par l'utilisateur
  const [oldTitle, setOldTitle] = useState(''); // Ancien titre de projet

  // États pour la gestion du formulaire et des erreurs associées
  const [formFields, setFormFields] = useState({
    title: { value: '', className: '' },
    description: { value: '', className: '' },
    tags: { value: '', className: '' },
  });

  // ? useRef
  const modalRef = useRef(null); // Référence pour le formulaire

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
  }, [dispatch]);

  // ? Fonctions

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
  const handleImageClick = (id: number) => {
    // On vérifie que le tag sélectionné existe bien dans le tableau des tags récupérés depuis l'API
    const selectedTag = allTags.find((tag) => tag.id === id);
    if (selectedTag) {
      // Si le tag existe
      // On vérifie si le tag est déjà sélectionné ou non
      if (selectedTags.some((tag) => tag.id === selectedTag.id)) {
        // On crée une variable qui récupère tous les tags sauf celui qui est déjà sélectionné
        const updatedTags = selectedTags.filter(
          (tag) => tag.id !== selectedTag.id
        );
        // On met à jour le state des technos sélectionnées
        setSelectedTags(updatedTags);
      } else {
        // On ajoute le tag à la variable updatedTags
        if (selectedTags.length < 10) {
          // Si le tableau des tags sélectionnés contient déjà 14 tags, on ne fait rien
          const updatedTags = [...selectedTags, selectedTag];
          // On met à jour le state des technos sélectionnées
          setSelectedTags(updatedTags);
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
    const form = event.currentTarget;
    const formData = new FormData(form);
    const objData = Object.fromEntries(formData.entries());

    const title = formData.get('title');
    const description = formData.get('description');

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

    // On compte le nombre de false dans isFormValid
    const falseFieldCount = Object.values(isFormValid).filter(
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
    if (falseFieldCount === 0) {
      // Créer un tableau pour les données de selectedTags
      const selectedTagsData = selectedTags.map((tag) => tag.id);

      // Ajouter le tableau selectedTagsData à formData
      objData.tags = selectedTagsData;
      objData.availability = !!checked;
      objData.user_id = user_id;
      const response = await dispatch(createProject(objData)); // On envoie les données du formulaire à l'API
      const projectId = response.payload.data.id;

      navigate(`/projects/${projectId}`);
    }
  };
  // ? Rendu JSX
  return (
    <div
      className="CreateProject"
      ref={modalRef} // On ajoute la référence pour la Modale
    >
      <div className="CreateProject--return">
        {/** //! Retour
         * @param {Function} navigate - Permet de naviguer entre les pages
         * On envoie au composant la fonction navigate
         * A chaque clic sur le bouton, on retourne à la page précédente
         */}
        <button type="button" onClick={() => navigate(-1)}>
          Retour
        </button>
      </div>
      <div className="CreateProject--header">
        <h2 className="CreateProject--header--title">Créer mon projet</h2>
      </div>
      <form
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
            slot="Titre du projet"
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
            slot="A propose du projet :"
            type="text"
            placeholder="Une petite présentation ?"
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
          <legend className="CreateProject--legend">Languages du projet</legend>
          <p className="CreateProject--secondField--text">
            (Sélectionnez 1 language minimum)
          </p>
          <div className="CreateProject--secondField--technos">
            {/* //? On map sur le tableau des technos récupérées depuis l'API */}
            {allTags.map((techno: TagSelectedI) => (
              <div
                key={techno.id}
                role="button"
                onClick={() => handleImageClick(Number(techno.id))} // Au clic, on appelle la fonction handleImageClick() et on lui passe l'id de la techno, converti en number
                onKeyDown={
                  (event) => handleImageKeyDown(event, String(techno.id)) // Au clavier, on lui passe l'id de la techno, converti en string
                }
                tabIndex={0} // On ajoute la propriété tabIndex pour rendre la div focusable
                className={
                  'CreateProject--secondField--technos--group' +
                  `${
                    // On ajoute la classe selected si la techno est sélectionnée
                    selectedTags.some((tag) => tag.id === techno.id)
                      ? '--selected'
                      : ''
                  }`
                }
              >
                <img
                  src={`/images/technos/${techno.name.toLowerCase()}.svg`}
                  title={techno.name.toLocaleLowerCase()}
                  alt={techno.name.toLocaleLowerCase()}
                />
                <p>{techno.name}</p>
              </div>
            ))}
          </div>
        </fieldset>
        <fieldset className="CreateProject--fourthField">
          <button type="submit" className="CreateProject--fourthField--submit">
            Créer le projet
          </button>
        </fieldset>
      </form>
    </div>
  );
}

export default CreateProject;
