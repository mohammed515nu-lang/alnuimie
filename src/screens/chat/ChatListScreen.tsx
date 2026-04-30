import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import { ApiStateView } from '../../components/ApiStateView';
import { DASHBOARD_TAB_BAR_SCROLL_BASE } from '../../constants/dashboardTabBar';
import { navigateFromRoot } from '../../navigation/rootNavigation';
import { pushStackRoute } from '../../navigation/href';
import { useStore } from '../../store/useStore';
import { getApiErrorMessage } from '../../api/http';
import type { ChatThread } from '../../api/types';
import { pressableRipple, space, touch, useAppTheme } from '../../theme';
import { DASHBOARD_RADIUS, getDashboardPalette, type DashboardPalette } from '../../theme/dashboardLight';

type ChatListStyles = ReturnType<typeof createStyles>;

type ChatThreadRowProps = {
  conversationId: string;
  name: string;
  lastMessage: string;
  unread: number;
  onOpen: (conversationId: string, title: string) => void;
  listStyles: ChatListStyles;
  palette: DashboardPalette;
};

const ChatThreadRow = memo(function ChatThreadRow({
  conversationId,
  name,
  lastMessage,
  unread,
  onOpen,
  listStyles,
  palette,
}: ChatThreadRowProps) {
  const onPress = useCallback(() => {
    onOpen(conversationId, name);
  }, [conversationId, name, onOpen]);

  return (
    <Pressable
      accessibilityRole="button"
      style={listStyles.row}
      onPress={onPress}
      {...pressableRipple(palette.navyTint)}
    >
      <View style={listStyles.avatar}>
        <Ionicons name="person" size={22} color={palette.navy} />
      </View>
      <View style={listStyles.rowText}>
        <Text style={listStyles.name}>{name}</Text>
        <Text style={listStyles.last} numberOfLines={1}>
          {lastMessage || '—'}
        </Text>
      </View>
      {unread > 0 ? (
        <View style={listStyles.badge} accessibilityLabel={`${unread} غير مقروء`}>
          <Text style={listStyles.badgeText}>{unread > 99 ? '99+' : unread}</Text>
        </View>
      ) : (
        <Ionicons name="chevron-back" size={20} color={palette.muted} />
      )}
    </Pressable>
  );
});

