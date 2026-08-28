import { useContext, useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthProvider';
import { CartContext } from '../../context/CartContext';
import { CartSidebar } from './CartSidebar';
import {
    IoFastFoodOutline,
    IoCartOutline,
    IoLogOutOutline,
    IoStatsChartOutline,
    IoClipboardOutline,
    IoHomeOutline,
    IoLogInOutline,
    IoPersonAddOutline,
    IoAddCircleOutline,
    IoReceiptOutline
} from "react-icons/io5";

// 1. Definimos una interfaz para que TS sepa qué es opcional
interface NavItemProps {
    to?: string;
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
    badge?: number;
    animate?: boolean;
}

const NavItem = ({ 
    to = "", 
    icon, 
    label, 
    onClick, // Quitamos el valor por defecto aquí para poder validar si existe
    badge = 0, 
    animate = false 
}: NavItemProps) => {
    const activeClass = "text-white scale-110 font-bold border-b-2 border-white pb-1";
    const inactiveClass = "text-orange-100 hover:text-white transition-all duration-300";

    const content = (
        <div className={`flex flex-col md:flex-row items-center gap-1 md:gap-2 ${animate ? 'scale-110' : ''}`}>
            <div className="relative text-2xl md:text-xl">
                {icon}
                {badge > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-black rounded-full h-4 w-4 flex items-center justify-center border border-white animate-pulse">
                        {badge}
                    </span>
                )}
            </div>
            <span className="text-[9px] md:text-xs font-black uppercase tracking-tighter">
                {label}
            </span>
        </div>
    );

    // Si hay un onClick y NO hay un "to", renderizamos botón
    if (onClick && !to) {
        return (
            <button type="button" onClick={onClick} className={inactiveClass}>
                {content}
            </button>
        );
    }

    // De lo contrario, renderizamos el link
    return (
        <NavLink to={to} className={({ isActive }) => isActive ? activeClass : inactiveClass}>
            {content}
        </NavLink>
    );
};

export const Navbar = () => {
    const { usuario, status, logout } = useContext(AuthContext);
    const { cart } = useContext(CartContext);
    const navigate = useNavigate();
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [animateCart, setAnimateCart] = useState(false);

    useEffect(() => {
        if (cart.length === 0) return;
        setAnimateCart(true);
        const timer = setTimeout(() => setAnimateCart(false), 300);
        return () => clearTimeout(timer);
    }, [cart.length]);

    return (
        <>
            <nav className="fixed top-0 w-full z-50 bg-orange-500 h-20 flex items-center shadow-[0_4px_20px_rgba(0,0,0,0.1)] px-4 transition-all border-b border-orange-600/20">
                <div className="container mx-auto flex justify-between items-center">

                    <div className="flex items-center cursor-pointer group" onClick={() => navigate('/')}>
                        <img
                            src="/logo.png"
                            alt="Logo"
                            className="h-14 w-auto object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-md"
                        />
                    </div>

                    <div className="hidden md:flex items-center gap-6">
                        {status !== 'authenticated' ? (
                            <>
                                <NavItem to="/" icon={<IoHomeOutline />} label="Inicio" />
                                <NavItem to="/login" icon={<IoLogInOutline />} label="Ingresar" />
                                <NavLink to="/register" className="bg-white text-orange-500 px-6 py-2 rounded-full font-black hover:bg-orange-50 transition-all text-xs uppercase shadow-sm">
                                    Registrarse
                                </NavLink>
                            </>
                        ) : (
                            <>
                                {usuario?.rol === 'ADMIN_ROLE' && (
                                    <>
                                        <NavItem to="/admin" icon={<IoStatsChartOutline />} label="Panel" />
                                        <NavItem to="/crearworker" icon={<IoStatsChartOutline />} label="Crear Trabajador" />
                                        <NavItem to="/adminmanage" icon={<IoStatsChartOutline />} label="Administracion" />
                                        <NavItem to="/adminprofile" icon={<IoStatsChartOutline />} label="Perfil" />
                                    </>
                                )}

                                {usuario?.rol === 'WORKER_ROLE' && (
                                    <>
                                        <NavItem to="/worker" icon={<IoClipboardOutline />} label="Comandas" />
                                        <NavItem to="/addproducts" icon={<IoAddCircleOutline />} label="Agregar" />
                                        <NavItem to="/gestionproduct" icon={<IoAddCircleOutline />} label="Gestionar" />
                                        <NavItem to="/profileworker" icon={<IoAddCircleOutline />} label="Perfil" />
                                    </>
                                )}

                                {usuario?.rol === 'CONSUMER_ROLE' && (
                                    <>
                                        <NavItem to="/home" icon={<IoHomeOutline />} label="Home" />
                                        <NavItem to="/catalogo" icon={<IoFastFoodOutline />} label="Menú" />
                                        <NavItem to="/getproducts" icon={<IoReceiptOutline />} label="Mis Pedidos" />
                                        <NavItem to="/profileconsumer" icon={<IoReceiptOutline />} label="Perfil" />
                                        <NavItem
                                            icon={<IoCartOutline />}
                                            label="Carrito"
                                            badge={cart.length}
                                            onClick={() => setIsCartOpen(true)}
                                            animate={animateCart}
                                        />
                                    </>
                                )}

                                <button
                                    onClick={() => { logout(); navigate('/login'); }}
                                    className="flex items-center gap-2 text-white/80 hover:text-white font-black text-[10px] ml-4 border-l border-white/20 pl-4 transition-colors"
                                >
                                    <IoLogOutOutline size={18} /> SALIR
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-orange-500 border-t border-orange-600 px-2 py-3 z-50 flex justify-around items-center shadow-[0_-5px_20px_rgba(0,0,0,0.1)] pb-5">
                {status !== 'authenticated' ? (
                    <>
                        <NavItem to="/" icon={<IoHomeOutline />} label="Inicio" />
                        <NavItem to="/login" icon={<IoLogInOutline />} label="Entrar" />
                        <NavItem to="/register" icon={<IoPersonAddOutline />} label="Registro" />
                    </>
                ) : (
                    <>
                        {usuario?.rol === 'CONSUMER_ROLE' && (
                            <>
                                <NavItem to="/home" icon={<IoHomeOutline />} label="Inicio" />
                                <NavItem to="/catalogo" icon={<IoFastFoodOutline />} label="Menú" />
                                <NavItem to="/getproducts" icon={<IoReceiptOutline />} label="Pedidos" />
                                <NavItem
                                    icon={<IoCartOutline />}
                                    label="Carrito"
                                    badge={cart.length}
                                    onClick={() => setIsCartOpen(true)}
                                    animate={animateCart}
                                />
                            </>
                        )}

                        {(usuario?.rol === 'WORKER_ROLE' || usuario?.rol === 'ADMIN_ROLE') && (
                             <NavItem 
                                label="Salir" 
                                icon={<IoLogOutOutline />} 
                                onClick={() => { logout(); navigate('/login'); }} 
                            />
                        )}
                    </>
                )}
            </div>

            <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            <div className="h-20 w-full"></div>
            <div className="h-20 md:hidden w-full"></div>
        </>
    );
};