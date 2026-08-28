import { useEffect, useState } from 'react';
import SomosNaturales from '../../api/somosNaturalesApi';
import { IoReceiptOutline, IoTimeOutline, IoCheckmarkCircle, IoFastFoodOutline, IoBicycleOutline, IoWalletOutline, IoCheckmarkDoneOutline } from "react-icons/io5";
import { RatingInput } from './RatingInput';

export const MisPedidos = () => {
    const [pedidos, setPedidos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const cargarPedidos = async () => {
        try {
            const { data } = await SomosNaturales.get('/orden/mis-pedidos');
            setPedidos(data.ordenes);
        } catch (error) {
            console.error('Error al cargar pedidos:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarPedidos();
        const interval = setInterval(cargarPedidos, 30000);
        return () => clearInterval(interval);
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDIENTE': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'EN_PREPARACION': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'LISTO': return 'bg-green-100 text-green-700 border-green-200';
            case 'EN_CAMINO': return 'bg-orange-100 text-orange-700 border-orange-200'; // Nuevo
            case 'ENTREGADO': return 'bg-purple-100 text-purple-700 border-purple-200'; // Cambié a púrpura para diferenciar
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin-slow text-6xl">🥗</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 pb-20 pt-10 px-4">
            <div className="max-w-4xl mx-auto">

                {/* Header de la sección */}
                <div className="flex items-center gap-4 mb-10">
                    <div className="bg-red-600 p-3 rounded-2xl shadow-lg shadow-red-200 text-white">
                        <IoReceiptOutline size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-gray-800 uppercase italic tracking-tighter">
                            Mis <span className="text-red-600">Pedidos</span>
                        </h1>
                        <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">
                            Historial y seguimiento en tiempo real
                        </p>
                    </div>
                </div>

                {pedidos.length === 0 ? (
                    <div className="bg-white rounded-[2.5rem] p-12 text-center shadow-xl shadow-gray-200/50 border border-gray-100">
                        <div className="text-6xl mb-4">🍽️</div>
                        <h3 className="font-black text-gray-800 uppercase tracking-tight">¿Tienes hambre?</h3>
                        <p className="text-gray-400 text-sm font-bold uppercase mt-2">Aún no has realizado ningún pedido.</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {pedidos.map(pedido => (

                            <div key={pedido._id} className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden transform transition-all hover:scale-[1.01] mb-8">

                                {/* 1. Header del Pedido */}
                                <div className="p-6 border-b border-gray-50 flex flex-wrap justify-between items-center gap-4 bg-gray-50/50">
                                    <div className="flex items-center gap-3">
                                        <div className="text-gray-400"><IoTimeOutline size={20} /></div>
                                        <span className="font-black text-gray-800 text-sm uppercase">
                                            {new Date(pedido.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase border-2 ${getStatusColor(pedido.estado)}`}>
                                        {pedido.estado.replace('_', ' ')}
                                    </span>
                                </div>

                                {/* 2. Cuerpo: Productos y Total */}
                                <div className="p-6 md:p-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tu Banquete</p>
                                            {pedido.productos.map((item: any, index: number) => (
                                                <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-2xl">
                                                    <span className="text-sm font-bold text-gray-700">
                                                        <span className="text-red-600 font-black mr-2">{item.cantidad}x</span>
                                                        {item.producto.nombre}
                                                    </span>
                                                    <span className="text-sm font-black text-gray-800">${(item.precio * item.cantidad).toFixed(2)}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="bg-yellow-50 rounded-[2rem] p-6 flex flex-col justify-center border border-yellow-100">
                                            <p className="text-[10px] font-black text-yellow-700 uppercase tracking-widest mb-2 text-center">Resumen de Pago</p>
                                            <div className="flex justify-between items-center text-2xl font-black text-gray-800 tracking-tighter">
                                                <span>TOTAL:</span>
                                                <span className="text-green-600">${pedido.total.toFixed(2)}</span>
                                            </div>
                                            <p className="text-center text-[10px] font-bold text-yellow-600 uppercase mt-2 italic">
                                                Método: {pedido.metodoPago}
                                            </p>
                                        </div>
                                    </div>

                                    {/* 3. Stepper (Barra de progreso) */}
                                    <div className="mt-10 mb-6 py-6 border-t border-gray-100 overflow-visible"> {/* Asegúrate que diga overflow-visible */}
                                        <div className="flex justify-between items-start relative w-full"> {/* items-start ayuda con el alineado */}

                                            {/* Línea de fondo: ajustamos el ancho al 80% para que no sobresalga de los extremos */}
                                            <div className="absolute top-5 left-[10%] w-[80%] h-0.5 bg-gray-100 -z-0"></div>

                                            <StepItem
                                                icon={<IoReceiptOutline />}
                                                label="Recibido"
                                                active={['PENDIENTE', 'EN_PREPARACION', 'LISTO', 'EN_CAMINO', 'ENTREGADO'].includes(pedido.estado)}
                                            />
                                            <StepItem
                                                icon={<IoFastFoodOutline />}
                                                label="En Cocina"
                                                active={['EN_PREPARACION', 'LISTO', 'EN_CAMINO', 'ENTREGADO'].includes(pedido.estado)}
                                            />
                                            <StepItem
                                                icon={<IoCheckmarkCircle />}
                                                label="¡Listo!"
                                                active={['LISTO', 'EN_CAMINO', 'ENTREGADO'].includes(pedido.estado)}
                                            />
                                            <StepItem
                                                icon={<IoBicycleOutline />}
                                                label="En camino"
                                                active={['EN_CAMINO', 'ENTREGADO', 'PAGADO'].includes(pedido.estado)}
                                            />
                                            <StepItem
                                                icon={<IoCheckmarkDoneOutline />}
                                                label="Entregado"
                                                active={['ENTREGADO', 'PAGADO'].includes(pedido.estado)}
                                            />
                                            <StepItem
                                                icon={<IoWalletOutline />}
                                                label="Pagado"
                                                active={pedido.estado === 'PAGADO'}
                                            />
                                        </div>
                                    </div>

                                    {/* 4. Sección de Calificación (Solo si está ENTREGADO) */}
                                    {pedido.estado === 'ENTREGADO' && (
                                        <div className="mt-8 pt-8 border-t-2 border-dashed border-gray-100">
                                            <h3 className="text-lg font-black text-gray-800 uppercase italic tracking-tighter mb-4 flex items-center gap-2">
                                                <span className="bg-orange-500 w-2 h-5 rounded-full"></span>
                                                Califica tu experiencia
                                            </h3>
                                            <div className="grid gap-3">
                                                {pedido.productos.map((item: any) => (
                                                    <div key={item.producto._id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-orange-50/30 rounded-2xl border border-orange-100">
                                                        <span className="font-bold text-gray-700 text-sm">{item.producto.nombre}</span>
                                                        <RatingInput producto={item.producto} />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// Subcomponente para los pasos del stepper
const StepItem = ({ icon, label, active }: { icon: any, label: string, active: boolean }) => (
    <div className="flex flex-col items-center relative z-10 flex-1 px-1"> {/* flex-1 en lugar de w-1/5 */}
        <div className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center text-lg md:text-xl transition-all duration-500 shadow-md ${active
            ? 'bg-red-600 text-white scale-110 shadow-red-200'
            : 'bg-white text-gray-300 border-2 border-gray-100'
            }`}>
            {icon}
        </div>
        <span className={`text-[7px] md:text-[9px] font-black uppercase mt-3 tracking-tighter leading-none text-center ${active ? 'text-red-600' : 'text-gray-400'
            }`}>
            {label}
        </span>
    </div>
);