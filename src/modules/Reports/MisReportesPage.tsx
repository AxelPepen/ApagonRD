import {useEffect, useState} from "react";
import {ReportService} from "../../services/report/ReportService.ts";
import {Report} from "../../domain/model/report/Report.ts";
import {toast} from "react-toastify";
import {useAuthContext} from "../../contexts/AuthContext.tsx";
import {ReportDetailModal} from "./ReportDetailModal.tsx";


export const MisReportesPage = () => {
    const {current} = useAuthContext();
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        loadReports();
    }, [current]);

    const loadReports = async () => {
        try {
            setLoading(true);
            const data = await ReportService.instance.getUserReports();
            
            // Filtrar reportes del usuario actual y ordenar del más nuevo al más viejo
            const userReports = data
                .filter((report) => report.user?.id === current?.id)
                .sort((a, b) => {
                    const dateA = new Date(a.createdAt).getTime();
                    const dateB = new Date(b.createdAt).getTime();
                    return dateB - dateA; // Más nuevo primero
                });
            
            setReports(userReports);
        } catch (error: any) {
            console.error("Error cargando reportes:", error);
            toast.error("Error al cargar los reportes. Por favor intenta nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-DO', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('es-DO', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const openModal = (report: Report) => {
        setSelectedReport(report);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedReport(null);
    };

    // Calcular paginación
    const totalPages = Math.ceil(reports.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentReports = reports.slice(startIndex, endIndex);

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center h-64">
                <div className="text-center">
                    <i className="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
                    <p className="text-gray-600">Cargando reportes...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="px-32 py-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Mis Reportes</h1>

            {reports.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <i className="fas fa-inbox text-6xl text-gray-400 mb-4"></i>
                    <p className="text-gray-600 text-lg">No tienes reportes registrados</p>
                </div>
            ) : (
                <>
                    <div className="bg-white rounded-lg shadow overflow-hidden px-6">
                        <div className="overflow-x-auto">

                        <table className="table w-full">
                                <thead>
                                    <tr>
                                        <th className="text-center py-3 px-4">Fecha</th>
                                        <th className="text-center py-3 px-4">Hora</th>
                                        <th className="text-center py-3 px-4">Sector</th>
                                        <th className="text-center py-3 px-4">Motivo</th>
                                        <th className="text-center py-3 px-4">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentReports.map((report) => (
                                        <tr key={report.id} className="hover:bg-gray-50">
                                            <td className="py-3 px-4 text-center">{formatDate(report.createdAt)}</td>
                                            <td className="py-3 px-4 text-center">{formatTime(report.createdAt)}</td>
                                            <td className="py-3 px-4 text-center">{report.sector?.name || 'N/A'}</td>
                                            <td className="py-3 px-4 text-center">{report.outageType}</td>
                                            <td className="py-3 px-4 text-center">
                                                <button
                                                    onClick={() => openModal(report)}
                                                    className="w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center transition-colors mx-auto"
                                                    title="Ver detalles"
                                                >
                                                    <i className="fas fa-info text-sm"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan={5} className="py-4 px-4">
                                            <div className="flex items-center justify-between">
                                                <div className="text-sm text-gray-600">
                                                    Mostrando {startIndex + 1} - {Math.min(endIndex, reports.length)} de {reports.length} reportes
                                                </div>
                                                {totalPages > 1 && (
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => goToPage(currentPage - 1)}
                                                            disabled={currentPage === 1}
                                                            className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            <i className="fas fa-chevron-left"></i>
                                                        </button>
                                                        
                                                        <div className="flex items-center gap-1">
                                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                                                if (
                                                                    page === 1 ||
                                                                    page === totalPages ||
                                                                    (page >= currentPage - 1 && page <= currentPage + 1)
                                                                ) {
                                                                    return (
                                                                        <button
                                                                            key={page}
                                                                            onClick={() => goToPage(page)}
                                                                            className={`px-3 py-2 rounded-lg border ${
                                                                                currentPage === page
                                                                                    ? 'bg-blue-600 text-white border-blue-600'
                                                                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                                                            }`}
                                                                        >
                                                                            {page}
                                                                        </button>
                                                                    );
                                                                } else if (page === currentPage - 2 || page === currentPage + 2) {
                                                                    return <span key={page} className="px-2">...</span>;
                                                                }
                                                                return null;
                                                            })}
                                                        </div>

                                                        <button
                                                            onClick={() => goToPage(currentPage + 1)}
                                                            disabled={currentPage === totalPages}
                                                            className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            <i className="fas fa-chevron-right"></i>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </>
            )}

            <ReportDetailModal
                report={selectedReport}
                isOpen={isModalOpen}
                onClose={closeModal}
            />
        </div>
    );
};
