import { useEffect, useState } from 'react';
import { IoFlame, IoTrendingUpSharp, IoFlashSharp } from 'react-icons/io5';
import SomosNaturales from '../../api/somosNaturalesApi';
import type { Producto } from '../../interfaces/ProductInterfaces';

export const MasVendidos = () => {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarMasVendidos = async () => {
            try {
                const resp = await SomosNaturales.get('/producto/masvendidos');
                setProductos(resp.data.productos);
            } catch (error) {
                console.error("Error al cargar los más vendidos", error);
            } finally {
                setLoading(false);
            }
        };
        cargarMasVendidos();
    }, []);

    if (loading || productos.length === 0) return null;

    return (
        <section className="py-16 bg-gray-50/50">
            <div className="max-w-7xl mx-auto px-4">
                
                {/* Header Estilo "Hot" */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
                    <div className="flex items-center gap-4">
                        <div className="bg-orange-600 p-4 rounded-[1.5rem] -rotate-6 shadow-xl shadow-orange-200 animate-pulse">
                            <IoFlame className="text-white text-3xl" />
                        </div>
                        <div>
                            <h2 className="text-4xl md:text-5xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">
                                Lo más <span className="text-orange-600">Pedido</span>
                            </h2>
                            <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.4em] mt-1 ml-1">
                                Tendencia en tiempo real
                            </p>
                        </div>
                    </div>
                    
                    <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
                        <IoFlashSharp className="text-orange-500" />
                        <span className="text-xs font-black text-gray-800 uppercase italic">Se agotan rápido</span>
                    </div>
                </div>

                {/* Grid de Productos */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {productos.slice(0, 3).map((p, index) => (
                        <div 
                            key={p._id} 
                            className="group relative bg-white rounded-[3rem] overflow-hidden shadow-2xl shadow-gray-200/60 hover:-translate-y-3 transition-all duration-500 border border-transparent hover:border-orange-100"
                        >
                            {/* Ranking Badge Flotante */}
                            <div className="absolute top-6 left-6 z-20">
                                <div className="bg-orange-600 text-white w-14 h-14 rounded-3xl flex flex-col items-center justify-center shadow-2xl rotate-[-10deg] border-4 border-white group-hover:rotate-0 transition-transform">
                                    <span className="text-[10px] font-black uppercase leading-none">Top</span>
                                    <span className="text-2xl font-black italic">#{index + 1}</span>
                                </div>
                            </div>

                            {/* Imagen con Zoom y Overlay */}
                            <div className="relative h-72 overflow-hidden">
                                <img 
                                    src={p.imagen} 
                                    alt={p.nombre} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                                
                                {/* Ventas Badge sobre la imagen */}
                                <div className="absolute bottom-6 left-8 right-8 flex justify-between items-end">
                                    <div className="flex flex-col">
                                        <span className="text-orange-400 text-[10px] font-black uppercase tracking-widest">Populares ahora</span>
                                        <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">
                                            {p.nombre}
                                        </h3>
                                    </div>
                                </div>
                            </div>

                            {/* Cuerpo de la Card */}
                            <div className="p-8 bg-white flex items-center justify-between">
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2 mb-1">
                                        <IoTrendingUpSharp className="text-green-500" size={18} />
                                        <span className="text-lg font-black text-gray-800 tracking-tighter">
                                            {p.ventasTotales}
                                        </span>
                                    </div>
                                    <span className="text-[10px] font-black text-gray-400 uppercase italic leading-none">
                                        Unidades Vendidas
                                    </span>
                                </div>

                                <div className="h-12 w-[1px] bg-gray-100"></div>

                                <div className="text-right">
                                    <span className="block text-[10px] font-black text-orange-500 uppercase tracking-tighter mb-1">Precio Especial</span>
                                    <span className="text-3xl font-black text-gray-900 tracking-tighter">
                                        ${p.precio.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};