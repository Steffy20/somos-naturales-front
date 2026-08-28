import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { IoPencilOutline, IoTrashOutline, IoFastFoodOutline, IoCloseCircleOutline } from 'react-icons/io5';
import SomosNaturales from '../../api/somosNaturalesApi';
import { EditarProductoForm } from './EditarProductoForm'; // Asegúrate de ajustar la ruta

interface Producto {
    _id: string;
    nombre: string;
    descripcion: string;
    precio: number | string;
    imagen?: string;
}

export const GestionProductos = () => {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [cargando, setCargando] = useState(true);
    
    // Estados para controlar el Modal de Edición
    const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
    const [mostrarModal, setMostrarModal] = useState(false);

    // 1. Cargar los productos desde el Backend
    const obtenerProductos = async () => {
        try {
            setCargando(true);
            // Ajusta esta ruta según cómo tengas configurado tu GET de productos en el backend
            const { data } = await SomosNaturales.get('/producto/traerProducto'); 
            // Suponiendo que tu backend responde { ok: true, productos: [...] }
            setProductos(data.productos || []); 
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'No se pudieron cargar los productos', 'error');
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        obtenerProductos();
    }, []);

    // 2. Función para Eliminar Producto
    const handleEliminarProducto = (id: string, nombre: string) => {
        Swal.fire({
            title: `¿Estás seguro de eliminar a "${nombre}"?`,
            text: "Esta acción borrará el registro y la imagen de Cloudinary permanentemente.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444', // Rojo
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            customClass: {
                popup: 'rounded-[2rem]'
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await SomosNaturales.delete(`/producto/eliminarProducto/${id}`);
                    
                    Swal.fire({
                        title: '¡Eliminado!',
                        text: 'El producto ha sido removido con éxito.',
                        icon: 'success',
                        confirmButtonColor: '#f97316'
                    });

                    // Refrescar la lista local filtrando el eliminado
                    setProductos(productos.filter(p => p._id !== id));
                } catch (error) {
                    console.error(error);
                    Swal.fire('Error', 'Hubo un problema al intentar eliminar el producto', 'error');
                }
            }
        });
    };

    // 3. Activar el flujo de edición
    const activarEdicion = (producto: Producto) => {
        setProductoSeleccionado(producto);
        setMostrarModal(true);
    };

    if (cargando) {
        return (
            <div className="flex justify-center items-center h-64">
                <span className="animate-pulse text-orange-500 font-black uppercase tracking-widest">Cargando Menú...</span>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8">
            <header className="mb-10">
                <h2 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter">
                    Panel de <span className="text-orange-500">Productos</span>
                </h2>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Inventario disponible para el público</p>
            </header>

            {productos.length === 0 ? (
                <div className="text-center p-12 bg-white rounded-[2rem] border-2 border-dashed border-gray-100 text-gray-400">
                    <IoFastFoodOutline size={48} className="mx-auto mb-4" />
                    <p className="font-bold">No hay productos registrados en el catálogo.</p>
                </div>
            ) : (
                /* CUADRÍCULA DE PRODUCTOS */
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {productos.map((prod) => (
                        <div key={prod._id} className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-100 overflow-hidden border border-gray-50 flex flex-col group transition-all hover:shadow-2xl">
                            
                            {/* Imagen del producto */}
                            <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
                                {prod.imagen ? (
                                    <img src={prod.imagen} alt={prod.nombre} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <IoFastFoodOutline size={32} />
                                    </div>
                                )}
                                <span className="absolute top-4 right-4 bg-gray-900 text-white font-black px-4 py-1.5 rounded-full text-sm italic">
                                    ${Number(prod.precio).toFixed(2)}
                                </span>
                            </div>

                            {/* Info del producto */}
                            <div className="p-6 flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="font-black text-lg text-gray-800 uppercase tracking-tight line-clamp-1 mb-1">{prod.nombre}</h3>
                                    <p className="text-gray-400 text-xs font-medium line-clamp-2 leading-relaxed">{prod.descripcion}</p>
                                </div>

                                {/* Acciones del Trabajador */}
                                <div className="grid grid-cols-2 gap-3 mt-6">
                                    <button
                                        onClick={() => activarEdicion(prod)}
                                        className="flex items-center justify-center gap-2 py-3 bg-gray-50 text-gray-700 font-bold rounded-2xl hover:bg-orange-50 hover:text-orange-500 transition-colors border border-transparent hover:border-orange-200 text-sm"
                                    >
                                        <IoPencilOutline size={16} />
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleEliminarProducto(prod._id, prod.nombre)}
                                        className="flex items-center justify-center gap-2 py-3 bg-red-50 text-red-500 font-bold rounded-2xl hover:bg-red-500 hover:text-white transition-all text-sm shadow-sm shadow-red-50"
                                    >
                                        <IoTrashOutline size={16} />
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* --- MODAL PARA EDITAR EL PRODUCTO --- */}
            {mostrarModal && productoSeleccionado && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-fade-in">
                    <div className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-y-auto max-h-[90vh]">
                        
                        {/* Botón Flotante para Cerrar Modal */}
                        <button 
                            onClick={() => setMostrarModal(false)}
                            className="absolute top-6 right-6 z-10 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <IoCloseCircleOutline size={32} />
                        </button>
                        
                        {/* Renderizamos tu Formulario de Edición dentro del Modal */}
                        <EditarProductoForm 
                            productoAEditar={productoSeleccionado}
                            onActualizado={() => {
                                setMostrarModal(false);
                                obtenerProductos(); // Refresca los datos en la pantalla principal
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};