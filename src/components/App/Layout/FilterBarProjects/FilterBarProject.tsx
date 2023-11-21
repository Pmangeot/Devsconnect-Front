// ? Librairies
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

// ? Composants externes
import CustomSwitch from '../../../../utils/customSwitchUI';

// ? Styles
import './style.scss';
import SelectComponent from './Select/Select';

// ? Typage global
import { ProjectI, TagSelectedI } from '../../../../@types/interface';

// ? Fonction principale
function FilterBar({
  projects,
  setFilteredProjects,
}: {
  // Props du composant
  projects: ProjectI[];
  setFilteredProjects: React.Dispatch<React.SetStateAction<ProjectI[]>>;
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
   * @param {array} project - Tableau des projets
   * @param {function} setFilteredProjects - State pour gérer les projets filtrés
   * @param {string} searchText - Valeur du paramètre `search` de l'url
   * @param {array} selectedTags - Tableau des technos sélectionnées
   * @param {boolean} checked - State pour gérer le switch open to work
   * A chaque fois que `projects`, `searchText`, `checked`, `setFilteredProjects` ou `selectedTags` change, on fait une mise à jour des projets filtrés
   * On met à jour les projets filtrés du composant parent <Projects />
   */
  useEffect(() => {
    // On filtre sur tous les membres
    const filteredResults = projects.filter((project) => {
      //* Filtre par nom ou prénom
      // on filtre le nom du membre par rapport à la valeur de la recherche
      const titleResult = project.title
        ?.toLowerCase()
        .includes(searchText.toLowerCase());
      // on filtre le pseudo du propriétaire par rapport à la valeur de la recherche
      const pseudoResult = project.user_pseudo
        ?.toLowerCase()
        .includes(searchText.toLowerCase());

      // On retourne le résultat de la recherche sur le titre ou le pseudo
      const textResult = titleResult || pseudoResult;

      //* Filtre par disponibilité
      // On retourne le résultat de la recherche sur la disponibilité
      const available = !checked || project.availability;

      //* Filtre par techno
      // On retourne le résultat de la recherche sur les technos
      const technoResult =
        // si aucune techno n'est sélectionnée, on retourne true pour tout afficher
        selectedTags.length === 0 ||
        // sinon on filtre sur les technos sélectionnées
        (project.tags &&
          // every pour que les filtres technos soient cumulatifs
          selectedTags.every((techno) =>
            // on vérifie que le nom de la techno est présent dans les tags du membre
            project.tags?.some(
              (tag) => tag.name.toLowerCase() === techno.value.toLowerCase()
            )
          ));
      // On retourne le résultat de la recherche
      return textResult && available && technoResult;
    });
    // On met à jour les membres filtrés du composant parent <Membres /> avec le résultat des différents filtres
    setFilteredProjects(filteredResults);
  }, [searchText, projects, checked, selectedTags, setFilteredProjects]);

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
            placeholder="Rechercher par titre ou propriétaire"
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
