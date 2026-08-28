import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthProvider';
import SomosNaturales from '../../api/somosNaturalesApi';
import Swal from 'sweetalert2';
import { 
    IoPersonCircleOutline, IoSaveOutline, IoMailOutline, 
    IoKeyOutline, IoBriefcaseOutline, IoBagOutline 
} from 'react-icons/io5';

export const WorkerProfile = () => {
    const { usuario } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        nombre: usuario?.nombre || '',
        correo: usuario?.correo || '',
        password: '' 
    });

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const data = { ...formData };
        if (!data.password.trim()) delete (data as any).password;

        try {
            await SomosNaturales.put(`/usuarios/${usuario?.uid}`, data);
            Swal.fire({
                title: 'Perfil Actualizado',
                text: 'Tus credenciales de staff han sido sincronizadas',
                icon: 'success',
                confirmButtonColor: '#3b82f6', 
                customClass: { popup: 'rounded-[2rem]' }
            });
        } catch (error) {
            Swal.fire('Error', 'No se pudo actualizar tu perfil de trabajador', 'error');
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 mt-12 pb-20 font-sans">
            
            {/* Header de Sección */}
            <div className="mb-10 text-center md:text-left">
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 uppercase italic tracking-tighter">
                    Staff <span className="text-blue-600">Portal</span>
                </h2>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mt-2 ml-1">
                    Gestión de cuenta de colaborador
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Lateral: Badge del Colaborador */}
                <div className="lg:col-span-4">
                    <div className="bg-white rounded-[3rem] p-8 text-center shadow-2xl shadow-blue-100 border border-blue-50 relative overflow-hidden group">
                        {/* Elemento Decorativo */}
                        <div className="absolute top-0 left-0 w-full h-2 bg-blue-600"></div>
                        
                        <div className="w-24 h-24 bg-blue-50 rounded-[2.5rem] mx-auto flex items-center justify-center text-blue-600 text-4xl shadow-inner mb-6 group-hover:scale-105 transition-transform duration-500">
                            <IoPersonCircleOutline size={60} />
                        </div>
                        
                        <h3 className="text-gray-900 font-black uppercase italic tracking-tight text-xl">
                            {usuario?.nombre}
                        </h3>
                        <div className="flex items-center justify-center gap-2 mt-2">
                            <IoBriefcaseOutline className="text-blue-500" size={14} />
                            <span className="text-[9px] font-black text-blue-600 uppercase italic tracking-widest">
                                Colaborador Activo
                            </span>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-100 space-y-3 text-[10px] font-bold uppercase text-gray-400 italic">
                            <div className="flex justify-between">
                                <span>Rango</span>
                                <span className="text-gray-800">Worker Staff</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Acceso</span>
                                <span className="text-gray-800">Operativo</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Principal: Formulario de Datos */}
                <div className="lg:col-span-8">
                    <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-gray-200 border border-gray-50">
                        <div className="flex items-center gap-3 mb-10">
                            <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-200">
                                <IoBagOutline size={24} />
                            </div>
                            <h4 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter">
                                Información Personal
                            </h4>
                        </div>

                        <form onSubmit={handleUpdate} className="space-y-8">
                            
                            {/* Input Nombre */}
                            <div className="relative group">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1 mb-2 block group-focus-within:text-blue-600 transition-colors">
                                    Nombre del Empleado
                                </label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        className="w-full bg-gray-50 border-2 border-transparent rounded-2xl py-4 px-6 font-bold text-gray-800 focus:bg-white focus:border-blue-600 outline-none transition-all shadow-sm"
                                        value={formData.nombre}
                                        onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                                    />
                                </div>
                            </div>

                            {/* Input Correo */}
                            <div className="relative group">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1 mb-2 block group-focus-within:text-blue-600 transition-colors">
                                    Correo Institucional
                                </label>
                                <div className="relative">
                                    <IoMailOutline className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" size={20} />
                                    <input 
                                        type="email" 
                                        className="w-full bg-gray-50 border-2 border-transparent rounded-2xl py-4 px-6 font-bold text-gray-800 focus:bg-white focus:border-blue-600 outline-none transition-all shadow-sm"
                                        value={formData.correo}
                                        onChange={(e) => setFormData({...formData, correo: e.target.value})}
                                    />
                                </div>
                            </div>

                            {/* Input Password */}
                            <div className="relative group">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1 mb-2 block group-focus-within:text-blue-600 transition-colors">
                                    Nueva Contraseña
                                </label>
                                <div className="relative">
                                    <IoKeyOutline className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" size={20} />
                                    <input 
                                        type="password" 
                                        className="w-full bg-gray-50 border-2 border-transparent rounded-2xl py-4 px-6 font-bold text-gray-800 focus:bg-white focus:border-blue-600 outline-none transition-all shadow-sm placeholder:text-gray-300"
                                        placeholder="Dejar vacío para no cambiar"
                                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    />
                                </div>
                            </div>

                            {/* Botón de Acción */}
                            <button className="w-full bg-blue-600 hover:bg-gray-900 text-white rounded-2xl py-5 font-black uppercase italic tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-100 active:scale-[0.98] group">
                                <IoSaveOutline size={22} className="group-hover:rotate-12 transition-transform" />
                                Actualizar Mis Datos
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <footer className="mt-12 text-center">
                <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.5em] italic">
                    Somos Naturales Staff Identity Management System
                </p>
            </footer>
        </div>
    );
};