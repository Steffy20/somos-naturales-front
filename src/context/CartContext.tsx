import  { createContext, useEffect, useState, type ReactNode } from 'react';

interface CartItem {
    _id: string;
    nombre: string;
    precio: number;
    cantidad: number;
    imagen: string;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (producto: any) => void;
    removeFromCart: (id: string) => void;
    clearCart: () => void;
    total: number;
}

export const CartContext = createContext<CartContextType>({} as CartContextType);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>(() => {
        const savedCart = localStorage.getItem('cart-natural');
        return savedCart ? JSON.parse(savedCart) : [];
    });
    useEffect(() => {
        localStorage.setItem('cart-natural', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (producto: any) => {
        const audio = new Audio('/sounds/sound.mp3');
        audio.volume = 0.1; 
        audio.play().catch(err => console.log("Error al reproducir sonido:", err));
        setCart(prevCart => {
            const existe = prevCart.find(item => item._id === producto._id);
            if (existe) {
                return prevCart.map(item =>
                    item._id === producto._id ? { ...item, cantidad: item.cantidad + 1 } : item
                );
            }
            return [...prevCart, { ...producto, cantidad: 1 }];
        });
    };

const removeFromCart = (id: string) => {
        setCart(prevCart => prevCart.filter(item => item._id !== id));
    };

    const clearCart = () => setCart([]);

    const total = cart.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, total }}>
            {children}
        </CartContext.Provider>
    );
};