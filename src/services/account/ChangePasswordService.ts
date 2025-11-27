import {BaseService} from "../BaseService.ts";
import {ChangePasswordPayload} from "../../domain/model/account/RecoverPassword.ts";

export class ChangePasswordService extends BaseService {
    private static factory: ChangePasswordService = new ChangePasswordService();

    static get instance(): ChangePasswordService {
        return ChangePasswordService.factory;
    }

    constructor() {
        super('account/recover/change');
    }

    async changePassword(payload: ChangePasswordPayload): Promise<void> {
        return this.post<void>('', payload);
    }
}