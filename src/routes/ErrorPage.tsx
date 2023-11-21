// ? Librairies
import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

// ? Composants
import NotFound from '../components/NotFound/NotFound';
import Header from '../components/App/Layout/Header/Header';
import Footer from '../components/App/Layout/Footer/Footer';

// ? Fonction principale
function ErrorPage() {
  // useRouteError() est un hook qui permet de récupérer l'erreur de la route
  const error = useRouteError();
  //* Même procédure pour le status
  function getStatus(e: unknown): number | string {
    if (isRouteErrorResponse(e)) {
      const { status } = e;
      if (status === 404) {
        return ['404', "Désolé, la page que vous demandez n'existe pas"];
      }
      return ['500', 'Désolé, une erreur est survenue'];
    }
    return ['500', 'Désolé, une erreur est survenue'];
  }
  const [errorStatus, errorMessage] = getStatus(error);
  // ? Rendu JSX
  return (
    // On retourne les props à un composant crée à part qui s'occupera du style et de l'integration dans notre appli
    <>
      <Header />
      <NotFound errorStatus={errorStatus} errorMessage={errorMessage} />
      <Footer />
    </>
  );
}

export default ErrorPage;
