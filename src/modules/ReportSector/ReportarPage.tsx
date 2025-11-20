import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {Form} from "../../components/io/Form.tsx";
import {Select} from "../../components/io/Select.tsx";
import {ReportService} from "../../services/report/ReportService.ts";
import {FileService} from "../../services/file/FileService.ts";
import {SectorService} from "../../services/sector/SectorService.ts";
import {CreateReport} from "../../domain/model/report/Report.ts";
import {Sector} from "../../domain/model/sector/Sector.ts";
import {SelectOption} from "../../domain/types/steoreotype.ts";

const powerStatusOptions: SelectOption[] = [
    {value: "POWER", description: "Tiene energía"},
    {value: "NO_POWER", description: "Sin energía"}
];

export const ReportarPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [loadingLocation, setLoadingLocation] = useState(true);
    const [currentSector, setCurrentSector] = useState<Sector | null>(null);
    const [allSectors, setAllSectors] = useState<Sector[]>([]);
    const [showSectorSelector, setShowSectorSelector] = useState(false);
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

    const {register, handleSubmit, formState: {errors}, setValue} = useForm<CreateReport>({
        defaultValues: {
            status: "RECEIVED",
            powerStatus: "NO_POWER"
        }
    });

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

    // Obtener ubicación y sector del usuario
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    setLatitude(lat);
                    setLongitude(lon);
                    setValue('latitude', lat);
                    setValue('longitude', lon);

                    try {
                        const sector = await SectorService.instance.getCurrentSector(lat, lon);
                        setCurrentSector(sector);
                        setValue('sectorId', sector.id);
                        setShowSectorSelector(false);
                        setLoadingLocation(false);
                    } catch (err) {
                        console.error("Error obteniendo sector:", err);
                        toast.warning("No se pudo determinar tu sector automáticamente. Por favor selecciona uno manualmente.");
                        setShowSectorSelector(true);
                        setLoadingLocation(false);
                    }
                },
                (error) => {
                    console.error("Error obteniendo ubicación:", error);
                    toast.warning("No se pudo obtener tu ubicación. Por favor selecciona un sector manualmente.");
                    setShowSectorSelector(true);
                    setLoadingLocation(false);
                }
            );
        } else {
            toast.warning("Tu navegador no soporta geolocalización. Por favor selecciona un sector manualmente.");
            setShowSectorSelector(true);
            setLoadingLocation(false);
        }
    }, [setValue]);

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validar tipo de archivo
            if (!file.type.startsWith('image/')) {
                toast.error("Por favor selecciona un archivo de imagen.");
                return;
            }
            // Validar tamaño (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error("La imagen no debe exceder 5MB.");
                return;
            }
            setPhotoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removePhoto = () => {
        setPhotoFile(null);
        setPhotoPreview(null);
    };

    const onSubmit = async (data: CreateReport) => {
        if (!latitude || !longitude) {
            toast.error("No se pudo obtener tu ubicación. Por favor recarga la página.");
            return;
        }
        if (!currentSector) {
            toast.error("Por favor selecciona un sector.");
            return;
        }
        setLoading(true);

        let photoUrl: string | undefined;

        const uploadPromise = photoFile
            ? FileService.instance.uploadFile(photoFile).then(
                (url) => {photoUrl = url;
                    toast.success("Foto subida correctamente");
                }, (err) => {console.error("Error subiendo foto:", err);
                    toast.error("Error subiendo la foto. El reporte se creará sin foto.");
                }) : Promise.resolve();

        uploadPromise.then(() => {
                const reportData: CreateReport = {
                    latitude,
                    longitude,
                    sectorId: currentSector.id,
                    powerStatus: data.powerStatus,
                    description: data.description,
                    status: "RECEIVED",
                    ...(photoUrl && { photoUrl })
                };

                return ReportService.instance.createReport(reportData).then(() => {
                        toast.success("Reporte creado exitosamente");
                        navigate('/app/inicio');
                    }, (error: any) => {
                        let errorMessage = "Error al crear el reporte. Por favor intenta nuevamente.";
                        if (error?.message) {
                            errorMessage = error.message;
                        } else if (error?.error) {
                            errorMessage = typeof error.error === 'string'
                                ? error.error
                                : error.error.message || errorMessage;
                        } else if (error?.status === 400) {
                            errorMessage = "Error de validación. Por favor verifica que todos los campos estén correctos.";
                            if (error?.message) {
                                errorMessage += ` ${error.message}`;
                            }
                        }
                        toast.error(errorMessage);
                    }
                );
            })
            .finally(() => {
                setLoading(false);
            });

    };

    if (loadingLocation) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <i className="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
                    <p className="text-gray-600">Obteniendo tu ubicación...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-2xl mx-auto overflow-y-auto" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
            <style>{`div::-webkit-scrollbar {display: none;}`}</style>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Reportar Apagón</h1>

            {currentSector && !showSectorSelector && (
                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                        <strong>Sector detectado:</strong> {currentSector.name}
                    </p>
                </div>
            )}

            <Form name="Report Form" submit={handleSubmit(onSubmit)} className="space-y-4">
                {showSectorSelector ? (
                        <div>
                            <Select label="Sector"{...register('sectorId', {required: 'Por favor selecciona un sector', onChange: (e) => {
                                        const sectorId = parseInt(e.target.value);
                                        const selectedSector = allSectors.find(s => s.id === sectorId);
                                        if (selectedSector) {
                                            setCurrentSector(selectedSector);
                                            setValue('sectorId', sectorId, { shouldValidate: true });
                                        }}})}
                                options={allSectors.map(sector => ({
                                    value: sector.id.toString(),
                                    description: sector.name
                                }))}
                                error={errors.sectorId?.message}
                            />
                        </div>) : (<></>)}
                <div>
                    <Select
                        label="Estado de energía"
                        {...register('powerStatus', {required: 'Este campo es requerido'})}
                        options={powerStatusOptions}
                        error={errors.powerStatus?.message}
                    />
                </div>

                <div>
                    <label className="form-label text-md mb-1 block">Descripción</label>
                    <textarea{...register('description', {required: 'Este campo es requerido'})} className="textarea bg-transparent w-full" rows={4} placeholder="Describe el problema en detalle..."/>
                    {errors.description && (
                        <p className="text-red-500 text-xs mt-1">
                            <i className="fa fa-warning mr-1"/>
                            {errors.description.message}
                        </p>
                    )}
                </div>

                <div>
                    <label className="form-label text-md mb-1 block">Foto (opcional)</label>
                    {photoPreview ? (
                        <div className="relative">
                            <img src={photoPreview} alt="Preview" className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-300"/>
                            <button type="button" onClick={removePhoto} className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600">
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                    ) : (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" id="photo-input"/>
                            <label htmlFor="photo-input" className="cursor-pointer flex flex-col items-center gap-2">
                                <i className="fas fa-camera text-3xl text-gray-400"></i>
                                <span className="text-sm text-gray-600">
                                    Haz clic para seleccionar una foto
                                </span>
                            </label>
                        </div>
                    )}
                </div>

                <div className="flex gap-4 pt-4">
                    <button type="button" onClick={() => navigate('/app/inicio')} className="btn btn-light flex-1" disabled={loading}>Cancelar</button>
                    <button type="submit" className="btn btn-primary flex-1" disabled={loading}>{loading ? (
                            <><i className="fa fa-spin fa-spinner mr-2"></i>Enviando...</>) : (
                            <><i className="fas fa-paper-plane mr-2"></i>Enviar Reporte</>)}
                    </button>
                </div>
            </Form>
        </div>
    );
};
