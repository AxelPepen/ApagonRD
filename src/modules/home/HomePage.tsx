import {useEffect, useState, useRef} from "react";
import {MapContainer, TileLayer, Polygon, Popup, useMap} from "react-leaflet";
import {useNavigate} from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {SectorService} from "../../services/sector/SectorService.ts";
import {Sector, GeoJSONPolygon} from "../../domain/model/sector/Sector.ts";
import {toast} from "react-toastify";

// Fix para los iconos de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Coordenadas de Santo Domingo (centro)
const SANTO_DOMINGO_CENTER: [number, number] = [18.4861, -69.9312];

// Componente para actualizar el mapa cuando cambia la ubicación
function MapUpdater({center}: {center: [number, number]}) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, map.getZoom());
    }, [center, map]);
    return null;
}

// Componente para el botón de centrar ubicación
function LocateButton({onLocate}: {onLocate: () => void}) {
    return (
        <button
            onClick={onLocate}
            className="absolute top-4 right-4 z-[1000] bg-blue-600 hover:bg-blue-700 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-colors"
            title="Centrar en mi ubicación"
        >
            <i className="fas fa-map-marker-alt text-xl"></i>
        </button>
    );
}

export const HomePage = () => {
    const navigate = useNavigate();
    const [sectors, setSectors] = useState<Sector[]>([]);
    const [_currentSector, setCurrentSector] = useState<Sector | null>(null);
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const [loading, setLoading] = useState(true);
    const mapRef = useRef<L.Map | null>(null);

    // Función para obtener y centrar la ubicación del usuario
    const handleLocate = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    const newLocation: [number, number] = [lat, lon];
                    setUserLocation(newLocation);
                    
                    // Centrar el mapa en la ubicación del usuario con zoom
                    if (mapRef.current) {
                        mapRef.current.setView(newLocation, 15); // Zoom 15 para una vista más cercana
                    }
                    
                    // Determinar el sector actual del usuario
                    SectorService.instance.getCurrentSector(lat, lon)
                        .then((sector) => {
                            if (sector) setCurrentSector(sector);
                        })
                        .catch((err) => {
                            console.error("Error obteniendo sector:", err);
                        });
                },
                (error) => {
                    console.error("Error obteniendo ubicación:", error);
                    toast.error("No se pudo obtener tu ubicación. Por favor, habilita la geolocalización.");
                }
            );
        } else {
            toast.error("Tu navegador no soporta geolocalización.");
        }
    };

    // Obtener ubicación del usuario (solo una vez al cargar)
    useEffect(() => {
        handleLocate();
    }, []); // Solo se ejecuta una vez al montar el componente

    // Cargar sectores (solo una vez al montar)
    useEffect(() => {
        setLoading(true);
        SectorService.instance.getAllSectors()
            .then((data) => {
                setSectors(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error cargando sectores:", err);
                toast.error("Error cargando los sectores del mapa");
                setLoading(false);
            });
    }, []); // Solo se ejecuta una vez al montar

    // Parsear GeoJSON y convertir a formato Leaflet [lat, lon][]
    const getPolygonCoordinates = (geojsonString: string | undefined): [number, number][] => {
        if (!geojsonString) {
            return [];
        }
        
        try {
            const geojson: GeoJSONPolygon = JSON.parse(geojsonString);
            
            if (geojson.type === "Polygon" && geojson.coordinates && geojson.coordinates.length > 0) {
                // GeoJSON usa [lon, lat], Leaflet usa [lat, lon]
                // Tomamos el primer anillo del polígono (el exterior)
                const ring = geojson.coordinates[0];
                return ring.map((coord: number[]) => {
                    // Convertir de [lon, lat] a [lat, lon]
                    return [coord[1], coord[0]] as [number, number];
                });
            }
        } catch (error) {
            console.error("Error parseando GeoJSON:", error, geojsonString);
        }
        
        return [];
    };

    // Obtener color según el estado del sector (colores más fuertes)
    const getSectorColor = (status: string): string => {
        return status === "POWER" ? '#22c55e' : '#ef4444'; // Verde más fuerte si tiene electricidad (POWER), rojo más fuerte si no
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <i className="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
                    <p className="text-gray-600">Cargando mapa...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full relative" style={{height: 'calc(100vh - 80px)'}}>
            {/* Leyenda en esquina inferior izquierda */}
            <div className="absolute bottom-16 left-4 z-[1000] bg-white rounded-lg shadow-lg p-3">
                <div className="flex flex-col gap-2 text-xs">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded"></div>
                        <span className="text-gray-700">Con electricidad</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded"></div>
                        <span className="text-gray-700">Sin electricidad</span>
                    </div>
                </div>
            </div>

            {/* Botón flotante en esquina inferior derecha */}
            <button
                onClick={() => navigate('/app/reportar')}
                className="absolute bottom-16 right-4 z-[1000] bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full shadow-lg flex items-center gap-2 transition-colors"
            >
                <i className="fas fa-plus-circle"></i>
                <span>Reportar</span>
            </button>

            <MapContainer
                center={userLocation || SANTO_DOMINGO_CENTER}
                zoom={12}
                style={{height: '100%', width: '100%', minHeight: '100%'}}
                ref={mapRef}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                <LocateButton onLocate={handleLocate} />
                
                {userLocation && <MapUpdater center={userLocation} />}
                
                {sectors.map((sector) => {
                    const polygonCoords = getPolygonCoordinates(sector.geojson);
                    if (polygonCoords.length === 0) {
                        return null;
                    }
                    
                    const hasElectricity = sector.status === "POWER";
                    const fillColor = getSectorColor(sector.status);
                    
                    return (
                        <Polygon
                            key={sector.id}
                            positions={polygonCoords}
                            pathOptions={{
                                color: '#000000', // Borde negro
                                fillColor: fillColor,
                                fillOpacity: 0.6, // Más opaco para colores más fuertes
                                weight: 3, // Borde más grueso
                                opacity: 1
                            }}
                            eventHandlers={{
                                mouseover: (e) => {
                                    const layer = e.target;
                                    layer.setStyle({
                                        fillOpacity: 0.8,
                                        weight: 4,
                                        color: '#000000'
                                    });
                                },
                                mouseout: (e) => {
                                    const layer = e.target;
                                    layer.setStyle({
                                        fillOpacity: 0.6,
                                        weight: 3,
                                        color: '#000000'
                                    });
                                }
                            }}
                        >
                            <Popup>
                                <div>
                                    <strong>{sector.name || `Sector ${sector.id}`}</strong>
                                    <br />
                                    Estado: {hasElectricity ? 'Con electricidad' : 'Sin electricidad'}
                                </div>
                            </Popup>
                        </Polygon>
                    );
                })}
            </MapContainer>
        </div>
    );
};
