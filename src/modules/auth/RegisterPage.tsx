import {RegisterForm} from "./RegisterForm.tsx";
import {APPVersion} from "../../components/io/output/shared/APPVersion.tsx";
import logo from "../../assets/images/logo.png";

export const RegisterPage = () => {
    return (
        <div
            className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-blue-100 to-blue-200 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-100 transition-colors duration-500">

            <div
                className="grid lg:grid-cols-2 w-full max-w-6xl h-[90vh] lg:h-[85vh] bg-white dark:bg-gray-950 shadow-2xl rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 backdrop-blur-sm">

                <div className="flex items-start justify-center p-10 lg:p-14 overflow-y-auto hide-scrollbar">
                    <div className="w-full max-w-md space-y-8 py-4">
                        <div className="text-center">
                            <h1 className="text-4xl font-extrabold text-blue-700 dark:text-blue-400 tracking-tight">
                                Crear cuenta
                            </h1>
                        </div>
                        <RegisterForm/>
                    </div>
                </div>

                <div
                    className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-tr from-blue-600 via-blue-500 to-sky-400 text-white px-10 py-20 relative overflow-hidden">
                    <div
                        className="absolute inset-0 opacity-20 bg-[url('/textures/pattern.svg')] bg-cover bg-center"></div>
                    <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                        <img
                            src={logo}
                            alt="Logo"
                            className="w-48 lg:w-56 h-auto mb-4 drop-shadow-lg"
                        />

                        <h2 className="text-4xl font-bold leading-tight drop-shadow-md">
                            Únete a nuestra plataforma
                        </h2>
                        <p className="text-lg font-medium leading-relaxed text-blue-100 max-w-md">
                            Crea tu cuenta y comienza a usar nuestros servicios de manera fácil y segura.
                        </p>
                    </div>
                </div>

            </div>

            <APPVersion className="fixed bottom-3 left-3 text-xs text-gray-500 dark:text-gray-400"/>
        </div>
    );
};

