import { Platform } from 'react-native';
import Constants from 'expo-constants';

/**
 * واجهة أصل التشغيل (Expo: Constants.platform) مع fallback لـ React Native
 * — مناسب للتحقق من iOS / Android / Web بشكل موحّد.
 */
export type ExpoRuntimeOs = 'ios' | 'android' | 'web';

const fromConstants: ExpoRuntimeOs | null = Constants.platform?.ios
  ? 'ios'
  : Constants.platform?.android
    ? 'android'
    : Constants.platform?.web
      ? 'web'
      : null;

function fromPlatformApi(): ExpoRuntimeOs {
  const p = Platform.OS;
  if (p === 'ios' || p === 'android' || p === 'web') return p;
  return 'web';
}

export const expoRuntimeOs: ExpoRuntimeOs = fromConstants ?? fromPlatformApi();

export const isIOS = expoRuntimeOs === 'ios';
export const isAndroid = expoRuntimeOs === 'android';
export const isWeb = expoRuntimeOs === 'web';
