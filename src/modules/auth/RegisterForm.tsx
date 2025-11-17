import {yupResolver} from '@hookform/resolvers/yup';
import {useForm} from 'react-hook-form';
import {UseForm} from '../../domain/types/steoreotype.ts';
import {CreateUser} from '../../domain/model/user/CreateUser.ts';
import {RegisterSchema} from '../../schemas/AuthSchemas.ts';
import {Input} from '../../components/io/Input.tsx';
import {Select} from '../../components/io/Select.tsx';
import {Form} from "../../components/io/Form.tsx";
import {Link, useNavigate} from "react-router-dom";
import {ErrorMessage} from "../../components/io/output/ErrorMessage.tsx";
import {AuthService} from "../../services/auth/AuthService.ts";
import {useState} from "react";
import {toast} from "react-toastify";
import {DocumentType} from "../../domain/model/user/documentType.ts";

const authService: AuthService = AuthService.instance;

const documentTypeOptions = [
    {value: DocumentType.ID_CARD, description: 'Cédula'},
    {value: DocumentType.PASSPORT, description: 'Pasaporte'}
];

export const RegisterForm = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string>();
    const {register, handleSubmit, formState: {errors}}: UseForm<CreateUser> = useForm<CreateUser>({
        resolver: yupResolver(RegisterSchema),
        reValidateMode: 'onChange'
    });

    const onSubmit = async (data: CreateUser) => {
        setLoading(true);
        setMessage(undefined);
        try {
            await authService.register(data);
            toast.success("Registro exitoso. Por favor inicia sesión.");
            navigate('/auth/login');
        } catch (error: any) {
            let errorMessage = 'Error al registrar usuario. Por favor intenta nuevamente.';
            
            // Manejo de errores específicos
            if (error?.message) {
                const errorMsg = String(error.message).toLowerCase();
                if (errorMsg.includes('duplicate') || errorMsg.includes('document') || errorMsg.includes('user_document_uk')) {
                    errorMessage = 'Ya existe un usuario registrado con este tipo y número de documento. Por favor verifica tus datos.';
                } else if (errorMsg.includes('username') || errorMsg.includes('user_username_uk')) {
                    errorMessage = 'Este nombre de usuario ya está en uso. Por favor elige otro.';
                } else if (errorMsg.includes('email') || errorMsg.includes('user_email_uk')) {
                    errorMessage = 'Este correo electrónico ya está registrado. Por favor usa otro.';
                } else {
                    errorMessage = error.message;
                }
            }
            
            setMessage(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form
            className="card-body flex flex-col gap-4 p-6"
            name="Register Form"
            submit={handleSubmit(onSubmit)}
        >
            {/* Campo: Nombre */}
            <div className="flex flex-col">
                <Input
                    label="Nombre"
                    type="text"
                    {...register("firstname")}
                    error={errors.firstname?.message}
                    required
                />
            </div>

            {/* Campo: Apellido */}
            <div className="flex flex-col">
                <Input
                    label="Apellido"
                    type="text"
                    {...register("lastname")}
                    error={errors.lastname?.message}
                    required
                />
            </div>

            {/* Campo: Usuario */}
            <div className="flex flex-col">
                <Input
                    label="Usuario"
                    type="text"
                    {...register("username")}
                    error={errors.username?.message}
                    required
                />
            </div>

            {/* Campo: Email */}
            <div className="flex flex-col">
                <Input
                    label="Email"
                    type="email"
                    {...register("email")}
                    error={errors.email?.message}
                    required
                />
            </div>

            {/* Campo: Tipo de Documento */}
            <div className="flex flex-col">
                <Select
                    label="Tipo de Documento"
                    {...register("documentType")}
                    error={errors.documentType?.message}
                    options={documentTypeOptions}
                    required
                />
            </div>

            {/* Campo: Número de Documento */}
            <div className="flex flex-col">
                <Input
                    label="Número de Documento"
                    type="text"
                    {...register("documentNumber")}
                    error={errors.documentNumber?.message}
                    required
                />
            </div>

            {/* Campo: Contraseña */}
            <div className="flex flex-col">
                <Input
                    label="Contraseña"
                    type="password"
                    {...register("password")}
                    error={errors.password?.message}
                    required
                />
            </div>

            <button className="btn btn-primary flex justify-center grow" disabled={loading}>
                {loading ? (
                    <>
                        <i className="fa fa-spin fa-spinner mr-2"/>
                        Registrando...
                    </>
                ) : (
                    'REGISTRARSE'
                )}
            </button>

            <Link to="/auth/login"
                  className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center justify-center gap-2 transition-colors mt-1">
                <i className="fa fa-arrow-left text-blue-500"></i>
                ¿Ya tienes cuenta? Inicia sesión
            </Link>

            <ErrorMessage message={message}/>
        </Form>
    );
};

