import  { useEffect, useState, useContext } from 'react';
import { IoFastFoodOutline, IoCartOutline } from "react-icons/io5";
import SomosNaturales from '../../api/somosNaturalesApi';
import { CartContext } from '../../context/CartContext';

export const CatalogoPage = () => {
    const { addToCart } = useContext(CartContext);
    const [productos, setProductos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarProductos = async () => {
            try {
                const { data } = await SomosNaturales.get('/producto/traerProducto');
                setProductos(data.productos.filter((p: any) => p.disponibilidad));
            } catch (error: any) {
                console.log('Error:', error.response?.data?.msg);
            } finally {
                setLoading(false);
            }
        };
        cargarProductos();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50">
                <div className="text-8xl animate-bounce mb-4">
                    <div className="animate-spin-slow text-center">🍔</div>
                </div>
                <div className="bg-red-600 px-6 py-2 rounded-full shadow-lg">
                    <p className="text-white font-black uppercase tracking-widest animate-pulse">
                        Preparando el menú...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header del Catálogo */}
            <header className="bg-white pt-12 pb-8 px-6 shadow-sm border-b-4 border-yellow-400 mb-8">
                <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
                    <IoFastFoodOutline className="text-4xl text-red-600 animate-pulse" />
                    <h2 className="text-3xl md:text-4xl font-black text-gray-800 uppercase italic tracking-tighter text-center">
                        Nuestro Menú <span className="text-red-600 font-black">Especial</span>
                    </h2>
                </div>
                <p className="text-center text-gray-400 font-bold text-xs uppercase tracking-widest mt-2">
                    Ingredientes frescos, sabor natural
                </p>
            </header>

            <div className="max-w-7xl mx-auto px-4">
                {/* Grid Responsivo */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {productos.map((prod) => (
                        <div
                            className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 overflow-hidden group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100"
                            key={prod._id}
                        >
                            {/* Imagen con Badge */}
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={prod.imagen}
                                    alt={prod.nombre}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/60 to-transparent"></div>
                            </div>
                            <div className="product-stats mt-2 flex items-center gap-3">
                                {/* Badge Principal de Rating */}
                                <div className={`
        flex items-center gap-1 px-3 py-1 rounded-full shadow-sm border
        ${prod.ratingPromedio > 0
                                        ? 'bg-yellow-50 border-yellow-200 shadow-yellow-100/50'
                                        : 'bg-orange-50 border-orange-100 shadow-orange-100/50'}
    `}>
                                    <span className={`${prod.ratingPromedio > 0 ? 'text-yellow-500' : 'text-orange-400'} animate-pulse`}>
                                        ⭐
                                    </span>
                                    <span className="text-[11px] font-black text-gray-800 uppercase italic tracking-tighter">
                                        {prod.ratingPromedio > 0 ? `${prod.ratingPromedio.toFixed(1)}` : 'NUEVO'}
                                    </span>
                                </div>

                                {/* Contador de Reviews con estilo minimalista */}
                                <div className="flex items-center gap-1 group cursor-help">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase italic tracking-widest group-hover:text-orange-500 transition-colors">
                                        {prod.numRevisiones}
                                        <span className="ml-1 text-[8px] opacity-70">REVIEWS</span>
                                    </span>
                                </div>
                            </div>
                            {/* Info del Producto */}
                            <div className="p-6">
                                <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight mb-2 truncate">
                                    {prod.nombre}
                                </h3>
                                <p className="text-gray-500 text-sm font-medium line-clamp-2 h-10 mb-4 leading-relaxed">
                                    {prod.descripcion}
                                </p>

                                <div className="flex items-center justify-between mt-4">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-gray-400 uppercase">Precio</span>
                                        <span className="text-2xl font-black text-green-600">
                                            ${prod.precio.toFixed(2)}
                                        </span>
                                    </div>

                                    <button
                                        className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-2xl shadow-lg shadow-red-200 active:scale-90 transition-all flex items-center justify-center group"
                                        onClick={() => addToCart(prod)}
                                        title="Agregar al carrito"
                                    >
                                        <IoCartOutline className="text-2xl group-hover:animate-bounce" />
                                        <span className="ml-2 font-black uppercase text-xs">Añadir</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Decoración final de página */}
            {productos.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-gray-400 font-bold uppercase tracking-widest">No hay productos disponibles por ahora...</p>
                </div>
            )}
        </div>
    );
};