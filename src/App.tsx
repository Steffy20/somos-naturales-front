import { AppRouter } from './routes/AppRouter';

export const App = () => {
  return (
    <div className="main-app-container">
      {/* Aquí se renderizarán los diferentes Homes según el rol */}
      <AppRouter />
    </div>
  );
};