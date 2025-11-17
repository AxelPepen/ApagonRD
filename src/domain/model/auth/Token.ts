export interface AuthToken {
    id: string;
    expiresAt: number;
}

export interface TokenResponse {
    token: string;
}

export type TokenInfo = TokenResponse & { info: AuthToken }