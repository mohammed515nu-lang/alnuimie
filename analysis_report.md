# 📊 تقرير الفحص الشامل — تطبيق بنيان

---

## 🔴 أولاً: أخطاء Stripe (عدم القدرة على الدفع)

### 1. مشكلة `paymentOption.id` — **خطأ حرج يمنع حفظ البطاقة**

**الملف:** `src/screens/wallet/AddCardScreen.tsx` — السطر 57

```typescript
// ❌ الكود الحالي — خاطئ
const pmId = (paymentOption as unknown as { id?: string } | null)?.id;
if (!pmId) throw new Error('لم يتم استلام paymentMethodId');
```

**السبب:** `presentPaymentSheet()` لا يُرجع `paymentOption.id` كـ `paymentMethodId`. هذا الـ `id` هو معرف خيار الدفع المعروض (مثل `card`، `apple_pay`) وليس `stripePaymentMethodId`. يجب استخدام `setupIntent` بدلاً من ذلك لجلب الـ PM من الخادم.

**الحل:**
```typescript
// ✅ بعد presentPaymentSheet بنجاح، اجلب البطاقة من الخادم مباشرة
const { error: presentError } = await presentPaymentSheet();
if (presentError) {
  if (presentError.code === 'Canceled') return;
  throw new Error(presentError.message);
}
// جلب قائمة البطاقات من الخادم (يحفظها Stripe Webhook أو SetupIntent)
await refreshPaymentCards();
hapticSuccess();
Alert.alert('تم', 'تم حفظ البطاقة');
```

---

### 2. `STRIPE_SECRET_KEY` مفقود في بيئة الخادم — **Stripe لا يعمل**

**الملف:** `server/.env.example` + `server/routes/stripe.js` / `wallet.js`

```
# server/.env.example
STRIPE_SECRET_KEY=   ← فارغ تماماً
```

الخادم على Render لا يمتلك `STRIPE_SECRET_KEY` → كل طلبات الدفع ترجع:
```json
{ "error": "Stripe payment service is not configured" }
```

**الحل:** يجب إضافة المتغيرات في Render Dashboard:
- `STRIPE_SECRET_KEY=sk_test_...`
- `STRIPE_PUBLISHABLE_KEY=pk_test_...`
- `STRIPE_WEBHOOK_SECRET=whsec_...`

---

### 3. `automatic_payment_methods` + `payment_method` — تعارض في الـ PaymentIntent

**الملف:** `server/routes/wallet.js` — السطور 292-299

```javascript
// ❌ تعارض: لا يمكن تحديد payment_method مع automatic_payment_methods: { enabled: true }
const intentParams = {
  automatic_payment_methods: { enabled: true },  // ← يتعارض مع السطر التالي
};
if (card) intentParams.payment_method = card.stripePaymentMethodId; // ← خطأ
```

**خطأ Stripe:** `"You cannot provide payment_method when automatic_payment_methods is enabled"`

**الحل:**
```javascript
if (card) {
  intentParams.payment_method = card.stripePaymentMethodId;
  intentParams.confirm = false; // أو استخدم payment_method_types بدلاً من automatic
  delete intentParams.automatic_payment_methods;
} else {
  intentParams.automatic_payment_methods = { enabled: true };
}
```

---

### 4. `StripeProvider` يتلقى مفتاحاً فارغاً — **تحطم صامت**

**الملف:** `app/_layout.tsx` — السطر 77

```typescript
const pk = getStripePublishableKey(); // قد يكون ''
// StripeProvider بـ publishableKey='' يتسبب بأخطاء غير واضحة
<StripeProvider publishableKey={pk} ...>
```

**الحل:** إضافة حماية:
```typescript
const pk = getStripePublishableKey();
// في RootWithProviders:
{pk ? (
  <StripeProvider publishableKey={pk} urlScheme={stripeScheme} setReturnUrlSchemeOnAndroid>
    {children}
  </StripeProvider>
) : (
  <>{children}</>
)}
```

---

### 5. نقطة Webhook مسجلة قبل `express.json()` لكن بشكل غير صحيح

**الملف:** `server/server.js` — السطر 31

```javascript
app.use('/api/stripe/webhook', stripeWebhook.webhookRouter); // ✅ صح
// لكن stripeRoutes أيضاً مسجل في السطر 105:
app.use('/api/stripe', stripeRoutes); // ← هذا يُعيد تسجيل /webhook تحت /api/stripe/webhook
```

التداخل بين `webhookRouter` و `stripeRoutes` يسبب تسجيل `/api/stripe/webhook` مرتين.

---

## 🔴 ثانياً: أخطاء تحطم التطبيق عند المحادثة

### 6. `ChatRoomScreen` — عدم التعامل مع `conversationId` الفارغ

**الملف:** `src/screens/chat/ChatRoomScreen.tsx` — السطر 33

