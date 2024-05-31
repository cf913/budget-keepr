import {ReactNode} from 'react'
import {ThemedView} from '../ThemedView'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {ScrollView, StyleSheet} from 'react-native'
import {ThemedText} from '../ThemedText'
import {PADDING, TYPO} from '@/constants/Styles'
import {useHeaderHeight} from '@react-navigation/elements'

export default function Page({
  withHeader = false,
  title,
  children,
}: {
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
        {title ? (
          <ThemedView style={styles.header}>
            <ThemedText style={[{}, styles.title]}>{title}</ThemedText>
          </ThemedView>
        ) : null}
        {children}
      </ScrollView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    ...TYPO.title,
  },
  header: {
    padding: PADDING,
  },
})
