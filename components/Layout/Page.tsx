import { PADDING, TYPO } from '@/constants/Styles'
import { useHeaderHeight } from '@react-navigation/elements'
import { ReactNode } from 'react'
import {
  RefreshControl,
  ScrollView,
  ScrollViewProps,
  StyleSheet,
  ViewProps,
  ViewStyle,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import SettingsButton from '../Buttons/SettingsButton'
import { ThemedView } from '../ThemedView'
import { Header } from './Header'
import { Footer } from './Footer'
import { Padder } from './Padder'

const Wrapper = ({
  scroll,
  refreshControl,
  children,
  ...props
}: ViewProps &
  ScrollViewProps & {
    scroll?: boolean
    refreshControl: React.JSX.Element
    children: ReactNode
  }) => {
  return scroll ? (
    <ScrollView refreshControl={refreshControl} {...props}>
      {children}
    </ScrollView>
  ) : (
    <ThemedView {...props}>{children}</ThemedView>
  )
}

type PageProps = {
  scroll?: boolean
  back?: boolean
  down?: boolean
  refreshing?: boolean
  onRefresh?: () => void
  withSettings?: boolean
  withHeader?: boolean
  title?: string
  subtitle?: string
  style?: ViewStyle
  footer?: ReactNode
  children: ReactNode
}

export function Page({
  scroll = false,
  back = false,
  down = false,
  refreshing = false,
  onRefresh,
  withSettings = false,
  withHeader = false,
  title,
  style,
  footer = null,
  children,
}: PageProps) {
  const insets = useSafeAreaInsets()
  const headerHeight = useHeaderHeight()

  const refreshControl = onRefresh ? (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      progressViewOffset={insets.top}
    />
  ) : (
    <></>
  )

  return (
    <ThemedView
      style={[
        {
          // paddingBottom: insets.bottom,
        },
        styles.container,
        { ...style },
      ]}
    >
      <Wrapper
        scroll={scroll}
        refreshControl={refreshControl}
        style={{
          // paddingTop: withHeader ? headerHeight : insets.top,
          flexGrow: 1,
        }}
        contentContainerStyle={{
          flexGrow: 1,
        }}
      >
        <Padder style={{ height: withHeader ? headerHeight : insets.top }} />
        <ThemedView style={[{}, styles.header]}>
          {title ? <Header title={title} back={back} down={down} /> : null}
          {withSettings ? <SettingsButton /> : null}
        </ThemedView>
        {children}
      </Wrapper>
      {footer ? <Footer>{footer}</Footer> : null}
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  title_container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    ...TYPO.title,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 15,
    opacity: 0.5,
  },
  header: {
    paddingHorizontal: PADDING,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
})
