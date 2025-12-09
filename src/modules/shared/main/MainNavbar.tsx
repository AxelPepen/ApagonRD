import {isNil} from "lodash";
import {NavigateFunction, useNavigate, useLocation} from "react-router-dom";
import {LoadingContent} from "../../../components/io/output/LoadingContent.tsx";
import {AuthContextValue, useAuthContext} from "../../../contexts/AuthContext.tsx";
import clsx from "clsx";
import {useEffect, useState} from "react";
import {ChangePasswordModal} from "./ChangePasswordModal.tsx";
import {EditProfileModal} from "./EditProfileModal.tsx";

export const MainNavbar = () => {
    const navigate: NavigateFunction = useNavigate();
    const location = useLocation();
    const {current, logout}: AuthContextValue = useAuthContext();
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    const [showEditProfileModal, setShowEditProfileModal] = useState(false);
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        const stored = localStorage.getItem('theme');
        return stored === 'dark' ? 'dark' : 'light';
    });

    useEffect(() => {
        const root = document.documentElement;
        root.setAttribute('data-theme', theme);
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

    const navItems = [
        { path: '/app/inicio', label: 'Inicio', icon: 'fa-home' },
        { path: '/app/reportar', label: 'Reportar', icon: 'fa-plus-circle' },
        { path: '/app/mis-reportes', label: 'Mis reportes', icon: 'fa-list' },
        { path: '/app/dashboard', label: 'Estadisticas', icon: 'fa-chart-line' },
        { path: '/app/asistente', label: 'Asistente', icon: 'fa-robot' },
    ];

    const isActive = (path: string) => location.pathname.startsWith(path);

    return (
        <>
        <header className="fixed top-0 left-0 right-0 z-50 shadow-md" style={{background: 'var(--color-surface)', color: 'var(--color-text)'}}>
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo/Brand */}
                    <div className="flex items-center cursor-pointer" onClick={() => navigate('/app/inicio')}>
                        <h1 className="text-xl font-bold" style={{color: 'var(--color-primary)'}}>ApagónRD</h1>
                    </div>

                    {/* Navigation Items */}
                    <nav className="flex items-center gap-1">
                        {navItems.map((item) => (
                        <button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                className={clsx(
                                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2",
                                    isActive(item.path)
                                        ? "bg-blue-600 text-white"
                                        : "text-gray-700 hover:bg-gray-100"
                                )}
                        >
                                <i className={clsx("fa", item.icon)}></i>
                                {item.label}
                        </button>
                        ))}
                    </nav>

                    {/* Profile Menu */}
                        <div className="menu" data-menu="true">
                            <div className="menu-item" data-menu-item-offset="20px, 10px"
                                 data-menu-item-offset-rtl="-20px, 10px" data-menu-item-placement="bottom-end"
                                 data-menu-item-placement-rtl="bottom-start" data-menu-item-toggle="dropdown"
                                 data-menu-item-trigger="click|lg:click">
                            <div className="menu-toggle btn btn-icon rounded-full cursor-pointer">
                                    <LoadingContent className="text-blue-500" loading={isNil(current)}>
                                    <img 
                                        src="/default-avatar.png" 
                                        alt="Profile" 
                                        className="size-10 rounded-full border-2 border-gray-300 shrink-0 object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"%3E%3Ccircle cx="20" cy="20" r="20" fill="%23e5e7eb"/%3E%3Cpath d="M20 20c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.87 0-7 1.79-7 4v2h14v-2c0-2.21-3.13-4-7-4z" fill="%239ca3af"/%3E%3C/svg%3E';
                                        }}
                                    />
                                    </LoadingContent>
                                </div>
                            <div className="menu-dropdown menu-default light:border-gray-300 w-screen max-w-[250px]">
                                <div className="flex flex-col py-2">
                                    {/* User Name */}
                                    {current && (
                                        <div className="px-4 py-3 border-b border-gray-200">
                                            <p className="font-bold text-gray-900 text-sm text-center">
                                                {current.info?.name || current.username || 'Usuario'}
                                            </p>
                                        </div>
                                    )}
                                    
                                    <div className="menu-item" data-menu-dismiss="true">
                                        <button className="menu-link w-full text-left" onClick={() => setShowEditProfileModal(true)}>
                                            <span className="menu-icon">
                                                <i className="fa fa-user-edit fa-fw"></i>
                                            </span>
                                            <span className="menu-title">Editar perfil</span>
                                        </button>
                                    </div>
                                    <div className="menu-item" data-menu-dismiss="true">
                                        <button className="menu-link w-full text-left" onClick={() => setShowChangePasswordModal(true)}>
                                            <span className="menu-icon">
                                                <i className="fa fa-key fa-fw"></i>
                                            </span>
                                            <span className="menu-title">Cambiar contraseña</span>
                                        </button>
                                    </div>
                                    <div className="menu-item" data-menu-dismiss="true">
                                        <button className="menu-link w-full text-left" onClick={toggleTheme}>
                                            <span className="menu-icon">
                                                <i className={`fa ${theme === 'light' ? 'fa-moon' : 'fa-sun'} fa-fw`}></i>
                                            </span>
                                            <span className="menu-title">{theme === 'light' ? 'Modo Oscuro' : 'Modo Claro'}</span>
                                        </button>
                                    </div>
                                    <div className="menu-separator"></div>
                                    <div className="menu-item px-4 py-2">
                                        <button 
                                            className="btn btn-sm btn-light justify-center w-full"
                                            onClick={() => logout && logout()}
                                        >
                                            <i className="fa fa-sign-out-alt mr-2"></i>
                                                Cerrar Sesión
                                        </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <ChangePasswordModal
                isOpen={showChangePasswordModal}
                onClose={() => setShowChangePasswordModal(false)}
            />
            <EditProfileModal
                isOpen={showEditProfileModal}
                onClose={() => setShowEditProfileModal(false)}
            />
        </>
    );
}