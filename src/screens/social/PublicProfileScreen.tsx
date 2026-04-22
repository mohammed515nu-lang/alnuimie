import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { socialAPI } from '../../api/services';
import { getApiErrorMessage } from '../../api/http';
import type { RootStackParamList } from '../../navigation/types';
import type { PortfolioItem, PublicProfileAggregate, Rating } from '../../api/types';
import { useStore } from '../../store/useStore';
import { colors, pressableRipple, radius, space, touch } from '../../theme';

type Route = RouteProp<RootStackParamList, 'PublicProfile'>;
type Nav = NativeStackNavigationProp<RootStackParamList>;

export function PublicProfileScreen() {
  const route = useRoute<Route>();
  const navigation = useNavigation<Nav>();
  const userId = route.params.userId;

  const me = useStore((s) => s.user);
  const sendConnectionRequest = useStore((s) => s.sendConnectionRequest);
  const ensureChatThread = useStore((s) => s.ensureChatThread);
  const upsertRating = useStore((s) => s.upsertRating);

  const [profile, setProfile] = useState<PublicProfileAggregate | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [connectOpen, setConnectOpen] = useState(false);
  const [connectMsg, setConnectMsg] = useState('');
  const [stars, setStars] = useState('5');
  const [comment, setComment] = useState('');

  const isSelf = useMemo(() => !!me && me._id === userId, [me, userId]);

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
    } catch (e) {
      Alert.alert('تعذر التحديث', getApiErrorMessage(e));
    } finally {
      setRefreshing(false);
    }
  };

  const onConnect = async () => {
    try {
      await sendConnectionRequest(userId, connectMsg.trim() || undefined);
      setConnectOpen(false);
      setConnectMsg('');
      Alert.alert('تم', 'تم إرسال طلب التواصل');
    } catch (e) {
      Alert.alert('تعذر الإرسال', getApiErrorMessage(e));
    }
  };

  const onMessage = async () => {
    try {
      const thread = await ensureChatThread(userId);
      navigation.navigate('ChatRoom', { conversationId: thread.id, title: thread.otherUserName || 'محادثة' });
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
      Alert.alert('تم', 'تم حفظ التقييم');
    } catch (e) {
      Alert.alert('تعذر التقييم', getApiErrorMessage(e));
    }
  };

  if (loading || !profile) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        {profile.avatarUri ? (
          <Image source={{ uri: profile.avatarUri }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPh]} />
        )}
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.meta}>
            {profile.role === 'contractor' ? 'مقاول' : profile.role === 'client' ? 'عميل' : profile.role}
            {profile.city ? ` • ${profile.city}` : ''}
          </Text>
          <Text style={styles.meta2}>
            ⭐ {profile.ratingAvg.toFixed(2)} ({profile.ratingCount}) • أعمال: {profile.completedProjects} • متابعون:{' '}
            {profile.followers}
          </Text>
        </View>
      </View>

      {profile.specialty ? <Text style={styles.block}>التخصص: {profile.specialty}</Text> : null}
      {typeof profile.yearsExperience === 'number' ? <Text style={styles.block}>الخبرة: {profile.yearsExperience} سنة</Text> : null}
      {profile.bio ? <Text style={styles.block}>{profile.bio}</Text> : null}

      {!isSelf ? (
        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            onPress={() => setConnectOpen((v) => !v)}
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

      {connectOpen ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>رسالة مع الطلب (اختياري)</Text>
          <TextInput
            placeholder="اكتب رسالة قصيرة..."
            placeholderTextColor={colors.placeholder}
            style={styles.input}
            value={connectMsg}
            onChangeText={setConnectMsg}
          />
          <Pressable accessibilityRole="button" onPress={onConnect} {...pressableRipple(colors.primaryTint18)} style={styles.btn}>
            <Text style={styles.btnText}>إرسال</Text>
          </Pressable>
        </View>
      ) : null}

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
          />
          <TextInput
            placeholder="تعليق (اختياري)"
            placeholderTextColor={colors.placeholder}
            style={styles.input}
            value={comment}
            onChangeText={setComment}
          />
          <Pressable accessibilityRole="button" onPress={onRating} {...pressableRipple(colors.primaryTint18)} style={styles.btn}>
            <Text style={styles.btnText}>حفظ التقييم</Text>
          </Pressable>
        </View>
      ) : null}

      <Text style={styles.sectionTitle}>معرض الأعمال</Text>
      {portfolio.length === 0 ? <Text style={styles.empty}>لا عناصر</Text> : null}
      {portfolio.map((it) => (
        <View key={it.id} style={styles.card}>
          <Text style={styles.itemTitle}>{it.title}</Text>
          {it.description ? <Text style={styles.block}>{it.description}</Text> : null}
        </View>
      ))}

      <Text style={styles.sectionTitle}>التقييمات</Text>
      {ratings.length === 0 ? <Text style={styles.empty}>لا تقييمات</Text> : null}
      {ratings.map((r) => (
        <View key={r.id} style={styles.card}>
          <Text style={styles.itemTitle}>
            {r.stars}⭐ — {r.fromUserName}
          </Text>
          {r.comment ? <Text style={styles.block}>{r.comment}</Text> : null}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  content: { padding: space.lg, paddingBottom: space.xxl + 8 },
  center: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },
  header: { flexDirection: 'row', gap: space.md, marginBottom: space.md },
  avatar: { width: 76, height: 76, borderRadius: radius.lg + 2, borderWidth: 1, borderColor: colors.border },
  avatarPh: { backgroundColor: colors.backgroundElevated },
  name: { color: colors.text, fontSize: 20, fontWeight: '900' },
  meta: { color: colors.textMuted, marginTop: space.xs, fontWeight: '700' },
  meta2: { color: colors.textSubtle, marginTop: space.sm - 2, lineHeight: 20 },
  block: { color: colors.textSecondary, marginTop: space.sm },
  actions: { flexDirection: 'row', gap: space.sm + 2, marginTop: space.sm + 2 },
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
  },
  btnSecondaryText: { color: colors.textSecondary, textAlign: 'center', fontWeight: '900' },
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.xl,
    padding: space.md,
    marginTop: space.md,
  },
  cardTitle: { color: colors.text, fontWeight: '900', marginBottom: space.sm },
  input: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: space.md,
    paddingVertical: space.sm + 2,
    color: colors.textSecondary,
    marginBottom: space.sm + 2,
    minHeight: touch.minHeight - 4,
  },
  sectionTitle: { color: colors.text, fontSize: 16, fontWeight: '900', marginTop: space.lg, marginBottom: space.sm },
  itemTitle: { color: colors.text, fontWeight: '900' },
  empty: { color: colors.placeholder },
});
