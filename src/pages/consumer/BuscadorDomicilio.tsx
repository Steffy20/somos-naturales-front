import { useState } from 'react';
import { IoBookOutline, IoBicycleOutline, IoLocationSharp, IoSearch, IoCheckmarkCircle } from "react-icons/io5";
import Swal from 'sweetalert2';

// DICCIONARIO MASIVO DE MANTA (Barrios, Parroquias y Zonas)
const SECTORES_MANTA = [
    'tarqui', 'los esteros', 'manta', 'eloy alfaro', 'san mateo',
    'barbasquillo', 'el murcielago', 'la pradera', 'jocay', 'altamira', 
    'el palmar', 'las acacias', 'la aurora', 'la florita', 'san jose',
    'san juan', 'santa martha', 'miraflores', 'la revocacion', 'el porvenir',
    'marina blue', 'manta 2000', 'ciudad azteca', 'puerto azul', 'san isidro',
    'san agustin', 'la victoria', 'barrio cordova', 'barrio perpetuo socorro',
    'uami', 'universidad', 'mall del pacifico', 'terminal terrestre', 
    'vía san mateo', 'vía barbasquillo', 'vía puerto aeropuerto', 'avenida flavio reyes',
    'avenida 24', 'calle 13', 'piedra larga', 'santa marianita', 'jaramijo', // A menudo se incluye por cercanía
    'urbirrios', 'pueblo nuevo', 'las cumbres', 'san pedro'
];

export const SelectorServicio = () => {
    const [direccion, setDireccion] = useState("");

    const scrollAlCatalogo = () => {
        const catalogo = document.getElementById('catalogo-publico');
        if (catalogo) catalogo.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const validarUbicacion = () => {
        const busqueda = direccion.toLowerCase().trim();

        if (busqueda.length < 3) {
            return Swal.fire({
                title: '¿Dónde te encuentras?',
                text: 'Ingresa tu barrio para verificar si llegamos hasta allá.',
                icon: 'question',
                confirmButtonColor: '#f97316'
            });
        }

        const perteneceAManta = SECTORES_MANTA.some(sector => busqueda.includes(sector));

        if (perteneceAManta) {
            Swal.fire({
                title: '<span style="font-family: Arial; font-weight: 900; font-style: italic;">UBICACIÓN CONFIRMADA</span>',
                html: `¡Perfecto! El sector <b>${direccion.toUpperCase()}</b> cuenta con cobertura total de <b>Somos Naturales</b>.`,
                icon: 'success',
                confirmButtonText: 'VER EL MENÚ',
                confirmButtonColor: '#22c55e',
                backdrop: `rgba(34, 197, 94, 0.1)`
            }).then(() => scrollAlCatalogo());
        } else {
            Swal.fire({
                title: 'Revisa tu ubicación',
                html: `El sector <b>"${direccion}"</b> no figura en nuestro mapa de Manta.<br><br><small>Recuerda que operamos solo en Manta, Manabí.</small>`,
                icon: 'error',
                confirmButtonText: 'Intentar con otro sector',
                confirmButtonColor: '#ef4444',
                footer: '<div style="text-align: center"><p style="font-size: 11px; color: #666">Sugerencias: <b>Barbasquillo, La Pradera, Calle 13, Los Esteros, Tarqui</b></p></div>'
            });
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 -mt-16 relative z-10">
            <div className="bg-white rounded-[3.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.2)] p-8 md:p-14 border-t-8 border-orange-500 overflow-hidden shadow-orange-900/10">
                
                <header className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 uppercase italic tracking-tighter leading-none mb-4">
                        ¿Hambre de algo <span className="text-orange-500">Natural?</span>
                    </h1>
                    <div className="flex items-center justify-center gap-2">
                        <IoCheckmarkCircle className="text-green-500" />
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                            Verificador de cobertura oficial
                        </p>
                    </div>
                </header>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    {/* Botón Catálogo */}
                    <button 
                        onClick={scrollAlCatalogo}
                        className="group flex flex-col items-center justify-center p-8 rounded-[2.5rem] border-2 border-gray-100 bg-gray-50 hover:bg-black hover:text-white transition-all duration-500 shadow-sm"
                    >
                        <IoBookOutline className="text-4xl mb-3 text-orange-500" />
                        <span className="font-black uppercase text-lg italic tracking-tighter leading-none">Catálogo Virtual</span>
                        <span className="text-[9px] font-bold opacity-40 uppercase tracking-widest mt-2 group-hover:text-orange-400">Ver productos</span>
                    </button>

                    {/* Botón Domicilio */}
                    <div className="flex flex-col items-center justify-center p-8 rounded-[2.5rem] border-2 border-orange-100 bg-orange-50/50 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-2 bg-orange-500 text-white text-[8px] font-black uppercase italic px-4 rounded-bl-2xl">Activo</div>
                        <IoBicycleOutline className="text-5xl mb-3 text-orange-600 animate-bounce" />
                        <span className="font-black uppercase text-lg text-orange-700 italic tracking-tighter leading-none">Orden a Domicilio</span>
                        <span className="text-[9px] font-bold text-orange-400 uppercase tracking-widest mt-2">Envíos Rápidos</span>
                    </div>
                </div>

                {/* Validador de Barrios */}
                <div className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-grow">
                            <div className="absolute inset-y-0 left-0 pl-7 flex items-center pointer-events-none">
                                <IoLocationSharp className="text-orange-500 text-2xl" />
                            </div>
                            <input 
                                type="text" 
                                value={direccion}
                                onChange={(e) => setDireccion(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && validarUbicacion()}
                                placeholder="Escribe tu barrio (Ej: Barbasquillo)" 
                                className="w-full pl-16 pr-8 py-7 bg-gray-100/50 border-2 border-transparent rounded-[2.2rem] outline-none focus:border-orange-500 focus:bg-white transition-all font-black text-xl text-gray-800 placeholder:text-gray-300 italic shadow-inner"
                            />
                        </div>
                        
                        <button 
                            onClick={validarUbicacion}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-12 py-7 rounded-[2.2rem] font-black uppercase italic tracking-tighter flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-orange-200"
                        >
                            <IoSearch className="text-2xl" />
                            Verificar
                        </button>
                    </div>
                    
                    <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 px-6">
                        <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">
                            Manta • Tarqui • Los Esteros • San Mateo • Eloy Alfaro • San Juan
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};