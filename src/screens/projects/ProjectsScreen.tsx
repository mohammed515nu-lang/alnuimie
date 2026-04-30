import { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { getApiErrorMessage } from '../../api/http';
import type { Project, ProjectStatus } from '../../api/types';
import { ApiStateView } from '../../components/ApiStateView';
import { DASHBOARD_TAB_BAR_SCROLL_BASE } from '../../constants/dashboardTabBar';
import { navigateFromRoot } from '../../navigation/rootNavigation';
import { useStore } from '../../store/useStore';
import { space, touch, useAppTheme } from '../../theme';
import { DASHBOARD_RADIUS, getDashboardPalette, type DashboardPalette } from '../../theme/dashboardLight';

const RADIUS = DASHBOARD_RADIUS;

const metaBase = StyleSheet.create({
  row: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 10,
  },
  textWrap: { flex: 1, alignItems: 'flex-end' },
  label: { fontSize: 11, fontWeight: '600', textAlign: 'right' },
  value: { fontSize: 13, fontWeight: '700', textAlign: 'right', marginTop: 2 },
});

function statusLabelAr(status: ProjectStatus): string {
  switch (status) {
    case 'pending':
      return 'قيد الانتظار';
    case 'in-progress':
      return 'قيد التنفيذ';
    case 'completed':
      return 'مكتمل';
    case 'cancelled':
      return 'ملغي';
    default:
      return status;
  }
}

function statusBadgeStyle(status: ProjectStatus, dash: DashboardPalette) {
  switch (status) {
    case 'pending':
      return { bg: dash.warningBg, color: dash.gold };
    case 'in-progress':
      return { bg: dash.inProgressBadgeBg, color: dash.navy };
    case 'completed':
      return { bg: 'rgba(21, 128, 61, 0.12)', color: dash.success };
    case 'cancelled':
      return { bg: 'rgba(185, 28, 28, 0.1)', color: dash.danger };
    default:
      return { bg: dash.border, color: dash.muted };
  }
}

