import {ChangeEvent, useCallback, useEffect, useMemo, useState} from "react";
import {SectorService} from "../../services/sector/SectorService.ts";
import {Sector, SectorUptimeHistory, SectorUptimeParams} from "../../domain/model/sector/Sector.ts";
import {toast} from "react-toastify";
import {Select} from "../../components/io/Select.tsx";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';
import {Doughnut} from 'react-chartjs-2';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);

const formatDateParam = (date: Date): string => {
    const pad = (value: number): string => value.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

const getCurrentMonthRange = (): SectorUptimeParams => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    start.setHours(0, 0, 0, 0);

    const end = new Date(now);
    end.setHours(23, 59, 59, 999);

    return {
        start: formatDateParam(start),
        end: formatDateParam(end)
    };
};

export const UptimeDashboardPage = () => {
    const [loading, setLoading] = useState(true);
    const [uptime, setUptime] = useState<SectorUptimeHistory | null>(null);
    const [currentSector, setCurrentSector] = useState<Sector | null>(null);
    const [allSectors, setAllSectors] = useState<Sector[]>([]);
    const [showSectorSelector, setShowSectorSelector] = useState(false);
    const [error, setError] = useState<string>();

    // Cargar todos los sectores para el selector manual
    useEffect(() => {
        SectorService.instance.getAllSectors()
            .then((sectors) => {
                setAllSectors(Array.isArray(sectors) ? sectors : []);
            })
            .catch((err) => {
                console.error("Error cargando sectores:", err);
            });
    }, []);

    // Función para cargar estadísticas de un sector
    const loadSectorStats = useCallback(async (sector: Sector) => {
        try {
            setLoading(true);
            setError(undefined);
            const range = getCurrentMonthRange();
            const uptimeData = await SectorService.instance.getSectorUptime(sector.id, range);
            setUptime(uptimeData);
            setCurrentSector(sector);
        } catch (err: any) {
            console.error("Error cargando estadísticas:", err);
            toast.error("No se pudo cargar la información del sector.");
            setError("No se pudo obtener las estadísticas del sector.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (!navigator.geolocation) {
                toast.warning("Tu navegador no soporta geolocalización. Por favor selecciona un sector manualmente.");
                setShowSectorSelector(true);
                setLoading(false);
                return;
            }

            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        const {latitude: lat, longitude: lon} = position.coords;
                        const sector = await SectorService.instance.getCurrentSector(lat, lon);
                        await loadSectorStats(sector);
                        setShowSectorSelector(false);
                    } catch (err: any) {
                        console.error("Error obteniendo sector:", err);
                        toast.warning("No se pudo determinar tu sector automáticamente. Por favor selecciona uno manualmente.");
                        setShowSectorSelector(true);
                        setLoading(false);
                    }
                },
                (geoError) => {
                    console.error("Error geolocalización:", geoError);
                    toast.warning("No se pudo obtener tu ubicación. Por favor selecciona un sector manualmente.");
                    setShowSectorSelector(true);
                    setLoading(false);
                }
            );
        };

        fetchData();
    }, [loadSectorStats]);

    const percentage = uptime?.percentage ?? 0;
    const effectivePercentage = Math.min(Math.max(percentage, 0), 100);

    const downtimeHours = useMemo(() => {
        if (!uptime) return 0;
        return Math.max(uptime.totalHours - uptime.powerHours, 0);
    }, [uptime]);

    const chartData = useMemo(() => {
        if (!uptime) return null;
        return {
            labels: ['Con energía', 'Sin energía'],
            datasets: [{
                data: [uptime.powerHours, downtimeHours],
                backgroundColor: ['#10b981', '#ef4444'],
                borderColor: ['#059669', '#dc2626'],
                borderWidth: 2,
            }]
        };
    }, [uptime, downtimeHours]);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    padding: 15,
                    font: {
                        size: 14
                    }
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context: any) {
                        const label = context.label || '';
                        const value = context.parsed || context.raw;
                        if (context.dataIndex === 0) {
                            return `${label}: ${value.toFixed(2)} horas`;
                        }
                        return `${label}: ${value.toFixed(2)} horas`;
                    }
                }
            }
        }
    };

    const getStatusDisplay = (status: string) => {
        if (status === 'POWER' || status === 'CON_ENERGIA') {
            return {
                text: 'Con energía',
                color: 'text-green-600',
                bgColor: 'bg-green-100',
                icon: 'fa-bolt'
            };
        } else {
            return {
                text: 'Sin energía',
                color: 'text-red-600',
                bgColor: 'bg-red-100',
                icon: 'fa-power-off'
            };
        }
    };

    const sectorStatus = uptime?.sector?.status || currentSector?.status;
    const statusDisplay = sectorStatus ? getStatusDisplay(sectorStatus) : null;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <i className="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
                    <p className="text-gray-600">Cargando estadísticas del sector...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="px-32 py-6 overflow-y-auto hide-scrollbar">
            <div className="flex flex-col gap-4">
                <h1 className="text-3xl font-bold text-gray-800">Estadísticas del sector</h1>
                <p className="text-gray-600 max-w-2xl">
                    Aquí te mostramos cuánto tiempo tu sector ha pasado sin energía este mes.
                </p>
            </div>

            {error && (
                <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                </div>
            )}

            {showSectorSelector && (
                <div className="mt-6">
                    <Select
                        label="Selecciona un sector"
                        options={allSectors.map(sector => ({
                            value: sector.id.toString(),
                            description: sector.name
                        }))}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                            const sectorId = parseInt(e.target.value);
                            if (sectorId) {
                                const selectedSector = allSectors.find(s => s.id === sectorId);
                                if (selectedSector) {
                                    loadSectorStats(selectedSector);
                                    setShowSectorSelector(false);
                                }
                            }
                        }}
                        error={undefined}
                    />
                </div>
            )}

            {!uptime ? (
                !error && !showSectorSelector && (
                    <div className="mt-8 text-gray-600">
                        No se encontró información del sector. Por favor selecciona un sector manualmente.
                    </div>
                )
            ) : (
                <div className="mt-8 space-y-6">
                    {/* Header Card */}
                    <div className="rounded-2xl border border-gray-200 p-6 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <p className="text-sm uppercase tracking-wide text-gray-500 mb-1">Sector</p>
                                <h2 className="text-3xl font-bold text-gray-800">{uptime.sector.name}</h2>
                                {statusDisplay && (
                                    <div className={`mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full ${statusDisplay.bgColor}`}>
                                        <i className={`fas ${statusDisplay.icon} ${statusDisplay.color}`}></i>
                                        <span className={`text-sm font-medium ${statusDisplay.color}`}>
                                            {statusDisplay.text}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500 mb-1">Período</p>
                                <p className="text-lg font-semibold text-gray-700">
                                    {new Date(uptime.start).toLocaleDateString('es-DO', { day: 'numeric', month: 'short' })} - {new Date(uptime.end).toLocaleDateString('es-DO', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-xl border border-gray-200 p-6 shadow-sm bg-white hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-1">Tiempo con energía</p>
                                    <p className="text-3xl font-bold text-green-600">{effectivePercentage.toFixed(1)}%</p>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                                    <i className="fas fa-bolt text-green-600 text-xl"></i>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl border border-gray-200 p-6 shadow-sm bg-white hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-1">Horas con energía</p>
                                    <p className="text-3xl font-bold text-blue-600">{uptime.powerHours.toFixed(1)}</p>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                    <i className="fas fa-clock text-blue-600 text-xl"></i>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl border border-gray-200 p-6 shadow-sm bg-white hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-1">Horas sin energía</p>
                                    <p className="text-3xl font-bold text-red-600">{downtimeHours.toFixed(1)}</p>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                    <i className="fas fa-power-off text-red-600 text-xl"></i>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl border border-gray-200 p-6 shadow-sm bg-white hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-1">Total horas</p>
                                    <p className="text-3xl font-bold text-gray-700">{uptime.totalHours.toFixed(1)}</p>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                                    <i className="fas fa-calendar text-gray-600 text-xl"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Doughnut Chart */}
                    <div className="rounded-2xl border border-gray-200 p-6 shadow-sm bg-white">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Proporción de energía</h3>
                        {chartData && (
                            <div className="h-64">
                                <Doughnut data={chartData} options={chartOptions} />
                            </div>
                        )}
                    </div>

                    {/* Resumen del mes */}
                    <div className="rounded-xl border border-gray-200 p-6 shadow-sm bg-white">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <i className="fas fa-calendar-alt text-purple-500"></i>
                            Resumen del mes
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-lg bg-red-50">
                                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <i className="fas fa-power-off text-red-600"></i>
                                    Días sin energía
                                </span>
                                <span className="text-lg font-bold text-red-700">
                                    {Math.round((downtimeHours / uptime.totalHours) * 30)} días
                                </span>
                            </div>
                            <div className={`flex items-center justify-between p-3 rounded-lg ${effectivePercentage > 50 ? 'bg-green-50' : 'bg-indigo-50'}`}>
                                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <i className={`fas fa-percentage ${effectivePercentage > 50 ? 'text-green-600' : 'text-indigo-600'}`}></i>
                                    Eficiencia
                                </span>
                                <span className={`text-lg font-bold ${effectivePercentage > 50 ? 'text-green-700' : 'text-indigo-700'}`}>
                                    {effectivePercentage.toFixed(2)}%
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-red-50">
                                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <i className="fas fa-power-off text-red-600"></i>
                                    Promedio diario sin luz
                                </span>
                                <span className="text-lg font-bold text-red-700">
                                    {(downtimeHours / 30).toFixed(2)} hrs/día
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


