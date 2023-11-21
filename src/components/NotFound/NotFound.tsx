// ? Librairies
import { useEffect } from 'react';

// ? Instance Axios
import axiosInstance from '../../utils/axios';

// ? Style
import './style.scss';

// ? Interface locale
interface NotFoundI {
  errorMessage: string;
  errorStatus: number | string;
}

// ? Fonction principale
function NotFound({ errorMessage, errorStatus }: NotFoundI) {
  return (
    <div className="not-found">
      <h1>Error {errorStatus}</h1>
      <p>{errorMessage}</p>
    </div>
  );
}

export default NotFound;
