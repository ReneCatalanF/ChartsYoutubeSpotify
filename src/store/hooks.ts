import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './index'; // Importa tus tipos RootState y AppDispatch

// Exporta un hook useDispatch tipado. Úsalo en toda tu app en lugar del useDispatch estándar.
export const useAppDispatch: () => AppDispatch = useDispatch;

// Exporta un hook useSelector tipado. Úsalo en toda tu app en lugar del useSelector estándar.
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;