import { api } from '../http';

export type AskBunyanAIResponse = {
  answer: string;
  matchedQuestion?: string;
  category?: string;
  role?: string;
};

export const aiAPI = {
  async ask(question: string): Promise<AskBunyanAIResponse> {
    try {
      const { data } = await api.post<AskBunyanAIResponse>(
        '/ai/ask',
        { question },
        // Render may cold-start; give AI endpoint more time.
        { timeout: 60000 }
      );
      return data;
    } catch {
      // Retry once on transient network/cold-start failures.
      const { data } = await api.post<AskBunyanAIResponse>(
        '/ai/ask',
        { question },
        { timeout: 60000 }
      );
      return data;
    }
  },
};
