import axios from 'axios';

import { api } from '../http';

export type AskBunyanAIResponse = {
  answer: string;
  matchedQuestion?: string;
  category?: string;
  role?: string;
  /** مصدر الإجابة من الخادم: nvidia | knowledge | fallback */
  source?: string;
};

export const aiAPI = {
  async ask(question: string): Promise<AskBunyanAIResponse> {
    // يجب أن يتجاوز أقصى NVIDIA_CHAT_TIMEOUT_MS على الخادم (حتى 480s) + محاولة ثانية
    const opts = { timeout: 600_000 as const };
    try {
      const { data } = await api.post<AskBunyanAIResponse>('/ai/ask', { question }, opts);
      return data;
    } catch (e) {
      // لا تعيد المحاولة عند رد HTTP (مثل 502 NVIDIA أو 503 غير مهيأ) حتى تظهر الرسالة للمستخدم.
      if (axios.isAxiosError(e) && e.response) throw e;
      const { data } = await api.post<AskBunyanAIResponse>('/ai/ask', { question }, opts);
      return data;
    }
  },
};
