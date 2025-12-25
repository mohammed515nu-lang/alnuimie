// 📦 EXAMPLES.md - أمثلة الاستخدام

## 🎨 أمثلة المكونات الحديثة

### 1️⃣ المكونات الأساسية - Basic Components

#### المزرار الحديث - ModernButton
```javascript
import { ModernButton } from './modern-index';

// الأشكال المختلفة
<ModernButton variant="primary">زر أساسي</ModernButton>
<ModernButton variant="secondary">زر ثانوي</ModernButton>
<ModernButton variant="outline">زر ملخص</ModernButton>
<ModernButton variant="ghost">زر شفاف</ModernButton>
<ModernButton variant="surface">زر سطح</ModernButton>

// الأحجام المختلفة
<ModernButton size="sm">صغير</ModernButton>
<ModernButton size="md">متوسط</ModernButton>
<ModernButton size="lg">كبير</ModernButton>
<ModernButton size="xl">كبير جداً</ModernButton>

// مع الأيقونات
<ModernButton icon={<FaArrowRight />} iconPosition="right">
  اضغط هنا
</ModernButton>

// حالات خاصة
<ModernButton loading={true}>جاري التحميل...</ModernButton>
<ModernButton disabled={true}>معطل</ModernButton>
<ModernButton fullWidth={true}>عرض كامل</ModernButton>
```

---

### 2️⃣ نظام البطاقات - Card System

#### بطاقة السطح - SurfaceCard
```javascript
import { SurfaceCard } from './modern-index';

<SurfaceCard variant="flat">
  <h3>عنوان البطاقة</h3>
  <p>محتوى البطاقة</p>
</SurfaceCard>

<SurfaceCard variant="elevated" padding="lg">
  <h3>بطاقة مرتفعة</h3>
  <p>مع ظل وارتفاع</p>
</SurfaceCard>

<SurfaceCard variant="outlined" hover={true}>
  <h3>بطاقة ملخصة</h3>
  <p>مع تأثير hover</p>
</SurfaceCard>
```

#### بطاقة الميزات - FeatureCard
```javascript
import { FeatureCard } from './modern-index';

<FeatureCard
  icon="🏆"
  title="الجودة العالية"
  description="نحن نوفر أفضل جودة في السوق"
  variant="primary"
/>

<FeatureCard
  icon="⚡"
  title="السرعة"
  description="أسرع خدمة توصيل في المنطقة"
  variant="secondary"
/>
```

#### بطاقة الإحصائيات - StatsCard
```javascript
import { StatsCard } from './modern-index';

<StatsCard
  title="المبيعات"
  value="$125,450"
  change="+12.5%"
  icon="💰"
  variant="primary"
/>

<StatsCard
  title="العملاء"
  value="2,450"
  change="+8.2%"
  icon="👥"
  variant="secondary"
/>
```

#### بطاقة المشروع - ProjectCard
```javascript
import { ProjectCard } from './modern-index';

<ProjectCard
  title="مجمع الأعمال الحديث"
  description="مجمع تجاري متكامل بأحدث التقنيات"
  image="/path/to/image.jpg"
  category="تجاري"
  status="مكتمل"
  progress={100}
  technologies={["React", "Node.js", "MongoDB"]}
/>
```

---

### 3️⃣ نظام الطباعة - Typography System

#### العناوين - Titles
```javascript
import {
  HeroTitle,
  SectionTitle,
  Subtitle,
  GradientText,
  AnimatedText
} from './modern-index';

<HeroTitle>عنوان بطل مميز</HeroTitle>

<SectionTitle>عنوان القسم</SectionTitle>

<Subtitle>عنوان فرعي صغير</Subtitle>

<HeroTitle>
  هذا نص عادي مع
  <GradientText> نص متدرج اللون </GradientText>
  في المنتصف
</HeroTitle>

<AnimatedText animation="fadeInUp" delay={200}>
  نص متحرك يظهر تدريجياً
</AnimatedText>
```

---

### 4️⃣ نظام التخطيط - Layout System

#### قسم البطل - HeroSection
```javascript
import { HeroSection, BigBlock } from './modern-index';

<HeroSection variant="primary" height="screen">
  <BigBlock>
    <h1>مرحباً بك</h1>
  </BigBlock>
</HeroSection>
```

#### كتلة كبيرة - BigBlock
```javascript
<BigBlock variant="primary" size="lg">
  <h2>محتوى مهم</h2>
  <p>هذا محتوى داخل كتلة كبيرة</p>
</BigBlock>
```

#### الشبكة - ModernGrid
```javascript
import { ModernGrid } from './modern-index';

<ModernGrid columns={3} gap="lg" responsive>
  {items.map(item => (
    <div key={item.id}>{item.name}</div>
  ))}
</ModernGrid>
```

