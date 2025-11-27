export interface RecoverPassword {
    token: string;
    password: string;
    repeated: string;
}

export interface SendRecoverRequest {
    username: string;
}

export interface ChangePasswordPayload {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}