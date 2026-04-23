import * as Haptics from 'expo-haptics';

import { isWeb } from './platformEnv';

const enabled = !isWeb;

export function hapticLight() {
  if (!enabled) return;
  void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

export function hapticMedium() {
  if (!enabled) return;
  void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
}

export function hapticSuccess() {
  if (!enabled) return;
  void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}

export function hapticError() {
  if (!enabled) return;
  void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
}
