import { useState } from 'react';
import Swal from 'sweetalert2';
import { IoPersonAddSharp, IoMailSharp, IoLockClosedSharp, IoShieldCheckmarkSharp } from 'react-icons/io5';
import SomosNaturales from '../../api/somosNaturalesApi';

export const WorkerCreate = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        correo: '',
        password: '',
        rol: 'WORKER_ROLE'
    });

    const { nombre, correo, password } = formData;

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ([nombre, correo, password].includes('')) {
        return Swal.fire('Error', 'Todos los campos son obligatorios', 'error');
    }

    try {
        const resp = await SomosNaturales.post('/usuarios/crearUsuario', formData);
        
        // Accedemos a resp.data.usuario porque así lo envía tu backend
        if (resp.data.usuario) { 
            Swal.fire({
                title: '¡Trabajador Creado!',
                text: `La cuenta de ${resp.data.usuario.nombre} está lista.`,
                icon: 'success',
                confirmButtonColor: '#f97326'


            });
            
            setFormData({ nombre: '', correo: '', password: '', rol: 'WORKER_ROLE' });
        }
    } catch (error: any) {
        const msg = error.response?.data?.errors?.[0]?.msg || error.response?.data?.msg || 'Error al crear';
        Swal.fire('Error de registro', msg, 'error');
    }
};

    return (
        <div className="max-w-xl mx-auto px-4 py-6 md:py-12">
            
            <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-2xl shadow-gray-200 overflow-hidden border border-gray-100">
                
                {/* Header más compacto en móvil (p-6 vs p-8) */}
                <div className="bg-gray-900 p-6 md:p-8 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 hidden md:block">
                        <IoPersonAddSharp size={80} className="text-white" />
                    </div>
                    <h3 className="text-white text-xl md:text-2xl font-black uppercase italic tracking-tighter relative z-10">
                        Gestión de <span className="text-orange-500">Personal</span>
                    </h3>
                    <p className="text-gray-400 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] mt-1 md:mt-2">
                        Registro de nuevos trabajadores
                    </p>
                </div>

                {/* Padding inferior aumentado (pb-12) para evitar el corte en móvil */}
                <form onSubmit={onSubmit} className="p-6 md:p-10 space-y-5 md:space-y-6 pb-12 md:pb-10">
                    
                    <div className="space-y-1 md:space-y-2">
                        <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase ml-4 tracking-widest">Nombre Completo</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <IoPersonAddSharp className="text-gray-300 group-focus-within:text-orange-500 transition-colors" />
                            </div>
                            <input 
                                type="text" 
                                name="nombre"
                                value={nombre}
                                onChange={onChange}
                                placeholder="Ej. Carlos Manta"
                                className="w-full pl-11 pr-4 py-3 md:py-4 bg-gray-50 border-2 border-transparent rounded-xl md:rounded-2xl outline-none focus:border-orange-500 focus:bg-white transition-all font-bold text-gray-800 italic text-sm md:text-base"
                            />
                        </div>
                    </div>

                    <div className="space-y-1 md:space-y-2">
                        <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase ml-4 tracking-widest">Email Corporativo</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <IoMailSharp className="text-gray-300 group-focus-within:text-orange-500 transition-colors" />
                            </div>
                            <input 
                                type="email" 
                                name="correo"
                                value={correo}
                                onChange={onChange}
                                placeholder="usuario@somosnaturales.com"
                                className="w-full pl-11 pr-4 py-3 md:py-4 bg-gray-50 border-2 border-transparent rounded-xl md:rounded-2xl outline-none focus:border-orange-500 focus:bg-white transition-all font-bold text-gray-800 italic text-sm md:text-base"
                            />
                        </div>
                    </div>

                    <div className="space-y-1 md:space-y-2">
                        <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase ml-4 tracking-widest">Contraseña</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <IoLockClosedSharp className="text-gray-300 group-focus-within:text-orange-500 transition-colors" />
                            </div>
                            <input 
                                type="password" 
                                name="password"
                                value={password}
                                onChange={onChange}
                                placeholder="••••••••"
                                className="w-full pl-11 pr-4 py-3 md:py-4 bg-gray-50 border-2 border-transparent rounded-xl md:rounded-2xl outline-none focus:border-orange-500 focus:bg-white transition-all font-bold text-gray-800 text-sm md:text-base"
                            />
                        </div>
                    </div>

                    <div className="space-y-1 md:space-y-2">
                        <label className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase ml-4 tracking-widest">Privilegios</label>
                        <div className="flex items-center gap-2 md:gap-3 bg-orange-50 p-3 md:p-4 rounded-xl md:rounded-2xl border border-orange-100">
                            <IoShieldCheckmarkSharp className="text-orange-500 text-lg md:text-xl flex-shrink-0" />
                            <span className="font-black text-orange-700 text-[10px] md:text-xs uppercase tracking-tighter leading-tight">
                                Account: WORKER_ROLE
                            </span>
                        </div>
                    </div>

                    <div className="pt-2 md:pt-4">
                        <button 
                            type="submit" 
                            className="w-full bg-gray-900 hover:bg-orange-600 text-white py-4 md:py-5 rounded-xl md:rounded-[1.5rem] font-black uppercase italic tracking-tighter transition-all shadow-xl active:scale-95 text-sm md:text-base"
                        >
                            Dar de alta trabajador
                        </button>
                    </div>
                </form>
            </div>
            
            <div className="h-20 md:hidden"></div>
        </div>
    );
};