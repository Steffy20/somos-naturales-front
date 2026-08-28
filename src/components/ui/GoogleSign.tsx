import { useEffect } from 'react';
import SomosNaturales from '../../api/somosNaturalesApi';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {  IoShieldCheckmarkOutline } from 'react-icons/io5';

export const GoogleLogin = () => {
    const navigate = useNavigate();

    const handleCredentialResponse = async (response: any) => {
        try {
            const resp = await SomosNaturales.post('/auth/google', { id_token: response.credential });
            
            localStorage.setItem('x-token', resp.data.token);

            await Swal.fire({
                icon: 'success',
                title: '¡Sesión Iniciada!',
                text: `Bienvenido ${resp.data.usuario.nombre}`,
                timer: 1500,
                showConfirmButton: false,
                customClass: { popup: 'rounded-[2rem]' }
            });

            if (resp.data.usuario.rol === 'CONSUMER_ROLE') {
                navigate('/home');
            } else {
                navigate('/dashboard');
            }

        } catch (error) {
            Swal.fire('Error', 'No se pudo vincular con la cuenta de Google', 'error');
        }
    }

    useEffect(() => {
        // @ts-ignore
        google.accounts.id.initialize({
            client_id: "28412389492-2b3aiio0puccnrnq4v9r2hqm28pl6ptf.apps.googleusercontent.com",
            callback: handleCredentialResponse
        });

        // @ts-ignore
        google.accounts.id.renderButton(
            document.getElementById("googleBtn"),
            { 
                theme: "outline", 
                size: "large",
                width: "100%", 
                text: "continue_with",
                shape: "pill"
            } 
        );
    }, []);

    return (
        <div className="w-full max-w-sm mx-auto">
            {/* Separador Visual */}
            <div className="flex items-center my-6 gap-4">
                <div className="h-[1px] bg-gray-200 flex-1"></div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] italic">O accede con</span>
                <div className="h-[1px] bg-gray-200 flex-1"></div>
            </div>

            {/* Contenedor del Botón */}
            <div className="relative group">
                {/* Glow Effect de fondo */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-red-500 to-yellow-500 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                
                <div className="relative bg-white p-1 rounded-full shadow-xl border border-gray-50 flex items-center justify-center">
                    {/* Este div recibirá el renderizado de Google */}
                    <div id="googleBtn" className="w-full overflow-hidden flex justify-center"></div>
                </div>
            </div>

            {/* Footer de Confianza */}
            <div className="flex items-center justify-center gap-2 mt-6 opacity-50 group-hover:opacity-100 transition-opacity">
                <IoShieldCheckmarkOutline className="text-gray-400" size={14} />
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest italic">
                    Conexión segura vía Google Cloud
                </p>
            </div>
        </div>
    );
}