import React, { useState, useRef } from 'react';
import Swal from 'sweetalert2';
import { IoCloudUploadOutline, IoFastFoodOutline, IoPricetagOutline, IoDocumentTextOutline, IoImageOutline, IoCloseCircle } from 'react-icons/io5';
import SomosNaturales from '../../api/somosNaturalesApi';

export const CrearProductoForm = () => {
    const [producto, setProducto] = useState({
        nombre: '',
        descripcion: '',
        precio: ''
    });

    const [archivo, setArchivo] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [cargando, setCargando] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

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
        if (!archivo) return Swal.fire('Falta Imagen', 'Debes subir una foto del producto', 'warning');

        setCargando(true);
        const formData = new FormData();
        formData.append('nombre', producto.nombre);
        formData.append('descripcion', producto.descripcion);
        formData.append('precio', producto.precio);
        formData.append('archivo', archivo);

        try {
            await SomosNaturales.post('/producto/crearProducto', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            Swal.fire({
                title: '¡Producto Creado!',
                text: 'El nuevo producto ya está disponible en el catálogo.',
                icon: 'success',
                confirmButtonColor: '#f97316'
            });

            setProducto({ nombre: '', descripcion: '', precio: '' });
            removeImage();
        } catch (error: any) {
            Swal.fire('Error', 'No se pudo crear el producto', 'error');
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-200 overflow-hidden border border-gray-50 flex flex-col md:flex-row">
                
                {/* LADO IZQUIERDO: CARGA DE IMAGEN */}
                <div className="w-full md:w-2/5 bg-gray-50 p-8 border-r border-gray-100 flex flex-col items-center justify-center relative">
                    <div className="absolute top-6 left-8">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] italic">Visualización</span>
                    </div>

                    {preview ? (
                        <div className="relative w-full aspect-square rounded-[2rem] overflow-hidden shadow-2xl group">
                            <img src={preview} alt="Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            <button 
                                onClick={removeImage}
                                className="absolute top-4 right-4 bg-white/90 text-red-500 p-2 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-lg"
                            >
                                <IoCloseCircle size={24} />
                            </button>
                        </div>
                    ) : (
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full aspect-square border-4 border-dashed border-gray-200 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 text-gray-400 hover:border-orange-400 hover:text-orange-500 hover:bg-orange-50/50 transition-all group"
                        >
                            <div className="bg-white p-6 rounded-full shadow-xl group-hover:scale-110 transition-transform">
                                <IoImageOutline size={40} />
                            </div>
                            <span className="font-black uppercase italic text-xs tracking-widest">Subir Imagen</span>
                        </button>
                    )}
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                </div>

                {/* LADO DERECHO: FORMULARIO */}
                <div className="w-full md:w-3/5 p-8 md:p-12">
                    <header className="mb-10">
                        <h2 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">
                            Nuevo <span className="text-orange-500">Producto</span>
                        </h2>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Detalles del menú</p>
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
                                    type="number" name="precio" value={producto.precio} onChange={handleChange} required
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

                        {/* Botón Guardar */}
                        <button 
                            type="submit" disabled={cargando}
                            className={`w-full py-5 rounded-[1.5rem] font-black uppercase italic tracking-tighter flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95 ${
                                cargando ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-900 text-white hover:bg-orange-600 shadow-orange-100'
                            }`}
                        >
                            {cargando ? (
                                <span className="animate-pulse">Guardando Producto...</span>
                            ) : (
                                <>
                                    <IoCloudUploadOutline size={20} />
                                    Publicar Producto
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};