```typescript
const conversationId = readString(cId); // قد يكون ''
// ثم:
await refreshChatMessages(conversationId); // يرسل طلب GET /chats//messages → 404
```

إذا انتقل المستخدم بـ `conversationId` فارغ أو غير صالح → crash عند محاولة الاتصال.

**الحل:**
```typescript
if (!conversationId) {
  // عودة للقائمة
  router.back();
  return;
}
```

---

### 7. `useFocusEffect` + Polling كل 4 ثوانٍ — **Memory Leak + Crash**

**الملف:** `src/screens/chat/ChatRoomScreen.tsx` — السطور 76-83

```typescript
useFocusEffect(
  useCallback(() => {
    const poll = setInterval(() => {
      void loadMessages(false); // ← يستمر حتى لو unmounted
    }, 4000);
    return () => clearInterval(poll);
  }, [loadMessages])
);
```

إذا غادر المستخدم الشاشة بسرعة وعاد، قد تتراكم مؤقتات متعددة. `loadMessages` يستدعي `setState` على component قد يكون unmounted.

**الحل:** إضافة `isMounted` flag:
```typescript
useFocusEffect(
  useCallback(() => {
    let active = true;
    const poll = setInterval(() => {
      if (active) void loadMessages(false);
    }, 4000);
    return () => {
      active = false;
      clearInterval(poll);
    };
  }, [loadMessages])
);
```

---

### 8. `conv.unread` Map vs Object — **TypeError يسبب crash**

**الملف:** `server/routes/chats.js` — السطر 158

```javascript
const prev = Number(conv.unread?.get?.(pid) ?? conv.unread?.[pid] ?? 0);
conv.unread.set ? conv.unread.set(pid, prev + 1) : (conv.unread[pid] = prev + 1);
```

Mongoose `Map` أحياناً يُعاد كـ plain object بعد `findById`، مما يتسبب بـ `conv.unread.set is not a function`.

**الحل:** تحويل صريح:
```javascript
if (!conv.unread || typeof conv.unread.set !== 'function') {
  conv.unread = new Map(Object.entries(conv.unread || {}));
}
conv.unread.set(pid, prev + 1);
```

---

### 9. `threadDto` — خطأ عند `unread` كـ Plain Object

**الملف:** `server/routes/chats.js` — السطر 25

```javascript
const unreadMap = conv.unread instanceof Map
  ? Object.fromEntries(conv.unread)
  : conv.unread; // قد يكون undefined أو Mongoose Map
const unread = Number(unreadMap?.[myId.toString()] ?? 0);
```

إذا كان `conv.unread` هو Mongoose Map ولم يُحوَّل بـ `instanceof Map`، يُعيد `undefined`.

---

### 10. `ChatListScreen` — عدم التعامل مع `otherUserName` الفارغ

**الملف:** `src/screens/chat/ChatListScreen.tsx` — السطر 123

```typescript
return threads.filter((t) => (t.otherUserName ?? '').toLowerCase().includes(s));
```

هذا صحيح، لكن في `ChatThreadRow`:
```typescript
name={item.otherUserName} // ← قد يكون '' أو undefined
```

إذا كان `otherUserName` فارغاً (مستخدم حُذف)، يُعرض اسم فارغ ويُسبب UX سيئاً. لا يوجد fallback.

---

## 🟡 ثالثاً: أخطاء إضافية

### 11. `api` timeout قصير جداً (30 ثانية)

الخادم على Render (Free tier) يستيقظ بعد نوم → قد تستغرق الاستجابة الأولى 30-60 ثانية → timeout.

**الملف:** `src/api/http.ts`
```typescript
timeout: 30000, // ← قد يكون قصيراً للـ cold start
```

---

### 12. `server/routes/stripe.js` — indentation خطأ في السطر 303-326

```javascript
// ❌ closing brace خاطئ (indentation)
if (payment.stripePaymentIntentId && stripe) {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(...);
  // ↓ هذا الـ closing try يغلق الـ if الداخلي بشكل خاطئ
  } catch (stripeError) {
    ...
  }
} else { // ← هذا الـ else ينتمي للـ if الداخلي لكنه ظاهرياً للخارجي
```

---

## 📚 قاعدة المعرفة — أسئلة المقاول

