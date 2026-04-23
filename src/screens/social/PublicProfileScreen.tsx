import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';

import { TopBar } from '../../components/TopBar';
import { socialAPI } from '../../api/services';
import { getApiErrorMessage } from '../../api/http';
import { pushStackRoute } from '../../navigation/href';
import type { PortfolioItem, PublicProfileAggregate, Rating } from '../../api/types';
import { useStore } from '../../store/useStore';
import { useAppTheme, pressableRipple, radius, space, touch } from '../../theme';
import { hapticSuccess } from '../../utils/haptics';
import type { AppPalette } from '../../theme/palettes';
import { isConnectedWith } from '../../utils/connections';

const MAX_CONNECT = 300;

function readParam(s: string | string[] | undefined) {
  if (s === undefined) return '';
  return Array.isArray(s) ? (s[0] ?? '') : s;
}

export function PublicProfileScreen() {
  const { userId: userIdParam } = useLocalSearchParams<{ userId: string }>();
  const userId = readParam(userIdParam);

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
  const [refreshing, setRefreshing] = useState(false);

  const [connectModal, setConnectModal] = useState(false);
  const [blockModal, setBlockModal] = useState(false);
  const [connectMsg, setConnectMsg] = useState('');
  const [stars, setStars] = useState('5');
  const [comment, setComment] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  const { colors } = useAppTheme();
  const styles = useMemo(() => createPublicProfileStyles(colors), [colors]);

  const isSelf = useMemo(() => !!me && me._id === userId, [me, userId]);
  const connected = useMemo(
    () => (me ? isConnectedWith(connections, me._id, userId) : false),
    [connections, me, userId]
  );

  const load = useCallback(async () => {
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
    void refreshConnections();
  }, [refreshConnections]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        await load();
      } catch (e) {
        Alert.alert('تعذر التحميل', getApiErrorMessage(e));
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
      Alert.alert('تعذر التحديث', getApiErrorMessage(e));
    } finally {
      setRefreshing(false);
    }
  };

  const onConnect = async () => {
    try {
      await sendConnectionRequest(userId, connectMsg.trim() || undefined);
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
    if (!connected) {
      setBlockModal(true);
      return;
    }
    try {
      const thread = await ensureChatThread(userId);
      pushStackRoute('ChatRoom', {
        conversationId: thread.id,
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

  if (loading || !profile) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  const roleLabel = profile.role === 'contractor' ? 'مقاول' : profile.role === 'client' ? 'عميل' : profile.role;
  const expYears =
    typeof profile.yearsExperience === 'number' && profile.yearsExperience >= 0
      ? String(profile.yearsExperience)
      : '—';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <TopBar title="الملف الشخصي" />
      <ScrollView
        ref={scrollRef}
        style={styles.flex}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="automatic"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.hero}>
          {profile.avatarUri ? (
            <Image source={{ uri: profile.avatarUri }} style={styles.avatarImg} />
          ) : (
            <View style={styles.avatarRole}>
              <Ionicons name={profile.role === 'contractor' ? 'hammer' : 'person'} size={36} color={colors.onPrimary} />
            </View>
          )}
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.role}>{roleLabel}</Text>
          <View style={styles.starsRow}>
            {profile.ratingCount === 0 ? (
              <>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Ionicons key={i} name="star-outline" size={18} color={colors.textMuted} style={{ marginHorizontal: 2 }} />
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
              {...pressableRipple(colors.primaryTint18)}
              style={styles.btn}
            >
              <Text style={styles.btnText}>طلب تواصل</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={onMessage}
              {...pressableRipple(colors.primaryTint12)}
              style={styles.btnSecondary}
            >
              <Text style={styles.btnSecondaryText}>مراسلة</Text>
            </Pressable>
          </View>
        ) : null}

        {profile.specialty ? <Text style={styles.block}>التخصص: {profile.specialty}</Text> : null}
        {profile.bio ? <Text style={styles.block}>{profile.bio}</Text> : null}

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
              {...pressableRipple(colors.primaryTint12)}
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
              placeholderTextColor={colors.placeholder}
              style={styles.input}
              value={stars}
              onChangeText={setStars}
              keyboardType="number-pad"
              textAlign="right"
            />
            <TextInput
              placeholder="تعليق (اختياري)"
              placeholderTextColor={colors.placeholder}
              style={styles.input}
              value={comment}
              onChangeText={setComment}
              textAlign="right"
            />
            <Pressable accessibilityRole="button" onPress={onRating} {...pressableRipple(colors.primaryTint18)} style={styles.btn}>
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
              placeholderTextColor={colors.placeholder}
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
              <Pressable onPress={() => setConnectModal(false)} style={styles.sheetCancel} {...pressableRipple(colors.primaryTint12)}>
                <Text style={styles.sheetCancelText}>إلغاء</Text>
              </Pressable>
              <Pressable onPress={onConnect} style={styles.sheetOk} {...pressableRipple(colors.primaryTint18)}>
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
                <Pressable onPress={() => setBlockModal(false)}>
                  <Text style={styles.alertLink}>حسناً</Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    setBlockModal(false);
                    setConnectModal(true);
                  }}
                >
                  <Text style={styles.alertLink}>إرسال طلب</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function createPublicProfileStyles(colors: AppPalette) {
  return StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  content: { padding: space.lg, paddingBottom: space.xxl + 8 },
  center: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },
  hero: { alignItems: 'center', marginBottom: space.lg },
  avatarImg: { width: 96, height: 96, borderRadius: 22, borderWidth: 1, borderColor: colors.borderMuted },
  avatarRole: {
    width: 96,
    height: 96,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  name: { color: colors.text, fontSize: 22, fontWeight: '900', marginTop: space.md, textAlign: 'center' },
  role: { color: colors.textMuted, marginTop: space.xs, fontWeight: '700' },
  starsRow: { flexDirection: 'row-reverse', alignItems: 'center', marginTop: space.sm, flexWrap: 'wrap', justifyContent: 'center' },
  noRate: { color: colors.textMuted, marginRight: space.sm, fontSize: 13 },
  rateText: { color: colors.textMuted, fontWeight: '700' },
  statsRow: { flexDirection: 'row-reverse', gap: space.sm, marginBottom: space.lg },
  statCard: {
    flex: 1,
    backgroundColor: colors.surfaceMid,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    padding: space.md,
    alignItems: 'center',
  },
  statNum: { color: colors.text, fontSize: 20, fontWeight: '900' },
  statLab: { color: colors.textMuted, marginTop: 4, fontSize: 12 },
  actions: { flexDirection: 'row-reverse', gap: space.sm + 2, marginBottom: space.md },
  btn: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: space.md,
    minHeight: touch.minHeight,
    justifyContent: 'center',
  },
  btnText: { color: colors.onPrimary, textAlign: 'center', fontWeight: '900' },
  btnSecondary: {
    flex: 1,
    borderRadius: radius.md,
    paddingVertical: space.md,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    minHeight: touch.minHeight,
    justifyContent: 'center',
    backgroundColor: colors.surfaceMid,
  },
  btnSecondaryText: { color: colors.link, textAlign: 'center', fontWeight: '900' },
  block: { color: colors.textSecondary, marginTop: space.sm, textAlign: 'right', lineHeight: 22 },
  sectionHead: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: space.lg,
    marginBottom: space.sm,
  },
  sectionTitle: { color: colors.text, fontSize: 16, fontWeight: '900', textAlign: 'right' },
  addRate: {
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMid,
    borderWidth: 1,
    borderColor: colors.borderMuted,
  },
  addRateText: { color: colors.primary, fontWeight: '800', fontSize: 12 },
  card: {
    backgroundColor: colors.surfaceMid,
    borderColor: colors.borderMuted,
    borderWidth: 1,
    borderRadius: radius.xl,
    padding: space.md,
    marginTop: space.sm + 2,
  },
  cardTitle: { color: colors.text, fontWeight: '900', marginBottom: space.sm, textAlign: 'right' },
  input: {
    backgroundColor: colors.background,
    borderColor: colors.borderMuted,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: space.md,
    paddingVertical: space.sm + 2,
    color: colors.textSecondary,
    marginBottom: space.sm + 2,
    minHeight: touch.minHeight - 4,
  },
  itemTitle: { color: colors.text, fontWeight: '900', textAlign: 'right' },
  empty: { color: colors.placeholder, textAlign: 'center', marginVertical: space.md },
  modalRoot: { flex: 1, justifyContent: 'flex-end' },
  modalDim: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
  sheet: {
    backgroundColor: colors.surfaceMid,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: space.lg,
    paddingBottom: space.xxl,
    borderTopWidth: 1,
    borderColor: colors.borderMuted,
  },
  sheetTitle: { color: colors.text, fontWeight: '900', fontSize: 18, textAlign: 'right' },
  sheetSub: { color: colors.textMuted, textAlign: 'right', marginTop: space.xs },
  sheetInput: {
    marginTop: space.md,
    minHeight: 120,
    backgroundColor: colors.background,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    padding: space.md,
    color: colors.text,
    textAlign: 'right',
  },
  counter: { color: colors.textMuted, textAlign: 'right', marginTop: space.xs, fontSize: 12 },
  sheetActions: { flexDirection: 'row-reverse', gap: space.md, marginTop: space.lg },
  sheetCancel: {
    flex: 1,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    paddingVertical: space.md,
    alignItems: 'center',
  },
  sheetCancelText: { color: colors.link, fontWeight: '900' },
  sheetOk: { flex: 1, backgroundColor: colors.primary, borderRadius: radius.md, paddingVertical: space.md, alignItems: 'center' },
  sheetOkText: { color: colors.onPrimary, fontWeight: '900' },
  blockModalRoot: { flex: 1 },
  alertDim: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.55)' },
  blockModalCenter: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    paddingHorizontal: space.lg,
  },
  alertBox: {
    backgroundColor: colors.surfaceMid,
    borderRadius: radius.md,
    padding: space.lg,
    borderWidth: 1,
    borderColor: colors.borderMuted,
  },
  alertTitle: { color: colors.text, fontWeight: '900', fontSize: 18, textAlign: 'right' },
  alertBody: { color: colors.textSecondary, marginTop: space.md, textAlign: 'right', lineHeight: 22 },
  alertBtns: { flexDirection: 'row-reverse', justifyContent: 'flex-end', gap: space.lg, marginTop: space.lg },
  alertLink: { color: '#2dd4bf', fontWeight: '800', fontSize: 16 },
});
}
