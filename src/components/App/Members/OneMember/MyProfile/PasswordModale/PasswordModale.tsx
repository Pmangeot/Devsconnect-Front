/* eslint-disable no-nested-ternary */
// ? Librairie
import { useRef, useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../../../../../hook/redux';

// ? Fonctions externes
import { toggleModalPassword } from '../../../../../../store/reducer/log';
import updateMember from '../../../../../../store/actions/memberUpdate';
import checkPassword from '../../../../../../store/actions/checkPassword';
import {
  resetMessage,
  updateFlash,
} from '../../../../../../store/reducer/main';
import {
  classMapping,
  validateField,
  isFormValid,
  errorMessages,
} from '../../../../../../utils/validate form/validateForm';

// ? Composants
import Input from '../../../../../Form/Input';

// ? Styles
import '../../../../../../styles/modale.scss';

// ? Fonction principale
function PasswordModale(props: string[]) {
  const { selectedTags } = props;
  // ? States
  // Redux
  const id = useAppSelector((state) => state.user.login.id); // id du membre connecté
  const { passwordStatus } = useAppSelector((state) => state.ajax); // Message de validation ou d'erreur
  const { modalPassword } = useAppSelector((state) => state.log); // État des modales

  // Local
  const [formFields, setFormFields] = useState({
    oldPassword: { value: '', className: '' },
    newPassword: { value: '', className: '' },
    confirmPassword: { value: '', className: '' },
  });
  const [oldPassword, setOldPassword] = useState(''); // Ancien mot de passe

  // ? useRef
  const modalRef = useRef(null); // Permet de cibler la modale

  // ? Dispatch
  const dispatch = useAppDispatch();

  // ? useEffect

  //* Pour le clic externe à la modale
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        // Si on clique en dehors de la modale
        modalRef.current &&
        !(modalRef.current as Element).contains(event.target as Node)
        // On précise que modalRef.current éun element html (Element)
        // On précise que event.target représente un noeud du DOM (Node)
      ) {
        dispatch(toggleModalPassword());
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [modalPassword, dispatch]);

  // ? Fonctions
  /** //* Fonction pour fermer la modale avec la croix ou le bouton annuler
   * @param {boolean} modalPassword - État de la modale
   * Au clic, on inverse l'état de la modale
   */
  const handlePasswordModale = () => {
    dispatch(toggleModalPassword());
    // Si on annule l'action, on repasse les champs en valides, ils ne seront pas pris en compte dans MyProfile
    isFormValid.oldPassword = true;
    isFormValid.newPassword = true;
    isFormValid.confirmPassword = true;
  };

  /** //! Accessibilité
   * @param {React.KeyboardEvent<HTMLDivElement>} event - Événement clavier
   * @param {boolean} modalPassword - État de la modale
   * * Une div n'est pas un element clickable par défaut.
   * On ajoute un fonction d’accessibilité pour le clavier.
   * Si la touche enter ou espace est pressée, on appelle la fonction handlePasswordModale() juste au dessus.
   */
  const handlePasswordModaleKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>
  ) => {
    if (event.key === 'enter' || event.key === ' ') {
      handlePasswordModale();
    }
  };

  /** //* Fonction de vérification du mot de passe
   * @param {React.ChangeEvent<HTMLInputElement>} e - Événement de changement de valeur
   * On récupère la valeur du champ
   * On appelle la fonction checkPassword() du fichier actions/checkPassword.ts
   * On lui passe en paramètre l'ancien mot de passe et l'id du membre connecté
   */
  const verifyPassword = (e) => {
    setOldPassword(e.target.value);

    if (e.target.value) {
      dispatch(checkPassword({ oldPassword: e.target.value, id }));
    }
  };

  /** //* Fonction de vérification du statut de la requête Ajax
   * @param {string} status - Statut de la requête Ajax
   * Si le statut est success, on passe isFormValid.oldPassword à true
   * Sinon, on passe isFormValid.oldPassword à false
   */
  const checkPasswordStatus = () => {
    if (passwordStatus === 'success') {
      isFormValid.oldPassword = true;
    } else {
      isFormValid.oldPassword = false;
    }
  };
  /** //* useEffect pour vérifier le statut de la requête Ajax
   * Quand le statut change, on appelle la fonction checkStatus()
   * Pour avoir toujours l'état à jour
   */
  useEffect(() => {
    checkPasswordStatus();
  }, [passwordStatus, oldPassword]);

  /** //* Fonction de validation des champs
   * @param {string} value - valeur du champ
   * @param {string} fieldName - nom du champ
   * Fonction qui vérifie si le champ est vide ou non
   * Si le champ est vide, on retourne une string vide
   * Si le champ n'est pas vide, on appelle la fonction validateField() du fichier utils.ts
   * Cette fonction vérifiera si le champ est valide ou non
   * On retourne le résultat dans le state formFields
   */
  const handleChange = (event, fieldName) => {
    // La propriété value qui servira a appelé la fonction validateField peut soit provenir de onChange de l'input password,
    // soit du useEffect, qui lui relance la fonction handleChange avec oldPassword (à jour)
    // Donc on initialise value à '' et on la met à jour selon le cas
    let value = '';
    // Si on a un event et que event.target existe, on récupère la valeur de l'input
    if (event && event.target) {
      value = event.target.value;
      // Sinon, en fonction du fieldName, on récupère la valeur de oldPassword
    } else if (fieldName === 'oldPassword') {
      // On récupère la valeur de oldPseudo
      value = oldPassword;
    }

    const newPasswordValue = formFields.newPassword.value;

    const options = { newPasswordValue };

    const validation = validateField(value, fieldName, options);

    let newClassName = '';

    if (validation) {
      const { className } = validation;
      newClassName = classMapping[className];
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
    handleChange(oldPassword, 'oldPassword');
  }, [passwordStatus, oldPassword]);

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

    // const oldPassword = document.querySelector(
    //   '#oldPassword'
    // ) as HTMLInputElement;
    const newPassword = document.querySelector(
      '#newPassword'
    ) as HTMLInputElement;
    const confirmPassword = document.querySelector(
      '#confirmPassword'
    ) as HTMLInputElement;

    if (!oldPassword || oldPassword.value === '') {
      isFormValid.oldPassword = false;
    }
    if (!newPassword || newPassword.value === '') {
      isFormValid.newPassword = false;
    }
    if (!confirmPassword || confirmPassword.value === '') {
      isFormValid.confirmPassword = false;
    }

    // ! Gestion des erreurs
    dispatch(resetMessage()); // On reset le message flash
    // On vérifie si les champs sont vides
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
      // Obligé de renvoyer les tags, sinon ils disparaissent
      // ? Gestion des tags
      if (selectedTags) {
        // On vérifie que selectedTags existe et qu'il contient au moins un tag
        const selectedTagsData = selectedTags.map((tag) => tag.id); // On crée un tableau avec les id des tags sélectionnés
        // const tagsJSON = JSON.stringify(selectedTagsData); // On convertie le tableau en chaîne JSON

        formData.append('tags', selectedTagsData); // On ajoute le tableau selectedTagsData à formData
        objData.tags = selectedTagsData; // On ajoute le tableau selectedTagsData à objData
      }
      // ? Gestion du password
      formData.append('password', confirmPassword.value);
      objData.password = confirmPassword.value;

      dispatch(
        // On dispatch l'action updateMember avec l'id du membre et les données du formulaire
        updateMember({
          id,
          objData: { ...objData }, // Dans formData, on ajoute les données du formulaire (objData)
        })
      );
      dispatch(toggleModalPassword()); // On ferme la modale
    }
  };

  // ? Rendu JSX

  return (
    <div className="Modale">
      <div className="Modale--container" ref={modalRef}>
        <div className="Modale--container--head">
          <h2 className="Modale--title">Modification du mot de passe</h2>
          <div
            /** //? Bouton fermer la modale
             * @param {boolean} modalPassword - État de la modale
             * @param {React.MouseEvent<HTMLDivElement>} event - Événement clic
             * @param {React.KeyboardEvent<HTMLDivElement>} event - Événement clavier
             * * Une div n'est pas un element clickable par défaut.
             * On ajoute tabindex={0} pour le rendre focusable.
             * et une fonction de déclenchement au clic ou au clavier
             */
            className="Modale--close"
            role="button" // On précise que c'est un bouton
            tabIndex={0} // On précise que c'est un élément focusable
            onClick={handlePasswordModale}
            onKeyDown={handlePasswordModaleKeyDown}
          >
            X
          </div>
        </div>

        <form onSubmit={handleSubmit} className="Modale--form">
          <div className="Modale--form--container">
            <div className="Modale--form--container--inputs">
              <Input
                id="oldPassword"
                name="password"
                slot="Ancien"
                type="password"
                placeholder="*****"
                aria-label="Ancien mot de passe"
                value={formFields.oldPassword.value}
                className={`Modale--form--container--inputs--input Input Input-light ${formFields.oldPassword.className}`}
                onChange={(event) => {
                  checkPasswordStatus();
                  verifyPassword(event);
                  handleChange(event, 'oldPassword');
                }}
                helperText={
                  formFields.oldPassword.value !== '' &&
                  isFormValid.oldPassword === false ? (
                    <span className="wrong">{errorMessages.oldPassword}</span>
                  ) : (
                    ''
                  )
                }
                color={
                  formFields.oldPassword.value === ''
                    ? 'lightestPerso'
                    : isFormValid.oldPassword === false
                    ? 'error'
                    : 'success'
                }
              />

              <Input
                id="newPassword"
                name="password"
                slot="Nouveau"
                type="password"
                placeholder="*****"
                aria-label="Nouveau mot de passe"
                value={formFields.newPassword.value}
                className={`Modale--form--container--inputs--input Input Input-light ${formFields.newPassword.className}`}
                onChange={(event) => handleChange(event, 'newPassword')}
                helperText={
                  formFields.newPassword.value !== '' &&
                  isFormValid.newPassword === false ? (
                    <span className="wrong">{errorMessages.newPassword}</span>
                  ) : (
                    ''
                  )
                }
                color={
                  formFields.newPassword.value === ''
                    ? 'lightestPerso'
                    : isFormValid.newPassword === false
                    ? 'error'
                    : 'success'
                }
              />
              <Input
                id="confirmPassword"
                name="password"
                slot="Confirmation"
                type="password"
                placeholder="*****"
                aria-label="Confirmation du mot de passe"
                value={formFields.confirmPassword.value}
                className={`Modale--form--container--inputs--input Input Input-light ${formFields.confirmPassword.className}`}
                onChange={(event) => handleChange(event, 'confirmPassword')}
                helperText={
                  formFields.confirmPassword.value !== '' &&
                  isFormValid.confirmPassword === false ? (
                    <span className="wrong">
                      {errorMessages.confirmPassword}
                    </span>
                  ) : (
                    ''
                  )
                }
                color={
                  formFields.confirmPassword.value === ''
                    ? 'lightestPerso'
                    : isFormValid.confirmPassword === false
                    ? 'error'
                    : 'success'
                }
              />
            </div>
            <button type="submit" className="Modale--form--container--confirm">
              Modifier le mot de passe
            </button>
            <button
              type="button"
              onClick={handlePasswordModale}
              className="Modale--form--container--cancel"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PasswordModale;
