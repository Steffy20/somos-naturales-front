import { MasVendidos } from './consumer/Masvendidos';
import { MejorRating } from './consumer/MejorRaiting';
import { CatalogoPublico } from './TraerProdcutosPublic';
import { SelectorServicio } from './consumer/BuscadorDomicilio';

export const HomePage = () => {

    return (
        <div className="bg-white min-h-screen">
            {/* 1. SECCIÓN HERO / BANNER (Impacto Total) */}
            <div className="relative w-full h-[300px] md:h-[450px] overflow-hidden">
                <img 
                    className="w-full h-full object-cover object-center" 
                    src="/logo.png" 
                    alt="Promo" 
                />
                {/* Overlay degradado para que el texto resalte */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
                    <div className="max-w-7xl mx-auto w-full px-6">
                        <div className="max-w-md">
                            <span className="bg-red-600 text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-widest">Exclusivo</span>
                            <h2 className="text-white text-4xl md:text-6xl font-black mt-4 leading-none uppercase italic">
                                Somos <br /> <span className="text-yellow-400">Naturales</span>
                            </h2>
                            <p className="text-white/90 mt-4 font-medium text-lg">Disfruta de descuentos y beneficios exclusivos hoy.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. SELECTOR DE SERVICIO (Flotando ligeramente sobre el banner) */}
            <SelectorServicio/>

            {/* 3. SECCIÓN DE PRODUCTOS (Estilo Cards Premium) */}
  <div id="catalogo-publico">
                <CatalogoPublico/>
            </div>

            <MasVendidos/>
            <MejorRating/>
        </div>
    );
};