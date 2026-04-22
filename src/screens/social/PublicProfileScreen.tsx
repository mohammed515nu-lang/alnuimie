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
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ScrollView
      style={{ backgroundColor: '#0B1220' }}
      contentContainerStyle={{ padding: 16, paddingBottom: 30 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        {profile.avatarUri ? <Image source={{ uri: profile.avatarUri }} style={styles.avatar} /> : <View style={[styles.avatar, styles.avatarPh]} />}
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.meta}>
            {profile.role === 'contractor' ? 'مقاول' : profile.role === 'client' ? 'عميل' : profile.role}
            {profile.city ? ` • ${profile.city}` : ''}
          </Text>
          <Text style={styles.meta2}>
            ⭐ {profile.ratingAvg.toFixed(2)} ({profile.ratingCount}) • أعمال: {profile.completedProjects} • متابعون: {profile.followers}
          </Text>
        </View>
      </View>

      {profile.specialty ? <Text style={styles.block}>التخصص: {profile.specialty}</Text> : null}
      {typeof profile.yearsExperience === 'number' ? <Text style={styles.block}>الخبرة: {profile.yearsExperience} سنة</Text> : null}
      {profile.bio ? <Text style={styles.block}>{profile.bio}</Text> : null}

      {!isSelf ? (
        <View style={styles.actions}>
          <Pressable onPress={() => setConnectOpen((v) => !v)} style={styles.btn}>
            <Text style={styles.btnText}>طلب تواصل</Text>
          </Pressable>
          <Pressable onPress={onMessage} style={styles.btnSecondary}>
            <Text style={styles.btnSecondaryText}>مراسلة</Text>
          </Pressable>
        </View>
      ) : null}

      {connectOpen ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>رسالة مع الطلب (اختياري)</Text>
          <TextInput
            placeholder="اكتب رسالة قصيرة..."
            placeholderTextColor="#64748B"
            style={styles.input}
            value={connectMsg}
            onChangeText={setConnectMsg}
          />
          <Pressable onPress={onConnect} style={styles.btn}>
            <Text style={styles.btnText}>إرسال</Text>
          </Pressable>
        </View>
      ) : null}

      {me && me.role === 'client' && profile.role === 'contractor' && !isSelf ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>تقييم المقاول</Text>
          <TextInput placeholder="1-5" placeholderTextColor="#64748B" style={styles.input} value={stars} onChangeText={setStars} keyboardType="number-pad" />
          <TextInput placeholder="تعليق (اختياري)" placeholderTextColor="#64748B" style={styles.input} value={comment} onChangeText={setComment} />
          <Pressable onPress={onRating} style={styles.btn}>
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
  center: { flex: 1, backgroundColor: '#0B1220', alignItems: 'center', justifyContent: 'center' },
  header: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  avatar: { width: 72, height: 72, borderRadius: 16, borderWidth: 1, borderColor: '#1F2937' },
  avatarPh: { backgroundColor: '#111827' },
  name: { color: '#F8FAFC', fontSize: 20, fontWeight: '900' },
  meta: { color: '#94A3B8', marginTop: 4, fontWeight: '700' },
  meta2: { color: '#CBD5E1', marginTop: 6 },
  block: { color: '#E2E8F0', marginTop: 8 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 10 },
  btn: { flex: 1, backgroundColor: '#38BDF8', borderRadius: 12, paddingVertical: 12 },
  btnText: { color: '#0B1220', textAlign: 'center', fontWeight: '900' },
  btnSecondary: { flex: 1, borderRadius: 12, paddingVertical: 12, borderWidth: 1, borderColor: '#334155' },
  btnSecondaryText: { color: '#E2E8F0', textAlign: 'center', fontWeight: '900' },
  card: {
    backgroundColor: 'rgba(15,23,42,0.72)',
    borderColor: '#1F2937',
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    marginTop: 12,
  },
  cardTitle: { color: '#F8FAFC', fontWeight: '900', marginBottom: 8 },
  input: {
    backgroundColor: '#0B1220',
    borderColor: '#1F2937',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#E2E8F0',
    marginBottom: 10,
  },
  sectionTitle: { color: '#F8FAFC', fontSize: 16, fontWeight: '900', marginTop: 16, marginBottom: 8 },
  itemTitle: { color: '#F8FAFC', fontWeight: '900' },
  empty: { color: '#64748B' },
});