| # | السؤال | الإجابة المتوقعة من النظام |
|---|--------|---------------------------|
| 1 | كيف أضيف مشروعاً جديداً؟ | شاشة "مشاريع" → زر "+" → إدخال اسم، موقع، ميزانية |
| 2 | كيف أرى تقرير المصروفات؟ | تبويب "محاسبة" → "التقارير المالية" |
| 3 | كيف أدفع لمورد؟ | "المحفظة" → "دفع مقاول → مورد" → إدخال المبلغ واسم المورد |
| 4 | كيف أُضيف بطاقة دفع؟ | "المحفظة" → "إدارة البطاقات" → "إضافة بطاقة" |
| 5 | كيف أرفع صورة لمشروعي؟ | "ملفي الشخصي" → "إدارة المحفظة" → إضافة صور |
| 6 | كيف أتواصل مع العميل؟ | تبويب "المحادثات" → اختيار المحادثة |
| 7 | لماذا لا أرى العميل في المحادثات؟ | يجب قبول طلب التواصل أولاً |
| 8 | كيف أقبل طلب تواصل؟ | "الاتصالات" → "الطلبات المعلقة" → قبول |
| 9 | كيف أُنشئ فاتورة؟ | "محاسبة" → "الفواتير" → "فاتورة جديدة" |
| 10 | كيف أُضيف إيراداً؟ | "محاسبة" → "الإيرادات" → "إضافة إيراد" |
| 11 | لماذا فشل الدفع؟ | تحقق من البطاقة المحفوظة وتأكد من اتصال الإنترنت |
| 12 | كيف أرى سجل التحويلات؟ | "المحفظة" → "التحويلات" |
| 13 | كيف أُعدّل ملفي الشخصي؟ | "حسابي" → "تعديل الملف الشخصي" |
| 14 | هل يمكنني إلغاء مشروع؟ | نعم، من صفحة المشروع → تغيير الحالة إلى "ملغى" |
| 15 | كيف أرى تقييماتي من العملاء؟ | "ملفي الشخصي العام" → قسم التقييمات |

---

## 📚 قاعدة المعرفة — أسئلة العميل

| # | السؤال | الإجابة المتوقعة من النظام |
|---|--------|---------------------------|
| 1 | كيف أبحث عن مقاول؟ | "اكتشاف" → البحث بالاسم أو التخصص |
| 2 | كيف أرسل طلب تواصل للمقاول؟ | الدخول على ملف المقاول → "إرسال طلب تواصل" |
| 3 | كيف أدفع للمقاول؟ | "المحفظة" → "دفع عميل → مقاول" → اختيار المقاول |
| 4 | لماذا لا يظهر المقاول في خيارات الدفع؟ | يجب أن يكون الطلب مقبولاً من المقاول أولاً |
| 5 | كيف أُضيف بطاقة ائتمانية؟ | "المحفظة" → "إدارة البطاقات" → "إضافة بطاقة" |
| 6 | هل دفعتي آمنة؟ | نعم، الدفع يتم عبر Stripe المشفر ولا تُحفظ بيانات البطاقة على الخادم |
| 7 | كيف أرى سجل مدفوعاتي؟ | "المحفظة" → "التحويلات" |
| 8 | كيف أبدأ محادثة مع مقاول؟ | من ملف المقاول → "رسالة"، أو تبويب "المحادثات" |
| 9 | كيف أُقيّم مقاولاً؟ | الدخول على ملفه العام → "إضافة تقييم" |
| 10 | كيف أرى المشاريع المتعلقة بي؟ | تبويب "المشاريع" |
| 11 | ماذا يحدث إذا رفضت طلب تواصل؟ | لا يمكن للمقاول إرسال رسائل أو استقبال مدفوعات |
| 12 | هل يمكنني حذف بطاقتي؟ | نعم، من "إدارة البطاقات" → حذف |
| 13 | ما العملة المدعومة للدفع؟ | دولار أمريكي (USD) حالياً |
| 14 | كيف أُلغي دفعة؟ | يجب التواصل مع الدعم، لا يوجد إلغاء تلقائي بعد إتمام الدفع |
| 15 | لماذا لم تُنفَّذ دفعتي؟ | تحقق من رصيد البطاقة أو حاول ببطاقة أخرى |

---

## ✅ ملخص الإصلاحات المطلوبة (بالأولوية)

| الأولوية | المشكلة | الملف |
|----------|---------|-------|
| 🔴 حرج | `paymentOption.id` لا يعمل | `AddCardScreen.tsx` |
| 🔴 حرج | `STRIPE_SECRET_KEY` مفقود على Render | إعدادات Render |
| 🔴 حرج | تعارض `automatic_payment_methods` + `payment_method` | `wallet.js` |
| 🔴 حرج | `conversationId` فارغ يُحطم الشاشة | `ChatRoomScreen.tsx` |
| 🟠 مهم | Memory leak في polling المحادثة | `ChatRoomScreen.tsx` |
| 🟠 مهم | Mongoose Map vs Object في unread | `chats.js` |
| 🟡 متوسط | `StripeProvider` بمفتاح فارغ | `_layout.tsx` |
| 🟡 متوسط | Indentation خاطئ في `stripe.js` | `stripe.js` |
| 🟡 متوسط | Timeout قصير في Axios | `http.ts` |
