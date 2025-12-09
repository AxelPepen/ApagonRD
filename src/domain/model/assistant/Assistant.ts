export type AssistantRole = 'user' | 'assistant' | 'system';

export interface AssistantMessage {
    role: AssistantRole;
    content: string;
}

export interface AssistantRequest {
    reply: string;
    messages: AssistantMessage[];
}

export interface AssistantResponse {
    reply?: string;
    message?: string;
    messages?: AssistantMessage[];
}

