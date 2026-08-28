import { useEffect, useState } from 'react';
import { IoStar, IoFlame, IoTrendingUpOutline } from 'react-icons/io5';
import SomosNaturales from '../../api/somosNaturalesApi';
import type { Producto } from '../../interfaces/ProductInterfaces';

export const MejorRating = () => {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarMejoresRating = async () => {
            try {
                const resp = await SomosNaturales.get('/producto/mejor-calificados');
                setProductos(resp.data.productos);
            } catch (error) {
                console.error("Error al cargar los mejores rating", error);
            } finally {
                setLoading(false);
            }
        };
        cargarMejoresRating();
    }, []);

    if (loading) return null; // O un skeleton pequeño

    return (
        <div className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                
                {/* Header de la Sección */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-yellow-400 p-3 rounded-2xl rotate-12 shadow-lg shadow-yellow-200">
                            <IoFlame className="text-white text-2xl animate-pulse" />
                        </div>
                        <div>
                            <h2 className="text-3xl md:text-4xl font-black text-gray-800 uppercase italic tracking-tighter">
                                Los <span className="text-yellow-500">Mejores calificados</span>
                            </h2>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] leading-none">
                                Favoritos de la comunidad
                            </p>
                        </div>
                    </div>
                    
                    <div className="hidden md:flex items-center gap-2 text-green-600 font-black italic text-sm bg-green-50 px-4 py-2 rounded-full border border-green-100">
                        <IoTrendingUpOutline size={20}/>
                        Tendencia hoy
                    </div>
                </div>

                {/* Grid Responsivo */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {productos.slice(0, 4).map((p, index) => (
                        <div 
                            key={p._id} 
                            className="bg-gray-50 rounded-[2.5rem] overflow-hidden group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-gray-100 relative"
                        >
                            {/* Ranking Badge (Top 1, 2, 3...) */}
                            <div className="absolute top-4 left-4 z-10 bg-black/80 backdrop-blur-md text-white w-10 h-10 rounded-full flex items-center justify-center font-black italic border-2 border-yellow-400 shadow-xl">
                                #{index + 1}
                            </div>

                            {/* Imagen */}
                            <div className="relative h-48 overflow-hidden">
                                <img 
                                    src={p.imagen} 
                                    alt={p.nombre} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>

                            {/* Contenido */}
                            <div className="p-6">
                                <h3 className="text-lg font-black text-gray-800 uppercase tracking-tight mb-2 truncate italic">
                                    {p.nombre}
                                </h3>

                                <div className="flex items-center justify-between">
                                    {/* Stats Coherentes con Catalogo */}
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-1 bg-yellow-400 px-3 py-1 rounded-xl shadow-md shadow-yellow-100">
                                            <IoStar className="text-white" size={12} />
                                            <span className="text-xs font-black text-white leading-none">
                                                {p.ratingPromedio.toFixed(1)}
                                            </span>
                                        </div>
                                        <span className="text-[9px] font-black text-gray-400 uppercase italic mt-2 tracking-tighter">
                                            {p.numRevisiones} Opiniones
                                        </span>
                                    </div>

                                    {/* Precio Minimalista */}
                                    <div className="text-right">
                                        <span className="block text-[8px] font-black text-gray-400 uppercase">Precio</span>
                                        <span className="text-xl font-black text-gray-900 tracking-tighter">
                                            ${p.precio.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};