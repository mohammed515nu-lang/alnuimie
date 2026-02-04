import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
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

const RequestsAndQuotesScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('requests');
  const [searchQuery, setSearchQuery] = useState('');

  const requests = [
    {
      id: '1',
      title: 'بناء فيلا سكنية',
      description: 'بناء فيلا دورين مع ملحقات على قطعة أرض 500م',
      budget: 'ريال 300,000 - 500,000',
      location: 'الرياض، حي النخيل',
      deadline: '2024-06-01',
      status: 'مفتوح',
      quotes: 3,
      postedDate: '2024-01-15',
    },
    {
      id: '2',
      title: 'تجديد شقة',
      description: 'تجديد شقة 3 غرف وصالة مع تغيير كامل للديكور',
      budget: 'ريال 80,000 - 120,000',
      location: 'جدة، حي الروضة',
      deadline: '2024-03-15',
      status: 'قيد التنفيذ',
      quotes: 5,
      postedDate: '2024-01-10',
    },
    {
      id: '3',
      title: 'بناء استراحة',
      description: 'بناء استراحة خارجية مع مسابح ومنطقة للباربيكيو',
      budget: 'ريال 150,000 - 250,000',
      location: 'الخبر، حي الشاطئ',
      deadline: '2024-04-01',
      status: 'مغلق',
      quotes: 8,
      postedDate: '2024-01-05',
    },
  ];

  const quotes = [
    {
      id: '1',
      requestId: '1',
      requestTitle: 'بناء فيلا سكنية',
      contractor: 'شركة المجموعة العربية للبناء',
      price: 'ريال 450,000',
      duration: '8 أشهر',
      status: 'مقبول',
      submittedDate: '2024-01-18',
      rating: 4.8,
    },
    {
      id: '2',
      requestId: '1',
      requestTitle: 'بناء فيلا سكنية',
      contractor: 'مقاولات النهضة',
      price: 'ريال 420,000',
      duration: '7 أشهر',
      status: 'معلق',
      submittedDate: '2024-01-17',
      rating: 4.5,
    },
    {
      id: '3',
      requestId: '2',
      requestTitle: 'تجديد شقة',
      contractor: 'الديكور الحديث',
      price: 'ريال 95,000',
      duration: '45 يوماً',
      status: 'مرفوض',
      submittedDate: '2024-01-12',
      rating: 4.2,
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'مفتوح':
        return BRAND_COLORS.success;
      case 'قيد التنفيذ':
        return BRAND_COLORS.warning;
      case 'مغلق':
      case 'مرفوض':
        return BRAND_COLORS.error;
      case 'مقبول':
        return BRAND_COLORS.success;
      case 'معلق':
        return BRAND_COLORS.warning;
      default:
        return BRAND_COLORS.muted;
    }
  };

  const filteredRequests = requests.filter(request =>
    request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredQuotes = quotes.filter(quote =>
    quote.requestTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    quote.contractor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'requests' && styles.activeTab]}
          onPress={() => setActiveTab('requests')}
        >
          <Text style={[styles.tabText, activeTab === 'requests' && styles.activeTabText]}>
            طلباتي
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'quotes' && styles.activeTab]}
          onPress={() => setActiveTab('quotes')}
        >
          <Text style={[styles.tabText, activeTab === 'quotes' && styles.activeTabText]}>
            العروض
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={BRAND_COLORS.muted} />
        <TextInput
          style={styles.searchInput}
          placeholder="البحث..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={BRAND_COLORS.muted}
        />
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'requests' && (
          <View>
            <TouchableOpacity style={styles.addButton}>
              <Ionicons name="add-circle" size={20} color="#fff" />
              <Text style={styles.addButtonText}>إنشاء طلب جديد</Text>
            </TouchableOpacity>

            {filteredRequests.map((request) => (
              <TouchableOpacity key={request.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.headerLeft}>
                    <Text style={styles.cardTitle}>{request.title}</Text>
                    <Text style={styles.cardLocation}>
                      <Ionicons name="location" size={14} color={BRAND_COLORS.muted} />
                      {' '}{request.location}
                    </Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(request.status) }]}>
                    <Text style={styles.statusText}>{request.status}</Text>
                  </View>
                </View>

                <Text style={styles.cardDescription}>{request.description}</Text>

                <View style={styles.cardContent}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>الميزانية:</Text>
                    <Text style={styles.infoValue}>{request.budget}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>الموعد النهائي:</Text>
                    <Text style={styles.infoValue}>{request.deadline}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>العروض المستلمة:</Text>
                    <Text style={styles.infoValue}>{request.quotes} عروض</Text>
                  </View>
                </View>

                <View style={styles.cardFooter}>
                  <Text style={styles.postedDate}>تم النشر: {request.postedDate}</Text>
                  <Ionicons name="chevron-forward" size={20} color={BRAND_COLORS.muted} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {activeTab === 'quotes' && (
          <View>
            {filteredQuotes.map((quote) => (
              <TouchableOpacity key={quote.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.headerLeft}>
                    <Text style={styles.cardTitle}>{quote.contractor}</Text>
                    <View style={styles.ratingContainer}>
                      <Ionicons name="star" size={14} color={BRAND_COLORS.warning} />
                      <Text style={styles.ratingText}>{quote.rating}</Text>
                    </View>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(quote.status) }]}>
                    <Text style={styles.statusText}>{quote.status}</Text>
                  </View>
                </View>

                <Text style={styles.requestTitle}>{quote.requestTitle}</Text>

                <View style={styles.cardContent}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>السعر:</Text>
                    <Text style={styles.priceValue}>{quote.price}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>المدة:</Text>
                    <Text style={styles.infoValue}>{quote.duration}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>تاريخ التقديم:</Text>
                    <Text style={styles.infoValue}>{quote.submittedDate}</Text>
                  </View>
                </View>

                <View style={styles.cardFooter}>
                  <TouchableOpacity style={styles.viewQuoteButton}>
                    <Text style={styles.viewQuoteText}>عرض التفاصيل</Text>
                  </TouchableOpacity>
                  <Ionicons name="chevron-forward" size={20} color={BRAND_COLORS.muted} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: BRAND_COLORS.card,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BRAND_COLORS.card,
    marginHorizontal: 20,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: BRAND_COLORS.text,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BRAND_COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 20,
    justifyContent: 'center',
    gap: 8,
  },
  addButtonText: {
    color: BRAND_COLORS.card,
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: BRAND_COLORS.text,
    marginBottom: 4,
  },
  cardLocation: {
    fontSize: 12,
    color: BRAND_COLORS.muted,
    marginTop: 2,
  },
  requestTitle: {
    fontSize: 14,
    color: BRAND_COLORS.muted,
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    color: BRAND_COLORS.card,
    fontSize: 12,
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: BRAND_COLORS.text,
  },
  cardDescription: {
    fontSize: 14,
    color: BRAND_COLORS.text,
    lineHeight: 20,
    marginBottom: 12,
  },
  cardContent: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: BRAND_COLORS.muted,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: BRAND_COLORS.text,
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '700',
    color: BRAND_COLORS.primary,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: BRAND_COLORS.light,
    marginTop: 12,
  },
  postedDate: {
    fontSize: 12,
    color: BRAND_COLORS.muted,
  },
  viewQuoteButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: BRAND_COLORS.light,
    borderRadius: 6,
  },
  viewQuoteText: {
    fontSize: 12,
    fontWeight: '600',
    color: BRAND_COLORS.primary,
  },
});

export default RequestsAndQuotesScreen;