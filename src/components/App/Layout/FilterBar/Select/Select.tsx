// ? Composants externes
import Select, { OnChangeValue, StylesConfig } from 'react-select'; // Composant Select de la librairie react-select
import { CSSObject } from '@emotion/react'; // Pour typer les styles en ligne (inline styles)

// ? Librairies
import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../../../../hook/redux';

// ? Fonctions externes
import { resizeWindow } from '../../../../../store/reducer/main';

// ? Datas
import { technos } from '../../../../../utils/technosPath';

// ? Styles
import './style.scss';

// ? Typage global
import { TagSelectedI } from '../../../../../@types/interface';

// ? Typage local
// Pour typer le state css `isFocused`
type StateI = {
  isFocused: boolean;
};

// ? Fonction principale
function SelectComponent({
  // validation des props
  handleTechnoChange,
}: {
  handleTechnoChange: (selected: TagSelectedI[]) => void;
}) {
  // ? States
  // Redux
  const windowWidth = useAppSelector((state) => state.main.windowWidth); // On récupère la largeur de la fenêtre navigateur
  // local
  const [selectedTechnos, setSelectedTechnos] = useState<TagSelectedI[]>([]); // Servira à stocker les technos sélectionnées

  // ? Dispatch
  const dispatch = useAppDispatch();

  // ? useEffect
  // On utilise useEffect pour mettre à jour la state windowWidth à chaque fois que la largeur de la fenêtre navigateur change
  useEffect(() => {
    const handleWindowResize = () => {
      // On met à jour et on fait un nouveau rendu avec la nouvelle largeur de la fenêtre navigateur
      dispatch(resizeWindow());
    };
    // On ajoute un écouteur d'évènement sur le resize de la fenêtre navigateur
    window.addEventListener('resize', handleWindowResize);

    // On retourne une fonction de nettoyage pour supprimer l'écouteur d'évènement
    return () => window.removeEventListener('resize', handleWindowResize);
  }, [dispatch]);
  /** //* Placeholder
   * On utilise ensuite la donnée windowWidth pour gérer le placeholder
  /* Le texte affiché dans le select dépend de la largeur de la fenêtre navigateur
  */
  const placeHolderText =
    windowWidth > 768
      ? 'Choisissez vos languages (limité à 5)'
      : 'Limité à 5 maximum';

  // ? Fonctions
  /** //* Fonction pour le choix des technos
   * @param {Array} selected : tableau d'objets
   * @param {handleTechnoChange} handleTechnoChange : fonction pour mettre à jour la state technos du parent
   * @param {setSelectedTechnos} setSelectedTechnos : fonction pour mettre à jour la state selectedTechnos
   * On utilise la fonction handleOptionChange pour mettre à jour la state selectedTechnos
   * On vérifie que selected est bien un tableau (Array.isArray(selected))
   * Si c'est le cas, on met à jour la state selectedTechnos et on envoie au parent le tableau de technos sélectionnées
   */
  const handleOptionChange = (selected: OnChangeValue<TagSelectedI, true>) => {
    if (selected && Array.isArray(selected)) {
      setSelectedTechnos(selected);
      handleTechnoChange(selected);
    }
  };

  /** //* Fonction pour limiter à 5 technos
   * @param {Array} selectedTechnos : tableau d'objets
   * @returns {boolean} : true si le tableau contient 5 éléments, false sinon
   * Si le tableau de technos sélectionnées contient 5 éléments, on désactive les options
   */
  const isOptionDisabled = () => selectedTechnos.length >= 5;

  /** //* Fonction pour personnaliser le rendu des options
   * @param {Object} option : objet avec les propriétés label, value et icon
   * @returns {JSX.Element} : JSX.Element
   * On utilise la fonction formatOptionLabel pour personnaliser le rendu des options
   * Elle filtre le tableau de technos sélectionnées et si l'option est présente, elle n'affiche que le label et disparait de la liste déroulante.
   * Sinon, elle affiche le label et l'icône (dans la liste déroulante).
   */
  const formatOptionLabel = ({ label, value, path }: TagSelectedI) => {
    // Si l'option est présente dans le tableau de technos sélectionnées...
    if (selectedTechnos.some((option) => option.value === value)) {
      return label; // On affiche uniquement le value
    }
    // Sinon, on affiche le label et l'icône
    return (
      <div className="Select--techno--flex">
        <img src={path} alt={value} className="Select--techno-svg" />
        {value}
      </div>
    );
  };

  // ? Style du select
  const customStyles: StylesConfig<TagSelectedI, true> = {
    // CSSObject est un type de typescript pour typer les styles en ligne (inline styles)
    // On l'importe depuis react-select et on l'utilise comme type pour typer les styles
    //! container complet
    control: (baseStyles: CSSObject, state: StateI) => ({
      ...baseStyles,
      borderColor: state.isFocused ? '#b3575c' : '#333',
      borderRadius: '10px',
      //* Media queries
      '@media (min-width: 1081px)': { width: '510px' },
      '@media (max-width: 1080px)': { width: '550px' },
      '@media (max-width: 768px)': { width: '100%', maxWidth: '500px' },
    }),
    //! placeholder
    placeholder: (baseStyles: CSSObject) => ({
      ...baseStyles,
      margin: 'auto 0',
      fontSize: '1.5rem',
      '@media (max-width: 500px)': { fontSize: '1rem' },
      '@media (max-width: 324px)': { fontSize: '0.6rem' },
    }),
    //! Input > Container des valeurs sélectionnées
    multiValue: (baseStyles: CSSObject) => ({
      ...baseStyles,
      display: 'flex',
      margin: '0 0.2rem',
      border: '1px solid rgba(163, 163, 163, 0.4)',
      opacity: '0.8',
      // display: 'none',
    }),
    //! Input > Texte des valeurs sélectionnées
    multiValueLabel: (baseStyles: CSSObject) => ({
      ...baseStyles,
      color: 'black',
      fontSize: '1rem',
      // display: 'none',
    }),
    //! Input > Croix des valeurs sélectionnées
    multiValueRemove: (baseStyles: CSSObject) => ({
      ...baseStyles,
      color: '#b3575c',
    }),
    //! Croix de suppression générale
    clearIndicator: (baseStyles: CSSObject) => ({
      ...baseStyles,
      color: '#b3575c',
      opacity: '0.6',
    }),
    //! Flèche
    dropdownIndicator: (baseStyles: CSSObject) => ({
      ...baseStyles,
      padding: '0 0.5rem',
      opacity: '0.6',
    }),
    // ! Menu déroulant
    menu: (baseStyles: CSSObject, state) => ({
      ...baseStyles,
      position: 'absolute',
      margin: '0rem 0',
      zIndex: '2',
      width: '100%', // Largeur du menu déroulant, même largeur que le select
      borderRadius: '0 0 20px 20px',
      '@media (min-width: 1081px)': { width: '510px' },
      '@media (max-width: 1080px)': { width: '550px' },
      '@media (max-width: 768px)': { width: '100%', maxWidth: '500px' },
    }),
    //! Chaque item du menu déroulant
    option: (base) => ({
      ...base,
      cursor: 'pointer',
      zIndex: '2',
      background: '#3f3f3f',
      ':hover': {
        backgroundColor: '#282828',
      },
    }),
    // ! Texte du menu déroulant
    menuList: (baseStyles: CSSObject) => ({
      ...baseStyles,
      maxHeight: '280px', // Hauteur du menu déroulant (1 technos = 40px * 7 = 280px)
      overflowY: 'auto',
      color: '#f4fefe',
      zIndex: '2',
    }),
  };

  // ? Rendu JSX
  return (
    <Select
      id="selectTechnos"
      isMulti // Autorise la sélection multiple
      name="technos"
      options={technos} // Tableau des technos (importé de utils/technosOptions)
      className="FilterBar--select"
      placeholder={placeHolderText} // variable définie plus haut
      value={selectedTechnos} // Valeur de la sélection (voir state plus haut)
      onChange={handleOptionChange} // Fonction pour le choix des technos (voir fonction plus haut)
      isOptionDisabled={isOptionDisabled} // Désactive les options si 5 technos sont sélectionnées
      formatOptionLabel={formatOptionLabel} // Personnalisation du rendu des options (voir fonction plus haut)
      styles={customStyles} // Style du select (voir const plus haut)
      captureMenuScroll // Empêche le scroll du menu déroulant de scroller la page
    />
  );
}

export default SelectComponent;
