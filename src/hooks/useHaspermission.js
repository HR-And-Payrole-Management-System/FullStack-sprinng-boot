import { useAuth } from '../context/AuthContext';

export function useHasPermission(permission) {
  const { hasPermission, hasRole } = useAuth();
  return hasRole('ADMIN') || hasPermission(permission);
}