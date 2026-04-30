import { router, type Href } from 'expo-router';

import type { RootStackParamList } from './types';

const staticHrefs: { [K in keyof RootStackParamList]?: Href } = {
  Auth: '/login',
  App: '/(main)/(tabs)' as Href,
  DiscoverUsers: '/discover-users',
  EditProfile: '/edit-profile',
  AccountSecurity: '/account-security',
  PortfolioManage: '/portfolio-manage',
  ConnectionRequests: '/connection-requests',
  ManageCards: '/manage-cards',
  AddCard: '/add-card',
  PayContractor: '/pay-contractor',
  ContractorPaySupplier: '/contractor-pay-supplier',
  Transfers: '/transfers',
  WalletHome: '/wallet-home',
  Invoices: '/invoices',
  NewInvoice: '/new-invoice',
  Revenues: '/revenues',
  AddRevenue: '/add-revenue',
  ExpenseCategories: '/expense-categories',
  ReportsAccounting: '/reports-accounting',
  NewProject: '/new-project',
  NotificationSettings: '/notification-settings',
};

export function pushStackRoute(
  name: keyof RootStackParamList,
  params?: RootStackParamList[keyof RootStackParamList]
) {
  if (name === 'PublicProfile' && params && 'userId' in params) {
    const { userId } = params as { userId: string };
    const safeUserId = String(userId ?? '').trim();
    if (!safeUserId) return;
    router.push(`/public-profile/${encodeURIComponent(safeUserId)}` as Href);
    return;
  }
  if (name === 'ChatRoom' && params && 'conversationId' in params) {
    const p = params as { conversationId: string; title: string };
    const safeConversationId = String(p.conversationId ?? '').trim();
    if (!safeConversationId) return;
    router.push({
      pathname: '/chat-room/[conversationId]',
      params: { conversationId: safeConversationId, title: String(p.title ?? '').trim() || 'محادثة' },
    } as Href);
    return;
  }
  if (name === 'EditProject' && params && 'id' in params) {
    const { id } = params as { id: string };
    const safeId = String(id ?? '').trim();
    if (!safeId) return;
    router.push(`/edit-project/${encodeURIComponent(safeId)}` as Href);
    return;
  }
  const h = staticHrefs[name];
  if (h) {
    router.push(h);
  }
}
