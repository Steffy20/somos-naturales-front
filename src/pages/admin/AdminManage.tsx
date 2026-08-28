import { useEffect, useState, useContext } from 'react';
import SomosNaturales from '../../api/somosNaturalesApi';
import { AuthContext } from '../../context/AuthProvider';
import Swal from 'sweetalert2';
import { 
    IoTrashOutline, IoCreateOutline, IoSaveOutline, 
    IoCloseOutline, IoShieldCheckmarkOutline, IoPersonOutline,
    IoMailOutline, IoFingerPrintOutline
} from 'react-icons/io5';

export const UserManagement = () => {
    const [usuarios, setUsuarios] = useState<any[]>([]);
    const [editando, setEditando] = useState<any | null>(null);
    const { usuario: adminLogueado } = useContext(AuthContext);

    const cargarUsuarios = async () => {
        try {
            const resp = await SomosNaturales.get('/usuarios');
            const filtrados = resp.data.usuarios.filter((u: any) => 
                u.rol === 'ADMIN_ROLE' || u.rol === 'WORKER_ROLE'
            );
            setUsuarios(filtrados);
        } catch (error) {
            console.error("Error al cargar usuarios", error);
        }
    };

    useEffect(() => { cargarUsuarios(); }, []);

    const handleActualizar = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await SomosNaturales.put(`/usuarios/${editando.uid}`, {
                nombre: editando.nombre,
                correo: editando.correo
            });
            Swal.fire({
                title: '¡Actualizado!',
                text: 'Perfil modificado con éxito',
                icon: 'success',
                confirmButtonColor: '#f97316'
            });
            setEditando(null);
            cargarUsuarios();
        } catch (error) {
            Swal.fire('Error', 'No se pudo actualizar el perfil', 'error');
        }
    };

    const handleDesactivar = async (id: string, nombre: string) => {
        if (id === adminLogueado?.uid) {
            return Swal.fire('Acción denegada', 'No puedes desactivar tu propia cuenta', 'error');
        }

        const result = await Swal.fire({
            title: `¿Inhabilitar a ${nombre}?`,
            text: "El usuario perderá el acceso a la gestión.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#111827',
            confirmButtonText: 'Sí, inhabilitar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            await SomosNaturales.delete(`/usuarios/${id}`);
            Swal.fire('Hecho', 'Estado actualizado', 'success');
            cargarUsuarios();
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 mt-10 pb-20">
            
            {/* Header Pro */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                <div>
                    <h2 className="text-3xl md:text-5xl font-black text-gray-900 uppercase italic tracking-tighter">
                        Staff <span className="text-orange-500">Master</span>
                    </h2>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mt-1 ml-1">
                        Control de credenciales y permisos
                    </p>
                </div>
                {editando && (
                    <div className="animate-bounce bg-orange-500 text-white px-4 py-1 rounded-full text-[9px] font-black uppercase italic shadow-lg shadow-orange-200">
                        Modo Edición Activo
                    </div>
                )}
            </div>

            {/* Panel de Edición Animado */}
            {editando && (
                <div className="mb-10 bg-gray-900 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden transition-all duration-500 border-4 border-orange-500">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6 text-white uppercase italic font-black">
                            <IoCreateOutline className="text-orange-500 text-2xl" />
                            <h3>Editando Perfil: <span className="text-orange-500">{editando.nombre}</span></h3>
                        </div>
                        
                        <form onSubmit={handleActualizar} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="relative">
                                <IoPersonOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input 
                                    type="text" 
                                    className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/10 rounded-2xl text-white font-bold focus:border-orange-500 outline-none transition-all"
                                    value={editando.nombre}
                                    onChange={(e) => setEditando({...editando, nombre: e.target.value})}
                                    placeholder="Nombre completo"
                                />
                            </div>
                            <div className="relative">
                                <IoMailOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input 
                                    type="email" 
                                    className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/10 rounded-2xl text-white font-bold focus:border-orange-500 outline-none transition-all"
                                    value={editando.correo}
                                    onChange={(e) => setEditando({...editando, correo: e.target.value})}
                                    placeholder="Correo electrónico"
                                />
                            </div>
                            <div className="flex gap-3">
                                <button type="submit" className="flex-1 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black uppercase italic transition-all flex items-center justify-center gap-2">
                                    <IoSaveOutline size={20}/> Guardar
                                </button>
                                <button type="button" onClick={() => setEditando(null)} className="px-6 bg-white/10 hover:bg-red-500 text-white rounded-2xl transition-all flex items-center justify-center">
                                    <IoCloseOutline size={24}/>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Tabla Estilizada */}
            <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-200 border border-gray-50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest italic border-b border-gray-100">Miembro del Staff</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest italic border-b border-gray-100">Credenciales</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest italic border-b border-gray-100 text-center">Nivel de Acceso</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest italic border-b border-gray-100 text-center">Estatus</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest italic border-b border-gray-100 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {usuarios.map((u: any) => (
                                <tr key={u.uid} className={`transition-all duration-300 ${editando?.uid === u.uid ? 'bg-orange-50' : 'hover:bg-gray-50/80 group'}`}>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-white font-black italic shadow-lg group-hover:bg-orange-500 transition-colors">
                                                {u.nombre.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-black text-gray-800 uppercase italic tracking-tight">{u.nombre}</span>
                                                    {u.uid === adminLogueado?.uid && (
                                                        <span className="bg-blue-500 text-white text-[8px] px-2 py-0.5 rounded-md font-black italic">TÚ</span>
                                                    )}
                                                </div>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">ID: {u.uid.substring(0, 8)}...</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <IoMailOutline className="text-orange-500" />
                                            <span className="text-xs font-bold">{u.correo}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase italic tracking-tighter flex items-center justify-center gap-1 mx-auto max-w-fit ${
                                            u.rol === 'ADMIN_ROLE' 
                                            ? 'bg-orange-100 text-orange-600 border border-orange-200' 
                                            : 'bg-blue-50 text-blue-600 border border-blue-100'
                                        }`}>
                                            <IoShieldCheckmarkOutline />
                                            {u.rol === 'ADMIN_ROLE' ? 'MASTER ADMIN' : 'STAFF WORKER'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${u.estado ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`}></div>
                                            <span className={`text-[10px] font-black uppercase italic ${u.estado ? 'text-green-600' : 'text-red-400'}`}>
                                                {u.estado ? 'Operativo' : 'Inhabilitado'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => setEditando(u)}
                                                className="p-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-900 hover:text-white transition-all active:scale-90"
                                                title="Editar Miembro"
                                            >
                                                <IoCreateOutline size={18} />
                                            </button>
                                            {u.uid !== adminLogueado?.uid && (
                                                <button 
                                                    onClick={() => handleDesactivar(u.uid, u.nombre)}
                                                    disabled={!u.estado}
                                                    className={`p-2.5 rounded-xl transition-all active:scale-90 ${
                                                        !u.estado 
                                                        ? 'bg-gray-50 text-gray-300 cursor-not-allowed' 
                                                        : 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white shadow-sm hover:shadow-red-200'
                                                    }`}
                                                >
                                                    <IoTrashOutline size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <footer className="mt-8 px-8 flex items-center gap-2">
                 <IoFingerPrintOutline className="text-gray-300 text-xl" />
                 <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">
                    SISTEMA DE SEGURIDAD SOMOS NATURALES • ENCRIPTADO DE DATOS
                 </p>
            </footer>
        </div>
    );
};