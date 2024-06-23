import { ReactNode } from 'react'
import { ThemedView } from '../ThemedView'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
  Pressable,
  RefreshControl,
  ScrollView,
  ScrollViewProps,
  StyleSheet,
  ViewProps,
  ViewStyle,
} from 'react-native'
import { ThemedText } from '../ThemedText'
import { PADDING, TYPO } from '@/constants/Styles'
import { useHeaderHeight } from '@react-navigation/elements'
import SettingsButton from '../Buttons/SettingsButton'
import { Feather } from '@expo/vector-icons'
import { useThemeColor } from '@/hooks/useThemeColor'
import { router } from 'expo-router'
import Content from './Content'
import Padder from './Padder'

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

export default function Page({
  scroll = false,
  back = false,
  down = false,
  refreshing = false,
  onRefresh,
  withSettings = false,
  withHeader = false,
  title,
  subtitle,
  style,
  footer = null,
  children,
}: {
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
}) {
  const insets = useSafeAreaInsets()
  const headerHeight = useHeaderHeight()
  const colorText = useThemeColor({}, 'mid')

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
          {title ? (
            <ThemedView style={styles.title_container}>
              {back || down ? (
                <Pressable
                  onPress={() => router.back()}
                  hitSlop={30}
                  style={{ zIndex: 2 }}
                >
                  {back ? <Feather
                    name={'chevron-left'}
                    size={28}
                    color={colorText}
                    style={{ marginLeft: -10 }}
                  /> :

                    <Feather
                      name={'x'}
                      size={24}
                      color={colorText}
                      style={{ marginLeft: -6, paddingRight: 2 }} />}
                </Pressable>
              ) : null}
              <ThemedView>
                <ThemedText
                  style={[
                    styles.title,
                    subtitle ? TYPO.title_compact : TYPO.title,
                  ]}
                >
                  {title}
                </ThemedText>
                {subtitle ? (
                  <ThemedText style={[{}, styles.subtitle]}>
                    {subtitle}
                  </ThemedText>
                ) : null}
              </ThemedView>
            </ThemedView>
          ) : null}
          {withSettings ? <SettingsButton /> : null}
        </ThemedView>
        {children}
      </Wrapper>
      {footer ? (
        <Content
          floating
          style={{
            paddingBottom: insets.bottom || PADDING,
            backgroundColor: 'transparent',
          }}
        >
          {footer}
        </Content>
      ) : null}
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
    padding: PADDING,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
})
