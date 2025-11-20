import {useEffect, useState} from "react";
import {ReportService} from "../../services/report/ReportService.ts";
import {Report} from "../../domain/model/report/Report.ts";
import {toast} from "react-toastify";

interface ReportDetailModalProps {
    report: Report | null;
    isOpen: boolean;
    onClose: () => void;
}

const ReportDetailModal = ({report, isOpen, onClose}: ReportDetailModalProps) => {
    if (!isOpen || !report) return null;

    return (
        <>
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-[9998]"
                onClick={onClose}
            />
            
            {/* Modal */}
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="p-6">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold text-gray-800">Detalles del Reporte</h2>
                            <button
                                onClick={onClose}
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        {/* Description */}
                        {report.description && (
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">Descripción</h3>
                                <p className="text-gray-600 whitespace-pre-wrap">{report.description}</p>
                            </div>
                        )}

                        {/* Photo */}
                        {report.photoUrl && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">Foto Adjunta</h3>
                                <img
                                    src={report.photoUrl}
                                    alt="Foto del reporte"
                                    className="w-full rounded-lg border border-gray-300"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                />
                            </div>
                        )}

                        {!report.description && !report.photoUrl && (
                            <p className="text-gray-500 text-center py-8">No hay información adicional disponible</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export const MisReportesPage = () => {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        loadReports();
    }, []);

    const loadReports = async () => {
        try {
            setLoading(true);
            const data = await ReportService.instance.getUserReports();
            setReports(data);
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
        <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Mis Reportes</h1>

            {reports.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <i className="fas fa-inbox text-6xl text-gray-400 mb-4"></i>
                    <p className="text-gray-600 text-lg">No tienes reportes registrados</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th className="text-left py-3 px-4">Fecha</th>
                                    <th className="text-left py-3 px-4">Hora</th>
                                    <th className="text-left py-3 px-4">Sector</th>
                                    <th className="text-left py-3 px-4">Motivo</th>
                                    <th className="text-center py-3 px-4">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reports.map((report) => (
                                    <tr key={report.id} className="hover:bg-gray-50">
                                        <td className="py-3 px-4">{formatDate(report.createdAt)}</td>
                                        <td className="py-3 px-4">{formatTime(report.createdAt)}</td>
                                        <td className="py-3 px-4">{report.sector?.name || 'N/A'}</td>
                                        <td className="py-3 px-4">{report.outageType}</td>
                                        <td className="py-3 px-4 text-center">
                                            <button
                                                onClick={() => openModal(report)}
                                                className="w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center transition-colors"
                                                title="Ver detalles"
                                            >
                                                <i className="fas fa-info text-sm"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <ReportDetailModal
                report={selectedReport}
                isOpen={isModalOpen}
                onClose={closeModal}
            />
        </div>
    );
};
