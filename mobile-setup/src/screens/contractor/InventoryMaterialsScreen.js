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

const InventoryMaterialsScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('materials');
  const [searchQuery, setSearchQuery] = useState('');

  const materials = [
    {
      id: '1',
      name: 'اسمنت',
      category: 'مواد بناء',
      quantity: 50,
      unit: 'طن',
      price: 'ريال 250/طن',
      location: 'المخزن الرئيسي',
      status: 'متوفر',
    },
    {
      id: '2',
      name: 'حديد تسليح',
      category: 'مواد بناء',
      quantity: 20,
      unit: 'طن',
      price: 'ريال 3000/طن',
      location: 'المخزن الرئيسي',
      status: 'متوفر',
    },
    {
      id: '3',
      name: 'طوب',
      category: 'مواد بناء',
      quantity: 5000,
      unit: 'قطعة',
      price: 'ريال 2.5/قطعة',
      location: 'المخزن الثاني',
      status: 'ناقص',
    },
  ];

  const inventory = [
    {
      id: '1',
      material: 'اسمنت',
      transaction: 'شراء',
      quantity: 10,
      unit: 'طن',
      date: '2024-01-15',
      supplier: 'شركة اسمنت الوطنية',
      cost: 'ريال 2,500',
    },
    {
      id: '2',
      material: 'حديد تسليح',
      transaction: 'استخدام',
      quantity: 5,
      unit: 'طن',
      date: '2024-01-14',
      project: 'مشروع القصر السكني',
      cost: 'ريال 15,000',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'متوفر':
        return BRAND_COLORS.success;
      case 'ناقص':
        return BRAND_COLORS.warning;
      case 'نفذ':
        return BRAND_COLORS.error;
      default:
        return BRAND_COLORS.muted;
    }
  };

  const getTransactionColor = (transaction) => {
    switch (transaction) {
      case 'شراء':
        return BRAND_COLORS.success;
      case 'استخدام':
        return BRAND_COLORS.error;
      default:
        return BRAND_COLORS.muted;
    }
  };

  const filteredMaterials = materials.filter(material =>
    material.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    material.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredInventory = inventory.filter(item =>
    item.material.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'materials' && styles.activeTab]}
          onPress={() => setActiveTab('materials')}
        >
          <Text style={[styles.tabText, activeTab === 'materials' && styles.activeTabText]}>
            المواد
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'inventory' && styles.activeTab]}
          onPress={() => setActiveTab('inventory')}
        >
          <Text style={[styles.tabText, activeTab === 'inventory' && styles.activeTabText]}>
            الحركات
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={BRAND_COLORS.muted} />
        <TextInput
          style={styles.searchInput}
          placeholder="البحث عن مادة..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={BRAND_COLORS.muted}
        />
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'materials' && (
          <View>
            <TouchableOpacity style={styles.addButton}>
              <Ionicons name="add-circle" size={20} color="#fff" />
              <Text style={styles.addButtonText}>إضافة مادة جديدة</Text>
            </TouchableOpacity>

            {filteredMaterials.map((material) => (
              <TouchableOpacity key={material.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.cardTitle}>{material.name}</Text>
                    <Text style={styles.cardCategory}>{material.category}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(material.status) }]}>
                    <Text style={styles.statusText}>{material.status}</Text>
                  </View>
                </View>
                <View style={styles.cardContent}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>الكمية:</Text>
                    <Text style={styles.infoValue}>{material.quantity} {material.unit}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>السعر:</Text>
                    <Text style={styles.infoValue}>{material.price}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>الموقع:</Text>
                    <Text style={styles.infoValue}>{material.location}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {activeTab === 'inventory' && (
          <View>
            <TouchableOpacity style={styles.addButton}>
              <Ionicons name="add-circle" size={20} color="#fff" />
              <Text style={styles.addButtonText}>تسجيل حركة جديدة</Text>
            </TouchableOpacity>

            {filteredInventory.map((item) => (
              <TouchableOpacity key={item.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.cardTitle}>{item.material}</Text>
                    <Text style={styles.cardDate}>{item.date}</Text>
                  </View>
                  <View style={[styles.transactionBadge, { backgroundColor: getTransactionColor(item.transaction) }]}>
                    <Text style={styles.statusText}>{item.transaction}</Text>
                  </View>
                </View>
                <View style={styles.cardContent}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>الكمية:</Text>
                    <Text style={styles.infoValue}>{item.quantity} {item.unit}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>التكلفة:</Text>
                    <Text style={styles.infoValue}>{item.cost}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>{item.supplier ? 'المورد:' : 'المشروع:'}</Text>
                    <Text style={styles.infoValue}>{item.supplier || item.project}</Text>
                  </View>
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
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: BRAND_COLORS.text,
    marginBottom: 4,
  },
  cardCategory: {
    fontSize: 14,
    color: BRAND_COLORS.muted,
  },
  cardDate: {
    fontSize: 12,
    color: BRAND_COLORS.muted,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  transactionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    color: BRAND_COLORS.card,
    fontSize: 12,
    fontWeight: '600',
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
});

export default InventoryMaterialsScreen;