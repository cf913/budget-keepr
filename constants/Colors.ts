/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4'
const tintColorDark = '#6fffe9'
const gray = '#00000022'

export const Colors = {
  common: {
    gray,
  },
  light: {
    bg: '#fff',
    bg_secondary: '#eee',
    mid: '#3a506b',
    tint: tintColorLight,
    text: '#11181C',
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    gray,
  },
  dark: {
    bg: '#0B132B',
    bg_secondary: '#1c2541',
    mid: '#3a506b',
    text: '#fff',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    gray: '#444',
  },
}
