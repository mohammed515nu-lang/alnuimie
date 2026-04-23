import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';

import { useStore } from '../store/useStore';
import {
  authUiDark,
  authUiLight,
  gradientsDark,
  gradientsLight,
  paletteDark,
  paletteLight,
  type AppGradients,
  type AppPalette,
  type AuthUiPalette,
  type ResolvedScheme,
} from './palettes';
import { authCardLiftStyle, surfaceLiftStyle, walletCardHaloStyle } from './shadows';

export type { ResolvedScheme };

export type AppThemeValue = {
  colors: AppPalette;
  gradients: AppGradients;
  authUi: AuthUiPalette;
  resolved: ResolvedScheme;
  surfaceLift: ReturnType<typeof surfaceLiftStyle>;
  authCardLift: ReturnType<typeof authCardLiftStyle>;
  walletCardHalo: ReturnType<typeof walletCardHaloStyle>;
};

const ThemeContext = createContext<AppThemeValue | null>(null);

function resolveScheme(
  appearance: 'light' | 'dark' | 'system',
  system: string | null | undefined
): ResolvedScheme {
  if (appearance === 'light') return 'light';
  if (appearance === 'dark') return 'dark';
  return system === 'dark' ? 'dark' : 'light';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const appearance = useStore((s) => s.appearance);
  const systemScheme = useColorScheme();

  const value = useMemo<AppThemeValue>(() => {
    const resolved = resolveScheme(appearance, systemScheme);
    if (resolved === 'light') {
      return {
        colors: paletteLight,
        gradients: gradientsLight,
        authUi: authUiLight,
        resolved,
        surfaceLift: surfaceLiftStyle('light'),
        authCardLift: authCardLiftStyle('light'),
        walletCardHalo: walletCardHaloStyle('light'),
      };
    }
    return {
      colors: paletteDark,
      gradients: gradientsDark,
      authUi: authUiDark,
      resolved,
      surfaceLift: surfaceLiftStyle('dark'),
      authCardLift: authCardLiftStyle('dark'),
      walletCardHalo: walletCardHaloStyle('dark'),
    };
  }, [appearance, systemScheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme(): AppThemeValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useAppTheme must be used inside ThemeProvider');
  }
  return ctx;
}
