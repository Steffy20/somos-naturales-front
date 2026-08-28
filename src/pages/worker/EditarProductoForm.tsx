import React, { useState, useRef, useEffect } from 'react';
import Swal from 'sweetalert2';
import { IoCloudUploadOutline, IoFastFoodOutline, IoPricetagOutline, IoDocumentTextOutline, IoImageOutline, IoCloseCircle } from 'react-icons/io5';
import SomosNaturales from '../../api/somosNaturalesApi';

interface Producto {
    _id: string;
    nombre: string;
    descripcion: string;
    precio: number | string;
    imagen?: string;
}

interface Props {
    productoAEditar: Producto;
    onActualizado?: () => void; // Callback opcional por si necesitas refrescar la vista anterior
}

export const EditarProductoForm = ({ productoAEditar, onActualizado }: Props) => {
    const [producto, setProducto] = useState({
        nombre: productoAEditar.nombre,
        descripcion: productoAEditar.descripcion,
        precio: productoAEditar.precio
    });

    const [archivo, setArchivo] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(productoAEditar.imagen || null);
    const [cargando, setCargando] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Por si el producto cambia dinámicamente desde las props
    useEffect(() => {
        setProducto({
            nombre: productoAEditar.nombre,
            descripcion: productoAEditar.descripcion,
            precio: productoAEditar.precio
        });
        setPreview(productoAEditar.imagen || null);
        setArchivo(null);
    }, [productoAEditar]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setProducto({ ...producto, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setArchivo(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setArchivo(null);
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setCargando(true);
        const formData = new FormData();
        formData.append('nombre', producto.nombre);
        formData.append('descripcion', producto.descripcion);
        formData.append('precio', String(producto.precio));
        
        // Solo mandamos el archivo si el usuario seleccionó uno nuevo
        if (archivo) {
            formData.append('archivo', archivo);
        }

        try {
            await SomosNaturales.put(`/producto/editarProducto/${productoAEditar._id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            Swal.fire({
                title: '¡Producto Actualizado!',
                text: 'Los cambios se han guardado correctamente.',
                icon: 'success',
                confirmButtonColor: '#f97316'
            });

            if (onActualizado) onActualizado();
        } catch (error: any) {
            console.error(error);
            Swal.fire('Error', 'No se pudo actualizar el producto', 'error');
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-200 overflow-hidden border border-gray-50 flex flex-col md:flex-row">
                
                {/* LADO IZQUIERDO: IMAGEN ACTUAL / NUEVA */}
                <div className="w-full md:w-2/5 bg-gray-50 p-8 border-r border-gray-100 flex flex-col items-center justify-center relative">
                    <div className="absolute top-6 left-8">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] italic">Visualización</span>
                    </div>

                    {preview ? (
                        <div className="relative w-full aspect-square rounded-[2rem] overflow-hidden shadow-2xl group">
                            <img src={preview} alt="Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            <button 
                                type="button"
                                onClick={removeImage}
                                className="absolute top-4 right-4 bg-white/90 text-red-500 p-2 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-lg"
                            >
                                <IoCloseCircle size={24} />
                            </button>
                        </div>
                    ) : (
                        <button 
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full aspect-square border-4 border-dashed border-gray-200 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 text-gray-400 hover:border-orange-400 hover:text-orange-500 hover:bg-orange-50/50 transition-all group"
                        >
                            <div className="bg-white p-6 rounded-full shadow-xl group-hover:scale-110 transition-transform">
                                <IoImageOutline size={40} />
                            </div>
                            <span className="font-black uppercase italic text-xs tracking-widest">Cambiar Imagen</span>
                        </button>
                    )}
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                </div>

                {/* LADO DERECHO: FORMULARIO */}
                <div className="w-full md:w-3/5 p-8 md:p-12">
                    <header className="mb-10">
                        <h2 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">
                            Editar <span className="text-orange-500">Producto</span>
                        </h2>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Modificar detalles del menú</p>
                    </header>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Nombre */}
                        <div className="space-y-2">
                            <div className="relative group">
                                <IoFastFoodOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500" />
                                <input 
                                    type="text" name="nombre" value={producto.nombre} onChange={handleChange} required
                                    placeholder="Nombre del Plato/Bebida"
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-orange-500 focus:bg-white transition-all font-bold text-gray-800"
                                />
                            </div>
                        </div>

                        {/* Precio */}
                        <div className="space-y-2">
                            <div className="relative group">
                                <IoPricetagOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500" />
                                <input 
                                    type="number" name="precio" value={producto.precio} onChange={handleChange} required step="any"
                                    placeholder="Precio (Ej: 5.50)"
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-orange-500 focus:bg-white transition-all font-bold text-gray-800"
                                />
                            </div>
                        </div>

                        {/* Descripción */}
                        <div className="space-y-2">
                            <div className="relative group">
                                <IoDocumentTextOutline className="absolute left-4 top-5 text-gray-300 group-focus-within:text-orange-500" />
                                <textarea 
                                    name="descripcion" value={producto.descripcion} onChange={handleChange} required
                                    placeholder="Descripción del producto..." rows={3}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:border-orange-500 focus:bg-white transition-all font-bold text-gray-800 min-h-[120px]"
                                />
                            </div>
                        </div>

                        {/* Botón Guardar Cambios */}
                        <button 
                            type="submit" disabled={cargando}
                            className={`w-full py-5 rounded-[1.5rem] font-black uppercase italic tracking-tighter flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95 ${
                                cargando ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-900 text-white hover:bg-orange-600 shadow-orange-100'
                            }`}
                        >
                            {cargando ? (
                                <span className="animate-pulse">Actualizando Producto...</span>
                            ) : (
                                <>
                                    <IoCloudUploadOutline size={20} />
                                    Guardar Cambios
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};