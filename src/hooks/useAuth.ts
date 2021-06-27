import { useContext } from 'react';
import { authContext } from '../contexts/AuthContext';

export const useAuth = () => {
  const value = useContext(authContext);
  return value;
};
