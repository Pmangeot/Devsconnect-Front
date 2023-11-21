/* eslint-disable no-nested-ternary */
// ? Librairies
import { useState, useEffect, useRef } from 'react';
import Carousel from 'react-multi-carousel';
import { useAppDispatch, useAppSelector } from '../../../../../hook/redux';

// ? Fonctions externes
import { fetchAllTags } from '../../../../../store/reducer/tag';
import { fetchOneMember } from '../../../../../store/reducer/members';
import updateMember from '../../../../../store/actions/memberUpdate';
import checkPseudo from '../../../../../store/actions/checkPseudo';
import checkEmail from '../../../../../store/actions/checkEmail';

import {
  toggleEditMode,
  toggleModalDelete,
  toggleModalPassword,
} from '../../../../../store/reducer/log';
import { resetMessage, updateFlash } from '../../../../../store/reducer/main';
import {
  classMapping,
  validateField,
  isFormValid,
  errorMessages,
  validatePicture,
} from '../../../../../utils/validate form/validateForm';

// ? Composants
import CustomSwitch from '../../../../../utils/customSwitchUI';
import ProjectCard from '../../../Cards/ProjectCard/ProjectCard';
import Input from '../../../../Form/Input';
import DeleteModale from './DeleteModale/DeleteModale';
import PasswordModale from './PasswordModale/PasswordModale';

// ? Styles
import responsive from '../../../../../utils/CustomCarousel';
import 'react-multi-carousel/lib/styles.css';
import '../style.scss';

// ? Typage global
import { TagI, MemberI } from '../../../../../@types/interface';

