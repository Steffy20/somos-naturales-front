import { useEffect, useState } from 'react';
import { IoPeople, IoBriefcase, IoStatsChart, IoTimeOutline } from 'react-icons/io5';
import SomosNaturales from '../../api/somosNaturalesApi';
import { StoreAnalytics } from './Analisis';

interface Stats {
    total: number;
    ultimo: string;
}

export const UserStats = () => {
    const [workers, setWorkers] = useState<Stats>({ total: 0, ultimo: '' });
    const [consumers, setConsumers] = useState<Stats>({ total: 0, ultimo: '' });
    const [loading, setLoading] = useState(true);

    const cargarStats = async () => {
        try {
            const resp = await SomosNaturales.get('/usuarios/stats/conteo');
            setWorkers(resp.data.workers);
            setConsumers(resp.data.consumers);
        } catch (error) {
            console.error("Error cargando estadísticas", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarStats();
    }, []);

    return (
        <>
        <div className="max-w-7xl mx-auto px-4 mb-10">
            {/* Título de Sección */}
            <div className="flex items-center gap-3 mb-8 ml-2">
                <div className="bg-orange-500 p-2 rounded-lg shadow-lg shadow-orange-200">
                    <IoStatsChart className="text-white text-xl" />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">
                        Métricas de <span className="text-orange-500">Crecimiento</span>
                    </h2>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Monitoreo de red en tiempo real</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">

                {/* Tarjeta de Trabajadores - Estilo Dark Premium */}
                <div className="group relative bg-gray-900 rounded-[2.5rem] p-8 overflow-hidden shadow-2xl transition-all duration-500 hover:-translate-y-2">
                    {/* Decoración de fondo */}
                    <div className="absolute -right-4 -top-4 bg-orange-500/10 w-32 h-32 rounded-full blur-3xl group-hover:bg-orange-500/20 transition-colors"></div>

                    <div className="flex items-center justify-between relative z-10">
                        <div className="space-y-1">
                            <p className="text-orange-500 text-[10px] font-black uppercase tracking-[0.3em] italic">Staff Activo</p>
                            <h3 className="text-5xl md:text-6xl font-black text-white tracking-tighter italic">
                                {loading ? '...' : workers.total}
                            </h3>
                            <p className="text-gray-400 font-bold uppercase text-xs tracking-tighter">Trabajadores en nómina</p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-md p-5 rounded-[2rem] border border-white/10 group-hover:scale-110 transition-transform duration-500">
                            <IoBriefcase className="text-orange-500 text-4xl" />
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/5 flex items-center gap-3 relative z-10">
                        <IoTimeOutline className="text-gray-500" />
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                            Último ingreso: <strong className="text-gray-300 italic">{workers.ultimo || 'N/A'}</strong>
                        </span>
                    </div>
                </div>

                {/* Tarjeta de Consumidores - Estilo Light Clean */}
                <div className="group relative bg-[#dbeeb9] rounded-[2.5rem] p-8 overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.08)] border-2 border-gray-100 transition-all duration-500 hover:border-orange-500/50 hover:shadow-orange-200/40 hover:-translate-y-2">

                    {/* Decoración de fondo: Círculo de luz naranja suave */}
                    <div className="absolute -right-6 -top-6 bg-orange-400/10 w-40 h-40 rounded-full blur-3xl group-hover:bg-orange-400/20 transition-all"></div>

                    <div className="flex items-center justify-between relative z-10">
                        <div className="space-y-1">
                            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] italic">Comunidad</p>
                            <h3 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter italic">
                                {loading ? '...' : consumers.total}
                            </h3>
                            <p className="text-gray-400 font-bold uppercase text-[11px] tracking-tighter mt-1">Usuarios registrados en la red</p>
                        </div>

                        {/* El Icono ahora tiene un gradiente para despegarse del fondo */}
                        <div className="bg-gradient-to-br from-orange-400 to-orange-600 p-5 rounded-[2rem] shadow-xl shadow-orange-200 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                            <IoPeople className="text-white text-4xl" />
                        </div>
                    </div>

                    {/* Footer de la tarjeta con más peso visual */}
                    <div className="mt-8 pt-6 border-t border-gray-200/60 flex items-center gap-3 relative z-10">
                        <div className="bg-orange-100 p-1.5 rounded-lg">
                            <IoTimeOutline className="text-orange-600" />
                        </div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            Nuevo cliente: <strong className="text-gray-900 italic font-black">{consumers.ultimo || 'N/A'}</strong>
                        </span>
                    </div>
                </div>

            </div>
        </div>
        <StoreAnalytics/>
        </>
    );
};