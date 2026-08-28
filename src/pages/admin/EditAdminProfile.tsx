import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthProvider';
import SomosNaturales from '../../api/somosNaturalesApi';
import Swal from 'sweetalert2';
import { 
    IoPersonOutline, IoMailOutline, IoKeyOutline, 
    IoShieldCheckmarkSharp, IoSaveOutline 
} from 'react-icons/io5';

export const AdminProfile = () => {
    const { usuario } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        nombre: usuario?.nombre || '',
        correo: usuario?.correo || '',
        password: ''
    });

const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const datosAEnviar: any = { ...formData };

    if (!datosAEnviar.password || datosAEnviar.password.trim() === '') {
        delete datosAEnviar.password;
    }

    try {
        const resp = await SomosNaturales.put(`/usuarios/${usuario?.uid}`, datosAEnviar);
        
        if (resp.data.ok) {
            Swal.fire('Éxito', 'Tus datos han sido actualizados.', 'success');
            // Opcional: Podrías limpiar el campo password después de actualizar
            setFormData({ ...formData, password: '' });
        }
    } catch (error) {
        console.error(error);
        Swal.fire('Error', 'No se pudo actualizar el perfil', 'error');
    }
};

    return (
        <div className="max-w-5xl mx-auto px-4 mt-12 pb-20">
            
            {/* Header del Perfil */}
            <div className="mb-10 text-center md:text-left px-2">
                <h2 className="text-4xl md:text-6xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">
                    Account <span className="text-orange-500">Security</span>
                </h2>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em] mt-2 ml-1">
                    Configuración de identidad administrativa
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Lateral: Card de Identidad */}
                <div className="lg:col-span-4">
                    <div className="bg-gray-900 rounded-[3rem] p-8 text-center relative overflow-hidden shadow-2xl">
                        {/* Decoración de fondo */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl"></div>
                        
                        <div className="relative z-10">
                            <div className="w-24 h-24 bg-gradient-to-tr from-orange-500 to-orange-400 rounded-[2rem] mx-auto flex items-center justify-center text-white text-4xl font-black italic shadow-xl shadow-orange-500/20 mb-6 border-4 border-gray-800">
                                {usuario?.nombre?.substring(0, 1).toUpperCase()}
                            </div>
                            
                            <h3 className="text-white font-black uppercase italic tracking-tight text-xl">
                                {usuario?.nombre}
                            </h3>
                            <span className="inline-block bg-orange-500/20 text-orange-500 text-[9px] font-black px-4 py-1 rounded-full uppercase italic tracking-widest mt-2 border border-orange-500/30">
                                {usuario?.rol === 'ADMIN_ROLE' ? 'Master Admin' : 'Staff Member'}
                            </span>

                            <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                                <div className="flex items-center justify-between text-[10px] font-black uppercase italic tracking-widest text-gray-500">
                                    <span>Estatus</span>
                                    <span className="text-green-500">Verificado</span>
                                </div>
                                <div className="flex items-center justify-between text-[10px] font-black uppercase italic tracking-widest text-gray-500">
                                    <span>ID</span>
                                    <span className="text-gray-300">{usuario?.uid?.substring(0, 10)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Principal: Formulario de Edición */}
                <div className="lg:col-span-8">
                    <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-gray-200 border border-gray-50">
                        <div className="flex items-center gap-3 mb-8">
                            <IoShieldCheckmarkSharp className="text-orange-500 text-3xl" />
                            <h4 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter">
                                Editar Información
                            </h4>
                        </div>

                        <form onSubmit={handleUpdate} className="space-y-6">
                            
                            {/* Input Nombre */}
                            <div className="group">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-4 mb-2 block group-focus-within:text-orange-500 transition-colors">
                                    Nombre Público
                                </label>
                                <div className="relative">
                                    <IoPersonOutline className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={20} />
                                    <input 
                                        type="text" 
                                        className="w-full bg-gray-50 border-2 border-transparent rounded-[1.5rem] py-4 pl-14 pr-6 font-bold text-gray-800 focus:bg-white focus:border-orange-500 focus:shadow-xl focus:shadow-orange-100 outline-none transition-all"
                                        value={formData.nombre} 
                                        onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                                    />
                                </div>
                            </div>

                            {/* Input Correo */}
                            <div className="group">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-4 mb-2 block group-focus-within:text-orange-500 transition-colors">
                                    Email de Acceso
                                </label>
                                <div className="relative">
                                    <IoMailOutline className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={20} />
                                    <input 
                                        type="email" 
                                        className="w-full bg-gray-50 border-2 border-transparent rounded-[1.5rem] py-4 pl-14 pr-6 font-bold text-gray-800 focus:bg-white focus:border-orange-500 focus:shadow-xl focus:shadow-orange-100 outline-none transition-all"
                                        value={formData.correo}
                                        onChange={(e) => setFormData({...formData, correo: e.target.value})}
                                    />
                                </div>
                            </div>

                            {/* Input Password */}
                            <div className="group">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-4 mb-2 block group-focus-within:text-orange-500 transition-colors">
                                    Actualizar Llave de Acceso
                                </label>
                                <div className="relative">
                                    <IoKeyOutline className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={20} />
                                    <input 
                                        type="password" 
                                        className="w-full bg-gray-50 border-2 border-transparent rounded-[1.5rem] py-4 pl-14 pr-6 font-bold text-gray-800 focus:bg-white focus:border-orange-500 focus:shadow-xl focus:shadow-orange-100 outline-none transition-all"
                                        placeholder="••••••••••••"
                                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    />
                                </div>
                                <p className="text-[9px] font-bold text-gray-300 uppercase tracking-tighter mt-2 ml-4 italic">
                                    * Deja este campo vacío si no deseas cambiar tu contraseña actual
                                </p>
                            </div>

                            {/* Botón Guardar */}
                            <button className="w-full bg-gray-900 hover:bg-orange-500 text-white rounded-[1.5rem] py-5 font-black uppercase italic tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-2xl hover:shadow-orange-200 group active:scale-[0.98]">
                                <IoSaveOutline size={22} className="group-hover:animate-bounce" />
                                Guardar Cambios
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <p className="text-center text-[9px] font-black text-gray-300 uppercase tracking-[0.5em] mt-12 italic">
                Secure Environment • Auth Module v2.0
            </p>
        </div>
    );
};