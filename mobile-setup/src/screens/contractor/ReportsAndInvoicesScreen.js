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

const ReportsAndInvoicesScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('reports');

  const reports = [
    {
      id: '1',
      title: 'تقرير مشروع القصر السكني',
      date: '2024-01-15',
      status: 'مكتمل',
      amount: 'ريال 50,000',
    },
    {
      id: '2',
      title: 'تقرير تجديدات الفيلا',
      date: '2024-01-10',
      status: 'قيد التنفيذ',
      amount: 'ريال 25,000',
    },
  ];

  const invoices = [
    {
      id: '1',
      client: 'محمد أحمد',
      project: 'بناء فيلا',
      amount: 'ريال 150,000',
      date: '2024-01-15',
      status: 'مدفوعة',
    },
    {
      id: '2',
      client: 'خالد العمر',
      project: 'تجديد مكتب',
      amount: 'ريال 75,000',
      date: '2024-01-10',
      status: 'معلقة',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'مكتمل':
      case 'مدفوعة':
        return BRAND_COLORS.success;
      case 'قيد التنفيذ':
        return BRAND_COLORS.warning;
      case 'معلقة':
        return BRAND_COLORS.error;
      default:
        return BRAND_COLORS.muted;
    }
  };

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'reports' && styles.activeTab]}
          onPress={() => setActiveTab('reports')}
        >
          <Text style={[styles.tabText, activeTab === 'reports' && styles.activeTabText]}>
            التقارير
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'invoices' && styles.activeTab]}
          onPress={() => setActiveTab('invoices')}
        >
          <Text style={[styles.tabText, activeTab === 'invoices' && styles.activeTabText]}>
            الفواتير
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'reports' && (
          <View>
            <TouchableOpacity style={styles.addButton}>
              <Ionicons name="add-circle" size={20} color="#fff" />
              <Text style={styles.addButtonText}>إنشاء تقرير جديد</Text>
            </TouchableOpacity>

            {reports.map((report) => (
              <TouchableOpacity key={report.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.cardTitle}>{report.title}</Text>
                    <Text style={styles.cardDate}>{report.date}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(report.status) }]}>
                    <Text style={styles.statusText}>{report.status}</Text>
                  </View>
                </View>
                <View style={styles.cardFooter}>
                  <Text style={styles.amount}>{report.amount}</Text>
                  <Ionicons name="chevron-forward" size={20} color={BRAND_COLORS.muted} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {activeTab === 'invoices' && (
          <View>
            <TouchableOpacity style={styles.addButton}>
              <Ionicons name="add-circle" size={20} color="#fff" />
              <Text style={styles.addButtonText}>إنشاء فاتورة جديدة</Text>
            </TouchableOpacity>

            {invoices.map((invoice) => (
              <TouchableOpacity key={invoice.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.cardTitle}>{invoice.client}</Text>
                    <Text style={styles.cardProject}>{invoice.project}</Text>
                    <Text style={styles.cardDate}>{invoice.date}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(invoice.status) }]}>
                    <Text style={styles.statusText}>{invoice.status}</Text>
                  </View>
                </View>
                <View style={styles.cardFooter}>
                  <Text style={styles.amount}>{invoice.amount}</Text>
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
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: BRAND_COLORS.text,
    marginBottom: 4,
  },
  cardProject: {
    fontSize: 14,
    color: BRAND_COLORS.muted,
    marginBottom: 2,
  },
  cardDate: {
    fontSize: 12,
    color: BRAND_COLORS.muted,
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
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: BRAND_COLORS.light,
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
    color: BRAND_COLORS.primary,
  },
});

export default ReportsAndInvoicesScreen;