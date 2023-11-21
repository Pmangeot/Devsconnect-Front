// ? Librairies
import { useEffect, useState } from 'react';
import { Audio } from 'react-loader-spinner'; // Composant pour spinner
import { TablePagination, ThemeProvider } from '@mui/material';
import paginationUITheme from '../../../utils/CustomPaginationUI';

import { useAppSelector, useAppDispatch } from '../../../hook/redux';

// ? Fonctions externes
import { fetchAllProjects } from '../../../store/reducer/projects';

// ? Composants
import NotFound from '../../NotFound/NotFound';
import FilterBar from '../Layout/FilterBarProjects/FilterBarProject';
import ProjectCard from '../Cards/ProjectCard/ProjectCard';

// ? Styles
import './style.scss';
import '../Cards/ProjectCard/style.scss';

// ? Interface globale
import { ProjectI } from '../../../@types/interface';

// ? Fonction principale
function Projects() {
  // ? States
  // Store
  const projects: ProjectI[] = useAppSelector(
    (state) => state.projects.list.data
  ); // Variable projects pour stocker les projets en provenance du store
  const loading = useAppSelector((state) => state.projects.list.loading); // Variable loading pour stocker le statut de chargement des projets

  // local
  const [filteredProjects, setFilteredProjects] =
    useState<ProjectI[]>(projects); // Variable filteredProjects pour stocker les projets filtrés en provenance du composant FilterBar
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // ? Dispatch
  const dispatch = useAppDispatch();

  // ? useEffect
  // useEffect pour récupérer les membres
  useEffect(() => {
    dispatch(fetchAllProjects());
  }, [dispatch]);

  // ? Fonctions
  /** //* Fonction pour changer de page
   * @param {Object} event - Événement
   * @param {Number} newPage - Nouvelle page
   * Au clic sur un bouton de pagination, on met à jour la page
   */
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  /** //* Fonction pour changer le nombre de membres par page
   * @param {Object} event - Événement
   * Au changement du nombre de membres par page, on met à jour le nombre de membres par page
   * On remet la page à 0
   */
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  //* En cas de chargement des membres, on affiche un indicateur de chargement
  if (loading) {
    return (
      <div className="Loader">
        <Audio
          height="80"
          width="80"
          radius="9"
          color="grey"
          ariaLabel="three-dots-loading"
        />
        <p>loading</p>
      </div>
    );
  }

  // Si la liste des projets est vide, on affiche une erreur serveur
  if (projects.length === 0) {
    return (
      <NotFound
        errorMessage="Désolé, aucun projet disponible pour le moment"
        errorStatus={500}
      />
    );
  }

  return (
    <div className="Projects">
      {/**
       * //! FilterBar.tsx
       * @param {Array} members - Liste des membres
       * @param {Function} setFilteredMembers - Fonction pour mettre à jour la liste des membres filtrés
       * On envoie au composant la liste des membres
       * On envoie au composant la fonction pour mettre à jour la liste des membres filtrés
       */}
      <ThemeProvider theme={paginationUITheme}>
        <TablePagination
          rowsPerPageOptions={[5, 10, 15, 20]}
          component="div"
          labelRowsPerPage="Résultats par page"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} sur ${count !== -1 ? count : `plus de ${to}`}`
          }
          count={filteredProjects.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </ThemeProvider>
      <FilterBar
        projects={projects}
        setFilteredProjects={setFilteredProjects}
      />
      <h2 className="Projects--title">Tous les projets</h2>
      {filteredProjects.length === 0 && (
        <p className="noResult">Aucun résultat pour vos critères</p>
      )}
      <div className="Projects--containerCard">
        {/* On map sur la liste en retour de la barre de recherche pour les cartes projects */}
        {filteredProjects
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((project: ProjectI) => (
            /** //! CardProject.tsx
             * @param {Object} member - Données du projet
             * @param {Number} key - Clé unique pour chaque projet
             * On envoie au composant CardProject les données de chaque projet
             * et une clé unique
             */
            // <li key={project.id}>{project.title}</li>
            // <CardProject key={project.id} project={project.id} />
            <ProjectCard key={project.id} project={project} />
          ))}
      </div>
    </div>
  );
}

export default Projects;
