import { api } from '../http';
import type { PaymentCard, Transfer } from '../types';

export type SetupIntentResponse = {
  setupIntentClientSecret: string;
  ephemeralKeySecret: string;
  customerId: string;
  publishableKey?: string;
};

export type CreateIntentResponse = {
  transfer: Transfer;
  clientSecret: string;
  paymentIntentId: string;
  customerId: string;
  ephemeralKeySecret: string;
  publishableKey?: string;
};

export type WalletSummary = {
  incoming: number;
  outgoing: number;
  net: number;
};

export const walletAPI = {
  async listCards(): Promise<PaymentCard[]> {
    const { data } = await api.get<PaymentCard[]>('/wallet/cards');
    return data;
  },

  async createSetupIntent(): Promise<SetupIntentResponse> {
    const { data } = await api.post<SetupIntentResponse>('/wallet/setup-intent');
    return data;
  },

  async saveCard(stripePaymentMethodId: string, makeDefault?: boolean): Promise<PaymentCard> {
    const { data } = await api.post<PaymentCard>('/wallet/cards', { stripePaymentMethodId, makeDefault });
    return data;
  },

  async setDefaultCard(id: string): Promise<PaymentCard> {
    const { data } = await api.post<PaymentCard>(`/wallet/cards/${id}/default`);
    return data;
  },

  async deleteCard(id: string) {
    await api.delete(`/wallet/cards/${id}`);
  },

  async listTransfers(): Promise<Transfer[]> {
    const { data } = await api.get<Transfer[]>('/wallet/transfers');
    return data;
  },

  async summary(): Promise<WalletSummary> {
    const { data } = await api.get<WalletSummary>('/wallet/summary');
    return data;
  },

  async createClientToContractorIntent(payload: {
    amount: number;
    toUserId: string;
    description?: string;
    projectId?: string;
    projectName?: string;
    currency?: string;
    cardId?: string;
  }): Promise<CreateIntentResponse> {
    const { data } = await api.post<CreateIntentResponse>('/wallet/transfers/client-to-contractor', payload);
    return data;
  },

  async createContractorToSupplierIntent(payload: {
    amount: number;
    toSupplierName?: string;
    toSupplierId?: string;
    description?: string;
    projectId?: string;
    projectName?: string;
    currency?: string;
    cardId?: string;
  }): Promise<CreateIntentResponse> {
    const { data } = await api.post<CreateIntentResponse>('/wallet/transfers/contractor-to-supplier', payload);
    return data;
  },

  async confirmTransfer(id: string): Promise<Transfer> {
    const { data } = await api.post<Transfer>(`/wallet/transfers/${id}/confirm`);
    return data;
  },

  /** مزامنة البطاقات من Stripe بعد نجاح PaymentSheet — يحفظ البطاقات الجديدة في قاعدة البيانات */
  async syncCards(): Promise<PaymentCard[]> {
    const { data } = await api.post<{ synced: number; cards: PaymentCard[] }>('/wallet/sync-cards');
    return data.cards;
  },
};
