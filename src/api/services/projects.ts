import { api } from '../http';
import type { Project } from '../types';

type RawProject = Partial<Project> & {
  _id?: string;
  id?: string;
  client?: { _id?: string; name?: string } | string;
  contractor?: { _id?: string; name?: string; companyName?: string } | string;
};

function normalizeProject(raw: RawProject): Project {
  const clientName =
    typeof raw.client === 'object' && raw.client !== null ? raw.client.name : undefined;
  const contractorName =
    typeof raw.contractor === 'object' && raw.contractor !== null
      ? String(raw.contractor.name ?? raw.contractor.companyName ?? '')
      : undefined;
  return {
    id: String(raw.id ?? raw._id ?? ''),
    name: String(raw.name ?? clientName ?? 'مشروع بدون اسم'),
    description: raw.description,
    location: raw.location,
    clientName,
    contractorName: contractorName || undefined,
    budget: typeof raw.budget === 'number' ? raw.budget : undefined,
    progress: typeof raw.progress === 'number' ? raw.progress : undefined,
    startDate: raw.startDate,
    expectedEndDate: raw.expectedEndDate,
    actualEndDate: raw.actualEndDate,
    createdBy: typeof raw.createdBy === 'string' ? raw.createdBy : undefined,
    status: raw.status ?? 'pending',
    createdAt: raw.createdAt ?? new Date().toISOString(),
  };
}

export const projectsAPI = {
  async listMine(): Promise<Project[]> {
    const { data } = await api.get<RawProject[]>('/projects');
    return data.map(normalizeProject);
  },

  async create(payload: {
    name: string;
    location: string;
    description?: string;
    budget?: number;
    startDate?: string;
    expectedEndDate?: string;
    /** معرّف المقاول (لصاحب المشروع) */
    contractor?: string;
  }): Promise<Project> {
    const { data } = await api.post<RawProject>('/projects', payload);
    return normalizeProject(data);
  },

  async getById(id: string): Promise<Project> {
    const { data } = await api.get<RawProject>(`/projects/${id}`);
    return normalizeProject(data);
  },

  async update(
    id: string,
    payload: Partial<{
      name: string;
      location: string;
      description?: string;
      budget?: number;
      startDate?: string;
      expectedEndDate?: string;
      status?: Project['status'];
    }>
  ): Promise<Project> {
    const { data } = await api.put<RawProject>(`/projects/${id}`, payload);
    return normalizeProject(data);
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/projects/${id}`);
  },
};
