/* eslint-disable @typescript-eslint/no-restricted-imports */
// Pour ne pas avoir à importer les types de redux à chaque fois qu'on veut créer une action ou un reducer, on peut créer un fichier qui va les importer et les exporter automatiquement.

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store'; //! Modifier le chemin du store

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
