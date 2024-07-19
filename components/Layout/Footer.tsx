import { PADDING } from '@/constants/Styles'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Content } from './Content'

export function Footer({ children }: { children: React.ReactNode }) {
  const insets = useSafeAreaInsets()
  return (
    <Content
      floating
      style={{
        paddingBottom: insets.bottom || PADDING,
        backgroundColor: 'transparent',
        zIndex: 99,
      }}
    >
      {children}
    </Content>
  )
}
