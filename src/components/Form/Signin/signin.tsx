// ? Librairies
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Checkbox from '@mui/material/Checkbox';

import { useAppSelector, useAppDispatch } from '../../../hook/redux';

// ? Fonctions externes
import { fetchAllTags } from '../../../store/reducer/tag';
import signinUser from '../../../store/actions/memberCreate';
import checkPseudo from '../../../store/actions/checkPseudo';
import checkEmail from '../../../store/actions/checkEmail';

import {
  toggleModalLogin,
  toggleModalSignin,
} from '../../../store/reducer/log';
import { resetMessage, updateFlash } from '../../../store/reducer/main';
import {
  classMapping,
  validateField,
  isFormValid,
  errorMessages,
  validatePicture,
} from '../../../utils/validate form/validateForm';

// ? Composants
import CustomSwitch from '../../../utils/customSwitchUI';
import Input from '../Input';

// ? Styles
import '../../../styles/modale.scss';

// ? Typage global
import { TagSelectedI } from '../../../@types/interface';

// ? Fonction principale
function Signin() {
  // ? State
  const allTags: TagSelectedI[] = useAppSelector(
    (state) => state.tag.list.data
  ); // Tableau des tags récupérés depuis l'API
  const { pseudoMessage, emailMessage, pseudoStatus, emailStatus } =
    useAppSelector((state) => state.ajax);
  // Local
  const [checked, setChecked] = useState(true); // State pour le check de open to work
  const [selectedTags, setSelectedTags] = useState<TagSelectedI[]>([]); // Tableau des tags sélectionnés par l'utilisateur
  const [cgu, setCgu] = useState(false); // State pour la case à cocher CGU

  const [oldPseudo, setOldPseudo] = useState(''); // Ancien mot de passe
  const [oldEmail, setOldEmail] = useState(''); // Ancien email
  const [currentPicture, setCurrentPicture] = useState(''); // Image de profil actuelle

  // Etats pour la gestion du formulaire et des erreurs associées
  const [formFields, setFormFields] = useState({
    firstname: { value: '', className: '' },
    lastname: { value: '', className: '' },
    pseudo: { value: '', className: '' },
    email: { value: '', className: '' },
    password: { value: '', className: '' },
    description: { value: '', className: '' },
    picture: { value: '', className: '' },
    tags: { value: '', className: '' },
  });

  // ? useRef
  const modalRef = useRef(null); // Référence pour la modale

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

  //* useEffect pour clic externe à la modale
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        // Si on clique en dehors de la modale
        modalRef.current &&
        !(modalRef.current as Element).contains(event.target as Node)
        // On précise que modalRef.current éun element html (Element)
        // On précise que event.target représente un noeud du DOM (Node)
      ) {
        // Clic en dehors de la modale
        isFormValid.picture = true; // On réinitialise le message d'erreur de l'image
        dispatch(toggleModalSignin());
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dispatch]);

  // ? Fonctions

  /** //* Fonction pour ouvrir ou fermer la modale de connexion
   * @param {toggleModalSignin} dispatch - Dispatch de l'action pour ouvrir ou fermer la modale
   * Au clic, on dispatch l'action pour ouvrir ou fermer la modale
   */
  const handleSignin = () => {
    // On dispatch l'action qui va gérer l'ouverture de la modale
    isFormValid.picture = true; // On réinitialise le message d'erreur de l'image
    dispatch(toggleModalSignin());
  };
  /** //! Accessibilité
   * @param {React.KeyboardEvent<HTMLDivElement>} event - Événement clavier
   * @param {toggleModalSignin} dispatch - Dispatch de l'action pour ouvrir ou fermer la modale
   * * Une div n'est pas un element clickable par défaut.
   * On ajoute un fonction d’accessibilité pour le clavier.
   * Si la touche enter ou espace est pressée, on appelle la fonction handleSignin() juste au dessus.
   */
  const handleSigninKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'enter' || event.key === ' ') {
      handleSignin();
    }
  };

  /** //* Fonction pour ouvrir la modale de connexion
   * @param {toggleModalLogin} dispatch - Dispatch de l'action pour ouvrir ou fermer la modale
   * Au clic, on dispatch l'action pour ouvrir ou fermer la modale
   * On ferme également la modale de connexion
   * On ouvre la modale d'inscription
   */
  const handleLogin = () => {
    dispatch(toggleModalSignin());
    dispatch(toggleModalLogin());
  };
  /** //! Accessibilité
   * @param {React.KeyboardEvent<HTMLDivElement>} event - Événement clavier
   * @param {toggleModalSignin} dispatch - Dispatch de l'action pour ouvrir ou fermer la modale
   * * Une div n'est pas un element clickable par défaut.
   * On ajoute un fonction d’accessibilité pour le clavier.
   * Si la touche enter ou espace est pressée, on appelle la fonction handleLogin() juste au dessus.
   */
  const handleLoginKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'enter' || event.key === ' ') {
      handleLogin();
    }
  };

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
      setCurrentPicture(URL.createObjectURL(event.target.files[0]));
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

  /** //* Fonction pour le switch open to work
   * @param {setChecked} setChecked - State pour le check de open to work
   * Au clic, on inverse la valeur du state
   */
  const handleSwitch = () => {
    setChecked(!checked);
  };

  /** //* Fonction pour la case à cocher CGU
   * @param {setCgu} setCgu - State pour la case à cocher CGU
   * Au clic, on inverse la valeur du state
   */
  const handleCguChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCgu(event.target.checked);
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
        const updatedTags = [...selectedTags, selectedTag];
        // On met à jour le state des technos sélectionnées
        setSelectedTags(updatedTags);
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

  /** //* Fonction pour l'envoie du formulaire
   * @param {React.FormEvent<HTMLFormElement>} event - Événement formulaire
   * @param {FormData} formData - Données du formulaire
   * @param {selectedTags} selectedTags - Tableau des tags sélectionnés par l'utilisateur
   * Au submit du formulaire, on récupère les données du formulaire et on les envoie à l'API
   * On dispatch l'action pour fermer la modale
   */
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // On empêche le comportement par défaut du formulaire
    // ! Déclaration des variables
    const form = event.currentTarget;
    const formData = new FormData(form);
    const objData = Object.fromEntries(formData.entries());

    const firstname = formData.get('firstname');
    const lastname = formData.get('lastname');
    const pseudo = formData.get('pseudo');
    const description = formData.get('description');
    const email = formData.get('email').toString();
    const password = formData.get('password');

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

    // Gestion des erreurs cgu
    if (cgu === false) {
      isFormValid.cgu = false;
    } else {
      isFormValid.cgu = true;
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
    console.log(falseFieldCount);
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
      delete objData.cgu;
      console.log(objData);
      dispatch(signinUser(objData)); // On envoie les données du formulaire à l'API
      dispatch(toggleModalSignin()); // On ferme la modale
      dispatch(toggleModalLogin()); // On ouvre la modale de connexion
    }
  };
  // ? Rendu JSX
  return (
    <div className="Modale BigForm">
      <div
        className="Modale--container"
        ref={modalRef} // On ajoute la référence pour la modale
      >
        <div className="Modale--container--head">
          <div
            className="Modale--close"
            role="button"
            onClick={handleSignin} // On appelle la fonction handleSignin() au clic
            tabIndex={0} // On ajoute la propriété tabIndex pour rendre la div focusable
            onKeyDown={handleSigninKeyDown} // On appelle la fonction handleSigninKeyDown() au clavier
          >
            X
          </div>
          {/* <div className="Modale--signin-box"> */}
          <h1 className="Modale--title">Inscription</h1>
          <div className="Modale--other Signin--login-box">
            <p className="Modale--text">Déjà membre ?</p>
            <div
              className="Modale--other--link"
              onClick={handleLogin}
              tabIndex={0} // On précise que la div est focusable
              role="button"
              onKeyDown={handleLoginKeyDown}
            >
              Connectez vous !
            </div>
          </div>

          {/* </div> */}
        </div>
        <form
          encType="multipart/form-data"
          onSubmit={handleSubmit} // On appelle la fonction handleSubmit() au submit
          className="Modale--form--container"
        >
          <legend className="Modale--legend">Informations personnelles</legend>

          <div className="BigForm--container">
            <div className="BigForm--container--image">
              <img
                className="BigForm--container--image--profil"
                src={
                  formFields.picture.value.includes('blob')
                    ? formFields.picture.value
                    : '/images/profil/profil.svg'
                }
                alt="profil"
                onClick={handleUploadClick}
                onKeyDown={handleUploadClick}
                role="button"
                tabIndex={0}
              />
              <img
                src="/images/profil/upload.svg"
                className="BigForm--container--image--upload"
                alt="upload"
                onClick={handleUploadClick}
                onKeyDown={handleUploadClick}
                role="button"
                tabIndex={0}
              />
            </div>
            <input
              id="picture"
              type="file"
              slot="Photo de profil"
              name="picture"
              accept="image/png, image/jpeg, image/jpg, image/gif, image/svg, image/webp"
              onChange={(event) => {
                handleFileChange(event);
              }}
              className="hidden"
            />
            {!isFormValid.picture && (
              <span className="Member--header--errorMessage wrong">
                {errorMessages.picture}
              </span>
            )}
          </div>

          <fieldset className=">Modale--form--container--inputs">
            {/* Input maison, importé */}
            <Input
              id="firstname"
              name="firstname"
              slot="Prénom"
              type="text"
              placeholder="Prénom"
              aria-label="Prénom"
              value={formFields.firstname.value}
              className={`Member--content--firstField--description Input Input-light ${formFields.firstname.className}`}
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
                  ? 'lightestPerso'
                  : isFormValid.firstname === false
                  ? 'error'
                  : 'success'
              }
            />
            <Input
              id="lastname"
              name="lastname"
              slot="Nom"
              type="text"
              placeholder="Nom"
              aria-label="Nom"
              value={formFields.lastname.value}
              className={`Member--content--firstField--description Input Input-light ${formFields.lastname.className}`}
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
                  ? 'lightestPerso'
                  : isFormValid.lastname === false
                  ? 'error'
                  : 'success'
              }
            />
            <Input
              id="pseudo"
              name="pseudo"
              slot="Pseudo"
              type="text"
              placeholder="Pseudo"
              aria-label="Pseudo"
              value={formFields.pseudo.value}
              className={`Member--content--firstField--description Input Input-light ${formFields.pseudo.className}`}
              onChange={(event) => {
                setOldPseudo(event.target.value);
                handleChange(event, 'pseudo');
                verifyPseudo(event);
                checkPseudoStatus();
              }}
              helperText={
                formFields.pseudo.value !== '' && pseudoStatus === 'error' ? (
                  <span className="wrong">{pseudoMessage}</span>
                ) : formFields.pseudo.value !== '' &&
                  isFormValid.pseudo === false ? (
                  <span className="wrong">{errorMessages.pseudo}</span>
                ) : (
                  ''
                )
              }
              color={
                formFields.pseudo.value === ''
                  ? 'lightestPerso'
                  : isFormValid.pseudo === false
                  ? 'error'
                  : 'success'
              }
            />
            <Input
              id="email"
              name="email"
              slot="Email"
              type="text"
              placeholder="Adresse Email"
              aria-label="Adresse Email"
              value={formFields.email.value}
              className={`Member--content--firstField--description Input Input-light ${formFields.email.className}`}
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
                ) : (
                  ''
                )
              }
              color={
                formFields.email.value === ''
                  ? 'lightestPerso'
                  : isFormValid.email === false
                  ? 'error'
                  : 'success'
              }
            />
            <Input
              id="password"
              name="password"
              slot="Mot de passe"
              type="password"
              placeholder="Mot de passe"
              aria-label="Mot de passe"
              value={formFields.password.value}
              className={`Member--content--firstField--description Input Input-light ${formFields.password.className}`}
              onChange={(event) => handleChange(event, 'password')}
              helperText={
                formFields.password.value !== '' &&
                isFormValid.password === false ? (
                  <span className="wrong">{errorMessages.password}</span>
                ) : (
                  ''
                )
              }
              color={
                formFields.password.value === ''
                  ? 'lightestPerso'
                  : isFormValid.password === false
                  ? 'error'
                  : 'success'
              }
            />
            <Input
              id="description"
              name="description"
              slot="A propos de moi"
              type="text"
              placeholder="Une petite présentation ?"
              aria-label="A propos de moi"
              multiline
              rows={5}
              value={formFields.description.value}
              className={`Member--content--firstField--description Input Input-light ${formFields.description.className}`}
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

            <div className="Member--content--firstField--openToWork">
              <p>Ouvert aux projets</p>
              <CustomSwitch
                name="availability"
                checked={checked} // On récupère la valeur du state checked
                onChange={handleSwitch} // On appelle la fonction handleSwitch() au changement
              />
            </div>
          </fieldset>

          <fieldset className="Member--content--secondField">
            <div className="Member--content--secondField--container">
              <legend className="Modale--legend">Languages favoris</legend>
              <p className="Member--content--secondField--container--text">
                (Sélectionnez 1 language minimum)
              </p>
              <div className="Member--content--secondField--container--technos">
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
                      'Member--content--secondField--container--technos--group' +
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
            </div>
            <div className="Modale--other--cgu">
              <div className="Modale--other--cgu--container">
                <Link
                  to="/cgu"
                  target="_blank"
                  className="Modale--other--link-cgu"
                >
                  <label htmlFor="cgu">J&apos;accepte les CGU</label>
                </Link>
                <Checkbox
                  id="cgu"
                  onChange={handleCguChange}
                  checked={cgu}
                  color="success"
                  size="large"
                  name="cgu"
                  className="Modale--other--cgu--checkbox"
                />
              </div>
            </div>
            <button type="submit" className="Modale--form--container--confirm">
              S&apos;inscrire
            </button>
          </fieldset>
        </form>
        <h1 className="Modale--other--subtitle">DevsConnect</h1>
      </div>
    </div>
  );
}

export default Signin;