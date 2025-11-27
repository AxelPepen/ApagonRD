import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {AuthService} from "../../../services/auth/AuthService.ts";
import {toast} from "react-toastify";
import {APPVersion} from "../../../components/io/output/shared/APPVersion.tsx";
import logo from "../../../assets/images/logo.png";
import {PasswordInput} from "../../../components/io/PasswordInput.tsx";

export const ChangePasswordPage = () => {
    const navigate = useNavigate();

    const [validating, setValidating] = useState(false);
    const [tokenValid, setTokenValid] = useState(false);
    const [loading, setLoading] = useState(false);

    const [password, setPassword] = useState("");
    const [repeat, setRepeat] = useState("");

    const token = new URLSearchParams(window.location.search).get("token");

    useEffect(() => {
        if (token) {
            // Validar token cuando existe
            setValidating(true);
            AuthService.instance.validateRecoveryToken(token)
                .then((response) => {
                    if (response.result === true) {
                        setTokenValid(true);
                    } else {
                        setTokenValid(false);
                        toast.error("El token de recuperación no es válido o ha expirado.");
                    }
                })
                .catch(() => {
                    setTokenValid(false);
                    toast.error("El token de recuperación no es válido o ha expirado.");
                })
                .finally(() => {
                    setValidating(false);
                });
        } else {
            // Si no hay token, no validamos pero mostramos el formulario
            setValidating(false);
            setTokenValid(false);
        }
    }, [token]);

    const handleSubmit = (e: any) => {
        e.preventDefault();

        if (!token) {
            toast.error("Token ausente. Verifica el enlace del correo.");
            return;
        }

        if (!password || !repeat) {
            toast.error("Rellena ambos campos de contraseña.");
            return;
        }

        if (password !== repeat) {
            toast.error("Las contraseñas no coinciden");
            return;
        }

        setLoading(true);
        AuthService.instance.changePassword({
            token: token,
            password: password,
            repeated: repeat
        })
            .then(() => {
                toast.success("Contraseña cambiada correctamente");
                navigate("/auth/login");
            })
            .catch((err) => {
                const msg = err?.message || "Error cambiando la contraseña";
                toast.error(msg);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    if (validating) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-blue-100 to-blue-200 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
                <div className="flex flex-col items-center p-6 rounded-lg text-center">
                    <i className="text-blue-500 text-4xl mb-2 fas fa-spinner fa-spin"></i>
                    <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        Validando token...
                    </h5>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-blue-100 to-blue-200 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-100 transition-colors duration-500 relative">
            <div className="grid lg:grid-cols-2 w-full max-w-6xl h-[90vh] lg:h-[85vh] bg-white dark:bg-gray-950 shadow-2xl rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 backdrop-blur-sm">
                {/* Panel Izquierdo - Formulario */}
                <div className="flex items-center justify-center p-10 lg:p-14">
                    <div className="w-full max-w-md space-y-8">
                        <div className="text-center">
                            <h1 className="text-3xl font-extrabold text-blue-700 dark:text-blue-400 tracking-tight">
                                Cambiar contraseña
                            </h1>
                            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                                Ingresa y confirma tu nueva contraseña para acceder nuevamente al sistema.
                            </p>
                        </div>

                        {!token && (
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
                                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                    <i className="fas fa-exclamation-triangle mr-2"></i>
                                    No se encontró un token en la URL. Por favor, usa el enlace del correo electrónico.
                                </p>
                            </div>
                        )}

                        {token && !tokenValid && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
                                <p className="text-sm text-red-800 dark:text-red-200">
                                    <i className="fas fa-times-circle mr-2"></i>
                                    El token de recuperación no es válido o ha expirado.
                                </p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="card-body flex flex-col gap-5 p-10">
                            <div className="flex flex-col">
                                <PasswordInput
                                    label={'Nueva Contraseña'}
                                    value={password}
                                    onChange={(e: any) => setPassword(e.target.value)}
                                    required
                                    error={undefined}
                                />
                            </div>
                            <div className="flex flex-col mt-2">
                                <PasswordInput
                                    label={'Repetir Contraseña'}
                                    value={repeat}
                                    onChange={(e: any) => setRepeat(e.target.value)}
                                    required
                                    error={undefined}
                                />
                            </div>
                            <button 
                                type="submit" 
                                className="btn btn-primary flex justify-center grow" 
                                disabled={loading || (!token || !tokenValid)}
                            >
                                Restablecer Contraseña
                                {loading && <i className="fa fa-spin fa-spinner ml-2"/>}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Panel Derecho - Branding */}
                <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-tr from-blue-600 via-blue-500 to-sky-400 text-white px-10 py-20 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-[url('/textures/pattern.svg')] bg-cover bg-center"></div>
                    <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                        <img
                            src={logo}
                            alt="Logo institucional"
                            className="w-48 lg:w-56 h-auto mb-4 drop-shadow-lg"
                        />
                        <h2 className="text-3xl font-bold leading-tight drop-shadow-md">
                            Restablece tu acceso
                        </h2>
                        <p className="text-lg font-medium leading-relaxed text-blue-100 max-w-md">
                            Cambia tu contraseña de manera segura y mantén protegida tu cuenta del sistema escolar.
                        </p>
                    </div>
                </div>
            </div>

            <APPVersion className="fixed bottom-3 left-3 text-xs text-gray-500 dark:text-gray-400"/>
        </div>
    );
};
