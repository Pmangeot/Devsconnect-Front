// ? Librairie
import { configureStore } from '@reduxjs/toolkit';

// ? Reducer
import mainReducer from './reducer/main';
import userReducer from './reducer/user';
import logReducer from './reducer/log';
import membersReducer from './reducer/members';
import tagReducer from './reducer/tag';
import projectsReducer from './reducer/projects';
import ajaxReducer from './reducer/ajax';

// ? Fonction qui permet de créer le store
const store = configureStore({
  // Liste des reducers
  reducer: {
    main: mainReducer,
    user: userReducer,
    log: logReducer,
    members: membersReducer,
    tag: tagReducer,
    projects: projectsReducer,
    ajax: ajaxReducer,
  },
});

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
// Je déduis le type `RootState` et `AppDispatch` depuis le store lui même
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
