import {useEffect} from "react";
import {useForm} from "react-hook-form";
import {PasswordInput} from "../../../components/io/PasswordInput.tsx";
import {Form} from "../../../components/io/Form.tsx";
import {ChangePasswordService} from "../../../services/account/ChangePasswordService.ts";
import {toast} from "react-toastify";
import {ChangePasswordPayload} from "../../../domain/model/account/RecoverPassword.ts";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object({
    currentPassword: yup.string().required('Ingresa tu contraseña actual'),
    newPassword: yup.string().required('Ingresa la nueva contraseña'),
    confirmPassword: yup.string()
        .oneOf([yup.ref('newPassword')], 'Las contraseñas no coinciden')
        .required('Confirma la nueva contraseña')
});

interface ChangePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type ChangePasswordForm = ChangePasswordPayload;

export const ChangePasswordModal = ({isOpen, onClose}: ChangePasswordModalProps) => {
    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
        reset
    } = useForm<ChangePasswordForm>({
        resolver: yupResolver(schema),
        reValidateMode: 'onChange'
    });

    useEffect(() => {
        if (!isOpen) {
            reset({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        }
    }, [isOpen, reset]);

    if (!isOpen) return null;

    const onSubmit = async (data: ChangePasswordForm) => {
        try {
            await ChangePasswordService.instance.changePassword(data);
            toast.success('Contraseña actualizada correctamente');
            onClose();
        } catch (error: any) {
            const message = error?.message || 'No se pudo cambiar la contraseña.';
            toast.error(message);
        }
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/50 z-[9998]" onClick={onClose}/>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
                    <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Cambiar contraseña</h2>
                            <p className="text-sm text-gray-500">Actualiza tu contraseña para mantener tu cuenta segura.</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 transition"
                            aria-label="Cerrar"
                        >
                            <i className="fas fa-times text-lg"/>
                        </button>
                    </div>

                    <Form
                        className="p-6 flex flex-col gap-4"
                        name="Change Password Modal Form"
                        submit={handleSubmit(onSubmit)}
                    >
                        <PasswordInput
                            label="Contraseña actual"
                            {...register('currentPassword')}
                            autoComplete="current-password"
                            error={errors.currentPassword?.message}
                        />
                        <PasswordInput
                            label="Nueva contraseña"
                            {...register('newPassword')}
                            error={errors.newPassword?.message}
                        />
                        <PasswordInput
                            label="Confirmar nueva contraseña"
                            {...register('confirmPassword')}
                            error={errors.confirmPassword?.message}
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
                                        <i className="fas fa-lock"/>
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