export function ChatListScreen() {
  const threads = useStore((s) => s.chatThreads);
  const insets = useSafeAreaInsets();
  const tabPad = DASHBOARD_TAB_BAR_SCROLL_BASE + insets.bottom + space.lg;
  const { resolved } = useAppTheme();
  const dash = useMemo(() => getDashboardPalette(resolved), [resolved]);
  const styles = useMemo(() => createStyles(dash), [dash]);
  const searchRef = useRef<TextInput>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState('');

  const load = useCallback(async () => {
    setError(null);
    const st = useStore.getState();
    await Promise.all([st.refreshChatThreads(), st.refreshConnections()]);
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        await load();
      } catch (e) {
        setError(getApiErrorMessage(e));
      } finally {
        setLoading(false);
      }
    })();
  }, [load]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await load();
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setRefreshing(false);
    }
  }, [load]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return threads;
    return threads.filter((t) => (t.otherUserName ?? '').toLowerCase().includes(s));
  }, [threads, q]);

  const openThread = useCallback((conversationId: string, title: string) => {
    const safeConversationId = String(conversationId ?? '').trim();
    if (!safeConversationId) return;
    pushStackRoute('ChatRoom', { conversationId: safeConversationId, title });
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: ChatThread }) => (
      <ChatThreadRow
        conversationId={item.id}
        name={item.otherUserName || 'مستخدم غير معروف'}
        lastMessage={item.lastMessage ?? ''}
        unread={item.unread}
        onOpen={openThread}
        listStyles={styles}
        palette={dash}
      />
    ),
    [openThread, styles, dash]
  );

  const listContentStyle = useMemo(
    () =>
      threads.length === 0 && !q.trim()
        ? [styles.listContent, styles.emptyGrow, { paddingBottom: tabPad }]
        : [styles.listContent, { paddingBottom: tabPad }],
    [threads.length, q, styles.listContent, styles.emptyGrow, tabPad]
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Pressable
            style={styles.headerIconBtn}
            accessibilityRole="button"
            accessibilityLabel="مستخدمون جدد"
            onPress={() => navigateFromRoot('DiscoverUsers')}
            {...pressableRipple(dash.navyTint)}
          >
            <Ionicons name="person-add-outline" size={22} color={dash.navy} />
          </Pressable>
          <Text style={styles.headerTitle}>المحادثات</Text>
          <Pressable
            style={styles.headerIconBtn}
            accessibilityRole="button"
            accessibilityLabel="بحث"
            onPress={() => searchRef.current?.focus()}
            {...pressableRipple(dash.navyTint)}
          >
            <Ionicons name="search-outline" size={22} color={dash.navy} />
          </Pressable>
        </View>
        <View style={styles.listContent}>
          <ApiStateView tone={resolved === 'light' ? 'beige' : 'default'} mode="loading" title="جاري تحميل المحادثات..." />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          style={styles.headerIconBtn}
          accessibilityRole="button"
          accessibilityLabel="مستخدمون جدد"
          onPress={() => navigateFromRoot('DiscoverUsers')}
          {...pressableRipple(dash.navyTint)}
        >
          <Ionicons name="person-add-outline" size={22} color={dash.navy} />
        </Pressable>
        <Text style={styles.headerTitle}>المحادثات</Text>
        <Pressable
          style={styles.headerIconBtn}
          accessibilityRole="button"
          accessibilityLabel="تركيز حقل البحث"
          onPress={() => searchRef.current?.focus()}
          {...pressableRipple(dash.navyTint)}
        >
          <Ionicons name="search-outline" size={22} color={dash.navy} />
        </Pressable>
      </View>

      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={20} color={dash.muted} style={{ marginLeft: 8 }} />
        <TextInput
          ref={searchRef}
          placeholder="ابحث في المحادثات..."
          placeholderTextColor={dash.muted}
          style={styles.searchInput}
          value={q}
          onChangeText={setQ}
          textAlign="right"
        />
      </View>

      {error && threads.length === 0 ? (
        <View style={styles.listContent}>
          <ApiStateView
            tone={resolved === 'light' ? 'beige' : 'default'}
            mode="error"
            title="تعذر تحميل المحادثات"
            subtitle={error}
            onRetry={() => void onRefresh()}
          />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(x) => x.id}
          renderItem={renderItem}
          keyboardShouldPersistTaps="handled"
          contentInsetAdjustmentBehavior="automatic"
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={dash.gold} />}
          contentContainerStyle={listContentStyle}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            error ? (
              <View style={styles.errWrap}>
                <Text style={styles.error} selectable>
                  {error}
                </Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="إعادة المحاولة"
                  onPress={() => void onRefresh()}
                  {...pressableRipple(dash.goldTint)}
                  style={styles.retry}
                >
                  <Text style={styles.retryText}>إعادة المحاولة</Text>
                </Pressable>
              </View>
            ) : null
          }
          ListEmptyComponent={
            threads.length === 0 ? (
              <View>
                <ApiStateView
                  tone={resolved === 'light' ? 'beige' : 'default'}
                  mode="empty"
                  title="لا توجد محادثات"
                  subtitle="ابحث عن مستخدم لبدء محادثة جديدة"
                />
                <Pressable
                  accessibilityRole="button"
                  onPress={() => navigateFromRoot('DiscoverUsers')}
                  {...pressableRipple(dash.goldTint)}
                  style={styles.cta}
                >
                  <Ionicons name="chatbubble-ellipses-outline" size={20} color={dash.navy} style={{ marginLeft: 8 }} />
                  <Text style={styles.ctaText}>ابدأ محادثة</Text>
                </Pressable>
              </View>
            ) : q.trim() ? (
              <Text style={styles.noMatch}>لا توجد نتائج مطابقة</Text>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}

function createStyles(dash: DashboardPalette) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: dash.pageBg },
    header: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingTop: 8,
      paddingBottom: 12,
    },
    headerTitle: {
      flex: 1,
      textAlign: 'center',
      fontSize: 18,
      fontWeight: '900',
      color: dash.navy,
    },
    headerIconBtn: {
      width: 44,
      height: 44,
      borderRadius: DASHBOARD_RADIUS,
      backgroundColor: dash.white,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: dash.border,
    },
    searchWrap: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      marginHorizontal: 16,
      backgroundColor: dash.white,
      borderRadius: DASHBOARD_RADIUS,
      borderWidth: 1,
      borderColor: dash.border,
      paddingHorizontal: 12,
      marginBottom: 12,
      minHeight: touch.minHeight - 4,
    },
    searchInput: { flex: 1, paddingVertical: 12, color: dash.darkText, fontSize: 15 },
    listContent: { paddingHorizontal: 16, paddingTop: 4 },
    emptyGrow: { flexGrow: 1 },
    errWrap: {
      marginBottom: 12,
      backgroundColor: 'rgba(185, 28, 28, 0.08)',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: 'rgba(185, 28, 28, 0.22)',
      padding: 12,
    },
    row: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 12,
      borderRadius: DASHBOARD_RADIUS,
      borderWidth: 1,
      borderColor: dash.border,
      backgroundColor: dash.white,
      marginBottom: 10,
      minHeight: touch.minHeight + 8,
      gap: 12,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
    },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: 14,
      backgroundColor: dash.goldTint,
      alignItems: 'center',
      justifyContent: 'center',
    },
    rowText: { flex: 1 },
    name: { color: dash.darkText, fontWeight: '900', textAlign: 'right', fontSize: 16 },
    last: { color: dash.muted, marginTop: 4, textAlign: 'right', fontSize: 13 },
    badge: {
      minWidth: 28,
      minHeight: 28,
      borderRadius: 14,
      backgroundColor: dash.gold,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 8,
    },
    badgeText: { color: dash.navy, fontWeight: '900', fontSize: 12 },
    cta: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 16,
      backgroundColor: dash.gold,
      paddingHorizontal: 24,
      paddingVertical: 14,
      borderRadius: DASHBOARD_RADIUS,
      minHeight: touch.minHeight,
      alignSelf: 'stretch',
    },
    ctaText: { color: dash.navy, fontWeight: '900', fontSize: 16 },
    error: { color: dash.danger, textAlign: 'center', fontWeight: '600' },
    retry: {
      marginTop: 10,
      alignSelf: 'center',
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 12,
      borderWidth: 1.5,
      borderColor: dash.gold,
      backgroundColor: dash.white,
    },
    retryText: { color: dash.navy, fontWeight: '800' },
    noMatch: { color: dash.muted, textAlign: 'center', marginTop: 24, fontSize: 15 },
  });
}
