import { useEffect, useState } from 'react';
import { IoFastFoodSharp } from 'react-icons/io5';
import SomosNaturales from '../../src/api/somosNaturalesApi';
import type { Producto } from '../../src/interfaces/ProductInterfaces';

export const CatalogoPublico = () => {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarProductos = async () => {
            try {
                const { data } = await SomosNaturales.get('/producto/TraerProductosHomePublic');
                console.log(data)
                setProductos(data.productos);
            } catch (error) {
                console.error("Error al cargar el catálogo público", error);
            } finally {
                setLoading(false);
            }
        };
        cargarProductos();
    }, []);

    if (loading) return (
        <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500"></div>
        </div>
    );

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                
                {/* Header de Sección */}
                <div className="flex flex-col md:flex-row items-end justify-between mb-12 border-b-4 border-gray-900 pb-6 gap-4">
                    <div className="flex items-center gap-4">
                        <IoFastFoodSharp className="text-5xl text-orange-500" />
                        <div>
                            <h2 className="text-4xl md:text-6xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">
                                El <span className="text-orange-500 text-outline">Menú</span>
                            </h2>
                            <p className="text-xs font-black text-gray-400 uppercase tracking-[0.5em] mt-2 ml-1">
                                Frescura natural en cada bocado
                            </p>
                        </div>
                    </div>

                    {/* Badge de cantidad total de productos */}
                    <div className="bg-gray-900 text-white px-6 py-2 rounded-full font-black italic text-sm uppercase tracking-tighter shadow-lg shadow-gray-300">
                        {productos.length} Opciones disponibles
                    </div>
                </div>

                {/* Grid de Productos */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                    {productos.map((prod) => (
                        <div 
                            key={prod._id} 
                            className="group flex flex-col bg-white rounded-[2.5rem] border border-gray-100 hover:border-orange-500/30 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden"
                        >
                            {/* Imagen con Overlay de Rating */}
                            <div className="relative h-60 overflow-hidden">
                                <img 
                                    src={prod.imagen} 
                                    alt={prod.nombre} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                
                                {/* Badge de Rating flotante sobre imagen */}
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-2xl flex items-center gap-1 shadow-lg">
                                    <span className="text-yellow-500 text-xs">⭐</span>
                                    <span className="text-[11px] font-black text-gray-900 italic">
                                        {prod.ratingPromedio > 0 ? prod.ratingPromedio.toFixed(1) : 'NEW'}
                                    </span>
                                </div>
                            </div>

                            {/* Cuerpo de la Card */}
                            <div className="p-6 flex flex-col flex-grow">
                                <div className="mb-4">
                                    <h3 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter leading-tight group-hover:text-orange-500 transition-colors truncate">
                                        {prod.nombre}
                                    </h3>
                                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">
                                        {prod.numRevisiones} Reviews de clientes
                                    </p>
                                </div>

                                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-gray-400 uppercase leading-none mb-1">Total</span>
                                        <span className="text-2xl font-black text-gray-900 tracking-tighter">
                                            ${prod.precio.toFixed(2)}
                                        </span>
                                    </div>

                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};