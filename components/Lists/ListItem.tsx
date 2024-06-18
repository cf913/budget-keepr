import {Feather} from '@expo/vector-icons'
import {useThemeColor} from '@/hooks/useThemeColor'
import {ThemedText} from '../ThemedText'
import {AnimatedView, ThemedView} from '../ThemedView'
import {Pressable, StyleSheet} from 'react-native'
import {HEIGHT, PADDING, TYPO} from '@/constants/Styles'
import {Link} from 'expo-router'
import {ReactNode} from 'react'
import {Category} from '../RecentEntries'
import {ExpoRouter} from '@/.expo/types/router'
import {FadeIn, FadeInRight} from 'react-native-reanimated'

const Wrapper = ({
  href,
  onSelectItem,
  children,
}: {
  href?: ExpoRouter.Href
  onSelectItem: (item: any) => void
  children: ReactNode
}) => {
  if (href)
    return (
      <Link href={href} asChild>
        <Pressable>{children}</Pressable>
      </Link>
    )

  if (onSelectItem)
    return <Pressable onPress={onSelectItem}>{children}</Pressable>

  return children
}

export default function ListItem({
  item,
  onSelect,
  href,
  title,
  description,
  category,
  lastItem = false,
  checked = false,
  right,
}: {
  item?: any
  onSelect?: (item: any) => void
  href?: string | ExpoRouter.Href
  title: string
  description?: string | null
  category?: Category
  lastItem?: boolean
  checked?: boolean
  right?: string | number
}) {
  const backgroundColor = useThemeColor({}, 'bg_secondary')
  const borderColor = useThemeColor({}, 'mid2')
  const chevronColor = useThemeColor({}, 'mid')
  const rightColor = useThemeColor({}, 'tint')

  const withCategory = category
    ? {
        borderStartWidth: 5,
        borderStartColor: category.color,
      }
    : null

  const onSelectItem = () => (onSelect ? onSelect(item) : null)

  return (
    <Wrapper href={href} onSelectItem={onSelectItem}>
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
        <AnimatedView entering={FadeIn} style={styles.right}>
          {href ? (
            <Feather
              name="chevron-right"
              size={24}
              color={chevronColor}
              style={{paddingLeft: PADDING / 4}}
            />
          ) : null}
          {checked ? (
            <Feather
              name="check"
              size={24}
              color={rightColor}
              style={{paddingLeft: PADDING / 4}}
            />
          ) : null}
          {right ? (
            <ThemedText style={{color: rightColor}}>{right}</ThemedText>
          ) : null}
        </AnimatedView>
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
    flexDirection: 'row-reverse',
    ...common_styles.bg_view,
  },
})
