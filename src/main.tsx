// ? Librairie
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';

// ? Composants
import store from './store';
import Router from './routes/router';

// ? Styles
import './styles/index.scss';

// ? Fonction root
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// ? Rendu
root.render(
  <Provider store={store}>
    <RouterProvider router={Router} />
  </Provider>
);
