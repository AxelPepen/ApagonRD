import {mixed, object, ObjectSchema, string} from "yup";
import {UserPasswordLogin} from "../domain/model/auth/Login.ts";
import {Messages} from "../domain/types/Messages.ts";
import {RecoverPassword, SendRecoverRequest} from "../domain/model/account/RecoverPassword.ts";
import {CreateUser} from "../domain/model/user/CreateUser.ts";
import { DocumentType } from '../domain/model/user/documentType'


export const LoginSchema: ObjectSchema<UserPasswordLogin> = object().shape({
        username: string().required(Messages.RequiredField),
        password: string().required(Messages.RequiredField)
    }
)

export const RecoverSchema: ObjectSchema<RecoverPassword> = object().shape({
    token: string().required(Messages.RequiredField),
    password: string().required(Messages.RequiredField),
    repeated: string().required(Messages.RequiredField),
    }
)

export const SendRecoverPasswordSchema: ObjectSchema<SendRecoverRequest> = object().shape({
        username: string().required(Messages.RequiredField),
    }
)

export const RegisterSchema: ObjectSchema<CreateUser> = object().shape({
    username: string().required(Messages.RequiredField),
    password: string()
        .required(Messages.RequiredField)
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .matches(/[0-9]/, 'La contraseña debe contener al menos un número')
        .matches(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula'),
    email: string().required(Messages.RequiredField).email('Debe ser un email válido'),
    firstname: string().required(Messages.RequiredField),
    lastname: string().required(Messages.RequiredField),
    documentType:mixed<DocumentType>()
        .oneOf(Object.values(DocumentType))
        .required(Messages.RequiredField),
    documentNumber: string().required(Messages.RequiredField),
})