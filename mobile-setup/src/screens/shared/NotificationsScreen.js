import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BRAND_COLORS = {
  primary: '#3A424F',
  accent: '#4A5568',
  secondary: '#5A6578',
  dark: '#2D3748',
  light: '#EDF2F7',
  background: '#F7FAFC',
  card: '#ffffff',
  text: '#2D3748',
  muted: '#718096',
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
};

const NotificationsScreen = ({ navigation, userRole }) => {
  const [activeTab, setActiveTab] = useState('all');

  const clientNotifications = [
    {
      id: '1',
      title: 'عرض جديد لمشروعك',
      message: 'قدم شركة المجموعة العربية عرضاً لمشروع بناء فيلا بمبلغ 450,000 ريال',
      type: 'quote',
      timestamp: 'قبل ساعتين',
      read: false,
    },
    {
      id: '2',
      title: 'تحديث حالة المشروع',
      message: 'بدأ العمل في مشروع تجديد شقة - تم إنجاز 25% من الأعمال',
      type: 'project_update',
      timestamp: 'قبل 5 ساعات',
      read: false,
    },
    {
      id: '3',
      title: 'رسالة من المقاول',
      message: 'تم إرسال تقرير أسبوعي عن سير العمل في مشروع القصر السكني',
      type: 'message',
      timestamp: 'قبل يوم',
      read: true,
    },
    {
      id: '4',
      title: 'موعد زيارة الموقع',
      message: 'موعد زيارة الموقع غداً الساعة 10 صباحاً للمعاينة والتقييم',
      type: 'appointment',
      timestamp: 'قبل يومين',
      read: true,
    },
  ];

  const contractorNotifications = [
    {
      id: '1',
      title: 'طلب مشروع جديد',
      message: 'طلب جديد لبناء فيلا في حي النخيل بميزانية 300,000-500,000 ريال',
      type: 'project_request',
      timestamp: 'قبل ساعة',
      read: false,
    },
    {
      id: '2',
      title: 'قبول العرض',
      message: 'تم قبول عرضك لمشروع تجديد شقة - سيتم البدء في العمل قريباً',
      type: 'quote_accepted',
      timestamp: 'قبل 3 ساعات',
      read: false,
    },
    {
      id: '3',
      title: 'دفع مستلم',
      message: 'تم استلام دفعة مقدمة لمشروع القصر السكني بقيمة 50,000 ريال',
      type: 'payment',
      timestamp: 'قبل يوم',
      read: true,
    },
    {
      id: '4',
      title: 'رسالة من العميل',
      message: 'العميل يطلب تحديثاً عن سير العمل في مشروع الاستراحة',
      type: 'message',
      timestamp: 'قبل يومين',
      read: true,
    },
  ];

  const notifications = userRole === 'client' ? clientNotifications : contractorNotifications;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'quote':
        return 'document-text';
      case 'project_update':
        return 'construct';
      case 'project_request':
        return 'business';
      case 'quote_accepted':
        return 'checkmark-circle';
      case 'payment':
        return 'cash';
      case 'appointment':
        return 'calendar';
      default:
        return 'mail';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'quote':
      case 'project_request':
        return BRAND_COLORS.primary;
      case 'project_update':
        return BRAND_COLORS.warning;
      case 'quote_accepted':
      case 'payment':
        return BRAND_COLORS.success;
      case 'appointment':
        return BRAND_COLORS.accent;
      default:
        return BRAND_COLORS.muted;
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !notification.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>الإشعارات</Text>
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity style={styles.clearButton}>
          <Text style={styles.clearButtonText}>مسح الكل</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
            الكل ({notifications.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'unread' && styles.activeTab]}
          onPress={() => setActiveTab('unread')}
        >
          <Text style={[styles.tabText, activeTab === 'unread' && styles.activeTabText]}>
            غير مقروء ({unreadCount})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {filteredNotifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off" size={60} color={BRAND_COLORS.muted} />
            <Text style={styles.emptyStateText}>لا توجد إشعارات</Text>
            <Text style={styles.emptyStateSubtext}>
              {activeTab === 'unread' ? 'جميع الإشعارات مقروءة' : 'ستظهر الإشعارات هنا'}
            </Text>
          </View>
        ) : (
          filteredNotifications.map((notification) => (
            <TouchableOpacity key={notification.id} style={styles.notificationCard}>
              <View style={styles.notificationHeader}>
                <View style={[styles.iconContainer, { backgroundColor: getNotificationColor(notification.type) }]}>
                  <Ionicons 
                    name={getNotificationIcon(notification.type)} 
                    size={20} 
                    color={BRAND_COLORS.card} 
                  />
                </View>
                <View style={styles.notificationContent}>
                  <Text style={styles.notificationTitle}>{notification.title}</Text>
                  <Text style={styles.notificationMessage}>{notification.message}</Text>
                  <Text style={styles.notificationTime}>{notification.timestamp}</Text>
                </View>
                {!notification.read && <View style={styles.unreadDot} />}
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BRAND_COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: BRAND_COLORS.card,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: BRAND_COLORS.text,
  },
  badge: {
    backgroundColor: BRAND_COLORS.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: BRAND_COLORS.card,
    fontSize: 12,
    fontWeight: '600',
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  clearButtonText: {
    color: BRAND_COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: BRAND_COLORS.card,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: BRAND_COLORS.light,
    marginRight: 8,
  },
  activeTab: {
    backgroundColor: BRAND_COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: BRAND_COLORS.muted,
  },
  activeTabText: {
    color: BRAND_COLORS.card,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: BRAND_COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: BRAND_COLORS.muted,
    textAlign: 'center',
  },
  notificationCard: {
    backgroundColor: BRAND_COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: BRAND_COLORS.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: BRAND_COLORS.text,
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: BRAND_COLORS.text,
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 12,
    color: BRAND_COLORS.muted,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: BRAND_COLORS.error,
    marginTop: 6,
  },
});

export default NotificationsScreen;