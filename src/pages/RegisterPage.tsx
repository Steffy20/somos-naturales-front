import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';
import SomosNaturales from '../api/somosNaturalesApi';
import { GoogleLogin } from '../components/ui/GoogleSign';
import Swal from 'sweetalert2';

export const RegisterPage = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        nombre: '',
        correo: '',
        password: ''
    });

    const { nombre, correo, password } = formData;

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Validación de formato de Email
    const validateEmail = (email: string) => {
        return String(email)
            .toLowerCase()
            .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    };

    const onRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        // --- VALIDACIONES DE FRONTEND ---
        if (nombre.trim().length < 3) {
            return Swal.fire({
                icon: 'warning',
                title: 'Nombre inválido',
                text: 'Por favor, ingresa tu nombre completo (mínimo 3 caracteres).',
                confirmButtonColor: '#16a34a'
            });
        }

        if (!validateEmail(correo)) {
            return Swal.fire({
                icon: 'error',
                title: 'Correo no válido',
                text: 'El formato del correo electrónico es incorrecto.',
                confirmButtonColor: '#16a34a'
            });
        }

        if (password.length < 6) {
            return Swal.fire({
                icon: 'info',
                title: 'Seguridad',
                text: 'La contraseña debe tener al menos 6 caracteres.',
                confirmButtonColor: '#16a34a'
            });
        }

        setIsLoading(true);

        try {
            const resp = await SomosNaturales.post('/register/registerConsumer', { nombre, correo, password });
            const { usuario, token } = resp.data;

            // Guardar sesión
            login(usuario, token);

            // Alerta de éxito total
            await Swal.fire({
                icon: 'success',
                title: '¡Cuenta creada!',
                text: 'Tu registro ha sido exitoso. ¡Bienvenido a Somos Naturales!',
                timer: 3000,
                showConfirmButton: false
            });

            // Redirigir al home o dashboard
            navigate('/home');

        } catch (error: any) {
            console.log(error.response?.data);
            
            const errorMsg = error.response?.data?.msg || 'Hubo un problema al crear tu cuenta.';
            
            Swal.fire({
                icon: 'error',
                title: 'Error en el registro',
                text: errorMsg,
                confirmButtonColor: '#16a34a'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-green-600 via-green-500 to-yellow-500 px-4">
            
            {isLoading ? (
                <div className="flex flex-col items-center justify-center animate-fadeIn">
                    <div className="text-8xl animate-bounce mb-4 drop-shadow-2xl">
                        <div className="animate-spin-slow">🍔</div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-md px-6 py-2 rounded-full border border-white/30 shadow-xl">
                        <p className="text-white font-black uppercase tracking-widest text-lg animate-pulse">
                            Cocinando tu perfil...
                        </p>
                    </div>
                </div>
            ) : (
                <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden transform transition-all hover:scale-[1.01]">
                    <div className="p-8 md:p-10">
                        <div className="flex flex-col items-center mb-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl shadow-inner mb-4">
                                🥗
                            </div>
                            <h1 className="text-3xl font-black text-gray-800 uppercase italic tracking-tighter">
                                Crear <span className="text-green-600">Cuenta</span>
                            </h1>
                            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-1 text-center">
                                Únete a nuestra comunidad natural
                            </p>
                        </div>

                        <form onSubmit={onRegister} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Nombre Completo</label>
                                <input 
                                    className="w-full px-5 py-3 bg-gray-50 border-2 border-transparent focus:border-green-400 focus:bg-white rounded-2xl outline-none transition-all font-medium text-gray-700 shadow-sm"
                                    type="text" 
                                    placeholder="Ej. Juan Pérez" 
                                    name="nombre" 
                                    value={nombre} 
                                    onChange={onChange} 
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Correo Electrónico</label>
                                <input 
                                    className="w-full px-5 py-3 bg-gray-50 border-2 border-transparent focus:border-green-400 focus:bg-white rounded-2xl outline-none transition-all font-medium text-gray-700 shadow-sm"
                                    type="email" 
                                    placeholder="tu@correo.com" 
                                    name="correo" 
                                    value={correo} 
                                    onChange={onChange} 
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Contraseña</label>
                                <input 
                                    className="w-full px-5 py-3 bg-gray-50 border-2 border-transparent focus:border-green-400 focus:bg-white rounded-2xl outline-none transition-all font-medium text-gray-700 shadow-sm"
                                    type="password" 
                                    placeholder="••••••••" 
                                    name="password" 
                                    value={password} 
                                    onChange={onChange} 
                                />
                            </div>

                            <button 
                                type="submit" 
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-green-200 transform active:scale-95 transition-all uppercase tracking-widest mt-4"
                            >
                                Registrarse
                            </button>
                        </form>

                        <div className="my-6 flex items-center before:flex-1 before:border-t before:border-gray-200 after:flex-1 after:border-t after:border-gray-200">
                            <span className="px-3 text-[10px] font-black text-gray-300 uppercase">o regístrate con</span>
                        </div>

                        <GoogleLogin/>

                        <div className="mt-6 text-center">
                            <p className="text-gray-500 text-xs font-bold uppercase">
                                ¿Ya tienes cuenta?{' '}
                                <Link to="/login" className="text-green-600 hover:text-green-700 underline decoration-2 underline-offset-4">
                                    Ingresa aquí
                                </Link>
                            </p>
                        </div>
                    </div>
                    
                    <div className="h-2 w-full flex">
                        <div className="h-full w-1/3 bg-green-600"></div>
                        <div className="h-full w-1/3 bg-yellow-400"></div>
                        <div className="h-full w-1/3 bg-red-500"></div>
                    </div>
                </div>
            )}
        </div>
    );
};