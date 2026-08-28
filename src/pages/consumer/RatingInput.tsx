import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthProvider";
import {  IoStarSharp } from "react-icons/io5"; // Cambiamos a Sharp para un look más sólido
import Swal from "sweetalert2";
import SomosNaturales from "../../api/somosNaturalesApi";

export const RatingInput = ({ producto }: { producto: any }) => {
    const { usuario } = useContext(AuthContext);
    const yaCalifico = producto?.usuariosQueCalificaron?.includes(usuario?.uid || '') || false;
    const [enviado, setEnviado] = useState(yaCalifico);
    const [hover, setHover] = useState(0);

    useEffect(() => {
        setEnviado(yaCalifico);
    }, [yaCalifico]);

    const enviarCalificacion = async (valor: number) => {
        if (!usuario?.uid) return Swal.fire('Error', 'Inicia sesión', 'error');

        try {
            const resp = await SomosNaturales.put(`/producto/calificar/${producto._id}`, {
                rating: valor
            });

            if (resp.data.ok) {
                setEnviado(true);
                Swal.fire({
                    title: '¡BRUTAL!',
                    text: 'Tu calificación se ha guardado con éxito',
                    icon: 'success',
                    confirmButtonColor: '#f97316',
                });
            }
        } catch (error: any) {
            Swal.fire('Ups', 'Algo salió mal', 'error');
        }
    };

    if (enviado) {
        return (
            <div className="flex items-center gap-2 mt-2 bg-green-50 self-start px-3 py-1 rounded-full border border-green-100 animate-bounce-short">
                <IoStarSharp className="text-green-500" size={12} />
                <span className="text-[10px] font-black text-green-700 uppercase italic tracking-tighter">
                    Producto calificado con éxito
                </span>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-1 mt-3">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] italic ml-1">
                ¿Qué tal estuvo?
            </span>
            
            <div className="flex items-center gap-2 bg-gray-50 self-start p-2 rounded-2xl border border-gray-100">
                <div className="flex" onMouseLeave={() => setHover(0)}>
                    {[1, 2, 3, 4, 5].map((num) => (
                        <button 
                            key={num} 
                            onClick={() => enviarCalificacion(num)}
                            onMouseEnter={() => setHover(num)}
                            className="transition-all duration-200 hover:scale-125 focus:outline-none px-0.5"
                        >
                            <IoStarSharp 
                                size={22} 
                                className={`transition-colors duration-200 ${
                                    (hover || 0) >= num 
                                    ? 'text-orange-500 drop-shadow-[0_0_5px_rgba(249,115,22,0.4)]' 
                                    : 'text-gray-200'
                                }`} 
                            />
                        </button>
                    ))}
                </div>
                
                <div className="h-4 w-[2px] bg-gray-200 mx-1"></div>
                
                <span className="text-[11px] font-black text-orange-500 uppercase italic tracking-tighter">
                    {hover > 0 ? `${hover}.0` : '0.0'}
                </span>
            </div>
        </div>
    );
};