// ? Librairies
import { createAction, createReducer } from '@reduxjs/toolkit';

// ? Fonctions externe
import loginUser from '../actions/login';
import signinUser from '../actions/memberCreate';
import logout from '../actions/logout';
import updateMember from '../actions/memberUpdate';
import deleteMember from '../actions/memberDelete';
import ProjectAddMember from '../actions/ProjectAddMember';
import ProjectRemoveMember from '../actions/ProjectRemoveMember';
import createProject from '../actions/projectCreate';
import updateProject from '../actions/projectUpdate';
import deleteProject from '../actions/projectDelete';
import ProjectAcceptMember from '../actions/ProjectAcceptMember';
import ProjectDeleteMember from '../actions/ProjectDeleteMember';

// ? Typage global
import { FlashI } from '../../@types/interface';

// ? Typage local

export interface MainState {
  windowWidth: number;
  flash?: FlashI | null;
  pseudo?: string | null;
}

// ? InitialState
const initialState: MainState = {
  windowWidth: window.innerWidth,
  flash: null,
  pseudo: null,
};

// ? Fonctions synchrone

export const resizeWindow = createAction('main/resizeWindow');

export const updateFlash = createAction<FlashI>('main/updateFlash');

//* Réinitialisation du message
export const resetMessage = createAction('main/resetMessage');

// ? Reducer
const mainReducer = createReducer(initialState, (builder) => {
  builder.addCase(resizeWindow, (state) => {
    state.windowWidth = window.innerWidth; // Modifie la valeur du state
  });

  builder
    //* Cas de la réinitialisation du message
    .addCase(resetMessage, (state) => {
      state.flash = null;
    })
    //* Cas de la mise à jour du message
    .addCase(updateFlash, (state, action) => {
      state.flash = action.payload;
    })
    //* Cas de la connexion réussie
    .addCase(loginUser.fulfilled, (state, action) => {
      const { pseudo } = action.payload.data; // On récupère les données de l'api, qu'on distribue dans le state

      state.pseudo = pseudo;

      state.flash = {
        type: 'success',
        children: `Bienvenue ${pseudo} !`,
      };
    })
    //* Cas de la connexion échouée
    .addCase(loginUser.rejected, (state) => {
      state.flash = {
        type: 'error',
        children: 'Pseudo ou mot de passe incorrect',
      };
    })

    //* Cas de la déconnexion
    .addCase(logout, (state) => {
      state.flash = {
        type: 'success',
        children: 'Au revoir !',
      };
      state.pseudo = null;
    })

    //* Cas de l'inscription réussie
    .addCase(signinUser.fulfilled, (state) => {
      state.flash = {
        type: 'success',
        children: 'Vous êtes bien inscrit, vous pouvez vous connecter !',
      };
    });

  //* Cas de la mise à jour du membre réussie
  builder.addCase(updateMember.fulfilled, (state) => {
    state.flash = {
      type: 'success',
      children: 'Les changements ont bien été pris en compte !',
    };
  });

  //* Cas de la suppression du membre réussie
  builder.addCase(deleteMember.fulfilled, (state) => {
    state.flash = {
      type: 'success',
      children: 'Le compte a bien été supprimé !',
    };
  });

  //* Cas de la suppression du membre échouée
  builder.addCase(deleteMember.rejected, (state) => {
    state.flash = {
      type: 'error',
      children: 'Une erreur est survenue, veuillez réessayer plus tard !',
    };
  });

  //* Cas de l'ajout d'un membre à un projet réussie
  builder.addCase(ProjectAddMember.fulfilled, (state) => {
    state.flash = {
      type: 'success',
      children: "Votre demande d'ajout est bien prise en compte !",
    };
  });

  //* Cas de la suppression d'un membre à un projet réussie
  builder.addCase(ProjectRemoveMember.fulfilled, (state) => {
    state.flash = {
      type: 'success',
      children: 'Vous ne faites plus parti du projet !',
    };
  });

  //* Cas de la création d'un projet réussie
  builder.addCase(createProject.fulfilled, (state) => {
    state.flash = {
      type: 'success',
      children: 'Le projet a bien été créé !',
    };
  });

  //* Cas de la création d'un projet échouée
  builder.addCase(createProject.rejected, (state) => {
    state.flash = {
      type: 'error',
      children: 'Une erreur est survenue, veuillez réessayer plus tard !',
    };
  });

  //* Cas de la mise à jour d'un projet réussie
  builder.addCase(updateProject.fulfilled, (state) => {
    state.flash = {
      type: 'success',
      children: 'Le projet a bien été mis à jour !',
    };
  });

  //* Cas de la mise à jour d'un projet échouée
  builder.addCase(updateProject.rejected, (state) => {
    state.flash = {
      type: 'error',
      children: 'Une erreur est survenue, veuillez réessayer plus tard !',
    };
  });

  //* Cas de la suppression d'un projet réussie
  builder.addCase(deleteProject.fulfilled, (state) => {
    state.flash = {
      type: 'success',
      children: 'Le projet a bien été supprimé !',
    };
  });

  //* Cas de la suppression d'un projet échouée
  builder.addCase(deleteProject.rejected, (state) => {
    state.flash = {
      type: 'error',
      children: 'Une erreur est survenue, veuillez réessayer plus tard !',
    };
  });

  //* Cas de l'acceptation d'un membre à un projet réussie
  builder.addCase(ProjectAcceptMember.fulfilled, (state) => {
    state.flash = {
      type: 'success',
      children: 'Le membre a bien été ajouté au projet !',
    };
  });

  //* Cas de l'acceptation d'un membre à un projet échouée
  builder.addCase(ProjectAcceptMember.rejected, (state) => {
    state.flash = {
      type: 'error',
      children: 'Une erreur est survenue, veuillez réessayer plus tard !',
    };
  });

  //* Cas de la suppression d'un membre à un projet réussie
  builder.addCase(ProjectDeleteMember.fulfilled, (state) => {
    state.flash = {
      type: 'success',
      children: 'Le membre a bien été supprimé du projet !',
    };
  });

  //* Cas de la suppression d'un membre à un projet échouée
  builder.addCase(ProjectDeleteMember.rejected, (state) => {
    state.flash = {
      type: 'error',
      children: 'Une erreur est survenue, veuillez réessayer plus tard !',
    };
  });
});

export default mainReducer;
