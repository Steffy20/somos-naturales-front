import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthProvider';
import SomosNaturales from '../../api/somosNaturalesApi';
import Swal from 'sweetalert2';
import { 
    IoPersonOutline, IoMailOutline, IoLockClosedOutline, 
    IoLeafOutline, IoSparklesOutline, IoChevronForwardOutline 
} from 'react-icons/io5';

export const CustomerProfile = () => {
    const { usuario } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        nombre: usuario?.nombre || '',
        correo: usuario?.correo || '',
        password: ''
    });

    const onUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        const updateData = { ...formData };
        if (!updateData.password) delete (updateData as any).password;

        try {
            await SomosNaturales.put(`/usuarios/${usuario?.uid}`, updateData);
            Swal.fire({
                title: '¡Ajustes Guardados!',
                text: 'Tu perfil ha sido actualizado con éxito',
                icon: 'success',
                confirmButtonColor: '#10b981',
                customClass: {
                    popup: 'rounded-[2.5rem]',
                    confirmButton: 'rounded-full px-8 py-3 font-black uppercase italic text-xs'
                }
            });
        } catch (error) {
            Swal.fire('Error', 'No pudimos actualizar tus datos', 'error');
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            
            {/* Header Amigable */}
            <div className="flex flex-col items-center mb-12 text-center">
                <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4 shadow-inner">
                    <IoLeafOutline size={40} className="animate-pulse" />
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-gray-800 uppercase italic tracking-tighter">
                    Mi <span className="text-emerald-500">Cuenta</span>
                </h2>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mt-2">
                    Personaliza tu experiencia natural
                </p>
            </div>

            <div className="bg-white rounded-[3.5rem] shadow-2xl shadow-emerald-100/50 border border-emerald-50 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-12">
                    
                    {/* Panel Izquierdo: Bienvenida */}
                    <div className="md:col-span-4 bg-emerald-500 p-10 flex flex-col justify-center text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <IoSparklesOutline className="text-emerald-200 mb-4" size={30} />
                            <h3 className="text-2xl font-black uppercase italic leading-tight">
                                ¡Hola, <br />{usuario?.nombre.split(' ')[0]}!
                            </h3>
                            <p className="text-xs font-medium text-emerald-100 mt-4 leading-relaxed">
                                Mantener tus datos actualizados nos ayuda a brindarte un mejor servicio.
                            </p>
                        </div>
                        {/* Decoración orgánica */}
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-400 rounded-full blur-3xl opacity-50"></div>
                    </div>

                    {/* Panel Derecho: Formulario */}
                    <div className="md:col-span-8 p-10 md:p-14">
                        <form onSubmit={onUpdate} className="space-y-6">
                            
                            {/* Input Nombre */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 italic">Nombre Completo</label>
                                <div className="relative group">
                                    <IoPersonOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                                    <input 
                                        type="text" 
                                        className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl font-bold text-gray-700 focus:bg-white focus:border-emerald-500 outline-none transition-all"
                                        value={formData.nombre}
                                        onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                                    />
                                </div>
                            </div>

                            {/* Input Correo */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 italic">Correo Electrónico</label>
                                <div className="relative group">
                                    <IoMailOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                                    <input 
                                        type="email" 
                                        className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl font-bold text-gray-700 focus:bg-white focus:border-emerald-500 outline-none transition-all"
                                        value={formData.correo}
                                        onChange={(e) => setFormData({...formData, correo: e.target.value})}
                                    />
                                </div>
                            </div>

                            {/* Input Password */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 italic">Seguridad</label>
                                <div className="relative group">
                                    <IoLockClosedOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
                                    <input 
                                        type="password" 
                                        className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl font-bold text-gray-700 focus:bg-white focus:border-emerald-500 outline-none transition-all placeholder:text-gray-300"
                                        placeholder="Nueva contraseña (opcional)"
                                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    />
                                </div>
                            </div>

                            {/* Botón de Acción */}
                            <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-full py-5 font-black uppercase italic tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-100 hover:shadow-emerald-200 active:scale-95 group">
                                Guardar mis cambios
                                <IoChevronForwardOutline className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <div className="mt-10 text-center">
                <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.6em]">
                    Somos Naturales • Tu Bienestar, Nuestra Prioridad
                </p>
            </div>
        </div>
    );
};