import { api } from '../http';
import type { ReportItem } from '../types';

type RawReport = Partial<ReportItem> & { _id?: string; id?: string };

function normalizeReport(raw: RawReport): ReportItem {
  return {
    id: String(raw.id ?? raw._id ?? ''),
    reportNumber: raw.reportNumber,
    reportType: (raw.reportType ?? 'custom') as ReportItem['reportType'],
    title: String(raw.title ?? 'تقرير'),
    status: raw.status,
    project: raw.project,
    data: raw.data,
    notes: raw.notes,
    generatedAt: raw.generatedAt,
    createdAt: raw.createdAt,
  };
}

export const accountingAPI = {
  async listReports(reportType?: ReportItem['reportType']): Promise<ReportItem[]> {
    const { data } = await api.get<RawReport[]>('/reports', { params: reportType ? { reportType } : undefined });
    return data.map(normalizeReport);
  },

  async createInvoice(payload: {
    title: string;
    amount: number;
    clientName: string;
    issueDate?: string;
    dueDate?: string;
    statusLabel?: string;
    projectId?: string;
  }): Promise<ReportItem> {
    const { data } = await api.post<RawReport>('/reports', {
      reportType: 'invoice',
      title: payload.title,
      project: payload.projectId,
      data: {
        amount: payload.amount,
        clientName: payload.clientName,
        issueDate: payload.issueDate,
        dueDate: payload.dueDate,
        statusLabel: payload.statusLabel,
      },
    });
    return normalizeReport(data);
  },

  async createRevenue(payload: {
    title: string;
    amount: number;
    description?: string;
    date?: string;
    projectName?: string;
    clientName?: string;
    received?: boolean;
  }): Promise<ReportItem> {
    const { data } = await api.post<RawReport>('/reports', {
      reportType: 'custom',
      title: payload.title,
      data: {
        kind: 'revenue',
        amount: payload.amount,
        description: payload.description,
        date: payload.date,
        projectName: payload.projectName,
        clientName: payload.clientName,
        received: payload.received,
      },
    });
    return normalizeReport(data);
  },

  async deleteReport(id: string): Promise<void> {
    await api.delete(`/reports/${id}`);
  },
};
