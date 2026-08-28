import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';

interface Props {
  // Definimos qué roles permitimos en la ruta
  allowedRoles: Array<'ADMIN_ROLE' | 'WORKER_ROLE' | 'CONSUMER_ROLE'>;
}

export const RoleGuard = ({ allowedRoles }: Props) => {
  const { usuario, status } = useContext(AuthContext);

  if (status === 'checking') {
    return <p>Verificando credenciales...</p>;
  }

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(usuario.rol)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};