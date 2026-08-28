import { useEffect, useState } from 'react';
import SomosNaturales from '../../api/somosNaturalesApi';
import { IoCashOutline, IoCartOutline, IoTrendingUp, IoFlash, IoAlertCircleOutline } from 'react-icons/io5';

export const StoreAnalytics = () => {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const resp = await SomosNaturales.get('/orden/dashboard');
                setData(resp.data);
            } catch (error) {
                console.error("Error al obtener stats", error);
            }
        };
        fetchStats();
    }, []);

    if (!data) return (
        <div className="flex flex-col items-center justify-center p-20 animate-pulse">
            <IoFlash className="text-gray-200 text-6xl animate-bounce" />
            <p className="text-gray-400 font-black uppercase italic tracking-widest mt-4">Analizando Negocio...</p>
        </div>
    );

    // LÓGICA DE APOYO: Si hoy es 0, calculamos el total histórico de los productos estrella para no mostrar vacío
    const totalVendidoHistorico = data.topProductos.reduce((acc: number, item: any) => acc + item.totalVendido, 0);
    const ingresosEstimadosHistoricos = data.topProductos.reduce((acc: number, item: any) => acc + (item.totalVendido * (item.detalles[0]?.precio || 0)), 0);

    return (
        <div className="max-w-7xl mx-auto px-4 mt-8 pb-20">
            
            {/* Header de Análisis */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                <div>
                    <h2 className="text-3xl md:text-5xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">
                        Business <span className="text-orange-500">Intelligence</span>
                    </h2>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mt-2 ml-1">
                        Rendimiento de ventas y productos
                    </p>
                </div>
                <div className="bg-orange-50 px-4 py-2 rounded-full border border-orange-100 flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-ping"></div>
                    <p className="text-[10px] font-black text-orange-600 uppercase italic">Datos en Vivo</p>
                </div>
            </div>

            {/* Fila de Métricas Principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                
                {/* Caja de Dinero */}
                <div className="relative overflow-hidden bg-gray-900 rounded-[2.5rem] p-8 shadow-2xl group transition-all hover:-translate-y-1">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:rotate-12 transition-transform">
                        <IoCashOutline size={100} className="text-green-400" />
                    </div>
                    <div className="relative z-10 flex items-center gap-6">
                        <div className="bg-green-500/20 p-4 rounded-2xl border border-green-500/30">
                            <IoCashOutline className="text-green-400 text-4xl" />
                        </div>
                        <div>
                            <span className="text-[10px] font-black text-green-500 uppercase tracking-widest italic">
                                {data.resumenHoy.totalDinero > 0 ? 'Ventas de Hoy' : 'Estimado Histórico (Top)'}
                            </span>
                            <h4 className="text-4xl md:text-5xl font-black text-white tracking-tighter mt-1">
                                ${data.resumenHoy.totalDinero > 0 
                                    ? data.resumenHoy.totalDinero.toFixed(2) 
                                    : ingresosEstimadosHistoricos.toFixed(2)}
                            </h4>
                        </div>
                    </div>
                    {data.resumenHoy.totalDinero === 0 && (
                         <div className="mt-4 flex items-center gap-2 text-[9px] text-gray-500 font-bold uppercase tracking-tight">
                            <IoAlertCircleOutline className="text-orange-500" /> Sin ventas registradas hoy
                         </div>
                    )}
                </div>

                {/* Caja de Productos */}
                <div className="relative overflow-hidden bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-gray-200 border border-gray-100 group transition-all hover:-translate-y-1">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:-rotate-12 transition-transform">
                        <IoCartOutline size={100} className="text-blue-500" />
                    </div>
                    <div className="relative z-10 flex items-center gap-6">
                        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                            <IoCartOutline className="text-blue-500 text-4xl" />
                        </div>
                        <div>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">
                                {data.resumenHoy.cantidadProductos > 0 ? 'Salidas hoy' : 'Volumen Histórico (Top)'}
                            </span>
                            <h4 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter mt-1">
                                {data.resumenHoy.cantidadProductos > 0 
                                    ? data.resumenHoy.cantidadProductos 
                                    : totalVendidoHistorico} <span className="text-lg text-gray-400 uppercase italic">und</span>
                            </h4>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabla de Productos Estrella */}
            <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-200 border border-gray-50 overflow-hidden">
                <div className="bg-gray-50 p-8 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <IoTrendingUp className="text-orange-500 text-3xl" />
                        <h4 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter">Productos Estrella</h4>
                    </div>
                    <span className="bg-gray-900 text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase italic tracking-widest shadow-lg">
                        Ranking por Volumen
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white">
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Rank</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Producto</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest italic text-right">Total Vendido</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {data.topProductos.map((item: any, index: number) => (
                                <tr key={item._id} className="hover:bg-orange-50/30 transition-colors group">
                                    <td className="px-8 py-6">
                                        <span className={`flex items-center justify-center w-8 h-8 rounded-lg font-black italic ${
                                            index === 0 ? 'bg-orange-500 text-white shadow-lg shadow-orange-200' : 'bg-gray-100 text-gray-400'
                                        }`}>
                                            {index + 1}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <img 
                                                src={item.detalles[0]?.imagen} 
                                                alt={item.detalles[0]?.nombre}
                                                className="w-12 h-12 rounded-xl object-cover shadow-md group-hover:scale-110 transition-transform"
                                            />
                                            <div className="flex flex-col">
                                                <span className="font-black text-gray-800 uppercase italic tracking-tight">
                                                    {item.detalles[0]?.nombre || 'Sin nombre'}
                                                </span>
                                                <span className="text-[10px] font-bold text-gray-400 uppercase">
                                                    Precio unit: ${item.detalles[0]?.precio.toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="inline-flex flex-col items-end">
                                            <span className="bg-gray-900 text-white px-4 py-2 rounded-xl font-black italic tracking-tighter text-sm">
                                                {item.totalVendido} <small className="text-orange-500 ml-1 italic">Ventas</small>
                                            </span>
                                            <span className="text-[9px] font-black text-green-600 mt-1 uppercase italic">
                                                Subtotal: ${(item.totalVendido * item.detalles[0]?.precio).toFixed(2)}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <p className="text-center text-[9px] font-black text-gray-300 uppercase tracking-[0.5em] mt-12 italic">
                Analytics Engine • Somos Naturales v2.0
            </p>
        </div>
    );
};