import {ReactNode} from 'react'
import {ThemedView} from '../ThemedView'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {Pressable, RefreshControl, ScrollView, StyleSheet} from 'react-native'
import {ThemedText} from '../ThemedText'
import {PADDING, TYPO} from '@/constants/Styles'
import {useHeaderHeight} from '@react-navigation/elements'
import SettingsButton from '../Buttons/SettingsButton'
import {Feather} from '@expo/vector-icons'
import {useThemeColor} from '@/hooks/useThemeColor'
import {router} from 'expo-router'

export default function Page({
  back = false,
  refreshing = false,
  onRefresh,
  withSettings = false,
  withHeader = false,
  title,
  children,
}: {
  back?: boolean
  refreshing?: boolean
  onRefresh?: () => void
  withSettings?: boolean
  withHeader?: boolean
  title?: string
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
          paddingBottom: insets.bottom,
        },
        styles.container,
      ]}
    >
      <ScrollView
        refreshControl={refreshControl}
        style={{paddingTop: withHeader ? headerHeight : insets.top}}
      >
        <ThemedView style={[{}, styles.header]}>
          {title ? (
            <ThemedView style={styles.title_container}>
              {back ? (
                <Pressable
                  onPress={() => router.back()}
                  hitSlop={30}
                  style={{zIndex: 2}}
                >
                  <Feather
                    name="chevron-left"
                    size={32}
                    color={colorText}
                    style={{marginLeft: -10}}
                  />
                </Pressable>
              ) : null}
              <ThemedText style={[{}, styles.title]}>{title}</ThemedText>
            </ThemedView>
          ) : null}
          {withSettings ? <SettingsButton /> : null}
        </ThemedView>
        {children}
      </ScrollView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title_container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    ...TYPO.title,
  },
  header: {
    padding: PADDING,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})
