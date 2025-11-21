import {useEffect, useMemo, useState} from "react";
import {SectorService} from "../../services/sector/SectorService.ts";
import {Sector, SectorUptimeHistory, SectorUptimeParams} from "../../domain/model/sector/Sector.ts";
import {toast} from "react-toastify";

const circleRadius = 90;
const circleCircumference = 2 * Math.PI * circleRadius;

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
    const [_currentSector, setCurrentSector] = useState<Sector | null>(null);
    const [error, setError] = useState<string>();

    useEffect(() => {
        const fetchData = async () => {
            if (!navigator.geolocation) {
                setError("Tu navegador no soporta geolocalización.");
                setLoading(false);
                return;
            }

            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        const {latitude: lat, longitude: lon} = position.coords;
                        const sector = await SectorService.instance.getCurrentSector(lat, lon);
                        setCurrentSector(sector);
                        const range = getCurrentMonthRange();
                        const uptimeData = await SectorService.instance.getSectorUptime(sector.id, range);
                        setUptime(uptimeData);
                    } catch (err: any) {
                        console.error("Error cargando historial de uptime:", err);
                        toast.error("No se pudo cargar la información de uptime.");
                        setError("No se pudo obtener el historial de uptime.");
                    } finally {
                        setLoading(false);
                    }
                },
                (geoError) => {
                    console.error("Error geolocalización:", geoError);
                    toast.error("Habilita la ubicación para obtener tu sector.");
                    setError("Habilita la ubicación para obtener el sector.");
                    setLoading(false);
                }
            );
        };

        fetchData();
    }, []);

    const percentage = uptime?.percentage ?? 0;
    const effectivePercentage = Math.min(Math.max(percentage, 0), 100);
    const strokeOffset = circleCircumference - (effectivePercentage / 100) * circleCircumference;

    const downtimeHours = useMemo(() => {
        if (!uptime) return 0;
        return Math.max(uptime.totalHours - uptime.powerHours, 0);
    }, [uptime]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <i className="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
                    <p className="text-gray-600">Cargando dashboard de uptime...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex flex-col gap-4">
                <h1 className="text-3xl font-bold text-gray-800">Dashboard de Uptime</h1>
                <p className="text-gray-600 max-w-2xl">
                    Visualiza cuánto tiempo ha tenido energía el sector detectado durante el mes en curso.
                </p>
            </div>

            {error && (
                <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                </div>
            )}

            {!uptime ? (
                !error && (
                    <div className="mt-8 text-gray-600">
                        No se encontró información de sector o uptime. Asegúrate de tener la ubicación habilitada.
                    </div>
                )
            ) : (
                <div className="mt-8 grid gap-6 lg:grid-cols-2">
                    <div className="flex flex-col gap-6 rounded-2xl border border-gray-200 p-6 shadow-sm bg-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm uppercase tracking-wide text-gray-500">Sector</p>
                                <h2 className="text-2xl font-semibold text-gray-800">{uptime.sector.name}</h2>
                            </div>
                            <p className="text-sm text-gray-500">
                                {new Date(uptime.start).toLocaleDateString('es-DO')} - {new Date(uptime.end).toLocaleDateString('es-DO')}
                            </p>
                        </div>

                        <div className="flex flex-col items-center gap-4">
                            <div className="relative flex items-center justify-center">
                                <svg width="220" height="220" viewBox="0 0 220 220">
                                    <circle
                                        cx="110"
                                        cy="110"
                                        r={circleRadius}
                                        fill="none"
                                        stroke="#e5e7eb"
                                        strokeWidth="16"
                                    />
                                    <circle
                                        cx="110"
                                        cy="110"
                                        r={circleRadius}
                                        fill="none"
                                        stroke="#10b981"
                                        strokeWidth="16"
                                        strokeDasharray={circleCircumference}
                                        strokeDashoffset={strokeOffset}
                                        strokeLinecap="round"
                                        transform="rotate(-90 110 110)"
                                    />
                                </svg>
                                <div className="absolute flex flex-col items-center">
                                    <span className="text-4xl font-semibold text-gray-900">
                                        {effectivePercentage.toFixed(1)}%
                                    </span>
                                    <span className="text-sm uppercase tracking-wider text-gray-500">
                                        Tiempo con luz
                                    </span>
                                </div>
                            </div>
                            <div className="text-sm text-gray-600">
                                {uptime.powerHours.toFixed(2)} horas con energía <span className="text-gray-400">/</span> {uptime.totalHours.toFixed(2)} horas totales
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6 rounded-2xl border border-gray-200 p-6 shadow-sm bg-white">
                        <h3 className="text-lg font-semibold text-gray-800">Resumen del mes</h3>
                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Días con energía</span>
                                <span>{((uptime.percentage / 100) * 30).toFixed(1)} días</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Horas sin luz</span>
                                <span>{downtimeHours.toFixed(2)} hrs</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Minutos con energía</span>
                                <span>{uptime.powerMinutes.toLocaleString('es-DO')}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Minutos totales</span>
                                <span>{uptime.totalMinutes.toLocaleString('es-DO')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


