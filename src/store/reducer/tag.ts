// ? Librairies
import { createReducer, createAsyncThunk } from '@reduxjs/toolkit';

// ? Instance Axios
import axiosInstance from '../../utils/axios';

// ? Typage global
import { TagI } from '../../@types/interface';

// ? Typage local
interface TagState {
  status?: string;
  list: {
    data: [];
  };
  tag: {
    data: TagI | null;
  };
}

// ? InitialState
export const initialState: TagState = {
  // Liste des tags
  list: {
    data: [],
  },
  // Un seul tag
  tag: {
    data: null,
  },
};

// ? Fonctions asynchrones
//* Rechercher tous les tags
export const fetchAllTags = createAsyncThunk('tag/fetchAllTags', async () => {
  try {
    const { data } = await axiosInstance.get('/api/tags');
    // ? On retourne le state
    return data;
  } catch (error) {
    // Gérez les erreurs potentielles ici
    console.error('Error:', error);
    throw error;
  }
});

//* Rechercher un seul tag
export const fetchOneTag = createAsyncThunk(
  'tag/fetchOneTag',
  async (id: string) => {
    try {
      const { data } = await axiosInstance.get(`/api/tags/${id}`);
      // ? On retourne le state
      return data;
    } catch (error) {
      // Gérez les erreurs potentielles ici
      console.error('Error:', error);
      throw error;
    }
  }
);

const tagReducer = createReducer(initialState, (builder) => {
  builder
    //* Cas de la connexion réussie de fetchAllTags
    .addCase(fetchAllTags.fulfilled, (state, action) => {
      state.list.data = action.payload.data; // On modifie le state avec les données reçues
    })
    //* Cas de la connexion échouée de fetchAllTags
    .addCase(fetchAllTags.rejected, (state) => {
      state.list.data = []; // On ne reçoit pas de données, on laisse un tableau vide
    });

  //* Cas de la connexion réussie de fetchOneMember
  builder
    .addCase(fetchOneTag.fulfilled, (state, action) => {
      state.tag.data = action.payload.data; // On modifie le state avec les données reçues
    })
    //* Cas de la connexion échouée de fetchOneMember
    .addCase(fetchOneTag.rejected, (state) => {
      state.tag.data = null; // On ne reçoit pas de données, on laisse null
    });
});

export default tagReducer;
