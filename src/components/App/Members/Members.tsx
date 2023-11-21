// ? Librairies
import { useEffect, useState } from 'react';
import { Audio } from 'react-loader-spinner'; // Composant pour spinner
import { TablePagination, ThemeProvider } from '@mui/material';
import paginationUITheme from '../../../utils/CustomPaginationUI';

import { useAppSelector, useAppDispatch } from '../../../hook/redux';

// ? Fonctions externes
import { fetchAllMembers } from '../../../store/reducer/members';

// ? Composants
import NotFound from '../../NotFound/NotFound';
import FilterBar from '../Layout/FilterBar/FilterBar';
import CardMember from '../Cards/CardMember/CardMember';

// ? Styles
import './style.scss';

// ? Interface globale
import { MemberI } from '../../../@types/interface';

// ? Fonction principale
function Members() {
  // ? States
  // Store
  const members: MemberI[] = useAppSelector((state) => state.members.list.data); // Variable members pour stocker les membres en provenance du store
  const loading = useAppSelector((state) => state.members.list.loading); // Variable loading pour stocker le statut de chargement des membres

  // local
  const [filteredMembers, setFilteredMembers] = useState<MemberI[]>(members); // Variable filteredMembers pour stocker les membres filtrés en provenance du composant FilterBar
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // ? Dispatch
  const dispatch = useAppDispatch();

  // ? useEffect
  // useEffect pour récupérer les membres
  useEffect(() => {
    dispatch(fetchAllMembers());
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

  // Si la liste des membres est vide, on affiche une erreur serveur
  if (members.length === 0) {
    return (
      <NotFound
        errorMessage="Désolé, le serveur ne répond pas"
        errorStatus={500}
      />
    );
  }

  // ? Rendu JSX
  return (
    <div className="Members">
      <ThemeProvider theme={paginationUITheme}>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          labelRowsPerPage="Résultats par page"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} sur ${count !== -1 ? count : `plus de ${to}`}`
          }
          count={filteredMembers.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </ThemeProvider>
      {/**
       * //! FilterBar.tsx
       * @param {Array} members - Liste des membres
       * @param {Function} setFilteredMembers - Fonction pour mettre à jour la liste des membres filtrés
       * On envoie au composant la liste des membres
       * On envoie au composant la fonction pour mettre à jour la liste des membres filtrés
       */}
      <FilterBar members={members} setFilteredMembers={setFilteredMembers} />
      <h2 className="Members--title">Tous les membres</h2>
      {filteredMembers.length === 0 && (
        <p className="noResult">Aucun résultat pour vos critères</p>
      )}

      <div className="Members--containerCard">
        {/* On map sur la liste en retour de la barre de recherche pour les cartes members */}
        {filteredMembers
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((member: MemberI) => (
            /** //! CardMember.tsx
             * @param {Object} member - Données du membre
             * @param {Number} key - Clé unique pour chaque membre
             * On envoie au composant CardMember les données de chaque membre
             * et une clé unique
             */
            <CardMember key={member.id} member={member} />
          ))}
      </div>
    </div>
  );
}

export default Members;
