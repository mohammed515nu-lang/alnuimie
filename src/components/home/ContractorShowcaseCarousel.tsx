import { useCallback, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { socialAPI } from '../../api/services';
import { getApiErrorMessage } from '../../api/http';
import { pushStackRoute } from '../../navigation/href';
import { cityMatchesGovernorate, SYRIAN_GOVERNORATES } from '../../constants/syrianGovernorates';
import { pressableRipple, touch, useAppTheme } from '../../theme';
import { DASHBOARD_RADIUS, getDashboardPalette, type DashboardPalette } from '../../theme/dashboardLight';

const MAX_CONTRACTORS = 28;
const BATCH = 6;

export type ShowcaseContractor = {
  userId: string;
  name: string;
  city?: string;
  specialty?: string;
  ratingAvg: number;
  ratingCount: number;
  images: string[];
};

/** صور أعمال المعرض فقط — بدون صورة الملف الشخصي؛ صاحب المشروع يرى من لديه أعمال مصوّرة. */
function projectImageUrlsFromPortfolio(portfolio: Awaited<ReturnType<typeof socialAPI.listPublicPortfolio>>): string[] {
  return portfolio
    .flatMap((p) => [...(p.imageUris ?? []), ...(p.imageUri ? [p.imageUri] : [])])
    .filter((u): u is string => typeof u === 'string' && u.trim().length > 0);
}

export function ContractorShowcaseCarousel() {
  const { width: winW } = Dimensions.get('window');
  const slideW = winW;
  const innerPad = 16;
  const imageStripW = slideW - innerPad * 2;

  const { resolved } = useAppTheme();
  const dash = useMemo(() => getDashboardPalette(resolved), [resolved]);
  const styles = useMemo(() => createShowcaseStyles(dash), [dash]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rawList, setRawList] = useState<ShowcaseContractor[]>([]);
  const [governorate, setGovernorate] = useState<string | null>(null);
  const [govModal, setGovModal] = useState(false);
  const [contractorIndex, setContractorIndex] = useState(0);
  const [imageIndexByContractor, setImageIndexByContractor] = useState<Record<string, number>>({});

  const contractorListRef = useRef<FlatList<ShowcaseContractor>>(null);

  const filtered = useMemo(() => {
    if (!governorate) return rawList;
    return rawList.filter((c) => cityMatchesGovernorate(c.city, governorate));
  }, [rawList, governorate]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const base = await socialAPI.searchUsers('', 'contractor');
      const contractors = base.filter((u) => u.role === 'contractor').slice(0, MAX_CONTRACTORS);
      const out: ShowcaseContractor[] = [];

      for (let i = 0; i < contractors.length; i += BATCH) {
        const chunk = contractors.slice(i, i + BATCH);
        const part = await Promise.all(
          chunk.map(async (u) => {
            const id = String(u._id ?? '').trim();
            if (!id) return null;
            try {
              const [profile, portfolio] = await Promise.all([
                socialAPI.getPublicProfile(id),
                socialAPI.listPublicPortfolio(id),
              ]);
              const images = projectImageUrlsFromPortfolio(portfolio);
              if (images.length === 0) return null;
              return {
                userId: id,
                name: profile.name ?? u.name,
                city: profile.city ?? u.city,
                specialty: profile.specialty ?? u.specialty,
                ratingAvg: typeof profile.ratingAvg === 'number' ? profile.ratingAvg : 0,
                ratingCount: typeof profile.ratingCount === 'number' ? profile.ratingCount : 0,
                images,
              } satisfies ShowcaseContractor;
            } catch {
              return null;
            }
          })
        );
        for (const p of part) {
          if (p) out.push(p);
        }
      }

      out.sort((a, b) => {
        if (b.ratingAvg !== a.ratingAvg) return b.ratingAvg - a.ratingAvg;
        return b.ratingCount - a.ratingCount;
      });

      setRawList(out);
      setContractorIndex(0);
      setImageIndexByContractor({});
      contractorListRef.current?.scrollToOffset({ offset: 0, animated: false });
    } catch (e) {
      setError(getApiErrorMessage(e));
      setRawList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  const onContractorScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const idx = Math.round(x / slideW);
    setContractorIndex(Math.max(0, Math.min(idx, Math.max(0, filtered.length - 1))));
  }, [slideW, filtered.length]);

  const setImgIdx = (userId: string, idx: number) => {
    setImageIndexByContractor((prev) => ({ ...prev, [userId]: idx }));
  };

  const govLabel = governorate ? `المحافظة: ${governorate}` : 'كل المحافظات';

  const renderSlide = useCallback(
    ({ item }: { item: ShowcaseContractor }) => {
      const imgs = item.images;
      const imgIdx = imageIndexByContractor[item.userId] ?? 0;

      return (
        <View style={[styles.slide, { width: slideW }]}>
          <View style={[styles.slideInner, { marginHorizontal: innerPad }]}>
            <View style={styles.slideHeader}>
              <View style={{ flex: 1, alignItems: 'flex-end' }}>
                <Text style={styles.contractorName} numberOfLines={1}>
                  {item.name}
                </Text>
                <View style={styles.metaRow}>
                  <Ionicons name="star" size={14} color={dash.gold} style={{ marginLeft: 4 }} />
                  <Text style={styles.ratingText}>
                    {item.ratingCount > 0
                      ? `${item.ratingAvg.toLocaleString('ar-SY', { maximumFractionDigits: 1 })} (${item.ratingCount})`
                      : 'لا تقييم بعد'}
                  </Text>
                  {item.city ? (
                    <>
                      <Text style={styles.dot}> · </Text>
                      <Ionicons name="location-outline" size={14} color={dash.muted} />
                      <Text style={styles.cityText} numberOfLines={1}>
                        {item.city}
                      </Text>
                    </>
                  ) : null}
                </View>
                {item.specialty ? (
                  <Text style={styles.specialty} numberOfLines={1}>
                    {item.specialty}
                  </Text>
                ) : null}
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="عرض الملف"
                onPress={() => pushStackRoute('PublicProfile', { userId: item.userId })}
                {...pressableRipple(dash.goldTint)}
                style={styles.profileBtn}
              >
                <Text style={styles.profileBtnText}>الملف</Text>
                <Ionicons name="person-outline" size={16} color={dash.onGold} />
              </Pressable>
            </View>

            <View style={[styles.imageFrame, { width: imageStripW }]}>
              {imgs.length === 0 ? (
                <View style={styles.placeholder}>
                  <Ionicons name="images-outline" size={48} color={dash.muted} />
                  <Text style={styles.placeholderText}>لا صور في المعرض بعد</Text>
                </View>
              ) : (
                <ScrollView
                  horizontal
                  pagingEnabled
                  nestedScrollEnabled
                  showsHorizontalScrollIndicator={false}
                  onScroll={(e) => {
                    const x = e.nativeEvent.contentOffset.x;
                    const i = Math.round(x / imageStripW);
                    setImgIdx(item.userId, Math.max(0, Math.min(i, imgs.length - 1)));
                  }}
                  scrollEventThrottle={16}
                >
                  {imgs.map((uri, i) => (
                    <Pressable
                      key={`${item.userId}-${i}`}
                      onPress={() => pushStackRoute('PublicProfile', { userId: item.userId })}
                      style={{ width: imageStripW, height: IMG_H }}
                    >
                      <Image source={{ uri }} style={styles.projectImage} resizeMode="cover" />
                    </Pressable>
                  ))}
                </ScrollView>
              )}
              {imgs.length > 1 ? (
                <View style={styles.imageDots}>
                  {imgs.map((_, i) => (
                    <View key={i} style={[styles.dotBubble, i === imgIdx && styles.dotBubbleOn]} />
                  ))}
                </View>
              ) : null}
            </View>
          </View>
        </View>
      );
    },
    [slideW, imageStripW, innerPad, imageIndexByContractor, styles, dash]
  );

  return (
    <View style={styles.wrap}>
      <View style={styles.sectionHead}>
        <Text style={styles.sectionTitle}>أعمال المقاولين</Text>
        <Text style={styles.sectionSub}>
          من لديهم صور أعمال في المعرض فقط — مرتبون حسب التقييم — مرّر يميناً ويساراً
        </Text>
      </View>

      <Pressable
        style={styles.govSearchBtn}
        onPress={() => setGovModal(true)}
        accessibilityRole="button"
        accessibilityLabel="تصفية حسب المحافظة"
        {...pressableRipple(dash.navyTint)}
      >
        <Ionicons name="location-outline" size={20} color={dash.navy} />
        <Text style={styles.govSearchBtnText}>بحث في المحافظات السورية</Text>
        <View style={styles.govChip}>
          <Text style={styles.govChipText} numberOfLines={1}>
            {govLabel}
          </Text>
        </View>
        <Ionicons name="chevron-back" size={18} color={dash.muted} />
      </Pressable>

      {loading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator color={dash.gold} size="large" />
          <Text style={styles.hint}>جاري تحميل المشاريع...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerBox}>
          <Text style={styles.err}>{error}</Text>
          <Pressable onPress={() => void load()} {...pressableRipple(dash.goldTint)} style={styles.retry}>
            <Text style={styles.retryText}>إعادة المحاولة</Text>
          </Pressable>
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.centerBox}>
          <Ionicons name="folder-open-outline" size={40} color={dash.muted} />
          <Text style={styles.hint}>
            {rawList.length === 0
              ? 'لا يوجد مقاولون بأعمال معروضة حالياً.'
              : 'لا مقاولون في هذه المحافظة ضمن النتائج. غيّر المحافظة أو تصفّح الكل.'}
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            key={governorate ?? 'all'}
            ref={contractorListRef}
            data={filtered}
            keyExtractor={(x) => x.userId}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            snapToInterval={slideW}
            snapToAlignment="start"
            disableIntervalMomentum
            onMomentumScrollEnd={onContractorScroll}
            getItemLayout={(_, index) => ({ length: slideW, offset: slideW * index, index })}
            renderItem={renderSlide}
          />
          <View style={styles.contractorDots}>
            {filtered.map((c, i) => (
              <Pressable
                key={c.userId}
                hitSlop={6}
                onPress={() => {
                  contractorListRef.current?.scrollToOffset({ offset: i * slideW, animated: true });
                  setContractorIndex(i);
                }}
              >
                <View style={[styles.contractorDot, i === contractorIndex && styles.contractorDotOn]} />
              </Pressable>
            ))}
          </View>
        </>
      )}

      <Modal visible={govModal} animationType="slide" transparent onRequestClose={() => setGovModal(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setGovModal(false)}>
          <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>اختر المحافظة</Text>
            <ScrollView style={styles.modalList} keyboardShouldPersistTaps="handled">
              <Pressable
                style={[styles.modalRow, !governorate && styles.modalRowOn]}
                onPress={() => {
                  setGovernorate(null);
                  setGovModal(false);
                  setContractorIndex(0);
                  requestAnimationFrame(() =>
                    contractorListRef.current?.scrollToOffset({ offset: 0, animated: false })
                  );
                }}
                {...pressableRipple(dash.navyTint)}
              >
                <Text style={[styles.modalRowText, !governorate && styles.modalRowTextOn]}>كل المحافظات</Text>
                {!governorate ? <Ionicons name="checkmark-circle" size={22} color={dash.gold} /> : null}
              </Pressable>
              {SYRIAN_GOVERNORATES.map((g) => (
                <Pressable
                  key={g}
                  style={[styles.modalRow, governorate === g && styles.modalRowOn]}
                  onPress={() => {
                    setGovernorate(g);
                    setGovModal(false);
                    setContractorIndex(0);
                    requestAnimationFrame(() =>
                      contractorListRef.current?.scrollToOffset({ offset: 0, animated: false })
                    );
                  }}
                  {...pressableRipple(dash.navyTint)}
                >
                  <Text style={[styles.modalRowText, governorate === g && styles.modalRowTextOn]}>{g}</Text>
                  {governorate === g ? <Ionicons name="checkmark-circle" size={22} color={dash.gold} /> : null}
                </Pressable>
              ))}
            </ScrollView>
            <Pressable style={styles.modalClose} onPress={() => setGovModal(false)} {...pressableRipple(dash.navyTint)}>
              <Text style={styles.modalCloseText}>إغلاق</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const IMG_H = 220;

function createShowcaseStyles(dash: DashboardPalette) {
  return StyleSheet.create({
  wrap: { marginBottom: 8 },
  sectionHead: { marginBottom: 10, paddingHorizontal: 4 },
  sectionTitle: { color: dash.navy, fontSize: 17, fontWeight: '900', textAlign: 'right' },
  sectionSub: { color: dash.muted, fontSize: 12, textAlign: 'right', marginTop: 4, lineHeight: 18 },
  govSearchBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
    backgroundColor: dash.white,
    borderRadius: DASHBOARD_RADIUS,
    borderWidth: 1,
    borderColor: dash.border,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 12,
    minHeight: touch.minHeight,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  govSearchBtnText: { flex: 1, color: dash.navy, fontWeight: '900', fontSize: 15, textAlign: 'right' },
  govChip: {
    maxWidth: 120,
    backgroundColor: dash.inputBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: dash.border,
  },
  govChipText: { color: dash.muted, fontSize: 11, fontWeight: '700', textAlign: 'center' },
  slide: { paddingBottom: 8 },
  slideInner: {
    backgroundColor: dash.white,
    borderRadius: DASHBOARD_RADIUS,
    borderWidth: 1,
    borderColor: dash.border,
    paddingBottom: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  slideHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 10,
  },
  contractorName: { color: dash.darkText, fontSize: 17, fontWeight: '900', textAlign: 'right' },
  metaRow: { flexDirection: 'row-reverse', alignItems: 'center', marginTop: 4, flexWrap: 'wrap', justifyContent: 'flex-end' },
  ratingText: { color: dash.muted, fontSize: 12, fontWeight: '700' },
  cityText: { color: dash.muted, fontSize: 12, maxWidth: 120 },
  dot: { color: dash.border },
  specialty: { color: dash.muted, fontSize: 12, marginTop: 4, textAlign: 'right' },
  profileBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    backgroundColor: dash.gold,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: dash.gold,
  },
  profileBtnText: { color: dash.onGold, fontWeight: '900', fontSize: 13 },
  imageFrame: {
    height: IMG_H,
    alignSelf: 'center',
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: dash.inputBg,
  },
  projectImage: { width: '100%', height: '100%' },
  placeholder: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  placeholderText: { color: dash.muted, marginTop: 8, textAlign: 'center', fontSize: 13 },
  imageDots: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dotBubble: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.45)' },
  dotBubbleOn: { backgroundColor: dash.gold, width: 16 },
  contractorDots: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 10 },
  contractorDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: dash.border },
  contractorDotOn: { backgroundColor: dash.navy, width: 22, borderRadius: 6 },
  centerBox: { minHeight: 200, alignItems: 'center', justifyContent: 'center', padding: 20 },
  hint: { color: dash.muted, textAlign: 'center', marginTop: 12, fontSize: 13, lineHeight: 20 },
  err: { color: dash.danger, textAlign: 'center', fontWeight: '700' },
  retry: { marginTop: 12, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: dash.gold },
  retryText: { color: dash.navy, fontWeight: '900' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(26, 43, 68, 0.35)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: dash.pageBg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 28,
    maxHeight: '72%',
    borderWidth: 1,
    borderColor: dash.border,
  },
  modalTitle: { color: dash.navy, fontWeight: '900', fontSize: 17, textAlign: 'right', marginBottom: 12 },
  modalList: { maxHeight: 420 },
  modalRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: DASHBOARD_RADIUS,
    marginBottom: 6,
    backgroundColor: dash.white,
    borderWidth: 1,
    borderColor: dash.border,
  },
  modalRowOn: { borderColor: dash.gold, backgroundColor: dash.goldTint },
  modalRowText: { color: dash.darkText, fontWeight: '800', fontSize: 15, textAlign: 'right', flex: 1 },
  modalRowTextOn: { color: dash.navy },
  modalClose: {
    marginTop: 12,
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: dash.white,
    borderRadius: DASHBOARD_RADIUS,
    borderWidth: 1,
    borderColor: dash.border,
  },
  modalCloseText: { color: dash.navy, fontWeight: '900' },
  });
}
