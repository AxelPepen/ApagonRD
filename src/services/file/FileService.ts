import {environment} from "../../environment/environment.ts";
import {StorageItem} from "../../domain/types/StorageItem.ts";
import {TokenInfo} from "../../domain/model/auth/Token.ts";

export class FileService {
    private static factory: FileService = new FileService();

    static get instance(): FileService {
        return FileService.factory;
    }

    async uploadFile(file: File): Promise<string> {
        const formData = new FormData();
        formData.append('file', file);

        // Obtener token de autenticación
        const info: string | null = localStorage.getItem(StorageItem.TokenInfo);
        let token: TokenInfo | null = null;
        if (info) {
            try {
                token = JSON.parse(info) as TokenInfo;
            } catch (e) {
                token = null;
            }
        }

        // No incluir Content-Type, el navegador lo establece automáticamente con el boundary correcto para FormData
        const headers: HeadersInit = {};
        if (token && token.token) {
            headers['Authorization'] = 'Bearer ' + token.token;
        }

        const url: string = `${environment.apiURL}files/upload`;
        const response: Response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: formData
        });

        if (!response.ok) {
            const text: string = await response.text();
            const payload: object = JSON.parse(text);
            return Promise.reject(payload);
        }

        try {
            const result = await response.json();
            // El endpoint devuelve un objeto con la propiedad 'uri' que contiene la URL de la imagen
            if (result.uri) {
                return result.uri;
            }
            // Fallback por si acaso el formato cambia
            return result.url || result.photoUrl || (typeof result === 'string' ? result : '');
        } catch (e) {
            return Promise.reject(e);
        }
    }
}

