import {Feather} from '@expo/vector-icons'
import {useThemeColor} from '@/hooks/useThemeColor'
import {ThemedText} from '../ThemedText'
import {ThemedView} from '../ThemedView'
import {Pressable, StyleSheet} from 'react-native'
import {HEIGHT, PADDING, RADIUS, TYPO} from '@/constants/Styles'
import {Link} from 'expo-router'
import {ReactNode} from 'react'
import FadeInView from '../FadeInView'
import {Category} from '../RecentEntries'

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
  title,
  description,
  category,
  lastItem = false,
  right,
}: {
  href?: string
  title: string
  description?: string | null
  category?: Category
  lastItem?: boolean
  right?: string
}) {
  const backgroundColor = useThemeColor({}, 'bg_secondary')
  const borderColor = useThemeColor({}, 'mid2')
  const chevronColor = useThemeColor({}, 'mid')
  const rightColor = useThemeColor({}, 'tint')

  const withCategory = category
    ? {
        borderStartWidth: 5,
        borderStartColor: title === 'Coles' ? 'red' : 'gold',
      }
    : null

  return (
    <Wrapper href={href}>
      <ThemedView
        style={[
          styles.container,
          {
            backgroundColor,
            ...withCategory,
          },
        ]}
      >
        <ThemedView style={[{}, styles.left]}>
          <ThemedText style={[{}, styles.title]}>{title}</ThemedText>
          {description ? (
            <ThemedText style={[{}, styles.description]}>
              {description}
            </ThemedText>
          ) : null}
        </ThemedView>
        <FadeInView style={[{}, styles.right]}>
          {href ? (
            <Feather name="chevron-right" size={24} color={chevronColor} />
          ) : null}
          {right ? (
            <ThemedText style={{color: rightColor}}>{right}</ThemedText>
          ) : null}
        </FadeInView>
      </ThemedView>
      {!+lastItem ? (
        <ThemedView
          style={{width: '100%', height: 1, backgroundColor: borderColor}}
        ></ThemedView>
      ) : null}
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
  },
  left: {
    ...common_styles.bg_view,
  },
  title: {},
  description: {
    ...TYPO.small,
    paddingVertical: 3,
    fontFamily: 'SpaceMono',
    opacity: 0.4,
  },
  right: {
    ...common_styles.bg_view,
  },
})