#### قسم المسافات السالبة - NegativeSpaceSection
```javascript
import { NegativeSpaceSection } from './modern-index';

<NegativeSpaceSection spacing="xl">
  <h2>محتوى مع مسافات كبيرة</h2>
</NegativeSpaceSection>
```

---

### 5️⃣ المكونات التفاعلية - Interactive Components

#### الشارة - Badge
```javascript
import { Badge } from './modern-index';

<Badge variant="primary">جديد</Badge>
<Badge variant="secondary">محبوب</Badge>
<Badge variant="success">مكتمل</Badge>
<Badge variant="warning">قيد الانتظار</Badge>
<Badge variant="error">مرفوض</Badge>
```

#### زر عائم - FloatingButton
```javascript
import { FloatingButton } from './modern-index';

<FloatingButton
  icon={<FaPlus />}
  variant="primary"
  position="bottom-right"
>
  أضف جديد
</FloatingButton>
```

---

## 📱 مثال صفحة كاملة

```javascript
import React from 'react';
import {
  HeroSection,
  BigBlock,
  ModernGrid,
  ModernButton,
  SurfaceCard,
  FeatureCard,
  StatsCard,
  HeroTitle,
  SectionTitle,
  Subtitle,
  GradientText,
  Badge,
  FloatingButton
} from './modern-index';
import { FaPlus, FaArrowRight } from 'react-icons/fa';
import './styles/GlobalModernDesign.css';

export default function HomePage() {
  const features = [
    { id: 1, icon: '🚀', title: 'سريع', description: 'أسرع حل في السوق' },
    { id: 2, icon: '🔒', title: 'آمن', description: 'حماية عالية للبيانات' },
    { id: 3, icon: '💡', title: 'ذكي', description: 'تقنيات حديثة ومتطورة' },
  ];

  const stats = [
    { title: 'المستخدمين', value: '50K+', change: '+15%', icon: '👥' },
    { title: 'المشاريع', value: '1,200', change: '+8%', icon: '📊' },
    { title: 'المشاركين', value: '500+', change: '+12%', icon: '🤝' },
  ];

  return (
    <>
      {/* القسم الأول - البطل */}
      <HeroSection variant="primary">
        <BigBlock size="lg">
          <HeroTitle>
            مرحباً بك في
            <GradientText> منصتنا الجديدة </GradientText>
          </HeroTitle>
          
          <Subtitle>
            أفضل حل لإدارة مشاريعك بكفاءة واحترافية
          </Subtitle>

          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <ModernButton variant="primary" size="lg" icon={<FaArrowRight />}>
              ابدأ الآن
            </ModernButton>
            <ModernButton variant="outline" size="lg">
              اعرف المزيد
            </ModernButton>
          </div>
        </BigBlock>
      </HeroSection>

      {/* الإحصائيات */}
      <BigBlock>
        <SectionTitle>إحصائياتنا</SectionTitle>
        
        <ModernGrid columns={3} gap="lg" responsive>
          {stats.map(stat => (
            <StatsCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              icon={stat.icon}
            />
          ))}
        </ModernGrid>
      </BigBlock>

      {/* الميزات */}
      <BigBlock>
        <SectionTitle>مميزاتنا</SectionTitle>
        
        <ModernGrid columns={3} gap="lg" responsive>
          {features.map(feature => (
            <FeatureCard
              key={feature.id}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </ModernGrid>
      </BigBlock>

      {/* عرض خاص */}
      <BigBlock variant="secondary">
        <div style={{ textAlign: 'center' }}>
          <h2>
            <Badge variant="success">عرض حصري</Badge>
          </h2>
          <HeroTitle>احصل على 50% خصم الآن</HeroTitle>
          <Subtitle>للمشتركين الجدد فقط</Subtitle>
          
          <ModernButton
            variant="primary"
            size="lg"
            style={{ marginTop: '2rem' }}
          >
            الاشتراك الآن
          </ModernButton>
        </div>
      </BigBlock>

      {/* زر عائم */}
      <FloatingButton
        icon={<FaPlus />}
        variant="primary"
        position="bottom-right"
      >
        إضافة جديد
      </FloatingButton>
    </>
  );
}
```

---

## 🎯 نصائح للاستخدام الأمثل

1. **استخدم المشغلات الحديثة دائماً** - جميع المكونات تدعم التخصيص الكامل
2. **اختبر على الهواتف** - جميع المكونات مستجيبة بشكل كامل
3. **لا تنسَ الأيقونات** - استخدم `react-icons` للأيقونات الجميلة
4. **خصص الألوان** - عدّل الألوان في `GlobalDesignSystem.js`
5. **استخدم التأثيرات** - أضف حركات بسيطة مع Framer Motion

---

**لمزيد من المعلومات، اقرأ `MODERN_DESIGN_GUIDE.md`**
