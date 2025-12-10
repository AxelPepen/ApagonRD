import {ChangeEvent, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';

export const LandingSite = () => {
    const navigate = useNavigate();
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const currentTheme = localStorage.getItem('theme') || 'light';
        if (currentTheme === 'dark') {
            document.documentElement.classList.add('dark');
            setIsDark(true);
        }
    }, []);

    const handleToggle = (e: ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        setIsDark(checked);

        if (checked) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    const faqs = [
        {
            question: "¿Cómo funciona la aplicación?",
            answer: "ApagonRD recibe reportes hechos por nuestros usuarios y los usa para determinar el estado de un sector."
        },
        {
            question: "¿Es gratis?",
            answer: "Sí, ApagonRD es completamente gratuita. Queremos que todos los dominicanos tengan acceso a información vital sobre los cortes de electricidad."
        },
        {
            question: "¿Mis reportes llegaran a la distribuidora de energia correspondiente?",
            answer: "Si, nos encargaremos de hacer llegar los reportes aprobados a la distribuidora de energia que le corresponda al sector."
        },
        {
            question: "¿Funciona en toda la República Dominicana?",
            answer: "No, por ahora solo funciona en parte de Santo Domingo, pero queremos en el futuro expandirnos a todo el pais."
        },
        {
            question: "¿Necesito crear una cuenta?",
            answer: "Si, es necesario registrarse en la aplicación para poder acceder a las funciones que esta ofrece."
        }
    ];

    const downloadLink = "https://github.com/RainelC/apagon-rd/releases/download/v0.1.0-beta/ApagonRD.apk";
    const currentYear = new Date().getFullYear();

    return (
        <div className="min-h-screen bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 transition-colors duration-300 overflow-y-auto hide-scrollbar">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md shadow-sm z-50 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="text-2xl font-bold bg-gradient-to-r from-sky-500 to-sky-700 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent cursor-pointer"
                        onClick={() => window.scrollTo(0, 0)}>ApagonRD</div>
                    <ul className="flex gap-8 items-center list-none">
                        <li className="hidden md:block"><a href="#about" className="text-slate-900 dark:text-slate-100 hover:text-sky-500 dark:hover:text-blue-400 font-medium transition-colors">Acerca de</a></li>
                        <li className="hidden md:block"><a href="#faq" className="text-slate-900 dark:text-slate-100 hover:text-sky-500 dark:hover:text-blue-400 font-medium transition-colors">FAQ</a></li>
                        <li className="hidden md:block"><a href="#download" className="text-slate-900 dark:text-slate-100 hover:text-sky-500 dark:hover:text-blue-400 font-medium transition-colors">Descargar</a></li>
                        <li className="hidden md:block"><a href="#contact" className="text-slate-900 dark:text-slate-100 hover:text-sky-500 dark:hover:text-blue-400 font-medium transition-colors">Contactanos</a></li>
                        <li>
                            <button onClick={() => navigate('/auth/login')} className="px-5 py-2 bg-sky-500 text-white font-semibold rounded-lg shadow-sm hover:shadow-md hover:bg-sky-600 transition-all">
                                Ingresar
                            </button>
                        </li>
                        <li className="flex items-center ml-6">
                            <label className="relative inline-block w-[50px] h-6">
                                <input type="checkbox" checked={isDark} onChange={handleToggle} className="opacity-0 w-0 h-0" aria-label="Toggle dark mode"/>
                                  <span className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-all duration-300 ${isDark ? 'bg-sky-500' : 'bg-gray-300'}`}>
                                  <span className={`absolute h-[18px] w-[18px] left-[3px] bottom-[3px] bg-white rounded-full transition-transform duration-300 ${isDark ? 'translate-x-[26px]' : ''}`} />
                                  </span>
                            </label>
                        </li>
                    </ul>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-500 to-sky-700 dark:from-slate-900 dark:to-slate-700 text-white text-center px-6 py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(251,191,36,0.1)_0%,transparent_50%),radial-gradient(circle_at_80%_80%,rgba(14,165,233,0.15)_0%,transparent_50%)] dark:bg-[radial-gradient(circle_at_20%_50%,rgba(251,191,36,0.08)_0%,transparent_50%),radial-gradient(circle_at_80%_80%,rgba(96,165,250,0.06)_0%,transparent_50%)] animate-pulse" />
                <div className="relative z-10 max-w-4xl">
                    <h1 className="text-6xl font-extrabold mb-6 leading-tight drop-shadow-lg dark:text-amber-400">
                        Mantente Informado sobre los Apagones
                    </h1>
                    <p className="text-2xl mb-10 opacity-95 font-light dark:text-amber-400">
                        La plataforma que te mantiene al día con los cortes de electricidad en República Dominicana y te permite reportarlos facilmente.
                    </p>
                    <a href="#download" className="inline-block px-10 py-4 bg-amber-400 dark:bg-amber-400 text-slate-900 dark:text-slate-900 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 hover:bg-amber-500 dark:hover:bg-amber-500">
                        Descargar App Movil
                    </a>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-24 px-6 bg-white dark:bg-slate-800">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-sky-500 to-sky-700 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
                        ¿Qué es ApagonRD?
                    </h2>
                    <div className="max-w-4xl mx-auto text-center space-y-6">
                        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                            ApagonRD es un proyecto creado para ayudar a los dominicanos a mantenerse informados sobre el estado del servicio eléctrico en el país. Con nuestra plataforma, puedes conocer en tiempo real qué sectores tienen luz, cuáles no, y reportar cualquier inconveniente de forma rápida y sencilla.
                        </p>
                        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                            Nuestro objetivo es construir una comunidad que se mantenga conectada y colaborativa, compartiendo información para mejorar el acceso a la energía en cada rincón de la República Dominicana.
                        </p>
                        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                            Únete a ApagonRD y sé parte del cambio: juntos podemos hacer que la información llegue a todos.
                        </p>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="py-24 px-6 bg-slate-50 dark:bg-slate-800">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-sky-500 to-sky-700 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
                        Preguntas Frecuentes
                    </h2>
                    <div className="max-w-4xl mx-auto flex flex-col gap-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="bg-white dark:bg-slate-700 rounded-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
                                    {faq.question}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    {faq.answer}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Download Section */}
            <section id="download" className="py-24 px-6 bg-white dark:bg-slate-800">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-sky-500 to-sky-700 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
                        Descarga la App
                    </h2>
                    <div className="max-w-2xl mx-auto text-center">
                        <p className="text-lg text-slate-600 dark:text-slate-400 mb-10">
                            Disponible para Android. Descarga ahora y empieza a estar informado sobre
                            los apagones en tu área.
                        </p>
                        <div className="flex gap-5 justify-center flex-wrap">
                            <a href={downloadLink} target="_blank" rel="noopener noreferrer"
                               className="inline-flex items-center gap-3 px-8 py-4 bg-slate-800 dark:bg-gradient-to-r dark:from-amber-400 dark:to-orange-500 text-white dark:text-slate-900 rounded-xl font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 dark:font-bold">
                                <span className="text-2xl">📱</span>
                                <div className="text-left">
                                    <div className="text-xs opacity-80">Descarga</div>
                                    <div>Directa</div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-24 px-6 bg-slate-50 dark:bg-slate-800">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-sky-500 to-sky-700 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
                        Contáctanos
                    </h2>
                    <div className="max-w-2xl mx-auto flex flex-col gap-8">
                        <div className="bg-white dark:bg-slate-700 rounded-xl p-8 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 text-center">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
                                Correo Electrónico
                            </h3>
                            <a href="mailto:contacto@apagonrd.com" className="text-xl text-sky-500 dark:text-blue-400 hover:text-sky-700 dark:hover:text-blue-300 font-medium transition-all duration-300 inline-block hover:scale-105">
                                contacto@apagonrd.com
                            </a>
                        </div>
                        <div className="bg-white dark:bg-slate-700 rounded-xl p-8 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 text-center">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
                                Teléfono
                            </h3>
                            <a href="tel:+18492617198" className="text-xl text-sky-500 dark:text-blue-400 hover:text-sky-700 dark:hover:text-blue-300 font-medium transition-all duration-300 inline-block hover:scale-105">
                                +1 (849) 261-7198
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-800 dark:bg-slate-950 text-white py-16 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="text-3xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                        ApagonRD
                    </div>
                    <p className="text-slate-400 mb-8">
                        Manteniéndote informado sobre los cortes de electricidad en República Dominicana
                    </p>
                    <ul className="flex gap-6 justify-center list-none mb-8">
                        <li><a href="#about" className="text-white hover:text-amber-400 transition-colors">Acerca de</a></li>
                        <li><a href="#faq" className="text-white hover:text-amber-400 transition-colors">FAQ</a></li>
                        <li><a href="#download" className="text-white hover:text-amber-400 transition-colors">Descargar</a></li>
                        <li><a href="#contact" className="text-white hover:text-amber-400 transition-colors">Contacto</a></li>
                    </ul>
                    <div className="text-slate-400 text-sm pt-8 border-t border-slate-700">
                        © {currentYear} ApagonRD. Todos los derechos reservados.
                    </div>
                </div>
            </footer>
        </div>
    );
};

