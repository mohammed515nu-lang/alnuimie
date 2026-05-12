import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { TopBar } from '../../components/TopBar';
import { DASHBOARD_TAB_BAR_SCROLL_BASE } from '../../constants/dashboardTabBar';
import {
  adminAPI,
  type AdminDisputeRow,
  type AdminPortfolioRow,
  type AdminRatingRow,
  type AdminReportRow,
} from '../../api/services/admin';
import { getApiErrorMessage } from '../../api/http';
import { useStore } from '../../store/useStore';
import { space, useAppTheme } from '../../theme';
import { DASHBOARD_RADIUS, getDashboardPalette } from '../../theme/dashboardLight';

type Seg = 'ratings' | 'portfolio' | 'reports' | 'disputes';

export function AdminModerationScreen() {
  const user = useStore((s) => s.user);
  const { resolved } = useAppTheme();
  const dash = useMemo(() => getDashboardPalette(resolved), [resolved]);
  const styles = useMemo(() => createStyles(dash), [dash]);
  const insets = useSafeAreaInsets();
  const tabPad = DASHBOARD_TAB_BAR_SCROLL_BASE + insets.bottom + space.lg;

  const [seg, setSeg] = useState<Seg>('ratings');
  const [loading, setLoading] = useState(false);
  const [ratings, setRatings] = useState<AdminRatingRow[]>([]);
  const [portfolio, setPortfolio] = useState<AdminPortfolioRow[]>([]);
  const [reports, setReports] = useState<AdminReportRow[]>([]);
  const [disputes, setDisputes] = useState<AdminDisputeRow[]>([]);

  const [chatModal, setChatModal] = useState(false);
  const [cid, setCid] = useState('');
  const [chatMsgs, setChatMsgs] = useState<{ id: string; senderName: string; text: string; timestamp: string }[]>([]);

  const load = useCallback(async () => {
    if (user?.role !== 'admin') return;
    setLoading(true);
    try {
      if (seg === 'ratings') {
        const d = await adminAPI.listRatings({ limit: 40 });
        setRatings(d.ratings);
      } else if (seg === 'portfolio') {
        const d = await adminAPI.listPortfolio({ limit: 40 });
        setPortfolio(d.items);
      } else if (seg === 'reports') {
        const d = await adminAPI.listReports({ limit: 40 });
        setReports(d.reports);
      } else {
        const d = await adminAPI.listDisputes({ limit: 40 });
        setDisputes(d.disputes);
      }
    } catch (e) {
      Alert.alert('خطأ', getApiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [seg, user?.role]);

  useEffect(() => {
    void load();
  }, [load]);

  if (user?.role !== 'admin') {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <TopBar tone="beige" title="المراقبة" />
        <Text style={styles.denied}>غير مصرّح.</Text>
      </SafeAreaView>
    );
  }

  const segBtn = (s: Seg, label: string) => (
    <Pressable
      key={s}
      onPress={() => setSeg(s)}
      style={[styles.seg, seg === s && styles.segOn]}
    >
      <Text style={[styles.segTxt, seg === s && styles.segTxtOn]}>{label}</Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <TopBar tone="beige" title="المحتوى والبلاغات" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.segRow}>
        {segBtn('ratings', 'تقييمات')}
        {segBtn('portfolio', 'محافظ')}
        {segBtn('reports', 'بلاغات')}
        {segBtn('disputes', 'نزاعات')}
      </ScrollView>

      <Pressable style={styles.chatBtn} onPress={() => setChatModal(true)}>
        <Text style={styles.chatBtnTxt}>عرض رسائل محادثة (معرّف)</Text>
      </Pressable>

      {seg === 'ratings' ? (
        <FlatList
          data={ratings}
          keyExtractor={(r) => r.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: tabPad }}
          onRefresh={() => void load()}
          refreshing={loading}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.stars} ★ — {item.target.name}</Text>
              <Text style={styles.cardBody}>{item.comment || '—'}</Text>
              <Text style={styles.cardMeta}>من: {item.from.name}</Text>
              <Pressable
                style={styles.dangerBtn}
                onPress={() =>
                  Alert.alert('حذف التقييم؟', 'لا يمكن التراجع.', [
                    { text: 'إلغاء', style: 'cancel' },
                    {
                      text: 'حذف',
                      style: 'destructive',
                      onPress: () =>
                        void adminAPI
                          .deleteRating(item.id)
                          .then(() => load())
                          .catch((e) => Alert.alert('خطأ', getApiErrorMessage(e))),
                    },
                  ])
                }
              >
                <Text style={styles.dangerTxt}>حذف</Text>
              </Pressable>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.empty}>لا عناصر.</Text>}
        />
      ) : seg === 'portfolio' ? (
        <FlatList
          data={portfolio}
          keyExtractor={(p) => p.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: tabPad }}
          onRefresh={() => void load()}
          refreshing={loading}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardMeta}>{item.ownerName} · {item.moderationStatus}</Text>
              <View style={styles.rowBtns}>
                <Pressable
                  style={styles.smallBtn}
                  onPress={() =>
                    void adminAPI
                      .patchPortfolio(item.id, { moderationStatus: 'hidden' })
                      .then(() => load())
                      .catch((e) => Alert.alert('خطأ', getApiErrorMessage(e)))
                  }
                >
                  <Text style={styles.smallBtnTxt}>إخفاء</Text>
                </Pressable>
                <Pressable
                  style={styles.smallBtn}
                  onPress={() =>
                    void adminAPI
                      .patchPortfolio(item.id, { moderationStatus: 'approved' })
                      .then(() => load())
                      .catch((e) => Alert.alert('خطأ', getApiErrorMessage(e)))
                  }
                >
                  <Text style={styles.smallBtnTxt}>موافقة</Text>
                </Pressable>
                <Pressable
                  style={styles.smallBtn}
                  onPress={() =>
                    void adminAPI
                      .patchPortfolio(item.id, { moderationStatus: 'pending_review' })
                      .then(() => load())
                      .catch((e) => Alert.alert('خطأ', getApiErrorMessage(e)))
                  }
                >
                  <Text style={styles.smallBtnTxt}>مراجعة</Text>
                </Pressable>
              </View>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.empty}>لا عناصر.</Text>}
        />
      ) : seg === 'reports' ? (
        <FlatList
          data={reports}
          keyExtractor={(r) => r.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: tabPad }}
          onRefresh={() => void load()}
          refreshing={loading}
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() =>
                Alert.alert('تحديث البلاغ', item.reason, [
                  { text: 'إلغاء', style: 'cancel' },
                  {
                    text: 'قيد المراجعة',
                    onPress: () =>
                      void adminAPI
                        .patchReport(item.id, { status: 'reviewing' })
                        .then(() => load())
                        .catch((e) => Alert.alert('خطأ', getApiErrorMessage(e))),
                  },
                  {
                    text: 'تم الحل',
                    onPress: () =>
                      void adminAPI
                        .patchReport(item.id, { status: 'resolved' })
                        .then(() => load())
                        .catch((e) => Alert.alert('خطأ', getApiErrorMessage(e))),
                  },
                  {
                    text: 'رفض',
                    onPress: () =>
                      void adminAPI
                        .patchReport(item.id, { status: 'dismissed' })
                        .then(() => load())
                        .catch((e) => Alert.alert('خطأ', getApiErrorMessage(e))),
                  },
                ])
              }
            >
              <Text style={styles.cardTitle}>{item.reason}</Text>
              <Text style={styles.cardBody}>{item.details || '—'}</Text>
              <Text style={styles.cardMeta}>حالة: {item.status}</Text>
            </Pressable>
          )}
          ListEmptyComponent={<Text style={styles.empty}>لا بلاغات.</Text>}
        />
      ) : (
        <FlatList
          data={disputes}
          keyExtractor={(d) => d.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: tabPad }}
          onRefresh={() => void load()}
          refreshing={loading}
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() =>
                Alert.alert(item.title, item.description || '', [
                  { text: 'إلغاء', style: 'cancel' },
                  {
                    text: 'قيد المراجعة',
                    onPress: () =>
                      void adminAPI
                        .patchDispute(item.id, { status: 'under_review' })
                        .then(() => load())
                        .catch((e) => Alert.alert('خطأ', getApiErrorMessage(e))),
                  },
                  {
                    text: 'تم الحل',
                    onPress: () =>
                      void adminAPI
                        .patchDispute(item.id, { status: 'resolved', resolutionText: 'قرار إداري' })
                        .then(() => load())
                        .catch((e) => Alert.alert('خطأ', getApiErrorMessage(e))),
                  },
                  {
                    text: 'إغلاق',
                    onPress: () =>
                      void adminAPI
                        .patchDispute(item.id, { status: 'closed' })
                        .then(() => load())
                        .catch((e) => Alert.alert('خطأ', getApiErrorMessage(e))),
                  },
                ])
              }
            >
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardMeta}>{item.status}</Text>
            </Pressable>
          )}
          ListEmptyComponent={<Text style={styles.empty}>لا نزاعات مسجّلة.</Text>}
        />
      )}

      <Modal visible={chatModal} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>معرّف المحادثة</Text>
            <TextInput
              style={styles.input}
              value={cid}
              onChangeText={setCid}
              placeholder="Conversation ObjectId"
              textAlign="left"
            />
            <Pressable
              style={styles.primaryBtn}
              onPress={() =>
                void adminAPI
                  .getChatMessages(cid.trim(), 100)
                  .then((d) => setChatMsgs(d.messages))
                  .catch((e) => Alert.alert('خطأ', getApiErrorMessage(e)))
              }
            >
              <Text style={styles.primaryBtnTxt}>تحميل</Text>
            </Pressable>
            <ScrollView style={{ maxHeight: 280 }}>
              {chatMsgs.map((m) => (
                <View key={m.id} style={styles.msgRow}>
                  <Text style={styles.msgWho}>{m.senderName}</Text>
                  <Text style={styles.msgTxt}>{m.text}</Text>
                </View>
              ))}
            </ScrollView>
            <Pressable style={styles.closeBtn} onPress={() => setChatModal(false)}>
              <Text style={styles.closeBtnTxt}>إغلاق</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function createStyles(dash: ReturnType<typeof getDashboardPalette>) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: dash.pageBg },
    denied: { padding: 24, color: dash.muted, textAlign: 'center' },
    segRow: { flexDirection: 'row-reverse', paddingHorizontal: 12, paddingVertical: 8, gap: 8 },
    seg: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: DASHBOARD_RADIUS,
      borderWidth: 1,
      borderColor: dash.border,
      backgroundColor: dash.white,
    },
    segOn: { borderColor: dash.gold, backgroundColor: dash.goldTint },
    segTxt: { fontSize: 13, fontWeight: '700', color: dash.muted },
    segTxtOn: { color: dash.navy },
    chatBtn: { marginHorizontal: 16, marginBottom: 8, padding: 10, backgroundColor: dash.white, borderRadius: DASHBOARD_RADIUS, borderWidth: 1, borderColor: dash.border },
    chatBtnTxt: { textAlign: 'center', fontWeight: '700', color: dash.navy },
    card: {
      padding: 12,
      marginBottom: 10,
      backgroundColor: dash.white,
      borderRadius: DASHBOARD_RADIUS,
      borderWidth: 1,
      borderColor: dash.border,
    },
    cardTitle: { fontSize: 15, fontWeight: '800', color: dash.darkText, textAlign: 'right' },
    cardBody: { fontSize: 13, color: dash.darkText, textAlign: 'right', marginTop: 6, lineHeight: 20 },
    cardMeta: { fontSize: 11, color: dash.muted, textAlign: 'right', marginTop: 6 },
    dangerBtn: { alignSelf: 'flex-end', marginTop: 8, paddingVertical: 6, paddingHorizontal: 12 },
    dangerTxt: { color: '#b91c1c', fontWeight: '800' },
    rowBtns: { flexDirection: 'row-reverse', gap: 8, marginTop: 8, flexWrap: 'wrap' },
    smallBtn: { paddingVertical: 6, paddingHorizontal: 10, backgroundColor: dash.goldTint, borderRadius: 8 },
    smallBtnTxt: { fontSize: 12, fontWeight: '800', color: dash.navy },
    empty: { textAlign: 'center', color: dash.muted, marginTop: 32 },
    modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
    modalCard: { backgroundColor: dash.white, borderRadius: 16, padding: 16 },
    modalTitle: { fontWeight: '900', marginBottom: 8, textAlign: 'right' },
    input: { borderWidth: 1, borderColor: dash.border, borderRadius: 8, padding: 10, marginBottom: 10 },
    primaryBtn: { backgroundColor: dash.gold, padding: 12, borderRadius: 8, marginBottom: 10 },
    primaryBtnTxt: { textAlign: 'center', fontWeight: '900', color: dash.onGold },
    msgRow: { marginBottom: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: dash.border, paddingBottom: 8 },
    msgWho: { fontSize: 11, fontWeight: '800', color: dash.gold },
    msgTxt: { fontSize: 14, textAlign: 'right', marginTop: 4 },
    closeBtn: { marginTop: 12, padding: 12, alignItems: 'center' },
    closeBtnTxt: { fontWeight: '800', color: dash.navy },
  });
}
