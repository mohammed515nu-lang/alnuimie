export type UserRole = 'client' | 'contractor' | 'admin' | string;

export type AuthUser = {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
};

export type PublicProfile = {
  _id: string;
  name: string;
  email?: string;
  role: UserRole;
  phone?: string;
  city?: string;
  specialty?: string;
  bio?: string;
  yearsExperience?: number;
  avatarUri?: string;
  companyName?: string;
  website?: string;
  /** من الخادم: آخر نشاط مسجّل في التطبيق */
  lastSeenAt?: string;
};

export type PublicProfileAggregate = PublicProfile & {
  ratingAvg: number;
  ratingCount: number;
  completedProjects: number;
  followers: number;
  following: number;
};

export type PortfolioItem = {
  id: string;
  userId: string;
  title: string;
  description?: string;
  imageUris: string[];
  imageUri?: string;
  location?: string;
  completedAt?: string;
  category?: string;
  createdAt?: string;
};

export type Connection = {
  id: string;
  fromUserId: string;
  toUserId: string;
  fromUserName: string;
  toUserName: string;
  fromUserRole: UserRole;
  toUserRole: UserRole;
  status: 'pending' | 'accepted' | 'rejected';
  message?: string;
  createdAt: string;
  acceptedAt?: string;
};

export type Rating = {
  id: string;
  targetUserId: string;
  fromUserId: string;
  fromUserName: string;
  stars: number;
  comment?: string;
  createdAt: string;
};

export type ChatThread = {
  id: string;
  otherUserId: string;
  otherUserName: string;
  otherUserRole: UserRole;
  /** آخر نشاط للطرف الآخر (من الخادم) */
  otherUserLastSeenAt?: string;
  lastMessage?: string;
  lastTime?: string;
  lastSenderId?: string;
  unread: number;
};

export type ChatMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
};

export type PaymentCard = {
  id: string;
  ownerId: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  holderName?: string;
  isDefault: boolean;
  stripePaymentMethodId: string;
  createdAt?: string;
};

export type Transfer = {
  id: string;
  type: 'client_to_contractor' | 'contractor_to_supplier' | 'topup' | 'withdraw' | string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | string;
  fromUserId: string;
  fromUserName: string;
  toUserId?: string;
  toUserName?: string;
  toSupplierName?: string;
  description?: string;
  projectId?: string;
  projectName?: string;
  createdAt: string;
  stripePaymentIntentId?: string;
  stripeClientSecret?: string;
  cardLast4?: string;
  cardBrand?: string;
};

export type ProjectStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled';

export type Project = {
  id: string;
  name: string;
  description?: string;
  location?: string;
  clientName?: string;
  /** اسم المقاول عند جلب المشروع مع populate */
  contractorName?: string;
  budget?: number;
  progress?: number;
  startDate?: string;
  expectedEndDate?: string;
  actualEndDate?: string;
  createdBy?: string;
  status: ProjectStatus;
  createdAt: string;
};

export type ReportType = 'financial' | 'inventory' | 'project' | 'supplier' | 'custom' | 'invoice';

export type RevenueData = {
  kind?: 'revenue';
  amount?: number;
  clientName?: string;
  received?: boolean;
  date?: string;
  description?: string;
  projectName?: string;
};

export type InvoiceData = {
  kind?: 'invoice';
  amount?: number;
  clientName?: string;
  dueDate?: string;
  issueDate?: string;
  statusLabel?: string;
};

export type ReportItem = {
  id: string;
  reportNumber?: string;
  reportType: ReportType;
  title: string;
  status?: 'pending' | 'completed' | 'failed';
  project?: string | { _id?: string; name?: string };
  data?: RevenueData | InvoiceData | Record<string, unknown>;
  notes?: string;
  generatedAt?: string;
  createdAt?: string;
};
