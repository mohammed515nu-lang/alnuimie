import type { RootStackParamList } from './types';
import { pushStackRoute } from './href';

/**
 * الانتقال من التبويبات (أو أي شاشة) إلى شاشة في الـ Stack (Expo Router).
 */
export function navigateFromRoot(name: keyof RootStackParamList) {
  pushStackRoute(name);
}
