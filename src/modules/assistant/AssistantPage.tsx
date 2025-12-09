import {FormEvent, useMemo, useState} from "react";
import {AssistantMessage, AssistantRequest} from "../../domain/model/assistant/Assistant.ts";
import {AssistantService} from "../../services/assistant/AssistantService.ts";
import {toast} from "react-toastify";

const initialAssistantMessage: AssistantMessage = {
    role: 'assistant',
    content: "¡Hola! Soy Apagón RD, tu asistente especializado en energía eléctrica y apagones en la República Dominicana. ¿En qué puedo ayudarte hoy?"
};

// Evita mensajes duplicados (mismo rol y contenido, trim) preservando el orden
const dedupeMessages = (msgs: AssistantMessage[]): AssistantMessage[] => {
    const seen = new Set<string>();
    const result: AssistantMessage[] = [];
    for (const msg of msgs) {
        const key = `${msg.role}::${msg.content.trim()}`;
        if (seen.has(key)) continue;
        seen.add(key);
        result.push(msg);
    }
    return result;
};

export const AssistantPage = () => {
    const [messages, setMessages] = useState<AssistantMessage[]>([initialAssistantMessage]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading]);

    const handleSend = async (event?: FormEvent) => {
        event?.preventDefault();
        const trimmed = input.trim();
        if (!trimmed || loading) return;

        const userMessage: AssistantMessage = {role: 'user', content: trimmed};
        const updatedMessages: AssistantMessage[] = dedupeMessages([...messages, userMessage]);

        setMessages(updatedMessages);
        setInput('');
        setLoading(true);

        const payload: AssistantRequest = {
            reply: trimmed,
            messages: updatedMessages
        };

        // Debug: mostrar el payload completo que se envía
        console.log('Payload completo enviado:', JSON.stringify(payload, null, 2));

        try {
            const response = await AssistantService.instance.sendMessage(payload);

            // Si el backend devuelve el historial completo, úsalo; si no, agrega la respuesta al historial local
            const responseMessages: AssistantMessage[] = response.messages && response.messages.length > 0
                ? response.messages
                : [...updatedMessages, {role: 'assistant', content: response.reply ?? response.message ?? 'No pude obtener una respuesta en este momento.'}];

            setMessages(dedupeMessages(responseMessages));
        } catch (err) {
            console.error('Error enviando mensaje al asistente:', err);
            toast.error('No se pudo comunicar con el asistente. Intenta nuevamente.');
            setMessages(updatedMessages); // Mantener conversación sin respuesta
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setMessages([initialAssistantMessage]);
    };

    return (
        <div className="h-full px-32 py-6 overflow-y-auto hide-scrollbar">
            <div className="flex flex-col h-full gap-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Asistente</h1>
                    <p className="text-gray-600">Haz preguntas sobre los apagones y el sistema eléctrico.</p>
                </div>
                <button
                    onClick={handleClear}
                    className="btn btn-light"
                    disabled={loading}
                >
                    Limpiar chat
                </button>
            </div>

            <div className="flex-1 overflow-y-auto hide-scrollbar rounded-2xl border border-gray-200 bg-white p-4 space-y-4">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-xl rounded-2xl px-4 py-3 text-sm shadow-sm ${
                                message.role === 'user'
                                    ? 'bg-blue-600 text-white rounded-tr-sm'
                                    : 'bg-gray-100 text-gray-800 rounded-tl-sm'
                            }`}
                        >
                            <p className="whitespace-pre-line">{message.content}</p>
                        </div>
                    </div>
                ))}
            </div>

            <form onSubmit={handleSend} className="flex flex-col gap-3">
                    <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Escribe tu pregunta..."
                    className="textarea bg-white border border-gray-200 rounded-2xl p-4 min-h-[120px] resize-none"
                    disabled={loading}
                />
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="btn btn-primary flex items-center gap-2"
                        disabled={!canSend}
                    >
                        {loading ? (
                            <>
                                <i className="fa fa-spinner fa-spin"></i>
                                Pensando...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-paper-plane"></i>
                                Enviar
                            </>
                        )}
                    </button>
                </div>
            </form>
            </div>
        </div>
    );
};

