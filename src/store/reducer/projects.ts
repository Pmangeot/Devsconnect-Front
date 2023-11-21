// ? Librairies
import { createReducer, createAsyncThunk } from '@reduxjs/toolkit';

// ? Fonctions externes
import projectCreate from '../actions/projectCreate';
import updateProject from '../actions/projectUpdate';
import projectDelete from '../actions/projectDelete';
import ProjectAddMember from '../actions/ProjectAddMember';
import ProjectRemoveMember from '../actions/ProjectRemoveMember';

// ? Instance Axios
import axiosInstance from '../../utils/axios';

// ? Typage global
import { ProjectI } from '../../@types/interface';

interface ProjectState {
  status?: string;
  list: {
    data: ProjectI[];
    loading: boolean;
  };
  project: {
    data: ProjectI | null;
    loading: boolean;
  };
}

// ? InitialState
export const initialState: ProjectState = {
  // Liste des projets
  list: {
    data: [],
    loading: false,
  },
  // Un seul projet
  project: {
    data: null,
    loading: false,
  },
};

// ? Fonctions asynchrones
//* Rechercher tous les projets
export const fetchAllProjects = createAsyncThunk(
  'project/fetchAllProjects',
  async () => {
    try {
      const { data } = await axiosInstance.get('/api/projects');
      // ? On retourne le state
      return data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
);

//* Rechercher un seul projet
export const fetchOneProject = createAsyncThunk(
  'project/fetchOneProject',
  async (id: string) => {
    try {
      const { data } = await axiosInstance.get(`/api/projects/${id}`);
      // ? On retourne le state
      return data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
);

// ? Reducer
const projectsReducer = createReducer(initialState, (builder) => {
  builder
    //* Cas de la connexion réussie de fetchAllProjects
    .addCase(fetchAllProjects.fulfilled, (state, action) => {
      state.list.data = action.payload.data;
      state.list.loading = false;
    })
    //* Cas de la connexion échouée de fetchAllProjects
    .addCase(fetchAllProjects.rejected, (state) => {
      state.list.data = [];
      state.list.loading = false;
    })
    //* Cas de la connexion en cours de fetchAllProjects
    .addCase(fetchAllProjects.pending, (state) => {
      state.list.loading = true;
    });

  builder
    //* Cas de la connexion réussie de fetchOneProject
    .addCase(fetchOneProject.fulfilled, (state, action) => {
      state.project.data = action.payload.data;
      state.project.loading = false;
    })
    //* Cas de la connexion échouée de fetchOneProject
    .addCase(fetchOneProject.rejected, (state) => {
      state.project.data = null;
      state.project.loading = false;
    })
    //* Cas de la connexion en cours de fetchOneProject
    .addCase(fetchOneProject.pending, (state) => {
      state.project.loading = true;
    });

  builder
    //* Cas de la connexion réussie de projectCreate
    .addCase(projectCreate.fulfilled, (state, action) => {
      state.project.data = action.payload;
      state.project.loading = false;
    })
    //* Cas de la connexion échouée de projectCreate
    .addCase(projectCreate.rejected, (state) => {
      state.project.loading = false;
    })
    //* Cas de la connexion en cours de projectCreate
    .addCase(projectCreate.pending, (state) => {
      state.project.loading = true;
    });

  builder
    //* Cas de la connexion réussie de projectUpdate
    .addCase(updateProject.fulfilled, (state, action) => {
      state.project.data = action.payload;
      state.project.loading = false;
    })
    //* Cas de la connexion échouée de projectUpdate
    .addCase(updateProject.rejected, (state) => {
      state.project.loading = false;
    })
    //* Cas de la connexion en cours de projectUpdate
    .addCase(updateProject.pending, (state) => {
      state.project.loading = true;
    });

  builder
    //* Cas de la connexion réussie de projectDelete
    .addCase(projectDelete.fulfilled, (state) => {
      state.project.loading = false;
    })
    //* Cas de la connexion échouée de projectDelete
    .addCase(projectDelete.rejected, (state) => {
      state.project.loading = false;
    })
    //* Cas de la connexion en cours de projectDelete
    .addCase(projectDelete.pending, (state) => {
      state.project.loading = true;
    });

  builder
    //* Cas de la connexion réussie de ProjectAddMember
    .addCase(ProjectAddMember.fulfilled, (state, action) => {
      const { userId } = action.payload;
      const { project } = state.list;
      if (project) {
        if (!project.users) {
          project.users = []; // Assurez-vous que la propriété `users` est initialisée comme un tableau vide si elle n'existe pas
        }
        project.users.push({ id: userId });
      }
    })
    //* Cas de la connexion échouée de ProjectAddMember
    .addCase(ProjectAddMember.rejected, (state) => {
      state.project.loading = false;
    })
    //* Cas de la connexion en cours de ProjectAddMember
    .addCase(ProjectAddMember.pending, (state) => {
      state.project.loading = true;
    })
    //* Cas de la connexion réussie de ProjectRemoveMember
    .addCase(ProjectRemoveMember.fulfilled, (state, action) => {
      const { userId } = action.payload;
      const { project } = state.list;
      if (project) {
        if (!project.users) {
          project.users = []; // Assurez-vous que la propriété `users` est initialisée comme un tableau vide si elle n'existe pas
        }
        project.users = project.users.filter((user) => user.id !== userId);
      }
    })
    //* Cas de la connexion échouée de ProjectRemoveMember
    .addCase(ProjectRemoveMember.rejected, (state) => {
      state.project.loading = false;
    })
    //* Cas de la connexion en cours de ProjectRemoveMember
    .addCase(ProjectRemoveMember.pending, (state) => {
      state.project.loading = true;
    });
});

export default projectsReducer;
