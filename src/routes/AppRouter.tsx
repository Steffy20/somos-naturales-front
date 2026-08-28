import { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { RoleGuard } from '../routes/RoleGuard';
import { LoginPage } from '../pages/Login';
import { AuthContext } from '../context/AuthProvider';
import { Unauthorized } from '../pages/Unauthorized';
import { Navbar } from '../components/ui/NavBar';
import { HomePage } from '../pages/HomePage';
import { RegisterPage } from '../pages/RegisterPage';
import { CatalogoPage } from '../pages/consumer/CatalogoPage';
import { ConsumerHome } from '../pages/consumer/ConsumerHome';
import { UserStats } from '../pages/admin/AdminHome';
import { CrearProductoForm } from '../pages/worker/AgregarProductos';
import {  WorkerPanel  } from '../pages/worker/WorkerHome';
import { MisPedidos } from '../pages/consumer/VerOrden';
import { WorkerCreate } from '../pages/admin/CrearWorker';
import { UserManagement } from '../pages/admin/AdminManage';
import { AdminProfile } from '../pages/admin/EditAdminProfile';
import { WorkerProfile } from '../pages/worker/WorkerProfile';
import { CustomerProfile } from '../pages/consumer/ConsumerProfile';
import { GestionProductos } from '../pages/worker/GestionProductos';

// Vistas

export const AppRouter = () => {
    const { status, usuario } = useContext(AuthContext);

    if (status === 'checking') {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
                <h2>Verificando sesión...</h2>
            </div>
        );
    }

    return (
        <>
            {/* CAMBIO 1: El Navbar se muestra SIEMPRE independientemente del status */}
            <Navbar />

            {/* CAMBIO 2: Todo el contenido dentro de main-content para que el padding funcione */}
            <main className="main-content">
                <Routes>
                    {/* RUTA RAÍZ: Determina a dónde ir según el estado */}
                    <Route path="/" element={
                        status === 'authenticated'
                            ? (
                                usuario?.rol === 'ADMIN_ROLE' ? <Navigate to="/admin" /> :
                                usuario?.rol === 'WORKER_ROLE' ? <Navigate to="/worker" /> :
                                <Navigate to="/home" />
                            )
                            : <HomePage />
                    } />

                    {/* RUTAS PÚBLICAS: Accesibles con el Navbar público */}
                    <Route path="/login" element={
                        status === 'authenticated' ? <Navigate to="/" /> : <LoginPage />
                    } />

                    <Route path="/register" element={
                        status === 'authenticated' ? <Navigate to="/" /> : <RegisterPage />
                    } />

                    {/* RUTAS PROTEGIDAS */}
                    <Route element={<RoleGuard allowedRoles={['ADMIN_ROLE']} />}>
                        <Route path="/admin" element={<UserStats />} />
                        <Route path="/crearworker" element={<WorkerCreate />} />
                        <Route path="/adminmanage" element={<UserManagement />} />
                        <Route path="/adminprofile" element={<AdminProfile />} />
                    </Route>

                    <Route element={<RoleGuard allowedRoles={['WORKER_ROLE']} />}>
                        <Route path="/worker" element={<WorkerPanel />} />
                        <Route path="/addproducts" element={<CrearProductoForm />} />
                        <Route path="/gestionproduct" element={<GestionProductos />} />
                        
                        <Route path="/profileworker" element={<WorkerProfile />} />
                        
                    </Route>

                    <Route element={<RoleGuard allowedRoles={['CONSUMER_ROLE']} />}>
                        <Route path="/home" element={<ConsumerHome />} />
                        <Route path="/catalogo" element={<CatalogoPage />} />
                        <Route path="/getproducts" element={<MisPedidos />} />
                        <Route path="/profileconsumer" element={<CustomerProfile />} />
                    </Route>

                    <Route path="/unauthorized" element={<Unauthorized />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </main>
        </>
    );
};