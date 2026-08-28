import { useEffect, useState } from 'react';
import SomosNaturales from '../../api/somosNaturalesApi';
import Swal from 'sweetalert2';
import { IoTimerOutline, IoFastFoodOutline, IoCheckmarkDoneOutline, IoCloseCircleOutline, IoMapOutline, IoWalletOutline } from "react-icons/io5";

export const WorkerPanel = () => {
    const [ordenes, setOrdenes] = useState<any[]>([]);

    const fetchOrdenes = async () => {
        try {
            const { data } = await SomosNaturales.get('/orden/todas');
            setOrdenes(data.ordenes);
        } catch (error) {
            console.error("Error al obtener órdenes");
        }
    };

    const cambiarEstado = async (id: string, nuevoEstado: string) => {
        try {
            await SomosNaturales.put(`/orden/${id}`, { estado: nuevoEstado });

            Swal.fire({
                title: 'Estado Actualizado',
                text: `Pedido movido a ${nuevoEstado.replace('_', ' ')}`,
                icon: 'success',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
            });

            fetchOrdenes();
        } catch (error) {
            Swal.fire('Error', 'No se pudo actualizar el estado', 'error');
        }
    };

    useEffect(() => {
        fetchOrdenes();
        const interval = setInterval(fetchOrdenes, 10000);
        return () => clearInterval(interval);
    }, []);

    // Agrupamos por importancia (sacamos los entregados del flujo principal si quieres)
    const ordenesActivas = ordenes.filter(o => o.estado !== 'CANCELADO');

    return (
        <div className="min-h-screen bg-[#f8f9fa] p-4 md:p-8">
            {/* Header del Panel */}
            <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 uppercase italic tracking-tighter">
                        Panel de <span className="text-red-600">Cocina</span>
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        <p className="text-gray-500 font-bold text-[10px] uppercase tracking-[0.2em]">Monitoreo en tiempo real</p>
                    </div>
                </div>

                <div className="flex gap-3 text-xs font-black uppercase tracking-tighter text-white">
                    <div className="bg-yellow-500 px-4 py-2 rounded-xl shadow-lg">Pendientes: {ordenes.filter(o => o.estado === 'PENDIENTE').length}</div>
                    <div className="bg-blue-500 px-4 py-2 rounded-xl shadow-lg">En Fuego: {ordenes.filter(o => o.estado === 'EN_PREPARACION').length}</div>
                </div>
            </div>

            {/* Grid de Tickets */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {ordenesActivas.map(orden => (
                    <div
                        key={orden._id}
                        className={`relative bg-white rounded-[2rem] shadow-xl overflow-hidden border-t-8 transition-all ${orden.estado === 'PENDIENTE' ? 'border-yellow-400' :
                            orden.estado === 'EN_PREPARACION' ? 'border-blue-500' :
                                orden.estado === 'LISTO' ? 'border-green-500' : 'border-gray-300'
                            }`}
                    >
                        {/* Contenido del Ticket */}
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-black text-gray-800 uppercase text-lg leading-tight truncate w-48">
                                        {orden.datosEnvio.nombreCompleto}
                                    </h3>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                        ID: {orden._id.substring(orden._id.length - 6)}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-black text-gray-900">${orden.total.toFixed(2)}</p>
                                    <div className="flex items-center justify-end gap-1 text-[9px] font-black text-green-600">
                                        <IoWalletOutline /> {orden.metodoPago}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-4 mb-4 border border-dashed border-gray-200">
                                <p className="text-[10px] font-black text-gray-400 uppercase mb-2 flex items-center gap-1">
                                    <IoFastFoodOutline /> Comanda
                                </p>
                                <ul className="space-y-1">
                                    {orden.productos.map((p: any, i: number) => (
                                        <li key={i} className="text-sm font-bold text-gray-700 flex justify-between">
                                            <span>{p.producto.nombre}</span>
                                            <span className="text-red-600 font-black">x{p.cantidad}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="space-y-2 mb-6">
                                <div className="flex items-start gap-2 text-gray-500">
                                    <IoMapOutline className="mt-1 flex-shrink-0" />
                                    <p className="text-xs font-medium leading-snug">
                                        <span className="font-bold text-gray-700">{orden.datosEnvio.ciudad}:</span> {orden.datosEnvio.direccion1}
                                        {orden.datosEnvio.descripcionLugar && (
                                            <span className="block italic text-gray-400 mt-1">"{orden.datosEnvio.descripcionLugar}"</span>
                                        )}
                                    </p>
                                </div>
                            </div>

                            {/* Acciones */}
                            <div className="grid grid-cols-2 gap-2">
                                {orden.estado === 'PENDIENTE' && (
                                    <button
                                        className="col-span-2 bg-yellow-400 hover:bg-yellow-500 text-black font-black py-3 rounded-xl transition-all flex items-center justify-center gap-2 uppercase text-xs"
                                        onClick={() => cambiarEstado(orden._id, 'EN_PREPARACION')}
                                    >
                                        <IoTimerOutline size={18} /> Iniciar Preparación
                                    </button>
                                )}

                                {orden.estado === 'EN_PREPARACION' && (
                                    <button
                                        className="col-span-2 bg-blue-500 hover:bg-blue-600 text-white font-black py-3 rounded-xl transition-all flex items-center justify-center gap-2 uppercase text-xs shadow-lg shadow-blue-100"
                                        onClick={() => cambiarEstado(orden._id, 'LISTO')}
                                    >
                                        <IoCheckmarkDoneOutline size={18} /> ¡Comida Lista!
                                    </button>
                                )}

                                {orden.estado === 'LISTO' && (
                                    <button
                                        className="col-span-2 bg-orange-500 hover:bg-orange-600 text-white font-black py-3 rounded-xl transition-all flex items-center justify-center gap-2 uppercase text-xs shadow-lg shadow-orange-100"
                                        onClick={() => cambiarEstado(orden._id, 'EN_CAMINO')}
                                    >
                                        <IoBicycleOutline size={18} /> Comida en camino
                                    </button>
                                )}
                                {orden.estado === 'EN_CAMINO' && (
                                    <button
                                        className="col-span-2 bg-purple-600 hover:bg-purple-700 text-white font-black py-3 rounded-xl transition-all flex items-center justify-center gap-2 uppercase text-xs shadow-lg"
                                        onClick={() => cambiarEstado(orden._id, 'ENTREGADO')}
                                    >
                                        <IoCheckmarkDoneOutline size={18} /> Confirmar Entrega
                                    </button>
                                )}
                                {orden.estado === 'ENTREGADO' && (
                                    <button
                                        className="col-span-2 bg-green-600 hover:bg-green-700 text-white font-black py-3 rounded-xl transition-all flex items-center justify-center gap-2 uppercase text-xs shadow-lg animate-pulse"
                                        onClick={() => cambiarEstado(orden._id, 'PAGADO')}
                                    >
                                        <IoWalletOutline size={18} /> Confirmar Pago Recibido
                                    </button>
                                )}
                                {/* Modificamos la condición de cancelar para que no se pueda cancelar si ya está pagado */}
                                {orden.estado !== 'PAGADO' && (
                                    <button
                                        className="col-span-2 border-2 border-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-400 font-black py-2 rounded-xl mt-2 transition-all flex items-center justify-center gap-2 uppercase text-[10px]"
                                        onClick={() => cambiarEstado(orden._id, 'CANCELADO')}
                                    >
                                        <IoCloseCircleOutline size={16} /> Cancelar Pedido
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

import { IoBicycleOutline } from "react-icons/io5";