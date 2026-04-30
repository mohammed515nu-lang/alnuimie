/** محافظات سوريا للتصفية في واجهة البحث */
export const SYRIAN_GOVERNORATES = [
  'دمشق',
  'ريف دمشق',
  'حلب',
  'حمص',
  'اللاذقية',
  'طرطوس',
  'حماة',
  'دير الزور',
  'الرقة',
  'الحسكة',
  'السويداء',
  'درعا',
  'إدلب',
  'القنيطرة',
] as const;

export type SyrianGovernorate = (typeof SYRIAN_GOVERNORATES)[number];

export function cityMatchesGovernorate(city: string | undefined, governorate: string): boolean {
  if (!governorate.trim()) return true;
  if (!city?.trim()) return false;
  const c = city.trim().toLowerCase();
  const g = governorate.trim().toLowerCase();
  if (c.includes(g) || g.includes(c)) return true;
  if (governorate === 'ريف دمشق' && (c.includes('ريف') && c.includes('دمشق'))) return true;
  return false;
}
