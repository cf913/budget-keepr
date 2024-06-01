import {ReactNode} from 'react'
import {ThemedView} from '../ThemedView'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {ScrollView, StyleSheet} from 'react-native'
import {ThemedText} from '../ThemedText'
import {PADDING, TYPO} from '@/constants/Styles'
import {useHeaderHeight} from '@react-navigation/elements'
import SettingsButton from '../Buttons/SettingsButton'

export default function Page({
  withSettings = false,
  withHeader = false,
  title,
  children,
}: {
  withSettings?: boolean
  withHeader?: boolean
  title?: string
  children: ReactNode
}) {
  const insets = useSafeAreaInsets()
  const headerHeight = useHeaderHeight()

  return (
    <ThemedView
      style={[
        {
          paddingBottom: insets.bottom,
        },
        styles.container,
      ]}
    >
      <ScrollView style={{paddingTop: withHeader ? headerHeight : insets.top}}>
        <ThemedView style={[{}, styles.header]}>
          {title ? (
            <ThemedView style={styles.title_container}>
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
  title_container: {},
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
