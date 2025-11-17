import {BaseService} from "../BaseService.ts";
import {KeyValue} from "../../domain/types/steoreotype.ts";
import {StorageItem} from "../../domain/types/StorageItem.ts";
import {AuthToken, TokenInfo, TokenResponse} from "../../domain/model/auth/Token.ts";
import {User} from "../../domain/model/user/user.ts";
import {CreateUser} from "../../domain/model/user/CreateUser.ts";
import {environment} from "../../environment/environment.ts";
import {isNil} from "lodash";

export class AuthService extends BaseService {

    private static factory: AuthService = new AuthService();

    static get instance(): AuthService {
        return AuthService.factory;
    }

    constructor() {
        super('auth');
    }

    async currentUser(): Promise<User> {
        // Try users/current endpoint instead of auth/current
        const url: string = `${this.getBaseURL()}users/current`;
        return this.getFullURL<User>(url);
    }

    async authenticate(username: string, password: string): Promise<AuthToken> {
        const request: KeyValue = {username, password};
        // Use Basic Auth for login endpoint
        const basicAuth = btoa(`${username}:${password}`);
        const headers: Record<string, string> = {
            'Authorization': `Basic ${basicAuth}`,
            'Content-Type': 'application/json'
        };
        const url: string = `${this.getBaseURL()}auth/token`;
        const response: Response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(request)
        });
        
        if (!response.ok) {
            const text: string = await response.text();
            const payload: object = JSON.parse(text);
            return Promise.reject(payload);
        }
        
        const {token}: TokenResponse = await response.json() as TokenResponse;
        const info: AuthToken = this.mapTokenToInfo(token);
        const tokenInfo: TokenInfo = {info, token};
        localStorage.setItem(StorageItem.TokenInfo, JSON.stringify(tokenInfo));
        return info;
    }

    async register(data: CreateUser): Promise<void> {
        // Use full URL path for users endpoint - No Auth required
        const url: string = `${this.getBaseURL()}users/register`;
        const response: Response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            const text: string = await response.text();
            const payload: object = JSON.parse(text);
            return Promise.reject(payload);
        }
        
        try {
            return await response.json() as void;
        } catch (e) {
            return;
        }
    }

    async recoverPassword(data: any): Promise<void> {
        // Use full URL path for account endpoints
        const url: string = `${this.getBaseURL()}account/recover`;
        await this.postFullURL<void>(url, data);
    }

    async changePassword(data: any): Promise<void> {
        const url: string = `${this.getBaseURL()}account/recover/change`;
        await this.postFullURL<void>(url, data);
    }

    async sendRecoveryCode(data: any = {}): Promise<void> {
        const url: string = `${this.getBaseURL()}account/recover/send`;
        await this.postFullURL<void>(url, data);
    }

    async validateRecoveryToken(token: string): Promise<void> {
        const url: string = `${this.getBaseURL()}account/recover/validate?token=${token}`;
        await this.getFullURL<void>(url);
    }

    private getBaseURL(): string {
        return environment.apiURL;
    }

    private async postFullURL<T>(url: string, body: any = {}, headers: Record<string, string> = {}): Promise<T> {
        const info: string | null = localStorage.getItem(StorageItem.TokenInfo);
        let token: TokenInfo | null = null;
        if (info) {
            try {
                token = JSON.parse(info) as TokenInfo;
            } catch (e) {
                token = null;
            }
        }
        const requestHeaders: Record<string, string> = {'Content-Type': 'application/json', ...headers};
        if (isNil(requestHeaders.authorization) && isNil(requestHeaders.Authorization) && token && token.token) {
            requestHeaders['Authorization'] = 'Bearer ' + token.token;
        }
        
        const response: Response = await fetch(url, {
            method: 'POST',
            headers: requestHeaders,
            body: JSON.stringify(body)
        });
        
        if (!response.ok) {
            const text: string = await response.text();
            const payload: object = JSON.parse(text);
            return Promise.reject(payload);
        }
        
        try {
            return await response.json() as T;
        } catch (e) {
            return {} as T;
        }
    }

    private async getFullURL<T>(url: string, headers: Record<string, string> = {}): Promise<T> {
        const info: string | null = localStorage.getItem(StorageItem.TokenInfo);
        let token: TokenInfo | null = null;
        if (info) {
            try {
                token = JSON.parse(info) as TokenInfo;
            } catch (e) {
                token = null;
            }
        }
        const requestHeaders: Record<string, string> = {...headers};
        if (isNil(requestHeaders.authorization) && isNil(requestHeaders.Authorization) && token && token.token) {
            requestHeaders['Authorization'] = 'Bearer ' + token.token;
        }
        
        const response: Response = await fetch(url, {
            method: 'GET',
            headers: requestHeaders
        });
        
        if (!response.ok) {
            const text: string = await response.text();
            const payload: object = JSON.parse(text);
            return Promise.reject(payload);
        }
        
        try {
            return await response.json() as T;
        } catch (e) {
            return {} as T;
        }
    }

    get current(): AuthToken {
        const tokenInfo: TokenInfo = JSON.parse(localStorage.getItem(StorageItem.TokenInfo) ?? '{}') as TokenInfo;
        return tokenInfo.info;
    }

    logout(): void {
        localStorage.clear();
    }

    private mapTokenToInfo(token: string): AuthToken {
        const base64Url: string = token.split('.')[1];
        const base64: string = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload: string = decodeURIComponent(atob(base64).split('').map((c: string): string =>
            '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        ).join(''));
        const payload = JSON.parse(jsonPayload);
        return {
            id: payload.sub,
            expiresAt: payload.exp * 1000
        };
    }
}