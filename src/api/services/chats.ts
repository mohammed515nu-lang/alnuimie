import { api } from '../http';
import type { ChatMessage, ChatThread, UserRole } from '../types';

/** الخادم قد يعيد `_id` أو `conversationId` بدل `id` — بدون تطبيع يبقى `thread.id` فارغاً وينهار التنقل */
function normalizeChatThread(raw: unknown): ChatThread {
  if (raw === null || typeof raw !== 'object') {
    throw new Error('استجابة المحادثة غير صالحة');
  }
  const r = raw as Partial<ChatThread> & { _id?: string; conversationId?: string };
  const id = String(r.id ?? r._id ?? r.conversationId ?? '').trim();
  if (!id) {
    throw new Error('استجابة المحادثة لا تحتوي معرّف محادثة');
  }
  const otherUserRole = (r.otherUserRole ?? 'client') as UserRole;
  return {
    id,
    otherUserId: String(r.otherUserId ?? '').trim(),
    otherUserName: String(r.otherUserName ?? '').trim(),
    otherUserRole,
    lastMessage: r.lastMessage,
    lastTime: r.lastTime,
    lastSenderId: r.lastSenderId,
    otherUserLastSeenAt: typeof r.otherUserLastSeenAt === 'string' ? r.otherUserLastSeenAt : undefined,
    unread: typeof r.unread === 'number' ? r.unread : 0,
  };
}

export const chatsAPI = {
  async listThreads(): Promise<ChatThread[]> {
    const { data } = await api.get<unknown>('/chats');
    if (!Array.isArray(data)) return [];
    const out: ChatThread[] = [];
    for (const row of data) {
      try {
        out.push(normalizeChatThread(row));
      } catch {
        // تخطّي عناصر تالفة بدل إسقاط القائمة بأكملها
      }
    }
    return out;
  },

  async ensureThread(otherUserId: string): Promise<ChatThread> {
    const { data } = await api.post<unknown>('/chats', { otherUserId });
    return normalizeChatThread(data);
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
