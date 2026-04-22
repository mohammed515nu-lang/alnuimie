import { api } from '../http';
import type { ChatMessage, ChatThread } from '../types';

export const chatsAPI = {
  async listThreads(): Promise<ChatThread[]> {
    const { data } = await api.get<ChatThread[]>('/chats');
    return data;
  },

  async ensureThread(otherUserId: string): Promise<ChatThread> {
    const { data } = await api.post<ChatThread>('/chats', { otherUserId });
    return data;
  },

  async listMessages(conversationId: string, params?: { before?: string; limit?: number }): Promise<ChatMessage[]> {
    const { data } = await api.get<ChatMessage[]>(`/chats/${conversationId}/messages`, { params });
    return data;
  },

  async sendMessage(conversationId: string, text: string): Promise<ChatMessage> {
    const { data } = await api.post<ChatMessage>(`/chats/${conversationId}/messages`, { text });
    return data;
  },

  async markRead(conversationId: string) {
    await api.post(`/chats/${conversationId}/read`);
  },
};
