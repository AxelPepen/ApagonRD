import {yupResolver} from '@hookform/resolvers/yup';
import {useForm} from 'react-hook-form';
import {RecoverSchema} from "../../../schemas/AuthSchemas.ts";
import {State, UseForm} from "../../../domain/types/steoreotype.ts";
import {Form} from "../../../components/io/Form.tsx";
import {Input} from "../../../components/io/Input.tsx";
import {useEffect, useState} from "react";
import {useQueryParams} from "../../../hooks/useQueryParams.tsx";
import {RecoverPassword} from "../../../domain/model/account/RecoverPassword.ts";
import {AuthService} from "../../../services/auth/AuthService.ts";
import {toast} from "react-toastify";
import {NavigateFunction, useNavigate} from "react-router-dom";
import {Link} from "react-router-dom";

const authService: AuthService = AuthService.instance;

export const RecoverPasswordSchema = () => {
    const navigate: NavigateFunction = useNavigate();
    const {token}: Record<string, string> = useQueryParams();
    const [loading, setLoading]: State<boolean> = useState<boolean>(false);
    const [validating, setValidating]: State<boolean> = useState<boolean>(true);
    const [tokenValid, setTokenValid]: State<boolean> = useState<boolean>(false);

    const {register, handleSubmit, formState: {errors}, setValue}: UseForm<RecoverPassword> = useForm<RecoverPassword>({
        resolver: yupResolver(RecoverSchema),
        reValidateMode: 'onChange'
    });

    // set / register token as a hidden field so it is included in submit values
    useEffect(() => {
        if (token) {
            setValue('token', token);
            // ensure token is registered (register can be called directly or using hidden input)
            register('token');
            // Validate token when component loads
            setValidating(true);
            authService.validateRecoveryToken(token)
                .then((response) => {
                    if (response.result === true) {
                        setTokenValid(true);
                    } else {
                        setTokenValid(false);
                        toast.error("El token de recuperación no es válido o ha expirado.");
                    }
                })
                .catch(() => {
                    setTokenValid(false);
                    toast.error("El token de recuperación no es válido o ha expirado.");
                })
                .finally(() => {
                    setValidating(false);
                });
        } else {
            setValidating(false);
            setTokenValid(false);
            toast.error("No se proporcionó un token de recuperación.");
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, setValue, register]);

    const doRecoverPassword = (params: RecoverPassword) => {
        // client-side quick check (extra friendly UX)
        if (!params.password || !params.repeated) {
            toast.error("Rellena ambos campos de contraseña.");
            return;
        }
        if (params.password !== params.repeated) {
            toast.error("Las contraseñas no coinciden.");
            return;
        }
        if (!params.token) {
            toast.error("Token ausente. Verifica el enlace del correo.");
            return;
        }

        setLoading(true);
        authService.changePassword(params)
            .then(() => {
                toast.success("Contraseña cambiada con éxito.");
                navigate('/auth/login', {replace: true});
            })
            .catch((err) => {
                // muestra mensaje más explícito si viene del backend
                const msg = err?.message || "Error cambiando contraseña. Verifica los datos.";
                toast.error(msg);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    if (validating) {
        return (
            <div className="flex flex-col items-center p-6 rounded-lg text-center">
                <i className="text-blue-500 text-4xl mb-2 fas fa-spinner fa-spin"></i>
                <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    Validando token...
                </h5>
            </div>
        );
    }

    if (!tokenValid) {
        return (
            <div className="flex flex-col items-center p-6 rounded-lg text-center">
                <i className="text-red-500 text-4xl mb-2 fas fa-times-circle"></i>
                <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    Token inválido o expirado
                </h5>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                    El token de recuperación no es válido o ha expirado. Por favor solicita uno nuevo.
                </p>
                <Link
                    to={'/auth/send-recover'}
                    className="text-blue-600 hover:underline flex items-center gap-2 font-medium"
                >
                    <i className="fas fa-arrow-left"></i> Solicitar nuevo token
                </Link>
            </div>
        );
    }

    return (
        <Form className="card-body flex flex-col gap-5 p-10" name="Recover Password Form" submit={handleSubmit(doRecoverPassword)}>
            <div className="text-center mb-2.5">
                <h3 className="text-lg font-medium text-gray-900 leading-none mt-2.5">
                    Cambiar Contraseña
                </h3>
            </div>

            {/* hidden token field (registered above) */}
            <input type="hidden" {...register('token')} />

            <div className="flex flex-col">
                <Input label={'Nueva Contraseña'} type="password"
                       {...register('password')}
                       error={errors.password?.message}/>
            </div>
            <div className="flex flex-col mt-2">
                <Input label={'Repetir Contraseña'} type="password"
                       {...register('repeated')}
                       error={errors.repeated?.message}/>
            </div>
            <button className="btn btn-primary flex justify-center grow" disabled={loading}>
                Restablecer Contraseña
                {loading && <i className="fa fa-spin fa-spinner ml-2"/>}
            </button>
        </Form>
    )
}
