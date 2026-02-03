# 📱 خطة تحويل الموقع إلى تطبيق موبايل

## 🎯 الهدف

تحويل كامل بيانات الموقع والواجهات وتسجيل الدخول إلى تطبيق موبايل باستخدام React Native.

---

## ✅ ما تم إنجازه

### 1. البنية الأساسية ✅
- ✅ إنشاء مشروع React Native/Expo
- ✅ إعداد API calls
- ✅ نظام تسجيل الدخول والتسجيل
- ✅ نظام التنقل الأساسي

### 2. Dashboard للعميل ✅
- ✅ `ClientDashboardScreen.js` - لوحة تحكم كاملة
- ✅ عرض الإحصائيات (المشاريع، الميزانية، المدفوع)
- ✅ إجراءات سريعة
- ✅ الطلبات الأخيرة

---

## 📋 ما يجب إنجازه

### 1. صفحات العميل (Client)
- [ ] `ClientProjectsScreen.js` - قائمة المشاريع
- [ ] `ClientAddProjectScreen.js` - إضافة مشروع جديد
- [ ] `ClientProfileScreen.js` - الملف الشخصي
- [ ] `ClientRequestsScreen.js` - الطلبات
- [ ] `ClientReportsScreen.js` - التقارير

### 2. صفحات المقاول (Contractor)
- [ ] `ContractorDashboardScreen.js` - لوحة التحكم
- [ ] `ProjectsListScreen.js` - قائمة المشاريع
- [ ] `AddProjectAndRequestsScreen.js` - إضافة مشروع وطلبات
- [ ] `InventoryMaterialsScreen.js` - المخزون والمواد
- [ ] `PurchasesAndIssueScreen.js` - المشتريات والإصدار
- [ ] `SuppliersAndPaymentsScreen.js` - الموردين والمدفوعات
- [ ] `ReportsAndInvoicesScreen.js` - التقارير والفواتير
- [ ] `ContractorProfileScreen.js` - الملف الشخصي

### 3. المكونات المشتركة
- [ ] `ProjectCard.js` - بطاقة المشروع
- [ ] `MaterialCard.js` - بطاقة المادة
- [ ] `SupplierCard.js` - بطاقة المورد
- [ ] `PaymentCard.js` - بطاقة الدفع
- [ ] `Charts.js` - الرسوم البيانية (مبسطة للموبايل)

### 4. نظام التنقل
- [ ] تحديث `AppNavigator.js` لإضافة جميع الشاشات
- [ ] إضافة Bottom Tabs للعميل
- [ ] إضافة Bottom Tabs للمقاول
- [ ] إضافة Stack Navigation للشاشات الفرعية

### 5. الميزات الإضافية
- [ ] Pull to Refresh
- [ ] Loading States
- [ ] Error Handling
- [ ] Empty States
- [ ] Search & Filter

---

## 🏗️ هيكل الملفات

```
alnuimie-mobile/
├── src/
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.js ✅
│   │   │   └── RegisterScreen.js ✅
│   │   ├── client/
│   │   │   ├── ClientDashboardScreen.js ✅
│   │   │   ├── ClientProjectsScreen.js ⏳
│   │   │   ├── ClientAddProjectScreen.js ⏳
│   │   │   ├── ClientProfileScreen.js ⏳
│   │   │   ├── ClientRequestsScreen.js ⏳
│   │   │   └── ClientReportsScreen.js ⏳
│   │   └── contractor/
│   │       ├── ContractorDashboardScreen.js ⏳
│   │       ├── ProjectsListScreen.js ⏳
│   │       ├── AddProjectAndRequestsScreen.js ⏳
│   │       ├── InventoryMaterialsScreen.js ⏳
│   │       ├── PurchasesAndIssueScreen.js ⏳
│   │       ├── SuppliersAndPaymentsScreen.js ⏳
│   │       ├── ReportsAndInvoicesScreen.js ⏳
│   │       └── ContractorProfileScreen.js ⏳
│   ├── components/
│   │   ├── ProjectCard.js ⏳
│   │   ├── MaterialCard.js ⏳
│   │   └── Charts.js ⏳
│   ├── navigation/
│   │   └── AppNavigator.js ✅ (يحتاج تحديث)
│   └── api/
│       └── index.js ✅
```

---

## 🔄 التحويلات المطلوبة

### من Web إلى Mobile:

| Web Component | Mobile Component |
|--------------|-----------------|
| `<div>` | `<View>` |
| `<span>`, `<p>` | `<Text>` |
| `<input>` | `<TextInput>` |
| `<button>` | `<TouchableOpacity>` |
| `<img>` | `<Image>` |
| `onClick` | `onPress` |
| `className` | `style` |
| CSS | `StyleSheet` |
| `Link` (React Router) | `navigation.navigate()` |
| `useNavigate()` | `navigation` prop |

---

## 📝 ملاحظات مهمة

1. **التصميم**: يجب أن يكون responsive ويعمل على جميع أحجام الشاشات
2. **الأداء**: استخدام `FlatList` للقوائم الطويلة
3. **التنقل**: استخدام Bottom Tabs للتنقل الرئيسي
4. **الحالة**: استخدام Context API أو Redux للحالة العامة
5. **التخزين**: استخدام AsyncStorage بدلاً من localStorage

---

## 🚀 الخطوات التالية

1. ✅ إنشاء ClientDashboardScreen
2. ⏳ إنشاء ClientProjectsScreen
3. ⏳ إنشاء ClientAddProjectScreen
4. ⏳ تحديث AppNavigator
5. ⏳ إنشاء صفحات المقاول
6. ⏳ إضافة المكونات المشتركة

---

**تم البدء! سيتم إكمال التحويل خطوة بخطوة 🎉**
