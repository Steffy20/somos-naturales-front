import { useContext, useState } from 'react';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthProvider';
import SomosNaturales from '../../api/somosNaturalesApi';
import { IoTrashOutline, IoCloseOutline, IoBagHandleOutline, IoLocationOutline, IoCardOutline } from "react-icons/io5";
import Swal from 'sweetalert2';

export const CartSidebar = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    const { cart, total, removeFromCart, clearCart } = useContext(CartContext);
    const { usuario } = useContext(AuthContext);

    // Estado para el formulario de envío
    const [formData, setFormData] = useState({
        nombreCompleto: usuario?.nombre || '',
        ciudad: '',
        direccion1: '',
        direccion2: '',
        descripcionLugar: '',
        metodoPago: 'EFECTIVO'
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFinalizarCompra = async () => {
        if (cart.length === 0) return;
        
        // Validación básica con SweetAlert
        if (!formData.ciudad || !formData.direccion1) {
            return Swal.fire({
                title: 'Campos incompletos',
                text: 'La ciudad y la dirección principal son obligatorias para el envío.',
                icon: 'warning',
                confirmButtonColor: '#d33'
            });
        }

        const ordenData = {
            productos: cart.map(item => ({
                producto: item._id,
                cantidad: item.cantidad,
                precio: item.precio
            })),
            total,
            datosEnvio: { ...formData },
            metodoPago: formData.metodoPago
        };

        try {
            // Usamos tu instancia de axios para el POST
            await SomosNaturales.post('/orden/', ordenData);

            Swal.fire({
                title: '¡Pedido Realizado!',
                text: 'Estamos preparando tu comida natural.',
                icon: 'success',
                confirmButtonColor: '#16a34a'
            });

            clearCart();
            onClose();
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'No se pudo procesar la orden. Intenta de nuevo.', 'error');
        }
    };

    return (
        <>
            {/* Overlay */}
            <div 
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Sidebar con scroll interno */}
            <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-[101] shadow-2xl transform transition-transform duration-500 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                
                {/* Header */}
                <div className="p-6 border-b-2 border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                    <div className="flex items-center gap-2">
                        <div className="bg-red-100 p-2 rounded-xl text-red-600">
                            <IoBagHandleOutline size={24} />
                        </div>
                        <h3 className="text-xl font-black text-gray-800 uppercase italic tracking-tighter">Confirmar Pedido</h3>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"><IoCloseOutline size={28} /></button>
                </div>

                {/* Contenido con Scroll */}
                <div className="flex-grow overflow-y-auto custom-scrollbar">
                    
                    {/* Sección 1: Productos (Resumen) */}
                    <div className="p-6 space-y-3">
                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Resumen de productos</p>
                        {cart.length === 0 ? (
                            <p className="text-center py-4 text-gray-400 font-bold uppercase text-xs italic">El carrito está vacío</p>
                        ) : (
                            cart.map(item => (
                                <div key={item._id} className="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                                    <img src={item.imagen} alt={item.nombre} className="h-12 w-12 object-cover rounded-lg shadow-sm" />
                                    <div className="flex-grow">
                                        <h6 className="font-black text-gray-800 uppercase text-xs truncate w-32">{item.nombre}</h6>
                                        <p className="text-green-600 font-bold text-xs">{item.cantidad}x ${item.precio}</p>
                                    </div>
                                    <button onClick={() => removeFromCart(item._id)} className="text-gray-300 hover:text-red-600 p-2"><IoTrashOutline /></button>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="h-2 bg-gray-50"></div>

                    {/* Sección 2: Formulario de Envío */}
                    <div className="p-6 space-y-4">
                        <div className="flex items-center gap-2 text-red-600 mb-2">
                            <IoLocationOutline size={20} />
                            <p className="text-[10px] font-black uppercase tracking-widest">Datos de entrega</p>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            <input 
                                className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-red-400 rounded-xl outline-none text-sm transition-all"
                                type="text" name="nombreCompleto" placeholder="Nombre completo" 
                                value={formData.nombreCompleto} onChange={handleInputChange} 
                            />
                            <input 
                                className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-red-400 rounded-xl outline-none text-sm transition-all"
                                type="text" name="ciudad" placeholder="Ciudad (ej. Manta, Portoviejo)" 
                                onChange={handleInputChange} 
                            />
                            <input 
                                className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-red-400 rounded-xl outline-none text-sm transition-all"
                                type="text" name="direccion1" placeholder="Dirección Principal" 
                                onChange={handleInputChange} 
                            />
                            <input 
                                className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-red-400 rounded-xl outline-none text-sm transition-all"
                                type="text" name="direccion2" placeholder="Referencia / Apt / Casa (Opcional)" 
                                onChange={handleInputChange} 
                            />
                            <textarea 
                                className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-red-400 rounded-xl outline-none text-sm transition-all resize-none h-20"
                                name="descripcionLugar" placeholder="Notas adicionales para el repartidor..." 
                                onChange={handleInputChange} 
                            />
                        </div>

                        <div className="flex items-center gap-2 text-red-600 mt-4 mb-2">
                            <IoCardOutline size={20} />
                            <p className="text-[10px] font-black uppercase tracking-widest">Método de pago</p>
                        </div>
                        
                        <select 
                            name="metodoPago" 
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent focus:border-red-400 rounded-xl outline-none text-sm font-bold text-gray-700 appearance-none cursor-pointer"
                        >
                            <option value="EFECTIVO">💵 Pago en Efectivo</option>
                            <option value="TRANSFERENCIA">🏦 Transferencia Bancaria</option>
                        </select>
                    </div>
                </div>

                {/* Footer Fijo */}
                <div className="p-6 border-t-4 border-yellow-400 bg-white shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
                    <div className="flex justify-between items-center mb-4">
                        <span className="font-black text-gray-400 uppercase text-xs tracking-widest">Total Pedido:</span>
                        <span className="text-3xl font-black text-gray-800 tracking-tighter">${total.toFixed(2)}</span>
                    </div>
                    <button 
                        onClick={handleFinalizarCompra}
                        disabled={cart.length === 0}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-green-100 active:scale-95 transition-all uppercase tracking-widest disabled:opacity-50"
                    >
                        Confirmar y Enviar
                    </button>
                    <button onClick={clearCart} className="w-full text-gray-400 font-bold text-[10px] uppercase mt-3 hover:text-red-600 transition-colors">
                        Limpiar Carrito
                    </button>
                </div>
            </div>
        </>
    );
};