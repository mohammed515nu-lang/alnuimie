import { Text, View, type ViewStyle } from 'react-native';

type Props = {
  width?: number;
  height?: number;
  style?: ViewStyle;
};

/**
 * علم سوريا (تصميم الاستقلال): ثلاثة أشرطة أفقية خضراء، بيضاء، سوداء، وثلاث نجوم حمراء في الوسط.
 * يُستخدم بدل إيموجي النظام لضمان مظهر موحّد.
 */
export function SyriaFlag({ width = 28, height = 20, style }: Props) {
  const band = height / 3;
  const starSize = Math.max(7, Math.min(band * 0.65, width * 0.12));
  const gap = Math.max(1, width * 0.035);

  return (
    <View style={[{ width, height, borderRadius: 3, overflow: 'hidden' }, style]}>
      <View style={{ height: band, backgroundColor: '#007A3D' }} />
      <View
        style={{
          height: band,
          backgroundColor: '#FFFFFF',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap,
        }}
      >
        <Text style={{ color: '#CE1126', fontSize: starSize, lineHeight: starSize, fontWeight: '700' }}>★</Text>
        <Text style={{ color: '#CE1126', fontSize: starSize, lineHeight: starSize, fontWeight: '700' }}>★</Text>
        <Text style={{ color: '#CE1126', fontSize: starSize, lineHeight: starSize, fontWeight: '700' }}>★</Text>
      </View>
      <View style={{ height: band, backgroundColor: '#000000' }} />
    </View>
  );
}
