import { api } from '../http';
import type {
  Connection,
  PortfolioItem,
  PublicProfile,
  PublicProfileAggregate,
  Rating,
} from '../types';

function normalizePublicProfile<T extends PublicProfile>(p: T): T {
  const anyP = p as unknown as { _id?: unknown; id?: unknown };
  const id = String(anyP._id ?? anyP.id ?? '');
  return { ...(p as any), _id: id } as T;
}

export const socialAPI = {
  async searchUsers(q: string, role?: 'contractor' | 'client'): Promise<PublicProfile[]> {
    const { data } = await api.get<PublicProfile[]>('/users/search', { params: { q, role } });
    return data.map(normalizePublicProfile);
  },

  async getPublicProfile(userId: string): Promise<PublicProfileAggregate> {
    const { data } = await api.get<PublicProfileAggregate>(`/users/${userId}/profile`);
    return normalizePublicProfile(data);
  },

  async getMyProfile(): Promise<PublicProfile> {
    const { data } = await api.get<PublicProfile>('/users/me/profile');
    return normalizePublicProfile(data);
  },

  async updateMyProfile(payload: Partial<PublicProfile>): Promise<PublicProfile> {
    const { data } = await api.put<PublicProfile>('/users/me/profile', payload);
    return normalizePublicProfile(data);
  },

  /** يحدّث «آخر ظهور» للمستخدم الحالي على الخادم */
  async pingPresence(): Promise<void> {
    await api.post('/users/me/presence');
  },

  async listMyPortfolio(): Promise<PortfolioItem[]> {
    const { data } = await api.get<PortfolioItem[]>('/portfolio');
    return data;
  },

  async listPublicPortfolio(userId: string): Promise<PortfolioItem[]> {
    const { data } = await api.get<PortfolioItem[]>(`/portfolio/user/${userId}`);
    return data;
  },

  async createPortfolioItem(payload: {
    title: string;
    description?: string;
    imageUris?: string[];
    imageUri?: string;
    location?: string;
    completedAt?: string;
    category?: string;
  }): Promise<PortfolioItem> {
    const { data } = await api.post<PortfolioItem>('/portfolio', payload);
    return data;
  },

  async updatePortfolioItem(
    id: string,
    payload: Partial<{
      title: string;
      description?: string;
      imageUris?: string[];
      location?: string;
      completedAt?: string;
      category?: string;
    }>
  ): Promise<PortfolioItem> {
    const { data } = await api.put<PortfolioItem>(`/portfolio/${id}`, payload);
    return data;
  },

  async deletePortfolioItem(id: string) {
    await api.delete(`/portfolio/${id}`);
  },

  async listConnections(): Promise<Connection[]> {
    const { data } = await api.get<Connection[]>('/connections');
    return data;
  },

  async sendConnectionRequest(toUserId: string, message?: string): Promise<Connection> {
    const { data } = await api.post<Connection>('/connections/request', { toUserId, message });
    return data;
  },

  async acceptConnection(id: string): Promise<Connection> {
    const { data } = await api.post<Connection>(`/connections/${id}/accept`);
    return data;
  },

  async rejectConnection(id: string): Promise<Connection> {
    const { data } = await api.post<Connection>(`/connections/${id}/reject`);
    return data;
  },

  async cancelConnection(id: string) {
    await api.delete(`/connections/${id}`);
  },

  async listRatings(userId: string): Promise<Rating[]> {
    const { data } = await api.get<Rating[]>(`/ratings/user/${userId}`);
    return data;
  },

  async upsertRating(targetUserId: string, stars: number, comment?: string): Promise<Rating> {
    const { data } = await api.post<Rating>('/ratings', { targetUserId, stars, comment });
    return data;
  },

  async deleteRating(id: string) {
    await api.delete(`/ratings/${id}`);
  },
};
