// ? Librairies
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

// ? Composants externes
import CustomSwitch from '../../../../utils/customSwitchUI';

// ? Styles
import './style.scss';
import SelectComponent from './Select/Select';

// ? Typage global
import { MemberI, TagSelectedI } from '../../../../@types/interface';

// ? Fonction principale
function FilterBar({
  members,
  setFilteredMembers,
}: {
  // Props du composant
  members: MemberI[];
  setFilteredMembers: React.Dispatch<React.SetStateAction<MemberI[]>>;
}) {
  // ? State
  // local
  const [checked, setChecked] = useState(false); // Sert à gérer le switch open to work
  const [searchParams, setSearchParams] = useSearchParams(); // Sert à récupérer les paramètres de l'url
  const [selectedTags, setSelectedTags] = useState<TagSelectedI[]>([]); // Sert à stocker les technos sélectionnées

  // ? Params url
  const searchText = searchParams.get('search') || ''; // Sert à récupérer la valeur du paramètre `search` de l'url

  // ? UseEffect
  /** //! UseEffect pour filtrer les membres
   * @param {array} members - Tableau des membres
   * @param {function} setFilteredMembers - State pour gérer les membres filtrés
   * @param {string} searchText - Valeur du paramètre `search` de l'url
   * @param {array} selectedTags - Tableau des technos sélectionnées
   * @param {boolean} checked - State pour gérer le switch open to work
   * A chaque fois que `members`, `searchText`, `checked`, `setFilteredMembers` ou `selectedTags` change, on fait une mise à jour des membres filtrés
   * On met à jour les membres filtrés du composant parent <Membres />
   */
  useEffect(() => {
    // On filtre sur tous les membres
    const filteredResults = members.filter((member) => {
      //* Filtre par nom ou prénom
      // on filtre le nom du membre par rapport à la valeur de la recherche
      const nameResult = member.lastname
        .toLowerCase()
        .includes(searchText.toLowerCase());
      // on filtre le prénom du membre par rapport à la valeur de la recherche
      const firstnameResult = member.firstname
        .toLowerCase()
        .includes(searchText.toLowerCase());

      // On retourne le résultat de la recherche sur le nom ou le prénom
      const textResult = nameResult || firstnameResult;

      //* Filtre par disponibilité
      // On retourne le résultat de la recherche sur la disponibilité
      const available = !checked || member.availability;

      //* Filtre par techno
      // On retourne le résultat de la recherche sur les technos
      const technoResult =
        // si aucune techno n'est sélectionnée, on retourne true pour tout afficher
        selectedTags.length === 0 ||
        // sinon on filtre sur les technos sélectionnées
        (member.tags &&
          // every pour que les filtres technos soient cumulatifs
          selectedTags.every((techno) =>
            // on vérifie que le nom de la techno est présent dans les tags du membre
            member.tags.some(
              (tag) => tag.name.toLowerCase() === techno.value.toLowerCase()
            )
          ));
      // On retourne le résultat de la recherche
      return textResult && available && technoResult;
    });
    // On met à jour les membres filtrés du composant parent <Membres /> avec le résultat des différents filtres
    setFilteredMembers(filteredResults);
  }, [searchText, members, checked, selectedTags, setFilteredMembers]);

  // ? Fonctions
  /**  //* Fonction pour le switch open to work
   * @param {boolean} checked - State pour gérer le switch open to work
   * @param {function} setChecked - State pour gérer le switch open to work
   * Au clic sur le switch, on inverse le state checked
   */
  const handleSwitch = () => {
    setChecked(!checked);
  };

  /** //* Fonction pour gérer les technos sélectionnées
   * @param {array} selectedTagsFromSelect - Tableau des technos sélectionnées dans le composant <Select />
   * On récupère les technos sélectionnées dans le composant <Select />
   * On met à jour le state selectedTags
   */
  const handleTechnoChange = (selectedTagsFromSelect: TagSelectedI[]) => {
    setSelectedTags(selectedTagsFromSelect);
  };

  /** //* Fonction pour enregistrer la recherche dans l'url
   * @param {event} event - Event de l'input de recherche
   * @param {function} setSearchParams - State pour gérer les paramètres de l'url
   * A chaque fois que l'utilisateur tape dans le champ de recherche
   * on récupère la valeur de la recherche (event.target.value)
   * On utilise setSearchParams pour mettre à jour les paramètres de l'url
   */
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const results = event.target.value;
    setSearchParams({ search: results });
  };

  // ? Rendu JSX
  return (
    <div className="FilterBar">
      <h3 className="FilterBar--title">Filtrer les résultats</h3>
      <div className="FilterBar--container">
        <div className="FilterBar--firstField">
          <p className="FilterBar--firstField--text">Choix des technos :</p>
          {/** //! Composant <Select />
           * @param {function} handleTechnoChange - Fonction pour gérer les technos sélectionnées
           * @param {array} selectedTags - Tableau des technos sélectionnées
           * On passe en props la fonction pour gérer les technos sélectionnées et le tableau des technos sélectionnées
           * On récupère les technos sélectionnées dans le composant <Select />
           */}
          <SelectComponent handleTechnoChange={handleTechnoChange} />
        </div>
        <div className="FilterBar--secondField">
          <input
            type="text"
            name="search"
            value={searchText} // On récupère la valeur du paramètre `search` de l'url
            onChange={handleSearch} // On enregistre la recherche dans l'url
            className="FilterBar--secondField--search"
            placeholder="Entrez votre recherche"
          />
        </div>
        <div className="FilterBar--thirdField">
          <label className="FilterBar--thirdField--switch" htmlFor="openToWork">
            Disponible :
            <CustomSwitch
              className="FilterBar--thirdField--switch"
              checked={checked} // On récupère la valeur du state checked
              onChange={handleSwitch} // On inverse le state checked avec la fonction handleSwitch()
            />
          </label>
        </div>
      </div>
    </div>
  );
}

export default FilterBar;
