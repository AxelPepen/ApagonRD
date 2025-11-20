import {Report} from "../../domain/model/report/Report.ts";

interface ReportDetailModalProps {
    report: Report | null;
    isOpen: boolean;
    onClose: () => void;
}

export const ReportDetailModal = ({report, isOpen, onClose}: ReportDetailModalProps) => {
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