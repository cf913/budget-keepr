import { useThemeColor } from './useThemeColor'

export function useColors() {
  const bgColor = useThemeColor({}, 'bg')
  const bgColor2 = useThemeColor({}, 'bg_secondary')
  const textColor = useThemeColor({}, 'text')
  const tintColor = useThemeColor({}, 'tint')
  const midColor = useThemeColor({}, 'mid')
  const midColor2 = useThemeColor({}, 'mid2')
  const grayColor = useThemeColor({}, 'gray')

  // const borderColor = useThemeColor({}, 'border');
  // const primaryColor = useThemeColor({}, 'primary');
  // const secondaryColor = useThemeColor({}, 'secondary');
  // const successColor = useThemeColor({}, 'success');
  // const warningColor = useThemeColor({}, 'warning');
  // const errorColor = useThemeColor({}, 'error');

  return {
    bgColor,
    textColor,
    tintColor,
    midColor,
    midColor2,
    bgColor2,
    grayColor,
    // borderColor,
    // primaryColor,
    // secondaryColor,
    // successColor,
    // warningColor,
    // errorColor,
  }
}

