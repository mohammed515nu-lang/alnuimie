import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authAPI, chatsAPI, socialAPI, walletAPI } from '../api/services';
import type {
  AuthUser,
  ChatMessage,
  ChatThread,
  Connection,
  PaymentCard,
  PortfolioItem,
  PublicProfile,
  PublicProfileAggregate,
  Rating,
  Transfer,
} from '../api/types';

type AppState = {
  user: AuthUser | null;

  myPublicProfile: PublicProfile | null;

  searchResults: PublicProfile[];
  connections: Connection[];
  portfolio: PortfolioItem[];
  ratings: Rating[];

  chatThreads: ChatThread[];
  chatMessagesByThread: Record<string, ChatMessage[]>;

  paymentCards: PaymentCard[];
  transfers: Transfer[];
  walletSummary: { incoming: number; outgoing: number; net: number } | null;

  setUser: (user: AuthUser | null) => void;
  logout: () => Promise<void>;

  refreshMyProfile: () => Promise<void>;
  updateMyProfile: (payload: Partial<PublicProfile>) => Promise<void>;

  searchUsers: (q: string) => Promise<void>;
  refreshConnections: () => Promise<void>;
  sendConnectionRequest: (toUserId: string, message?: string) => Promise<Connection>;
  acceptConnection: (id: string) => Promise<Connection>;
  rejectConnection: (id: string) => Promise<Connection>;
  cancelConnection: (id: string) => Promise<void>;

  refreshPortfolio: () => Promise<void>;
  addPortfolioItem: (payload: Parameters<typeof socialAPI.createPortfolioItem>[0]) => Promise<void>;
  updatePortfolioItem: (id: string, payload: Parameters<typeof socialAPI.updatePortfolioItem>[1]) => Promise<void>;
  deletePortfolioItem: (id: string) => Promise<void>;

  refreshRatings: (userId: string) => Promise<void>;
  upsertRating: (targetUserId: string, stars: number, comment?: string) => Promise<void>;
  deleteRating: (id: string) => Promise<void>;

  refreshChatThreads: () => Promise<void>;
  ensureChatThread: (otherUserId: string) => Promise<ChatThread>;
  refreshChatMessages: (conversationId: string) => Promise<void>;
  sendChatMessage: (conversationId: string, text: string) => Promise<void>;
  markChatThreadRead: (conversationId: string) => Promise<void>;

  refreshPaymentCards: () => Promise<void>;
  setDefaultPaymentCard: (id: string) => Promise<void>;
  removePaymentCard: (id: string) => Promise<void>;

  refreshTransfers: () => Promise<void>;
  refreshWalletSummary: () => Promise<void>;

  addTransferLocal: (t: Transfer) => void;
  updateTransferLocal: (id: string, patch: Partial<Transfer>) => void;
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,

      myPublicProfile: null,

      searchResults: [],
      connections: [],
      portfolio: [],
      ratings: [],

      chatThreads: [],
      chatMessagesByThread: {},

      paymentCards: [],
      transfers: [],
      walletSummary: null,

      setUser: (user) => set({ user }),

      logout: async () => {
        await authAPI.logout();
        try {
          await AsyncStorage.removeItem('bunyan-app');
        } catch {
          // ignore
        }
        set({
          user: null,
          myPublicProfile: null,
          searchResults: [],
          connections: [],
          portfolio: [],
          ratings: [],
          chatThreads: [],
          chatMessagesByThread: {},
          paymentCards: [],
          transfers: [],
          walletSummary: null,
        });
      },

      refreshMyProfile: async () => {
        const profile = await socialAPI.getMyProfile();
        set({ myPublicProfile: profile });
      },

      updateMyProfile: async (payload) => {
        const profile = await socialAPI.updateMyProfile(payload);
        set({ myPublicProfile: profile });
      },

      searchUsers: async (q) => {
        const trimmed = q.trim();
        if (!trimmed) {
          set({ searchResults: [] });
          return;
        }
        const results = await socialAPI.searchUsers(trimmed);
        set({ searchResults: results });
      },

      refreshConnections: async () => {
        const connections = await socialAPI.listConnections();
        set({ connections });
      },

      sendConnectionRequest: async (toUserId, message) => {
        const conn = await socialAPI.sendConnectionRequest(toUserId, message);
        await get().refreshConnections();
        return conn;
      },

      acceptConnection: async (id) => {
        const conn = await socialAPI.acceptConnection(id);
        await get().refreshConnections();
        return conn;
      },

      rejectConnection: async (id) => {
        const conn = await socialAPI.rejectConnection(id);
        await get().refreshConnections();
        return conn;
      },

      cancelConnection: async (id) => {
        await socialAPI.cancelConnection(id);
        await get().refreshConnections();
      },

      refreshPortfolio: async () => {
        const portfolio = await socialAPI.listMyPortfolio();
        set({ portfolio });
      },

      addPortfolioItem: async (payload) => {
        await socialAPI.createPortfolioItem(payload);
        await get().refreshPortfolio();
      },

      updatePortfolioItem: async (id, payload) => {
        await socialAPI.updatePortfolioItem(id, payload);
        await get().refreshPortfolio();
      },

      deletePortfolioItem: async (id) => {
        await socialAPI.deletePortfolioItem(id);
        await get().refreshPortfolio();
      },

      refreshRatings: async (userId) => {
        const ratings = await socialAPI.listRatings(userId);
        set({ ratings });
      },

      upsertRating: async (targetUserId, stars, comment) => {
        await socialAPI.upsertRating(targetUserId, stars, comment);
        await get().refreshRatings(targetUserId);
      },

      deleteRating: async (id) => {
        await socialAPI.deleteRating(id);
        const userId = get().user?._id;
        if (userId) await get().refreshRatings(userId);
      },

      refreshChatThreads: async () => {
        const chatThreads = await chatsAPI.listThreads();
        set({ chatThreads });
      },

      ensureChatThread: async (otherUserId) => {
        const thread = await chatsAPI.ensureThread(otherUserId);
        await get().refreshChatThreads();
        return thread;
      },

      refreshChatMessages: async (conversationId) => {
        const msgs = await chatsAPI.listMessages(conversationId, { limit: 200 });
        set((s) => ({
          chatMessagesByThread: { ...s.chatMessagesByThread, [conversationId]: msgs },
        }));
      },

      sendChatMessage: async (conversationId, text) => {
        const msg = await chatsAPI.sendMessage(conversationId, text);
        set((s) => {
          const prev = s.chatMessagesByThread[conversationId] ?? [];
          return { chatMessagesByThread: { ...s.chatMessagesByThread, [conversationId]: [...prev, msg] } };
        });
        await get().refreshChatThreads();
      },

      markChatThreadRead: async (conversationId) => {
        await chatsAPI.markRead(conversationId);
        await get().refreshChatThreads();
      },

      refreshPaymentCards: async () => {
        const paymentCards = await walletAPI.listCards();
        set({ paymentCards });
      },

      setDefaultPaymentCard: async (id) => {
        await walletAPI.setDefaultCard(id);
        await get().refreshPaymentCards();
      },

      removePaymentCard: async (id) => {
        await walletAPI.deleteCard(id);
        await get().refreshPaymentCards();
      },

      refreshTransfers: async () => {
        const transfers = await walletAPI.listTransfers();
        set({ transfers });
      },

      refreshWalletSummary: async () => {
        const walletSummary = await walletAPI.summary();
        set({ walletSummary });
      },

      addTransferLocal: (t) =>
        set((s) => ({
          transfers: [t, ...s.transfers.filter((x) => x.id !== t.id)],
        })),

      updateTransferLocal: (id, patch) =>
        set((s) => ({
          transfers: s.transfers.map((x) => (x.id === id ? { ...x, ...patch } : x)),
        })),
    }),
    {
      name: 'bunyan-app',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);

export type { PublicProfileAggregate };
