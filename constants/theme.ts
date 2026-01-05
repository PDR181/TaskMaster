/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

const tintColorLight = "#5FB3D5"; // Azul pastel mais forte
const tintColorDark = "#E8D5C4"; // Bege pastel suave

export const Colors = {
  light: {
    text: "#2D4A4A",
    background: "#FFFFFF",
    tint: tintColorLight,
    icon: "#7A9A9A",
    tabIconDefault: "#7A9A9A",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#2D4A4A",
    background: "#2A2A2A",
    tint: tintColorLight,
    icon: "#7A9A9A",
    tabIconDefault: "#7A9A9A",
    tabIconSelected: tintColorLight,
  },
};

export const PriorityColors = {
  baixa: "#3B82F6", // Azul
  media: "#FBBF24", // Amarelo
  alta: "#EF4444", // Vermelho
};

export const CardColors = {
  light: "#E8F0F0", // Cinza azul claríssimo
  dark: "#E8F0F0", // Mesma cor do light
};

export const InputTextColors = {
  light: "#1F2937", // Cinza bem escuro/quase preto
  dark: "#1F2937", // Cinza bem escuro/quase preto
};

export const TaskTextColors = {
  light: "#2D4A4A", // Texto escuro para modo light
  dark: "#2D4A4A", // Mesma cor do modo light
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
