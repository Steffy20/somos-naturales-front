import { useNavigate } from 'react-router-dom';

export const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1 style={{ color: 'red' }}>403 - Acceso Denegado</h1>
      <p>No tienes los permisos necesarios para ver esta sección.</p>
      <button 
        onClick={() => navigate('/')}
        style={{ padding: '10px 20px', cursor: 'pointer' }}
      >
        Volver a mi inicio
      </button>
    </div>
  );
};