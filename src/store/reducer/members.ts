// ? Librairies
import { createReducer, createAsyncThunk } from '@reduxjs/toolkit';

// ? Fonctions externes
import updateMember from '../actions/memberUpdate';
import deleteMember from '../actions/memberDelete';

// ? Instance Axios
import axiosInstance from '../../utils/axios';

// ? Typage global
import { MemberI } from '../../@types/interface';

interface MemberState {
  status?: string;
  list: {
    data: MemberI[];
    loading: boolean;
  };
  member: {
    data: MemberI | null;
    loading: boolean;
  };
}

// ? InitialState
export const initialState: MemberState = {
  // Liste des membres
  list: {
    data: [],
    loading: false,
  },
  // Un seul membre
  member: {
    data: null,
    loading: false,
  },
};

// ? Fonctions asynchrones
//* Rechercher tous les membres
export const fetchAllMembers = createAsyncThunk(
  'user/fetchAllMembers',
  async () => {
    try {
      const { data } = await axiosInstance.get('/api/users');
      // ? On retourne le state
      return data;
    } catch (error) {
      // Gérez les erreurs potentielles ici

      console.error('Error:', error);
      throw error;
    }
  }
);

//* Rechercher un seul membre
export const fetchOneMember = createAsyncThunk(
  'user/fetchOneMember',
  async (id: string) => {
    try {
      const { data } = await axiosInstance.get(`/api/users/${id}`);
      // ? On retourne le state
      return data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
);

// ? Reducer
const membersReducer = createReducer(initialState, (builder) => {
  builder
    //* Cas de la connexion réussie de fetchAllMembers
    .addCase(fetchAllMembers.fulfilled, (state, action) => {
      state.list.data = action.payload.data; // On modifie le state avec les données reçues
      state.list.loading = false; // Définir l'état de chargement sur false
    })
    //* Cas de la connexion échouée de fetchAllMembers
    .addCase(fetchAllMembers.rejected, (state) => {
      state.list.data = []; // On ne reçoit pas de données, on laisse un tableau vide
      state.list.loading = false; // Définir l'état de chargement sur false
    })
    //* Cas de la connexion en cours de fetchAllMembers
    .addCase(fetchAllMembers.pending, (state) => {
      state.list.loading = true; // Définir l'état de chargement sur true
    });

  builder
    //* Cas de la connexion réussie de fetchOneMember
    .addCase(fetchOneMember.fulfilled, (state, action) => {
      state.member.data = action.payload.data; // On modifie le state avec les données reçues
      state.member.loading = false; // Définir l'état de chargement sur false
    })
    //* Cas de la connexion échouée de fetchOneMember
    .addCase(fetchOneMember.rejected, (state) => {
      state.member.data = null; // On ne reçoit pas de données, on laisse null
      state.member.loading = false; // Définir l'état de chargement sur false
    })
    //* Cas de la connexion en cours de fetchOneMember
    .addCase(fetchOneMember.pending, (state) => {
      state.member.loading = true; // Définir l'état de chargement sur true
    });
  builder
    //* Cas de la connexion réussie de updateMember
    .addCase(updateMember.fulfilled, (state, action) => {
      state.member.loading = false; // Définir l'état de chargement sur false
      state.member.data = action.payload.data;
    })
    //* Cas de la connexion échouée de updateMember
    .addCase(updateMember.rejected, (state) => {
      state.member.loading = false; // Définir l'état de chargement sur false
    })
    //* Cas de la connexion en cours de updateMember
    .addCase(updateMember.pending, (state) => {
      state.member.loading = true; // Définir l'état de chargement sur true
    });
  builder
    //* Cas de la connexion réussie de deleteMember
    .addCase(deleteMember.fulfilled, (state, action) => {
      state.member.loading = false; // Définir l'état de chargement sur false
    })
    //* Cas de la connexion échouée de deleteMember
    .addCase(deleteMember.rejected, (state, action) => {
      state.member.loading = false; // Définir l'état de chargement sur false
    })
    //* Cas de la connexion en cours de deleteMember
    .addCase(deleteMember.pending, (state) => {
      state.member.loading = true; // Définir l'état de chargement sur true
    });
});

export default membersReducer;
