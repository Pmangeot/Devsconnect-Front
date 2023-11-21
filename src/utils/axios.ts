/* eslint-disable prefer-promise-reject-errors */
import axios from 'axios';
import logout from '../store/actions/logout';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:4000',
  headers: {
    'content-type': 'application/json',
  },
});

// On définit et exporte une variable pour gérer les erreurs
// Elle sera utilisée dans les actions asynchrones"
export let axError = null;

// Intercepteur pour la gestion des erreurs
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    axError = error;
    if (error.response) {
      // La requête a reçu une réponse avec un code d'erreur (4xx, 5xx)
      const { status, data, config } = error.response;
      console.log(error.response);
      let errorMessage = 'Une erreur est survenue';

      if (status === 404) {
        errorMessage = 'La ressource demandée est introuvable';
      } else if (status === 500) {
        errorMessage = 'Erreur interne du serveur';
      }

      return Promise.reject({ message: errorMessage, data, config });
    }
    if (error.request) {
      // La requête n'a pas reçu de réponse (pas de connexion réseau, par exemple)
      return Promise.reject({
        message: 'No response received',
        request: error.request,
      });
    }
    // Une erreur s'est produite lors de la configuration de la requête
    return Promise.reject({
      message: 'Error setting up the request',
      config: error.config,
    });
  }
);

// ? Intercepteur pour gérer le jeton
axiosInstance.interceptors.request.use(
  // On ajoute le jeton d'authentification provenant du local storage dans le header de la requête
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ? Intercepteur pour gérer le rafraîchissement du jeton
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const originalRequest = axError.config;

    // Vérifie si la requête a échoué avec une erreur 401 (jeton expiré)
    if (
      axError.response &&
      axError.response.status === 401 &&
      !originalRequest.retry
    ) {
      // On indique que la requête a déjà été tentée
      originalRequest.retry = true;

      return (
        axiosInstance
          .post(`/refresh-token`, {
            refreshToken: localStorage.getItem('refreshToken'),
          })
          // On récupère la réponse
          .then((response) => {
            // Si la réponse est un succès
            if (response.status === 200) {
              // On récupère le nouveau jeton et le nouveau jeton de rafraîchissement
              const newAccessToken = response.data.data.accessToken;
              const { refreshToken } = response.data.data;
              // On met à jour le local storage
              localStorage.clear();
              localStorage.setItem('accessToken', newAccessToken);
              localStorage.setItem('refreshToken', refreshToken);
              // On met à jour le header de la requête avec le nouveau jeton
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

              // On renvoie la requête avec le nouveau jeton
              return axiosInstance(originalRequest);
            }
          })
          .catch((error) => {
            logout();
          })
      );
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