// ? Fonction principale
function MyProfile() {
  // ? States
  // Store
  const member: MemberI | null = useAppSelector(
    (state) => state.members.member.data
  ); // On récupère les données du membre
  const allTags: TagI[] = useAppSelector((state) => state.tag.list.data); // On récupère les tags
  const userId = useAppSelector((state) => state.user.login.id); // On récupère l'id de l'utilisateur connecté
  const isEditMode = useAppSelector((state) => state.log.isEditMode); // On récupère le state isEditMode
  const { pseudoMessage, emailMessage, pseudoStatus, emailStatus } =
    useAppSelector((state) => state.ajax);
  const { modalDelete, modalPassword } = useAppSelector((state) => state.log); // On récupère le state modale

  // Local
  const [checked, setChecked] = useState(false); // Valeur du switch
  const [selectedTags, setSelectedTags] = useState<TagI[] | undefined>(
    member?.tags
  ); // On récupère les tags du membre qu'on stocke (pour la gestion de l'update)
  const [oldPseudo, setOldPseudo] = useState(''); // Ancien mot de passe
  const [oldEmail, setOldEmail] = useState(''); // Ancien mot de passe
  const [currentPicture, setCurrentPicture] = useState({}); // Image de profil à envoyer au back

  // Etats pour la gestion du formulaire et des erreurs associées
  const [formFields, setFormFields] = useState({
    firstname: { value: '', className: '' },
    lastname: { value: '', className: '' },
    pseudo: { value: '', className: '' },
    email: { value: '', className: '' },
    description: { value: '', className: '' },
    tags: { value: '', className: '' },
    picture: { value: '', className: '' },
  });
  // ? useRef
  const formRef = useRef<HTMLFormElement>(null); // Utiliser pour récupérer les données du formulaire (référence au <form>)

  // ? useDispatch
  const dispatch = useAppDispatch();

  // ? useEffect

  // Au chargement de la page, on reset les messages d'erreur de picture et on revient en mode lecture systématiquement
  useEffect(() => {
    errorMessages.picture = '';
    if (isEditMode === true) {
      dispatch(toggleEditMode());
    }
  }, []);

  useEffect(() => {
    // On récupère les données du membre en fonction de l'id
    if (userId) {
      const userIdString = userId.toString(); // On convertit l'id en string
      dispatch(fetchOneMember(userIdString));
      setChecked(member?.availability); // On stocke la valeur de l'availability du membre dans le state checked
    }
  }, [
    dispatch,
    isEditMode,
    userId,
    member?.availability,
    modalPassword,
    member?.picture,
  ]); // On rappelle le useEffect à chaque modification du state

  useEffect(() => {
    // On récupère tous les tags
    dispatch(fetchAllTags());
    setSelectedTags(member?.tags); // On stocke les tags du membre dans le state selectedTags
  }, [dispatch, member?.tags, isEditMode]); // On rappelle le useEffect à chaque modification du state isEditMode et/ou member?.tags

  // ? Fonctions

  /** //* Fonction pour ouvrir la fenêtre d'upload
   * Permet d'ouvrir la fenêtre d'upload de l'image de profil
   * en cliquant sur l'image de photo de profil
   */
  const handleUploadClick = () => {
    // Simuler un clic sur l'élément input lorsque l'utilisateur clique sur l'image
    document.getElementById('picture')?.click();
  };

  /** //* Fonction pour la photo de profil
   * @param {currentPicture} currentPicture - Image de profil actuelle
   * @param {setCurrentPicture} setCurrentPicture - State pour l'image de profil actuelle
   * @param {setFormFields} setFormFields - State pour la gestion du formulaire
   * On met à jour le state pour l'image de profil actuelle
   */
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    formFields.picture.value = '';
    if (event.target.files) {
      validatePicture(event.target.files[0]);
      setCurrentPicture(event.target.files[0]);
      if (isFormValid.picture) {
        setFormFields({
          ...formFields,
          picture: {
            value: URL.createObjectURL(event.target.files[0]),
            className: '',
          },
        });
      }
    }
  };

  /** //* Switch open to work
   * @param {boolean} checked - valeur du switch
   * Au clic, on inverse la valeur du switch
   */
  const handleSwitch = () => {
    setChecked(!checked);
  };

  /** //* Fonction pour le bouton annuler
   * @param {boolean} isEditMode - valeur du state isEditMode
   * Au clic, on inverse la valeur du state isEditMode
   */
  const handleResetForm = () => {
    // On réinitialise les messages d'erreur et isFormValid pour ne rien garder en mémoire
    setFormFields({
      ...formFields,
      firstname: { value: '', className: '' },
      lastname: { value: '', className: '' },
      pseudo: { value: '', className: '' },
      email: { value: '', className: '' },
      description: { value: '', className: '' },
      picture: { value: '', className: '' },
    });
    isFormValid.firstname = true;
    isFormValid.lastname = true;
    isFormValid.pseudo = true;
    isFormValid.email = true;
    isFormValid.description = true;
    isFormValid.picture = true;
    dispatch(toggleEditMode());
  };

  /** //* Fonction pour le bouton delete
   * @param {boolean} modalDelete - valeur du state modalDelete
   * Au clic, on inverse la valeur du state modalDelete
   * qui affiche ou non la modale de suppression
   */
  const handleDeleteModale = () => {
    if (member?.projects.length !== 0) {
      dispatch(
        updateFlash({
          type: 'error',
          children: 'Vous ne pouvez pas supprimer votre profil si vous participez à un projet.',
        })
      );
    } else {
      dispatch(toggleModalDelete());
    }
  };

  /** //* Fonction pour le bouton modifier le mot de passe
   * @param {boolean} modalPassword - valeur du state modalPassword
   * Au clic, on inverse la valeur du state modalPassword
   * qui affiche ou non la modale de suppression
   */
  const handlePasswordModale = () => {
    dispatch(toggleModalPassword());
  };

  /** //* Fonction pour la modification du tableau selectedTags
   * @param {number} id - id du tag cliqué
   * On récupère l'id du tag cliqué
   * On vérifie si le tag est présent dans selectedTags (find)
   * Si oui, on le retire du tableau et on retire la classe `selected` du tag.
   * Si non, on l'ajoute au tableau et on ajoute la classe `selected` au tag.
   */
  const handleImageClick = (id: number) => {
    // Si on trouve l'id dans allTags, on stocke dans selectedTag
    const selectedTag = allTags.find((tag) => tag.id === id);
    if (selectedTag) {
      if (
        // Si selectedTags existe et que selectedTag est présent dans selectedTags
        selectedTags &&
        selectedTags.some((tag) => tag.id === selectedTag.id)
      ) {
        // ? Le tag est déjà sélectionné
        // On le supprime en filtrant selectedTags pour ne garder que ceux avec un id différent
        const updatedTags = selectedTags.filter(
          (tag) => tag.id !== selectedTag.id
        );
        // On met à jour le state
        setSelectedTags(updatedTags);

        // On retire la classe `selected` du tag
        const tagElement = document.getElementById(`tag-${selectedTag.id}`); // On cible l'element par son id spécifique
        if (tagElement)
          tagElement.className =
            'Member--content--secondField--container--technos--group'; // Si on trouve l'element avec l'id de selectedTag, on retire la classe `selected`
      } else {
        // ? Le tag n'est pas sélectionné
        // On l'ajoute en concaténant selectedTags et selectedTag dans updatedTags (spread operator)
        // Pour éviter l'erreur de linter sur le ternaire imbriqué => eslint-disable-next-line no-nested-ternary
        // eslint-disable-next-line no-nested-ternary
        const updatedTags: TagI[] | undefined = selectedTag
          ? selectedTags !== undefined
            ? [...selectedTags, selectedTag]
            : [selectedTag]
          : [selectedTag]; // Si selectedTags existe, on concatène, sinon on crée un tableau avec selectedTag
        // On met à jour le state
        setSelectedTags(updatedTags);

        // On ajoute la classe `selected` au tag
        const tagElement = document.getElementById(`tag-${selectedTag.id}`); // On cible l'element par son id spécifique
        if (tagElement)
          tagElement.className =
            'Member--content--secondField--container--technos--group--selected'; // Si on trouve l'element avec l'id de selectedTag, on retire la classe `selected`

        // if (tagElement) tagElement.classList.add('--selected'); // Si on trouve l'element avec l'id de selectedTag, on ajoute la classe `selected`
      }
    }
  };
  /** //! Accessibilité
   * Une div n'est pas un element clickable par défaut.
   * @param {React.KeyboardEvent<HTMLDivElement>} event - event du clavier
   * @param {string} imageId - id de l'image cliquée
   * On ajoute un fonction d’accessibilité pour le clavier.
   * Si la touche enter ou espace est pressée, on appelle la fonction handleClick() juste au dessus.
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
  // ? Verification pseudo

  /** //* Fonction de vérification du pseudo
   * @param {React.ChangeEvent<HTMLInputElement>} event - Événement de changement de valeur
   * On récupère la valeur du champ
   * On appelle la fonction checkPseudo() du fichier actions/checkPseudo.ts
   * On lui passe en paramètre l'ancien pseudo du membre connecté
   */
  const verifyPseudo = (event) => {
    if (event.target.value) {
      dispatch(checkPseudo({ oldPseudo: event.target.value }));
    }
  };
  /** //* Fonction de vérification du statut de la requête Ajax
   * @param {string} status - Statut de la requête Ajax
   * Si le statut est success, on passe isFormValid.Pseudo à true
   * Sinon, on passe isFormValid.Pseudo à false
   */
  const checkPseudoStatus = () => {
    if (pseudoStatus === 'success') {
      isFormValid.pseudo = true;
    } else if (pseudoStatus === 'error') {
      isFormValid.pseudo = false;
    }
  };
  /** //* useEffect pour relancer la verification du statut de la requête Ajax
   * Quand le statut change, on appelle la fonction checkStatus()
   * Pour avoir toujours l'état à jour
   */
  useEffect(() => {
    checkPseudoStatus();
  }, [pseudoStatus, oldPseudo]);

  // ? Verification email

  /** //* Fonction de vérification du email
   * @param {React.ChangeEvent<HTMLInputElement>} event - Événement de changement de valeur
   * On récupère la valeur du champ
   * On appelle la fonction checkEmail() du fichier actions/checkEmail.ts
   * On lui passe en paramètre l'ancien email du membre connecté
   */
  const verifyEmail = (event) => {
    if (event.target.value) {
      dispatch(checkEmail({ oldEmail: event.target.value }));
    }
  };
  /** //* Fonction de vérification du statut de la requête Ajax
   * @param {string} status - Statut de la requête Ajax
   * Si le statut est success, on passe isFormValid.Email à true
   * Sinon, on passe isFormValid.Email à false
   */
  const checkEmailStatus = () => {
    if (emailStatus === 'success') {
      isFormValid.email = true;
    } else if (emailStatus === 'error') {
      isFormValid.email = false;
    }
  };
  /** //* useEffect pour relancer la verification du statut de la requête Ajax
   * Quand le statut change, on appelle la fonction checkStatus()
   * Pour avoir toujours l'état à jour
   */
  useEffect(() => {
    checkEmailStatus();
  }, [emailStatus, oldEmail]);

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
      // Sinon, en fonction du fieldName, on récupère la valeur de oldPseudo ou oldEmail
    } else if (fieldName === 'pseudo') {
      // On récupère la valeur de oldPseudo
      value = oldPseudo;
    } else if (fieldName === 'email') {
      // On récupère la valeur de oldEmail
      value = oldEmail;
    }
    const options = { pseudoStatus, emailStatus };

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
  //! on doit utiliser un useEffect pour mettre à jour le state pseudoStatus et emailStatus pour relancer la fonction
  useEffect(() => {
    handleChange(oldPseudo, 'pseudo');
  }, [pseudoStatus, oldPseudo]);
  useEffect(() => {
    handleChange(oldEmail, 'email');
  }, [emailStatus, oldEmail]);

  // ! ==== Envoie du formulaire ====
  // ! ==============================

  /** //* Fonction d'envoi du formulaire
   * @param {React.FormEvent<HTMLFormElement>} event - event du formulaire
   * On empêche le comportement par défaut du formulaire
   * On crée un objet formData pour stocker les données du formulaire
   * On stocke les données du formulaire dans un objet
   * On soumet le formulaire
   */
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // ! Déclaration des variables
    const formData = new FormData(); // On crée un objet formData pour stocker les données du formulaire
    const objData = Object.fromEntries(formData.entries()); // On stocke les données du formulaire dans un objet

    // inputs
    const inputs = formRef.current
      ? formRef.current.querySelectorAll('input') // On cible tous les inputs du formulaire
      : null;

    const firstname = document.querySelector('#firstname') as HTMLInputElement;
    const lastname = document.querySelector('#lastname') as HTMLInputElement;
    const pseudo = document.querySelector('#pseudo') as HTMLInputElement;
    const email = document.querySelector('#email') as HTMLInputElement;

    const textarea = formRef.current
      ? formRef.current.querySelector('textarea') // On cible le textarea du formulaire
      : null;
    const textareaName: keyof MemberI = textarea?.name as keyof MemberI; // On récupère le name du textarea
    const textareaValue: string | undefined = textarea?.value; // On récupère la value du textarea

    // ! Gestion des erreurs

    dispatch(resetMessage()); // On reset le message flash

    if (selectedTags.length === 0) {
      // Si aucun tag n'est sélectionné, on passe isFormValid.tags à false
      isFormValid.tags = false;
    } else {
      // Sinon, on passe isFormValid.tags à true
      isFormValid.tags = true;
    }

    // On vérifie si les champs sont vides
    ['firstname', 'lastname', 'pseudo', 'email', 'description'].forEach(
      (field) => {
        if (eval(field).value === '') {
          // Si le champ est vide, on passe isFormValid[field] à true, car dans l'update on n'est pas obligé de tout modifier
          isFormValid[field] = true;
        }
      }
    );

    const validProfile = [
      isFormValid.firstname,
      isFormValid.lastname,
      isFormValid.pseudo,
      isFormValid.email,
      isFormValid.description,
      isFormValid.tags,
      isFormValid.picture,
    ];
    // On compte le nombre de false dans isFormValid
    const falseFieldCount = Object.values(validProfile).filter(
      (value) => value === false
    ).length;

    // Si un seul champ est vide, on affiche un message d'erreur spécifique à ce champ
    if (falseFieldCount === 1) {
      // On laisse le mode édition activé
      dispatch(toggleEditMode(true));
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
      // On laisse le mode édition activé
      dispatch(toggleEditMode(true));
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
      // ? Gestion des inputs
      inputs?.forEach((input) => {
        // Pour chaque input
        const { name, value } = input as HTMLInputElement; // On récupère le name et la value en destructuring
        // Vérifiez si `name` est une clé valide de `MemberI`
        if (member && name in member) {
          const memberValue = member[name as keyof MemberI]; // Obtenez la valeur actuelle de `name` dans `objData`
          // Si la valeur est différente d'une string vide et de la valeur initiale, on l'ajoute à formData et à objData
          if (value !== '' && value !== memberValue) {
            formData.append(name, value);
            objData[name] = value;
          }
        }
      });

      // ? Gestion du textarea
      if (
        textareaValue !== undefined && // On vérifie que textareaValue existe
        textareaValue !== '' && // On vérifie que textareaValue n'est pas une string vide
        textareaName && // On vérifie que textareaName existe
        member && // On vérifie que member existe
        textareaValue !== member[textareaName] // On vérifie que textareaValue est différent de la valeur initiale
      ) {
        formData.append(textareaName, textareaValue); // Alors, on ajoute textareaValue à formData
        objData[textareaName] = textareaValue; // On ajoute textareaValue à objData
      }

      // ? Gestion du switch openToWork
      if (checked !== undefined) {
        // Si la valeur du state est différente de la valeur du membre, on l'ajoute à formData
        objData.availability = checked !== false; // On ajoute checked à objData
      }

      // ? Gestion de l'image
      if (currentPicture) {
        // Si une picture a été sélectionnée
        formData.append('picture', currentPicture); // On ajoute l'image à formData
        objData.picture = currentPicture; // On ajoute l'image à objData
      }

      // ? Gestion des tags
      if (selectedTags && selectedTags.length > 0) {
        // On vérifie que selectedTags existe et qu'il contient au moins un tag
        const selectedTagsData = selectedTags.map((tag) => tag.id); // On crée un tableau avec les id des tags sélectionnés

        formData.append('tags', selectedTagsData); // On ajoute le tableau selectedTagsData à formData
        objData.tags = selectedTagsData; // On ajoute le tableau selectedTagsData à objData
      }

      dispatch(
        // On dispatch l'action updateMember avec l'id du membre et les données du formulaire
        updateMember({
          id: userId,
          objData, // Dans formData, on ajoute la valeur de checked et on ajoute les données du formulaire (objData)
        })
      );
      handleResetForm(); // On réinitialise le formulaire
      dispatch(toggleEditMode());
    }
  };

  /** //* Fonction pour le bouton d'édition
   * @param {React.FormEvent<HTMLFormElement>} event - event du formulaire
   * On empêche le comportement par défaut du formulaire
   * Au clic, on inverse la valeur du state isEditMode
   *
   * Si isEditMode est true, on soumet le formulaire
   */
  const handleEditClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    dispatch(toggleEditMode());

    if (isEditMode) {
      handleSubmit(event);
    }
  };
  console.log(member)
  // ? Rendu JSX
  return (
    <>
      <div className="Member">
        <div className="Member--header">
          <div className="Member--header--container">
            <div
              className="Member--header--container--image"
              style={{ cursor: isEditMode ? 'pointer' : 'default' }} // Si isEditMode est true, on affiche le curseur pointer pour le changement d'image
            >
              <img
                className="Member--header--container--image--profil"
                src={
                  formFields.picture.value.includes('blob')
                    ? formFields.picture.value
                    : member?.picture
                }
                alt="profil"
                onClick={handleUploadClick}
                onKeyDown={handleUploadClick}
                role="button"
                tabIndex={0}
              />
              <img
                src="/images/profil/upload.svg"
                className={`Member--header--container--image--upload ${
                  isEditMode ? 'visible' : 'hidden'
                }`}
                alt="upload"
                onClick={handleUploadClick}
                onKeyDown={handleUploadClick}
                role="button"
                tabIndex={0}
              />
            </div>
            <h2 className="Member--header--container--title">
              {member?.firstname} {member?.lastname}
            </h2>
          </div>
          {!isFormValid.picture && (
            <span className="Member--header--errorMessage wrong">
              {errorMessages.picture}
            </span>
          )}
        </div>
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <div className="Member--content">
            <fieldset className="Member--content--firstField">
              {/* Pour chaque input, on désactive le champ si on est pas en mode édition */}
              <legend className="Member--legend">
                Informations personnelles
              </legend>
              <input
                id="picture"
                type="file"
                slot="Photo de profil"
                name="picture"
                accept="image/png, image/jpeg, image/jpg, image/gif, image/svg, image/webp"
                onChange={(event) => {
                  handleFileChange(event);
                }}
                className="Member--content--firstField--input hidden"
                disabled={!isEditMode} // On désactive le switch si on est pas en mode édition
              />

              {/* Input maison, importé */}
              <div className="Member--content--firstField--inputText">
                <Input
                  id="firstname"
                  name="firstname"
                  slot={isEditMode ? 'Prénom' : null}
                  type="text"
                  placeholder={`Prénom : ${member?.firstname || ''}`}
                  aria-label="Prénom"
                  className={`Member--content--firstField--inputText--firstname Input ${
                    formFields.firstname.className
                  } ${isEditMode ? 'Input-dark' : ''}`}
                  value={formFields.firstname.value}
                  disabled={!isEditMode}
                  onChange={(event) => handleChange(event, 'firstname')}
                  helperText={
                    formFields.firstname.value !== '' &&
                    isFormValid.firstname === false ? (
                      <span className="wrong">{errorMessages.firstname}</span>
                    ) : (
                      ''
                    )
                  }
                  color={
                    formFields.firstname.value === ''
                      ? 'perso'
                      : isFormValid.firstname === false
                      ? 'error'
                      : 'success'
                  }
                />
                <Input
                  id="lastname"
                  name="lastname"
                  slot={isEditMode ? 'Nom' : null}
                  type="text"
                  placeholder={`Nom : ${member?.lastname || ''}`}
                  aria-label="Nom"
                  className={`Member--content--firstField--inputText--lastname Input ${
                    formFields.lastname.className
                  } ${isEditMode ? 'Input-dark' : ''}`}
                  value={formFields.lastname.value}
                  disabled={!isEditMode}
                  onChange={(event) => handleChange(event, 'lastname')}
                  helperText={
                    formFields.lastname.value !== '' &&
                    isFormValid.lastname === false ? (
                      <span className="wrong">{errorMessages.lastname}</span>
                    ) : (
                      ''
                    )
                  }
                  color={
                    formFields.lastname.value === ''
                      ? 'perso'
                      : isFormValid.lastname === false
                      ? 'error'
                      : 'success'
                  }
                />
                <Input
                  id="pseudo"
                  name="pseudo"
                  slot={isEditMode ? 'Pseudo' : null}
                  type="text"
                  placeholder={`Pseudo : ${member?.pseudo || ''}`}
                  aria-label="Pseudo"
                  className={`Member--content--firstField--inputText--pseudo Input ${
                    formFields.pseudo.className
                  } ${isEditMode ? 'Input-dark' : ''}`}
                  value={formFields.pseudo.value}
                  disabled={!isEditMode}
                  onChange={(event) => {
                    setOldPseudo(event.target.value);
                    handleChange(event, 'pseudo');
                    verifyPseudo(event);
                    checkPseudoStatus();
                  }}
                  helperText={
                    formFields.pseudo.value !== '' &&
                    pseudoStatus === 'error' ? (
                      <span className="wrong">{pseudoMessage}</span>
                    ) : formFields.pseudo.value !== '' &&
                      isFormValid.pseudo === false ? (
                      <span className="wrong">{errorMessages.pseudo}</span>
                    ) : formFields.pseudo.value !== '' &&
                      isFormValid.pseudo === true ? (
                      <span className="good">{pseudoMessage}</span>
                    ) : (
                      ''
                    )
                  }
                  color={
                    formFields.pseudo.value === ''
                      ? 'perso'
                      : isFormValid.pseudo === false
                      ? 'error'
                      : 'success'
                  }
                />
                <Input
                  id="email"
                  name="email"
                  slot={isEditMode ? 'Email' : null}
                  type="email"
                  placeholder={`Email : ${member?.email || ''}`}
                  aria-label="Email"
                  className={`Member--content--firstField--inputText--email Input ${
                    formFields.email.className
                  } ${isEditMode ? 'Input-dark' : ''}`}
                  value={formFields.email.value}
                  disabled={!isEditMode}
                  onChange={(event) => {
                    setOldEmail(event.target.value);
                    handleChange(event, 'email');
                    verifyEmail(event);
                    checkEmailStatus();
                  }}
                  helperText={
                    formFields.email.value !== '' && emailStatus === 'error' ? (
                      <span className="wrong">{emailMessage}</span>
                    ) : formFields.email.value !== '' &&
                      isFormValid.email === false ? (
                      <span className="wrong">{errorMessages.email}</span>
                    ) : formFields.email.value !== '' &&
                      isFormValid.email === true ? (
                      <span className="good">{emailMessage}</span>
                    ) : (
                      ''
                    )
                  }
                  color={
                    formFields.email.value === ''
                      ? 'perso'
                      : isFormValid.email === false
                      ? 'error'
                      : 'success'
                  }
                />
              </div>
              {!isEditMode ? (
                <Input
                  id="password"
                  name="password"
                  type="password"
                  slot="Éditez pour modifier le mot de passe"
                  placeholder="Éditez pour modifier le mot de passe"
                  className="Member--content--firstField--password Input"
                  disabled
                />
              ) : (
                <button
                  type="button"
                  className="Member--content--firstField--password--button"
                  onClick={handlePasswordModale}
                  disabled={!isEditMode}
                >
                  Modifier le mot de passe
                </button>
              )}
              <Input
                id="description"
                name="description"
                multiline
                rows={5}
                slot={isEditMode ? 'Description' : null}
                type="text"
                placeholder={`Description : ${member?.description || ''}`}
                aria-label="A propos de moi"
                className={`Member--content--firstField--description Input ${
                  formFields.description.className
                } ${isEditMode ? 'Input-dark' : ''}`}
                value={formFields.description.value}
                disabled={!isEditMode}
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
                    ? 'perso'
                    : isFormValid.description === false
                    ? 'error'
                    : 'success'
                }
              />
              <div className="Member--content--firstField--openToWork">
                <p className="Member--content--firstField--openToWork--text">
                  Disponibilité
                </p>
                <CustomSwitch
                  className="Member--content--firstField--openToWork--switch"
                  name="availability"
                  checked={isEditMode ? checked : member?.availability} // Si on est en mode édition, on affiche la valeur du state checked, sinon on affiche la valeur du membre
                  onChange={handleSwitch} // On appelle la fonction handleSwitch au changement de valeur du switch
                  disabled={!isEditMode} // On désactive le switch si on est pas en mode édition
                />
              </div>
            </fieldset>
            <fieldset className="Member--content--secondField">
              <div className="Member--content--secondField--container">
                <legend className="Member--legend">Languages favoris</legend>
                {isEditMode ? (
                  <p className="Member--content--secondField--container--text">
                    (Sélectionnez 1 language minimum)
                  </p>
                ) : null}
                <div className="Member--content--secondField--container--technos">
                  {/** //! Rendu conditionnel des tags
                   * @param {boolean} isEditMode - Si on est en mode édition ou lecture
                   * @param {array} member.tags - Les tags du membre
                   * @param {array} allTags - Tous les tags
                   *
                   * Affichage des tags en fonction des conditions lecture ou édition
                   */}
                  {!isEditMode
                    ? /** //* En mode lecture
                       * Si on a des tags, on les affiche avec un map() sur les tags du membre
                       * On ajoute une key à chaque tag
                       * On affiche l'image du tag et son nom
                       */
                      member?.tags &&
                      member.tags.map((tag) => (
                        <div
                          className="Member--content--secondField--container--technos--group"
                          key={tag.id}
                          style={{ cursor: 'default' }}
                        >
                          <img
                            src={`/images/technos/${tag.name.toLowerCase()}.svg`}
                            alt={tag.name}
                            title={tag.name}
                          />
                          <p>{tag.name}</p>
                        </div>
                      ))
                    : /** //* En mode édition
                       * Si on a des tags, on les affiche avec un map() sur allTags
                       * On ajoute une key à chaque tag
                       * On affiche l'image du tag et son nom
                       *
                       * On vérifie si le tag est présent dans les tags du membre pour ajouter la classe selected
                       */
                      allTags &&
                      allTags?.map((tag) => {
                        const isMatchingTag =
                          member?.tags?.find(
                            (memberTag) => memberTag.id === tag.id // On vérifie si le tag est présent dans les tags du membre
                          ) !== undefined;
                        const className = isMatchingTag ? '--selected' : ''; // Si le tag est présent dans les tags du membre, on ajoute la classe selected
                        return (
                          <div
                            key={tag.id}
                            role="button"
                            onClick={() => handleImageClick(tag.id)} // On appelle la fonction handleImageClick au clic sur l'image
                            onKeyDown={(
                              event // On appelle la fonction handleImageKeyDown au keydown sur l'image
                            ) => handleImageKeyDown(event, tag.id.toString())}
                            tabIndex={0} // On ajoute un tabIndex pour que l'élément soit focusable (accessibilité)
                            className={
                              'Member--content--secondField--container--technos--group' +
                              `${className}`
                            }
                            id={`tag-${tag.id}`} // Sert de référence pour la fonction handleImageClick ( permet d'ajouter ou de retirer la classe selected quand on ajoute/supprime le tag)
                            style={{ cursor: 'pointer' }}
                          >
                            <img
                              src={`/images/technos/${tag.name.toLowerCase()}.svg`}
                              alt={tag.name}
                              title={tag.name}
                            />
                            <p>{tag.name}</p>
                          </div>
                        );
                      })}
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
                {member?.projects && member.projects.length > 0 && (
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
                    arrows={member.projects.length > 1}
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

                    {member.projects.map((project) => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                  </Carousel>
                )}
              </div>
            </fieldset>
          </div>
          <fieldset className="Member--fourthField">
            <div className="Member--fourthField--container">
              <button // ? Bouton supprimer le profil
                type="button"
                className={
                  isEditMode
                    ? 'Member--fourthField--container--delete'
                    : 'hidden'
                }
          
                onClick={handleDeleteModale} // On appelle la fonction handleDeleteModale au clic sur le bouton
              >
                Supprimer le profil
              </button>
              <div className="Member--fourthField--container--group">
                <button // ? Bouton annuler
                  onClick={handleResetForm} // On appelle la fonction handleResetForm au clic sur le bouton
                  type="button"
                  className={`Member--fourthField--container--cancel ${
                    // On contrôle l'affichage du bouton si on est en mode édition grâce à la classe CSS visible ou hidden
                    isEditMode
                      ? 'Member--fourthField--container visible'
                      : 'Member--fourthField--container hidden'
                  }`}
                  disabled={!isEditMode}
                >
                  Annuler
                </button>
                <button // ? Bouton modifier ou valider
                  onClick={handleEditClick}
                  type="button"
                  className={`Member--fourthField--container--submit ${
                    // On contrôle l'affichage du bouton si on est en mode édition grâce à la classe CSS updatedMode ou submittedMode
                    isEditMode
                      ? 'Member--fourthField--container--updatedMode'
                      : 'Member--fourthField--container--submittedMode'
                  }`}
                >
                  {isEditMode ? 'Valider' : 'Modifier mon profil'}{' '}
                  {/* On affiche le texte en fonction du mode isEditMode */}
                </button>
              </div>
            </div>
          </fieldset>
        </form>
      </div>
      {/** //! Modale de suppression
       * Si modalDelete est true, on affiche la modale
       */}
      {modalDelete && <DeleteModale />}
      {/** //! Modale de changement de password
       * Si modalPassword est true, on affiche la modale
       */}
      {modalPassword && (
        <PasswordModale
          props={selectedTags} // Obligé de renvoyer les tags, sinon ils disparaissent
        />
      )}
    </>
  );
}

export default MyProfile;
