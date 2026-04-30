/** تبويبات الشاشة الرئيسية */
export type MainTabParamList = {
  Home: undefined;
  Projects: undefined;
  BunyanAI: undefined;
  Accounting: undefined;
  Chats: undefined;
  Account: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  App: undefined;
  DiscoverUsers: undefined;
  PublicProfile: { userId: string };
  ChatRoom: { conversationId: string; title: string };
  EditProfile: undefined;
  AccountSecurity: undefined;
  PortfolioManage: undefined;
  ConnectionRequests: undefined;
  AddCard: undefined;
  ManageCards: undefined;
  PayContractor: undefined;
  ContractorPaySupplier: undefined;
  Transfers: undefined;
  WalletHome: undefined;
  Invoices: undefined;
  NewInvoice: undefined;
  Revenues: undefined;
  AddRevenue: undefined;
  ExpenseCategories: undefined;
  ReportsAccounting: undefined;
  NewProject: undefined;
  EditProject: { id: string };
  NotificationSettings: undefined;
};
