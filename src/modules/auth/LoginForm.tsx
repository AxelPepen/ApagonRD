import {yupResolver} from '@hookform/resolvers/yup';
import {useForm} from 'react-hook-form';
import {AuthContextValue, useAuthContext} from '../../contexts/AuthContext.tsx';
import {UseForm} from '../../domain/types/steoreotype.ts';
import {UserPasswordLogin} from '../../domain/model/auth/Login.ts';
import {LoginSchema} from '../../schemas/AuthSchemas.ts';
import {Input} from '../../components/io/Input.tsx';
import {PasswordInput} from "../../components/io/PasswordInput.tsx";
import {Form} from "../../components/io/Form.tsx";
import {Link} from "react-router-dom";
import {ErrorMessage} from "../../components/io/output/ErrorMessage.tsx";

export const LoginForm = () => {

    const {authenticate, message, loading}: AuthContextValue = useAuthContext();
    const {register, handleSubmit, formState: {errors}}: UseForm<UserPasswordLogin> = useForm<UserPasswordLogin>({
        resolver: yupResolver(LoginSchema),
        reValidateMode: 'onChange'
    });

    return (
        <Form
            className="card-body flex flex-col gap-4 p-6"
            name="Login Form"
            submit={handleSubmit(authenticate)}
        >
            {/* Campo: Usuario */}
            <div className="flex flex-col">
                <Input
                    label="Usuario / Documento"
                    type="text"
                    {...register("username")}
                    error={errors.username?.message}
                />
            </div>

            {/* Campo: Contraseña */}
            <div className="flex flex-col">
                <PasswordInput
                    label="Contraseña"
                    {...register("password")}
                    error={errors.password?.message}
                    autoComplete="current-password"
                />
            </div>

            <button className="btn btn-auth-primary flex justify-center grow">
                INICIAR SESIÓN
                {loading && <i className="fa fa-spin fa-spinner"/>}
            </button>

            <Link to="/auth/send-recover"
                  className="text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-strong)] flex items-center justify-center gap-2 transition-colors mt-1">
                <i className="fa fa-unlock-alt" style={{color: 'var(--color-primary)'}}></i>
                Recuperar contraseña
            </Link>

            <Link to="/auth/register"
                  className="text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-strong)] flex items-center justify-center gap-2 transition-colors mt-2">
                <i className="fa fa-user-plus" style={{color: 'var(--color-primary)'}}></i>
                ¿No tienes cuenta? ¡Regístrate!
            </Link>

            <ErrorMessage message={message}/>
        </Form>
    );
};
