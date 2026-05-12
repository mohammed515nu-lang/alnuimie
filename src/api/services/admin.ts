import { api } from '../http';

export type AdminUserRow = {
  id: string;
  _id: string;
  name: string;
  email: string;
  role: string;
  accountStatus: string;
  suspendedReason?: string;
  walletFrozen: boolean;
  createdAt?: string;
};

export type AdminRatingRow = {
  id: string;
  stars: number;
  comment: string;
  from: { id: string; name: string; email?: string };
  target: { id: string; name: string };
  createdAt?: string;
};

export type AdminPortfolioRow = {
  id: string;
  userId: string;
  ownerName: string;
  title: string;
  description?: string;
  imageUris: string[];
  moderationStatus: string;
  moderationNote?: string;
  createdAt?: string;
};

export type AdminReportRow = {
  id: string;
  conversationId: string;
  reporter: { id: string; name: string };
  reportedUser?: { id: string; name: string };
  reason: string;
  details: string;
  status: string;
  adminNotes: string;
  createdAt?: string;
};

export type AdminDisputeRow = {
  id: string;
  title: string;
  description?: string;
  type: string;
  status: string;
  resolutionText?: string;
  adminNotes?: string;
  project?: { id: string; name: string } | null;
  openedBy: { id: string; name: string };
  respondent?: { id: string; name: string } | null;
  updatedAt?: string;
  createdAt?: string;
};

export type AdminTransferRow = {
  id: string;
  type: string;
  amount: number;
  currency: string;
  status: string;
  stripePaymentIntentId?: string;
  fromUserId?: string;
  fromName?: string;
  toUserId?: string;
  toName?: string;
  description?: string;
  createdAt?: string;
};

export const adminAPI = {
  async listUsers(params?: { page?: number; limit?: number; q?: string }) {
    const { data } = await api.get<{ users: AdminUserRow[]; total: number }>('/admin/users', { params });
    return data;
  },

  async patchUser(
    id: string,
    body: Partial<{ role: string; accountStatus: string; suspendedReason: string; walletFrozen: boolean }>
  ) {
    const { data } = await api.patch<{ user: AdminUserRow }>(`/admin/users/${id}`, body);
    return data;
  },

  async resetUserPassword(id: string) {
    const { data } = await api.post<{ temporaryPassword: string }>(`/admin/users/${id}/reset-password`);
    return data;
  },

  async listRatings(params?: { page?: number; limit?: number }) {
    const { data } = await api.get<{ ratings: AdminRatingRow[]; total: number }>('/admin/ratings', { params });
    return data;
  },

  async deleteRating(id: string) {
    await api.delete(`/admin/ratings/${id}`);
  },

  async listPortfolio(params?: { page?: number; limit?: number; status?: string }) {
    const { data } = await api.get<{ items: AdminPortfolioRow[]; total: number }>('/admin/portfolio', { params });
    return data;
  },

  async patchPortfolio(id: string, body: Partial<{ moderationStatus: string; moderationNote: string }>) {
    const { data } = await api.patch<{ item: AdminPortfolioRow }>(`/admin/portfolio/${id}`, body);
    return data;
  },

  async listReports(params?: { page?: number; limit?: number; status?: string }) {
    const { data } = await api.get<{ reports: AdminReportRow[]; total: number }>('/admin/reports', { params });
    return data;
  },

  async patchReport(id: string, body: Partial<{ status: string; adminNotes: string }>) {
    await api.patch(`/admin/reports/${id}`, body);
  },

  async createReport(body: {
    conversationId: string;
    reporterId?: string;
    reportedUserId?: string;
    reason: string;
    details?: string;
  }) {
    const { data } = await api.post<{ id: string }>('/admin/reports', body);
    return data;
  },

  async getChatMessages(conversationId: string, limit?: number) {
    const { data } = await api.get<{ messages: { id: string; senderName: string; text: string; timestamp: string }[] }>(
      `/admin/chats/${conversationId}/messages`,
      { params: { limit } }
    );
    return data;
  },

  async listDisputes(params?: { page?: number; limit?: number }) {
    const { data } = await api.get<{ disputes: AdminDisputeRow[]; total: number }>('/admin/disputes', { params });
    return data;
  },

  async createDispute(body: {
    title: string;
    openedBy: string;
    projectId?: string;
    respondentId?: string;
    description?: string;
    type?: string;
  }) {
    const { data } = await api.post<{ id: string }>('/admin/disputes', body);
    return data;
  },

  async patchDispute(id: string, body: Partial<{ status: string; resolutionText: string; adminNotes: string }>) {
    await api.patch(`/admin/disputes/${id}`, body);
  },

  async financeSummary() {
    const { data } = await api.get<{
      transfersByStatus: { _id: string; total: number; count: number }[];
      paymentsByStatus: { _id: string; total: number; count: number }[];
      largeTransferThresholdUsd: number;
      largeTransfers: {
        id: string;
        amount: number;
        currency: string;
        status: string;
        type: string;
        stripePaymentIntentId?: string;
        fromName?: string;
        toName?: string;
        createdAt?: string;
      }[];
      stripeConfigured: boolean;
    }>('/admin/finance/summary');
    return data;
  },

  async listTransfers(params?: { page?: number; limit?: number }) {
    const { data } = await api.get<{ transfers: AdminTransferRow[]; total: number }>('/admin/transfers', { params });
    return data;
  },

  async patchTransfer(id: string, status: string) {
    await api.patch(`/admin/transfers/${id}`, { status });
  },

  async stripeRefundTransfer(id: string) {
    const { data } = await api.post<{ refundId: string; amount: number; currency: string }>(
      `/admin/transfers/${id}/stripe-refund`
    );
    return data;
  },
};
