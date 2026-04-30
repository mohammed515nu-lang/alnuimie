import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';

import { ApiStateView } from '../../components/ApiStateView';
import { TopBar } from '../../components/TopBar';
import { socialAPI } from '../../api/services';
import { getApiErrorMessage } from '../../api/http';
import { pushStackRoute } from '../../navigation/href';
import type { PortfolioItem, PublicProfileAggregate, Rating } from '../../api/types';
import { useStore } from '../../store/useStore';
import { pressableRipple, space, touch, useAppTheme } from '../../theme';
import { DASHBOARD_RADIUS, getDashboardPalette, type DashboardPalette } from '../../theme/dashboardLight';
import { hapticSuccess } from '../../utils/haptics';
import { isConnectedWith } from '../../utils/connections';

const MAX_CONNECT = 300;

function readParam(s: string | string[] | undefined) {
  if (s === undefined) return '';
  return Array.isArray(s) ? (s[0] ?? '') : s;
}

export function PublicProfileScreen() {
  const { userId: userIdParam } = useLocalSearchParams<{ userId: string }>();
  const userId = readParam(userIdParam);
  const insets = useSafeAreaInsets();

  const me = useStore((s) => s.user);
  const connections = useStore((s) => s.connections);
  const refreshConnections = useStore((s) => s.refreshConnections);
  const sendConnectionRequest = useStore((s) => s.sendConnectionRequest);
  const ensureChatThread = useStore((s) => s.ensureChatThread);
  const upsertRating = useStore((s) => s.upsertRating);

  const [profile, setProfile] = useState<PublicProfileAggregate | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const [connectModal, setConnectModal] = useState(false);
  const [blockModal, setBlockModal] = useState(false);
  const [connectMsg, setConnectMsg] = useState('');
  const [stars, setStars] = useState('5');
  const [comment, setComment] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  const { resolved } = useAppTheme();
  const dash = useMemo(() => getDashboardPalette(resolved), [resolved]);
  const styles = useMemo(() => createStyles(dash), [dash]);
  const apiTone = resolved === 'light' ? 'beige' : 'default';

  const isSelf = useMemo(() => !!me && me._id === userId, [me, userId]);
  const barTitle = isSelf ? 'ملفي العام' : 'الملف الشخصي';
  const connected = useMemo(
    () => (me ? isConnectedWith(connections, me._id, userId) : false),
    [connections, me, userId]
  );

  const load = useCallback(async () => {
    setLoadError(null);
    const [p, port, r] = await Promise.all([
      socialAPI.getPublicProfile(userId),
      socialAPI.listPublicPortfolio(userId),
      socialAPI.listRatings(userId),
    ]);
    setProfile(p);
    setPortfolio(port);
    setRatings(r);
  }, [userId]);

  useEffect(() => {
    void useStore.getState().refreshConnections();
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        await load();
      } catch (e) {
        setLoadError(getApiErrorMessage(e));
      } finally {
        setLoading(false);
      }
    })();
  }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await load();
      await refreshConnections();
    } catch (e) {
      setLoadError(getApiErrorMessage(e));
    } finally {
      setRefreshing(false);
    }
  };

  const onConnect = async () => {
    const toId = String(userId ?? '').trim();
    if (!toId) {
      Alert.alert('تنبيه', 'معرّف المستخدم غير صالح.');
      return;
    }
    try {
      await sendConnectionRequest(toId, connectMsg.trim() || undefined);
      setConnectModal(false);
      setConnectMsg('');
      hapticSuccess();
      Alert.alert('تم', 'تم إرسال طلب التواصل');
    } catch (e) {
      Alert.alert('تعذر الإرسال', getApiErrorMessage(e));
    }
  };

  const onMessage = async () => {
    if (!me || isSelf) return;
    const otherId = String(userId ?? '').trim();
    if (!otherId) {
      Alert.alert('تنبيه', 'معرّف المستخدم غير صالح.');
      return;
    }
    if (!connected) {
      setBlockModal(true);
      return;
    }
    try {
      const thread = await ensureChatThread(otherId);
      const cid = String(thread.id ?? '').trim();
      if (!cid) {
        Alert.alert('تعذر فتح المحادثة', 'لم يُرجع الخادم معرف محادثة صالحاً.');
        return;
      }
      pushStackRoute('ChatRoom', {
        conversationId: cid,
        title: thread.otherUserName || 'محادثة',
      });
    } catch (e) {
      Alert.alert('تعذر فتح المحادثة', getApiErrorMessage(e));
    }
  };

  const onRating = async () => {
    const n = Number(stars);
    if (!(n >= 1 && n <= 5)) return Alert.alert('تنبيه', 'التقييم يجب أن يكون بين 1 و 5');
    try {
      await upsertRating(userId, n, comment.trim() || undefined);
      await load();
      hapticSuccess();
      Alert.alert('تم', 'تم حفظ التقييم');
    } catch (e) {
      Alert.alert('تعذر التقييم', getApiErrorMessage(e));
    }
  };

  const setMsg = (t: string) => {
    if (t.length <= MAX_CONNECT) setConnectMsg(t);
    else setConnectMsg(t.slice(0, MAX_CONNECT));
  };

  const bottomPad = 24 + insets.bottom;

  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <TopBar tone="beige" title={barTitle} />
        <View style={styles.center}>
          <ApiStateView tone={apiTone} mode="loading" title="جاري تحميل الملف..." />
        </View>
      </SafeAreaView>
    );
  }

  if ((!profile || loadError) && !refreshing) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <TopBar tone="beige" title={barTitle} />
        <View style={styles.center}>
          <ApiStateView
            tone={apiTone}
            mode="error"
            title="تعذر تحميل الملف"
            subtitle={loadError ?? 'حدث خطأ غير متوقع'}
            onRetry={() => void onRefresh()}
          />
        </View>
      </SafeAreaView>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <TopBar tone="beige" title={barTitle} />
        <View style={styles.center}>
          <ApiStateView tone={apiTone} mode="loading" title="جاري تحميل الملف..." />
        </View>
      </SafeAreaView>
    );
  }

  const roleLabel = profile.role === 'contractor' ? 'مقاول' : profile.role === 'client' ? 'عميل' : profile.role;
  const expYears =
    typeof profile.yearsExperience === 'number' && profile.yearsExperience >= 0
      ? String(profile.yearsExperience)
      : '—';
  const roleIcon: keyof typeof Ionicons.glyphMap =
    profile.role === 'contractor' ? 'construct-outline' : 'person-outline';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <TopBar tone="beige" title={barTitle} />
      <ScrollView
        ref={scrollRef}
        style={styles.flex}
        contentContainerStyle={[styles.content, { paddingBottom: bottomPad }]}
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="automatic"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={dash.gold} />}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <View style={styles.hero}>
            {profile.avatarUri ? (
              <Image source={{ uri: profile.avatarUri }} style={styles.avatarImg} />
            ) : (
              <View style={styles.avatarRole}>
                <Ionicons name={roleIcon} size={36} color={dash.navy} />
              </View>
            )}
            <Text style={styles.name}>{profile.name}</Text>
            <View style={styles.rolePill}>
              <Text style={styles.role}>{roleLabel}</Text>
            </View>
            <View style={styles.starsRow}>
              {profile.ratingCount === 0 ? (
                <>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Ionicons key={i} name="star-outline" size={18} color={dash.muted} style={{ marginHorizontal: 2 }} />
                  ))}
                  <Text style={styles.noRate}>لا تقييمات بعد</Text>
                </>
              ) : (
                <Text style={styles.rateText}>
                  ⭐ {profile.ratingAvg.toFixed(1)} ({profile.ratingCount})
                </Text>
              )}
            </View>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{profile.ratingCount}</Text>
            <Text style={styles.statLab}>تقييمات</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{expYears}</Text>
            <Text style={styles.statLab}>سنة خبرة</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{profile.completedProjects}</Text>
            <Text style={styles.statLab}>مشاريع</Text>
          </View>
        </View>

        {!isSelf ? (
          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              onPress={() => setConnectModal(true)}
              {...pressableRipple(dash.goldTint)}
              style={styles.btn}
            >
              <Text style={styles.btnText}>طلب تواصل</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={onMessage}
              {...pressableRipple(dash.navyTint)}
              style={styles.btnSecondary}
            >
              <Text style={styles.btnSecondaryText}>مراسلة</Text>
            </Pressable>
          </View>
        ) : null}

        {profile.specialty ? (
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>التخصص</Text>
            <Text style={styles.block}>{profile.specialty}</Text>
          </View>
        ) : null}
        {profile.bio ? (
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>نبذة</Text>
            <Text style={styles.block}>{profile.bio}</Text>
          </View>
        ) : null}

        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>الأعمال المنجزة ({portfolio.length})</Text>
        </View>
        {portfolio.length === 0 ? <Text style={styles.empty}>لا توجد أعمال منشورة بعد</Text> : null}
        {portfolio.map((it) => (
          <View key={it.id} style={styles.card}>
            <Text style={styles.itemTitle}>{it.title}</Text>
            {it.description ? <Text style={styles.block}>{it.description}</Text> : null}
          </View>
        ))}

        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>التقييمات ({ratings.length})</Text>
          {me && me.role === 'client' && profile.role === 'contractor' && !isSelf ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="الانتقال إلى نموذج التقييم"
              onPress={() => scrollRef.current?.scrollToEnd({ animated: true })}
              style={styles.addRate}
              {...pressableRipple(dash.goldTint)}
            >
              <Text style={styles.addRateText}>+ أضف تقييمك</Text>
            </Pressable>
          ) : null}
        </View>
        {ratings.length === 0 ? <Text style={styles.empty}>لا تقييمات بعد</Text> : null}
        {ratings.map((r) => (
          <View key={r.id} style={styles.card}>
            <Text style={styles.itemTitle}>
              {r.stars}⭐ — {r.fromUserName}
            </Text>
            {r.comment ? <Text style={styles.block}>{r.comment}</Text> : null}
          </View>
        ))}

        {me && me.role === 'client' && profile.role === 'contractor' && !isSelf ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>تقييم المقاول</Text>
            <TextInput
              placeholder="1-5"
              placeholderTextColor={dash.muted}
              style={styles.input}
              value={stars}
              onChangeText={setStars}
              keyboardType="number-pad"
              textAlign="right"
            />
            <TextInput
              placeholder="تعليق (اختياري)"
              placeholderTextColor={dash.muted}
              style={styles.input}
              value={comment}
              onChangeText={setComment}
              textAlign="right"
            />
            <Pressable
              accessibilityRole="button"
              onPress={onRating}
              {...pressableRipple(dash.goldTint)}
              style={styles.btn}
            >
              <Text style={styles.btnText}>حفظ التقييم</Text>
            </Pressable>
          </View>
        ) : null}
      </ScrollView>

      <Modal visible={connectModal} animationType="slide" transparent onRequestClose={() => setConnectModal(false)}>
        <View style={styles.modalRoot}>
          <Pressable style={styles.modalDim} onPress={() => setConnectModal(false)} />
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>إرسال طلب تواصل</Text>
            <Text style={styles.sheetSub}>إلى {profile.name}</Text>
            <TextInput
              placeholder="...اكتب رسالة تعريفية (اختياري)"
              placeholderTextColor={dash.muted}
              style={styles.sheetInput}
              value={connectMsg}
              onChangeText={setMsg}
              multiline
              textAlignVertical="top"
              textAlign="right"
            />
            <Text style={styles.counter}>
              {connectMsg.length}/{MAX_CONNECT}
            </Text>
            <View style={styles.sheetActions}>
              <Pressable
                onPress={() => setConnectModal(false)}
                style={styles.sheetCancel}
                {...pressableRipple(dash.navyTint)}
              >
                <Text style={styles.sheetCancelText}>إلغاء</Text>
              </Pressable>
              <Pressable onPress={onConnect} style={styles.sheetOk} {...pressableRipple(dash.goldTint)}>
                <Text style={styles.sheetOkText}>إرسال الطلب</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={blockModal} transparent animationType="fade" onRequestClose={() => setBlockModal(false)}>
        <View style={styles.blockModalRoot}>
          <Pressable style={styles.alertDim} onPress={() => setBlockModal(false)} />
          <View style={styles.blockModalCenter} pointerEvents="box-none">
            <View style={styles.alertBox}>
              <Text style={styles.alertTitle}>غير متصل</Text>
              <Text style={styles.alertBody}>يجب قبول طلب التواصل أولاً قبل إرسال الرسائل</Text>
              <View style={styles.alertBtns}>
                <Pressable onPress={() => setBlockModal(false)} {...pressableRipple(dash.navyTint)}>
                  <Text style={styles.alertLink}>حسناً</Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    setBlockModal(false);
                    setConnectModal(true);
                  }}
                  {...pressableRipple(dash.goldTint)}
                >
                  <Text style={styles.alertLinkStrong}>إرسال طلب</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function createStyles(dash: DashboardPalette) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: dash.pageBg },
    flex: { flex: 1 },
    content: { paddingHorizontal: 16, paddingTop: 8 },
    center: { flex: 1, paddingHorizontal: 16, paddingTop: 24, alignItems: 'stretch' },
    heroCard: {
      backgroundColor: dash.white,
      borderRadius: DASHBOARD_RADIUS,
      borderWidth: 1,
      borderColor: dash.border,
      padding: 20,
      marginBottom: 14,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
    },
    hero: { alignItems: 'center' },
    avatarImg: { width: 96, height: 96, borderRadius: 22, borderWidth: 1, borderColor: dash.border },
    avatarRole: {
      width: 96,
      height: 96,
      borderRadius: 22,
      backgroundColor: dash.goldTint,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: dash.gold,
    },
    name: { color: dash.navy, fontSize: 22, fontWeight: '900', marginTop: 14, textAlign: 'center' },
    rolePill: {
      marginTop: 8,
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderRadius: 20,
      backgroundColor: dash.goldTint,
      borderWidth: 1,
      borderColor: dash.border,
    },
    role: { color: dash.navy, fontWeight: '800', fontSize: 13 },
    starsRow: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      marginTop: 10,
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    noRate: { color: dash.muted, marginRight: 8, fontSize: 13 },
    rateText: { color: dash.darkText, fontWeight: '800' },
    statsRow: { flexDirection: 'row-reverse', gap: 10, marginBottom: 14 },
    statCard: {
      flex: 1,
      backgroundColor: dash.white,
      borderRadius: DASHBOARD_RADIUS,
      borderWidth: 1,
      borderColor: dash.border,
      padding: 12,
      alignItems: 'center',
      elevation: 1,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
    },
    statNum: { color: dash.gold, fontSize: 20, fontWeight: '900' },
    statLab: { color: dash.muted, marginTop: 4, fontSize: 11, fontWeight: '700' },
    actions: { flexDirection: 'row-reverse', gap: 10, marginBottom: 14 },
    btn: {
      flex: 1,
      backgroundColor: dash.gold,
      borderRadius: 14,
      paddingVertical: space.md,
      minHeight: touch.minHeight,
      justifyContent: 'center',
    },
    btnText: { color: dash.onGold, textAlign: 'center', fontWeight: '900' },
    btnSecondary: {
      flex: 1,
      borderRadius: 14,
      paddingVertical: space.md,
      borderWidth: 1.5,
      borderColor: dash.gold,
      minHeight: touch.minHeight,
      justifyContent: 'center',
      backgroundColor: dash.white,
    },
    btnSecondaryText: { color: dash.navy, textAlign: 'center', fontWeight: '900' },
    infoCard: {
      backgroundColor: dash.white,
      borderRadius: DASHBOARD_RADIUS,
      borderWidth: 1,
      borderColor: dash.border,
      padding: 14,
      marginBottom: 10,
    },
    infoLabel: {
      color: dash.navy,
      fontWeight: '900',
      fontSize: 13,
      textAlign: 'right',
      marginBottom: 6,
    },
    block: { color: dash.darkText, textAlign: 'right', lineHeight: 22, fontSize: 15 },
    sectionHead: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 18,
      marginBottom: 8,
    },
    sectionTitle: { color: dash.navy, fontSize: 16, fontWeight: '900', textAlign: 'right' },
    addRate: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 12,
      backgroundColor: dash.white,
      borderWidth: 1,
      borderColor: dash.gold,
    },
    addRateText: { color: dash.navy, fontWeight: '800', fontSize: 12 },
    card: {
      backgroundColor: dash.white,
      borderColor: dash.border,
      borderWidth: 1,
      borderRadius: DASHBOARD_RADIUS,
      padding: 14,
      marginTop: 8,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
    },
    cardTitle: { color: dash.navy, fontWeight: '900', marginBottom: 10, textAlign: 'right' },
    input: {
      backgroundColor: dash.inputBg,
      borderColor: dash.border,
      borderWidth: 1,
      borderRadius: 12,
      paddingHorizontal: space.md,
      paddingVertical: space.sm + 2,
      color: dash.darkText,
      marginBottom: 10,
      minHeight: touch.minHeight - 4,
      fontSize: 16,
    },
    itemTitle: { color: dash.darkText, fontWeight: '900', textAlign: 'right', fontSize: 16 },
    empty: { color: dash.muted, textAlign: 'center', marginVertical: 12, fontSize: 14 },
    modalRoot: { flex: 1, justifyContent: 'flex-end' },
    modalDim: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)' },
    sheet: {
      backgroundColor: dash.white,
      borderTopLeftRadius: DASHBOARD_RADIUS,
      borderTopRightRadius: DASHBOARD_RADIUS,
      padding: 20,
      paddingBottom: 28,
      borderTopWidth: 1,
      borderColor: dash.border,
    },
    sheetTitle: { color: dash.navy, fontWeight: '900', fontSize: 18, textAlign: 'right' },
    sheetSub: { color: dash.muted, textAlign: 'right', marginTop: 4, fontSize: 14 },
    sheetInput: {
      marginTop: 14,
      minHeight: 120,
      backgroundColor: dash.inputBg,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: dash.border,
      padding: 14,
      color: dash.darkText,
      textAlign: 'right',
      fontSize: 15,
    },
    counter: { color: dash.muted, textAlign: 'right', marginTop: 6, fontSize: 12 },
    sheetActions: { flexDirection: 'row-reverse', gap: 12, marginTop: 18 },
    sheetCancel: {
      flex: 1,
      borderRadius: 14,
      borderWidth: 1.5,
      borderColor: dash.gold,
      paddingVertical: space.md,
      alignItems: 'center',
      backgroundColor: dash.white,
    },
    sheetCancelText: { color: dash.navy, fontWeight: '900' },
    sheetOk: {
      flex: 1,
      backgroundColor: dash.gold,
      borderRadius: 14,
      paddingVertical: space.md,
      alignItems: 'center',
    },
    sheetOkText: { color: dash.onGold, fontWeight: '900' },
    blockModalRoot: { flex: 1 },
    alertDim: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
    blockModalCenter: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      paddingHorizontal: 20,
    },
    alertBox: {
      backgroundColor: dash.white,
      borderRadius: DASHBOARD_RADIUS,
      padding: 20,
      borderWidth: 1,
      borderColor: dash.border,
    },
    alertTitle: { color: dash.navy, fontWeight: '900', fontSize: 18, textAlign: 'right' },
    alertBody: { color: dash.muted, marginTop: 12, textAlign: 'right', lineHeight: 22, fontSize: 15 },
    alertBtns: { flexDirection: 'row-reverse', justifyContent: 'flex-end', gap: 20, marginTop: 18 },
    alertLink: { color: dash.navy, fontWeight: '800', fontSize: 16 },
    alertLinkStrong: { color: dash.gold, fontWeight: '900', fontSize: 16 },
  });
}
