import {useEffect} from "react";
import {useForm} from "react-hook-form";
import {Input} from "../../../components/io/Input.tsx";
import {Form} from "../../../components/io/Form.tsx";
import {UserService} from "../../../services/user/UserService.ts";
import {toast} from "react-toastify";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {useAuthContext} from "../../../contexts/AuthContext.tsx";

const schema = yup.object({
    username: yup.string().required('El nombre de usuario es requerido'),
    email: yup.string().required('El email es requerido').email('Debe ser un email válido'),
    firstname: yup.string().required('El nombre es requerido'),
    lastname: yup.string().required('El apellido es requerido')
});

interface EditProfileForm {
    username: string;
    email: string;
    firstname: string;
    lastname: string;
}

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const EditProfileModal = ({isOpen, onClose}: EditProfileModalProps) => {
    const {current} = useAuthContext();
    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
        reset
    } = useForm<EditProfileForm>({
        resolver: yupResolver(schema),
        reValidateMode: 'onChange'
    });

    useEffect(() => {
        if (isOpen && current) {
            reset({
                username: current.username || '',
                email: current.email || '',
                firstname: current.info?.firstname || '',
                lastname: current.info?.lastname || ''
            });
        }
    }, [isOpen, current, reset]);

    if (!isOpen) return null;

    const onSubmit = async (data: EditProfileForm) => {
        try {
            await UserService.instance.updateProfile(data);
            toast.success('Perfil actualizado correctamente');
            onClose();
        } catch (error: any) {
            const message = error?.message || 'No se pudo actualizar el perfil.';
            toast.error(message);
        }
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/50 z-[9998]" onClick={onClose}/>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                <div className="rounded-2xl shadow-2xl w-full max-w-lg" style={{background: 'var(--color-surface)', color: 'var(--color-text)'}}>
                    <div className="flex items-center justify-between border-b px-6 py-4" style={{borderColor: 'var(--color-border)'}}>
                        <div>
                            <h2 className="text-xl font-semibold" style={{color: 'var(--color-text)'}}>Editar perfil</h2>
                            <p className="text-sm" style={{color: 'var(--color-text-secondary)'}}>Actualiza tu información personal.</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="transition hover:opacity-70"
                            style={{color: 'var(--color-text-secondary)'}}
                            aria-label="Cerrar"
                        >
                            <i className="fas fa-times text-lg"/>
                        </button>
                    </div>

                    <Form
                        className="p-6 flex flex-col gap-4"
                        name="Edit Profile Modal Form"
                        submit={handleSubmit(onSubmit)}
                    >
                        <Input
                            label="Nombre de usuario"
                            type="text"
                            {...register('username')}
                            error={errors.username?.message}
                        />
                        <Input
                            label="Email"
                            type="email"
                            {...register('email')}
                            error={errors.email?.message}
                        />
                        <Input
                            label="Nombre"
                            type="text"
                            {...register('firstname')}
                            error={errors.firstname?.message}
                        />
                        <Input
                            label="Apellido"
                            type="text"
                            {...register('lastname')}
                            error={errors.lastname?.message}
                        />

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                className="btn btn-light"
                                onClick={onClose}
                                disabled={isSubmitting}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary flex items-center gap-2"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <i className="fa fa-spinner fa-spin"/>
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-save"/>
                                        Guardar cambios
                                    </>
                                )}
                            </button>
                        </div>
                    </Form>
                </div>
            </div>
        </>
    );
};


