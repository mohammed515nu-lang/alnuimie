import { router, type Href } from 'expo-router';

import type { RootStackParamList } from './types';

const staticHrefs: { [K in keyof RootStackParamList]?: Href } = {
  Auth: '/login',
  App: '/(main)/(tabs)' as Href,
  DiscoverUsers: '/discover-users',
  EditProfile: '/edit-profile',
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
};

export function pushStackRoute(
  name: keyof RootStackParamList,
  params?: RootStackParamList[keyof RootStackParamList]
) {
  if (name === 'PublicProfile' && params && 'userId' in params) {
    const { userId } = params as { userId: string };
    router.push(`/public-profile/${userId}` as Href);
    return;
  }
  if (name === 'ChatRoom' && params && 'conversationId' in params) {
    const p = params as { conversationId: string; title: string };
    router.push({
      pathname: '/chat-room/[conversationId]',
      params: { conversationId: p.conversationId, title: p.title },
    } as Href);
    return;
  }
  const h = staticHrefs[name];
  if (h) {
    router.push(h);
  }
}