export function ProjectsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const tabPad = DASHBOARD_TAB_BAR_SCROLL_BASE + insets.bottom + space.lg;

  const role = useStore((s) => s.user?.role);
  const projects = useStore((s) => s.projects);
  const deleteProject = useStore((s) => s.deleteProject);

  const isClient = role === 'client';
  const title = isClient ? 'مشاريعي' : 'مشاريع العمل';

  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);

  const { resolved } = useAppTheme();
  const dash = useMemo(() => getDashboardPalette(resolved), [resolved]);
  const styles = useMemo(() => createStyles(dash), [dash]);

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError(null);
      await useStore.getState().refreshProjects();
    } catch (err) {
      setLoadError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadProjects();
    }, [loadProjects])
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter((p) => {
      const hay = `${p.name} ${p.location ?? ''} ${p.description ?? ''}`.toLowerCase();
      return hay.includes(q);
    });
  }, [projects, query]);

  const hasProjects = projects.length > 0;
  const hasFiltered = filtered.length > 0;
  const listBottomPad = hasProjects ? tabPad + 64 : tabPad;

  const onDelete = (projectId: string) => {
    if (deletingId) return;
    Alert.alert('حذف المشروع', 'هل أنت متأكد من حذف المشروع؟', [
      { text: 'إلغاء', style: 'cancel' },
      {
        text: 'حذف',
        style: 'destructive',
        onPress: () => {
          void (async () => {
            setDeletingId(projectId);
            try {
              await deleteProject(projectId);
              Alert.alert('تم', 'تم حذف المشروع بنجاح.');
            } catch (err) {
              Alert.alert('تعذر الحذف', getApiErrorMessage(err));
            } finally {
              setDeletingId(null);
            }
          })();
        },
      },
    ]);
  };

  const openProjectMenu = (p: Project) => {
    Alert.alert(p.name, undefined, [
      { text: 'تعديل', onPress: () => router.push(`/edit-project/${p.id}` as any) },
      { text: 'حذف', style: 'destructive', onPress: () => onDelete(p.id) },
      { text: 'إلغاء', style: 'cancel' },
    ]);
  };

  const formatDate = (iso?: string) => (iso ? iso.slice(0, 10) : '—');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable
            accessibilityRole="button"
            accessibilityLabel="إنشاء مشروع جديد"
            style={styles.fab}
            onPress={() => navigateFromRoot('NewProject')}
          >
            <Ionicons name="add" size={26} color={dash.onGold} />
          </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {title}
        </Text>
        <Pressable
          style={styles.headerIconBtn}
          accessibilityRole="button"
          accessibilityLabel="تنبيهات"
          onPress={() => navigateFromRoot('NotificationSettings')}
        >
          <Ionicons name="notifications-outline" size={22} color={dash.navy} />
        </Pressable>
      </View>

      <View style={styles.root}>
        <View style={styles.searchRow}>
          <Pressable
            style={[styles.filterBtn, filterOpen && styles.filterBtnActive]}
            onPress={() => setFilterOpen((v) => !v)}
            accessibilityRole="button"
            accessibilityLabel="تصفية"
          >
            <Ionicons name="options-outline" size={22} color={dash.navy} />
          </Pressable>
          <View style={styles.searchField}>
            <Ionicons name="search-outline" size={20} color={dash.muted} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="بحث في المشاريع..."
              placeholderTextColor={dash.muted}
              style={styles.searchInput}
              textAlign="right"
            />
          </View>
        </View>

        {filterOpen ? (
          <Text style={styles.filterHint}>التصفية حسب النص أعلاه — يمكن لاحقاً ربط فلاتر إضافية.</Text>
        ) : null}

        {loading && !hasProjects ? (
          <ApiStateView tone={resolved === 'light' ? 'beige' : 'default'} mode="loading" title="جاري تحميل المشاريع..." />
        ) : loadError && !hasProjects ? (
          <ApiStateView
            tone={resolved === 'light' ? 'beige' : 'default'}
            mode="error"
            title="تعذر تحميل المشاريع"
            subtitle={loadError}
            onRetry={() => void loadProjects()}
          />
        ) : hasProjects && hasFiltered ? (
          <ScrollView
            contentContainerStyle={[styles.listWrap, { paddingBottom: listBottomPad }]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {filtered.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                dash={dash}
                styles={styles}
                onMenu={() => openProjectMenu(project)}
                onDetails={() => router.push(`/edit-project/${project.id}` as any)}
                onEdit={() => router.push(`/edit-project/${project.id}` as any)}
                onDelete={() => onDelete(project.id)}
                formatDate={formatDate}
              />
            ))}
          </ScrollView>
        ) : hasProjects && !hasFiltered ? (
          <View style={styles.emptyInline}>
            <Text style={styles.emptyText}>لا نتائج مطابقة للبحث.</Text>
            <Pressable onPress={() => setQuery('')}>
              <Text style={styles.clearSearch}>مسح البحث</Text>
            </Pressable>
          </View>
        ) : (
          <View style={[styles.emptyWrap, { paddingBottom: tabPad }]}>
            <ApiStateView
              tone={resolved === 'light' ? 'beige' : 'default'}
              mode="empty"
              title={isClient ? 'لا مشاريع مسجلة بعد' : 'لا مشاريع بعد'}
              subtitle={
                isClient
                  ? 'أضف مشروعاً واربطه بمقاول من جهات اتصالك أو عبر معرّف المقاول.'
                  : 'أنشئ مشروعاً لتتبّع الميزانية والمواعيد والمواد.'
              }
            />
            <View style={styles.emptyCtaRow}>
              <Pressable style={styles.ctaPrimary} onPress={() => navigateFromRoot('NewProject')}>
                <Text style={styles.ctaPrimaryText}>إضافة مشروع +</Text>
              </Pressable>
              {isClient ? (
                <Pressable style={styles.ctaOutline} onPress={() => navigateFromRoot('DiscoverUsers')}>
                  <Text style={styles.ctaOutlineText}>استكشاف مقاولين</Text>
                </Pressable>
              ) : null}
            </View>
          </View>
        )}
      </View>

      {hasProjects ? (
        <View style={[styles.footerCta, { paddingBottom: Math.max(insets.bottom, 12) + 8 }]}>
          <Pressable style={styles.ctaPrimaryFull} onPress={() => navigateFromRoot('NewProject')}>
            <Text style={styles.ctaPrimaryText}>{isClient ? 'إضافة مشروع مع مقاول +' : 'إنشاء مشروع جديد +'}</Text>
          </Pressable>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

function ProjectCard({
  project,
  dash,
  styles,
  onMenu,
  onDetails,
  onEdit,
  onDelete,
  formatDate,
}: {
  project: Project;
  dash: DashboardPalette;
  styles: ReturnType<typeof createStyles>;
  onMenu: () => void;
  onDetails: () => void;
  onEdit: () => void;
  onDelete: () => void;
  formatDate: (iso?: string) => string;
}) {
  const badge = statusBadgeStyle(project.status, dash);
  const budgetStr =
    typeof project.budget === 'number' ? `${project.budget.toLocaleString('ar-SY')} ل.س` : '—';

  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <Pressable hitSlop={12} onPress={onMenu} style={styles.menuHit}>
          <Ionicons name="ellipsis-vertical" size={20} color={dash.muted} />
        </Pressable>
        <View style={styles.badgeWrap}>
          <Text style={[styles.badge, { backgroundColor: badge.bg, color: badge.color }]}>
            {statusLabelAr(project.status)}
          </Text>
        </View>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {project.name}
        </Text>
        <Ionicons name="folder-outline" size={22} color={dash.gold} />
      </View>

      <View style={styles.grid}>
        <View style={styles.gridCol}>
          <MetaLine dash={dash} icon="calendar-outline" label="تاريخ البدء" value={formatDate(project.startDate)} />
          <MetaLine dash={dash} icon="calendar-outline" label="تاريخ الانتهاء" value={formatDate(project.expectedEndDate)} />
          <MetaLine dash={dash} icon="time-outline" label="آخر تحديث" value={formatDate(project.createdAt)} />
        </View>
        <View style={styles.gridCol}>
          <MetaLine dash={dash} icon="construct-outline" label="المقاول" value={project.contractorName ?? '—'} />
          <MetaLine dash={dash} icon="location-outline" label="المدينة" value={project.location ?? '—'} />
          <MetaLine
            dash={dash}
            icon="document-text-outline"
            label="الوصف"
            value={project.description?.trim() ? project.description : '—'}
            multiline
          />
          <MetaLine dash={dash} icon="cash-outline" label="الميزانية" value={budgetStr} />
        </View>
      </View>

      <View style={styles.cardActions}>
        <Pressable style={styles.iconDelete} onPress={onDelete} accessibilityLabel="حذف">
          <Ionicons name="trash-outline" size={20} color={dash.danger} />
        </Pressable>
        <Pressable style={styles.btnOutline} onPress={onEdit}>
          <Ionicons name="create-outline" size={18} color={dash.gold} />
          <Text style={styles.btnOutlineText}>تعديل</Text>
        </Pressable>
        <Pressable style={styles.btnPrimary} onPress={onDetails}>
          <Text style={styles.btnPrimaryText}>عرض التفاصيل</Text>
        </Pressable>
      </View>
    </View>
  );
}

function MetaLine({
  icon,
  label,
  value,
  multiline,
  dash,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  multiline?: boolean;
  dash: DashboardPalette;
}) {
  return (
    <View style={metaBase.row}>
      <View style={metaBase.textWrap}>
        <Text style={[metaBase.label, { color: dash.muted }]}>{label}</Text>
        <Text style={[metaBase.value, { color: dash.darkText }]} numberOfLines={multiline ? 3 : 1}>
          {value}
        </Text>
      </View>
      <Ionicons name={icon} size={18} color={dash.gold} />
    </View>
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
      borderRadius: RADIUS,
      backgroundColor: dash.white,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: dash.border,
    },
    fab: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: dash.gold,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.12,
      shadowRadius: 4,
    },
    root: { flex: 1, paddingHorizontal: 16 },
    searchRow: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      gap: 10,
      marginBottom: 12,
    },
    searchField: {
      flex: 1,
      flexDirection: 'row-reverse',
      alignItems: 'center',
      gap: 8,
      backgroundColor: dash.white,
      borderRadius: RADIUS,
      borderWidth: 1,
      borderColor: dash.border,
      paddingHorizontal: 12,
      minHeight: touch.minHeight - 4,
    },
    searchInput: {
      flex: 1,
      fontSize: 15,
      color: dash.darkText,
      paddingVertical: 10,
    },
    filterBtn: {
      width: 48,
      height: 48,
      borderRadius: RADIUS,
      backgroundColor: dash.white,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: dash.border,
    },
    filterBtnActive: {
      borderColor: dash.gold,
      backgroundColor: dash.goldTint,
    },
    filterHint: {
      fontSize: 12,
      color: dash.muted,
      textAlign: 'right',
      marginBottom: 8,
    },
    listWrap: { gap: 14, paddingTop: 4 },
    card: {
      backgroundColor: dash.white,
      borderRadius: RADIUS,
      borderWidth: 1,
      borderColor: dash.border,
      padding: 16,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
    },
    cardTop: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      gap: 8,
      marginBottom: 14,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: dash.border,
      paddingBottom: 12,
    },
    menuHit: { padding: 4 },
    badgeWrap: { flexShrink: 0 },
    badge: {
      fontSize: 11,
      fontWeight: '800',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 10,
      overflow: 'hidden',
    },
    cardTitle: {
      flex: 1,
      fontSize: 17,
      fontWeight: '900',
      color: dash.darkText,
      textAlign: 'right',
    },
    grid: {
      flexDirection: 'row-reverse',
      gap: 12,
    },
    gridCol: {
      flex: 1,
    },
    cardActions: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      gap: 10,
      marginTop: 16,
    },
    btnPrimary: {
      flex: 1,
      backgroundColor: dash.gold,
      borderRadius: 14,
      minHeight: 46,
      justifyContent: 'center',
      alignItems: 'center',
    },
    btnPrimaryText: {
      color: dash.onGold,
      fontWeight: '900',
      fontSize: 14,
    },
    btnOutline: {
      flex: 1,
      flexDirection: 'row-reverse',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      borderRadius: 14,
      borderWidth: 1.5,
      borderColor: dash.gold,
      minHeight: 46,
      backgroundColor: dash.white,
    },
    btnOutlineText: {
      color: dash.gold,
      fontWeight: '800',
      fontSize: 14,
    },
    iconDelete: {
      width: 44,
      height: 46,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: dash.border,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: dash.white,
    },
    emptyWrap: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 24,
    },
    emptyInline: { paddingVertical: 32, alignItems: 'center' },
    emptyText: { color: dash.muted, fontSize: 15, textAlign: 'center' },
    clearSearch: { color: dash.gold, fontWeight: '800', marginTop: 8, fontSize: 15 },
    ctaPrimary: {
      marginTop: 12,
      backgroundColor: dash.gold,
      paddingHorizontal: 24,
      paddingVertical: 14,
      borderRadius: RADIUS,
      width: '90%',
      maxWidth: 400,
      alignItems: 'center',
      alignSelf: 'center',
    },
    emptyCtaRow: {
      marginTop: 8,
      width: '100%',
      alignItems: 'center',
      gap: 10,
      paddingHorizontal: 12,
    },
    ctaOutline: {
      backgroundColor: dash.white,
      paddingHorizontal: 24,
      paddingVertical: 14,
      borderRadius: RADIUS,
      width: '90%',
      maxWidth: 400,
      alignItems: 'center',
      borderWidth: 1.5,
      borderColor: dash.navy,
      alignSelf: 'center',
    },
    ctaOutlineText: { color: dash.navy, fontWeight: '900', fontSize: 15 },
    ctaPrimaryText: { color: dash.onGold, fontWeight: '900', fontSize: 16 },
    footerCta: {
      position: 'absolute',
      left: 16,
      right: 16,
      bottom: 0,
      backgroundColor: 'transparent',
    },
    ctaPrimaryFull: {
      backgroundColor: dash.gold,
      borderRadius: RADIUS,
      minHeight: 52,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.12,
      shadowRadius: 6,
    },
  });
}
