// ? Librairies
import { createAction, createReducer } from '@reduxjs/toolkit';

// ? Fonctions externes
import signinUser from '../actions/memberCreate';
import updateMember from '../actions/memberUpdate';

// ? Typage local
interface LogState {
  isEditMode: boolean;
  modalLogin: boolean;
  modalSignin: boolean;
  modalDelete: boolean;
  modalPassword: boolean;
  modalDeleteProject: boolean;
}

// ? InitialState
const initialState: LogState = {
  isEditMode: false,
  modalLogin: false,
  modalSignin: false,
  modalDelete: false,
  modalPassword: false,
  modalDeleteProject: false,
};

// ? Fonctions synchrone
export const toggleEditMode = createAction('log/toggleEditMode');
export const toggleModalLogin = createAction('log/toggleModalLogin');
export const toggleModalSignin = createAction('log/toggleModalSignin');
export const toggleModalDelete = createAction('log/toggleModalDelete');
export const toggleModalPassword = createAction('log/toggleModalPassword');
export const toggleModalDeleteProject = createAction(
  'log/toggleModalDeleteProject'
);

// ? Reducer
const logReducer = createReducer(initialState, (builder) => {
  builder
    //* Cas du clic sur le bouton de connexion
    .addCase(toggleModalLogin, (state) => {
      state.modalLogin = !state.modalLogin; // Inverse la valeur du state
      state.modalSignin = false; // Remet la valeur du state signin à false
    })
    //* Cas du clic sur le bouton d'inscription
    .addCase(toggleModalSignin, (state) => {
      state.modalSignin = !state.modalSignin; // Inverse la valeur du state
      state.modalLogin = false; // Remet la valeur du state login à false
    })

    //* Cas du clic sur le bouton de suppression
    .addCase(toggleModalDelete, (state) => {
      state.modalDelete = !state.modalDelete; // Inverse la valeur du state
    })
    //* Cas du clic sur le bouton de modification du mot de passe
    .addCase(toggleModalPassword, (state) => {
      state.modalPassword = !state.modalPassword; // Inverse la valeur du state
    })
    //* Cas du clic sur le bouton d'édition
    .addCase(toggleEditMode, (state) => {
      state.isEditMode = !state.isEditMode; // Inverse la valeur du state
    })

    //* Cas de l'inscription échouée
    .addCase(signinUser.rejected, (state) => {
      state.modalSignin = true;
    })

    //* Cas de l'update de membre échouée
    .addCase(updateMember.rejected, (state) => {
      state.isEditMode = true;
    })

    //* Cas du clic sur le bouton de suppression de projet
    .addCase(toggleModalDeleteProject, (state) => {
      state.modalDeleteProject = !state.modalDeleteProject; // Inverse la valeur du state
    });
});

export default logReducer;
