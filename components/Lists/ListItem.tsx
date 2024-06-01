import {Feather} from '@expo/vector-icons'
import {useThemeColor} from '@/hooks/useThemeColor'
import {ThemedText} from '../ThemedText'
import {ThemedView} from '../ThemedView'
import {Pressable, StyleSheet} from 'react-native'
import {HEIGHT, PADDING, RADIUS, TYPO} from '@/constants/Styles'
import {Link} from 'expo-router'
import {ReactNode} from 'react'

const Wrapper = ({href, children}: {href?: string; children: ReactNode}) =>
  href ? (
    <Link href={href} asChild>
      <Pressable>{children}</Pressable>
    </Link>
  ) : (
    <>{children}</>
  )

export default function ListItem({
  href,
  description,
  lastItem = false,
}: {
  href?: string
  description?: string | null
  lastItem?: boolean
}) {
  const backgroundColor = useThemeColor({}, 'bg_secondary')
  const borderColor = useThemeColor({}, 'bg')
  const chevronColor = useThemeColor({}, 'mid')

  return (
    <Wrapper href={href}>
      <ThemedView
        style={[
          styles.container,
          {backgroundColor, borderColor, borderBottomWidth: +!lastItem},
        ]}
      >
        <ThemedView style={[{}, styles.left]}>
          <ThemedText style={[{}, styles.title]}>Default Budget</ThemedText>
          {description ? (
            <ThemedText style={[{}, styles.description]}>
              {description}
            </ThemedText>
          ) : null}
        </ThemedView>
        <ThemedView style={[{}, styles.right]}>
          {href ? (
            <Feather name="chevron-right" size={24} color={chevronColor} />
          ) : null}
        </ThemedView>
      </ThemedView>
    </Wrapper>
  )
}

const common_styles = StyleSheet.create({
  bg_view: {
    backgroundColor: 'transparent',
  },
})

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: PADDING,
    height: HEIGHT.item,
    borderBottomWidth: 1,
  },
  left: {
    ...common_styles.bg_view,
  },
  title: {},
  description: {
    ...TYPO.small,
    paddingVertical: 3,
    opacity: 0.5,
  },
  right: {
    ...common_styles.bg_view,
  },
})
