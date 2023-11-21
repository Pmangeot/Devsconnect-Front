// ? Librairies
import { createReducer } from '@reduxjs/toolkit';

// ? Fonctions externes
import loginUser from '../actions/login';
import logout from '../actions/logout';

// ? Instance Axios
import axiosInstance from '../../utils/axios';

// ? Typage local
interface UserState {
  signin: {
    id: number | null;
    children?: string | null;
    status?: string | null;
  };
  login: {
    id: number | null;
    logged: boolean;
    pseudo: string | null;
    status?: string | null;
  };
}

// ? InitialState
export const initialState: UserState = {
  signin: {
    id: null,
    status: null,
  },
  login: {
    id: null,
    logged: false,
    pseudo: null,
    status: null,
  },
};

const userReducer = createReducer(initialState, (builder) => {
  builder

    //* Cas de la connexion réussie
    .addCase(loginUser.fulfilled, (state, action) => {
      const { logged, pseudo, userId } = action.payload.data; // On récupère les données de l'api, qu'on distribue dans le state
      state.login.logged = logged;
      state.login.pseudo = pseudo;
      state.login.id = userId;
    })

    //* Cas de la connexion échouée
    .addCase(loginUser.rejected, (state) => {
      state.login.logged = false;
      state.login.pseudo = null;
      state.login.id = null;
    })
    //* Cas de la connexion en cours
    .addCase(loginUser.pending, (state) => {
      state.login.logged = false;
      state.login.pseudo = null;
      state.login.id = null;
    })

    //* Cas de la déconnexion
    .addCase(logout, (state) => {
      state.login.logged = false;
      state.login.pseudo = null;
      state.login.id = null;

      //! à la déconnexion, on supprime le token
      delete axiosInstance.defaults.headers.common.Authorization;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    });
});

export default userReducer;
