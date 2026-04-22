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
