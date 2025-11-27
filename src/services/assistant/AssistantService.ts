import {BaseService} from "../BaseService.ts";
import {AssistantRequest, AssistantResponse} from "../../domain/model/assistant/Assistant.ts";

export class AssistantService extends BaseService {
    private static factory: AssistantService = new AssistantService();

    static get instance(): AssistantService {
        return AssistantService.factory;
    }

    private constructor() {
        super('ia');
    }

    async sendMessage(payload: AssistantRequest): Promise<AssistantResponse> {
        return this.post<AssistantResponse>('', payload);
    }
}

