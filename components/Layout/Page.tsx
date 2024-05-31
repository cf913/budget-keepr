import {ReactNode} from 'react'
import {ThemedView} from '../ThemedView'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {StyleSheet} from 'react-native'
import {ThemedText} from '../ThemedText'
import {PADDING, TYPO} from '@/constants/Styles'

export default function Page({
  title,
  children,
}: {
  title?: string
  children: ReactNode
}) {
  const insets = useSafeAreaInsets()

  return (
    <ThemedView
      style={[
        {paddingTop: insets.top, paddingBottom: insets.bottom},
        styles.container,
      ]}
    >
      <ThemedView style={styles.header}>
        {title ? (
          <ThemedText style={[{}, styles.title]}>{title}</ThemedText>
        ) : null}
      </ThemedView>
      {children}
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
