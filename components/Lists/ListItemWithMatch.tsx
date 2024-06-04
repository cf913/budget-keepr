import {Feather} from '@expo/vector-icons'
import {useThemeColor} from '@/hooks/useThemeColor'
import {ThemedText} from '../ThemedText'
import {ThemedView} from '../ThemedView'
import {Pressable, StyleSheet} from 'react-native'
import {HEIGHT, PADDING, RADIUS, TYPO} from '@/constants/Styles'
import {Link} from 'expo-router'
import {ReactNode, useMemo} from 'react'
import FadeInView from '../FadeInView'
import {Category} from '../RecentEntries'
import {ExpoRouter} from '@/.expo/types/router'

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

export default function ListItemWithMatch({
  item,
  onSelect,
  href,
  title,
  description,
  category,
  lastItem = false,
  right,
}: {
  item?: any
  onSelect?: (item: any) => void
  href?: ExpoRouter.Href
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
        borderStartColor:
          title === 'Coles' ? 'red' : title === 'Aldi' ? 'blue' : 'gold',
      }
    : null

  const onSelectItem = () => (onSelect ? onSelect(item) : null)

  const matchingTitle = useMemo(() => {
    const {matches, name} = item
    const {indices} = matches[0]
    const [start, end] = indices[0]
    const pre = name.slice(0, start)
    const mid = name.slice(start, end + 1)
    const suf = name.slice(end + 1)

    return (
      <ThemedText style={[{}, styles.title]}>
        {pre}
        <ThemedText style={{color: rightColor, fontWeight: 'bold'}}>
          {mid}
        </ThemedText>
        {suf}
      </ThemedText>
    )
  }, [item])

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
          {matchingTitle}
          {description ? (
            <ThemedText style={[{}, styles.description]}>
              {description}
            </ThemedText>
          ) : null}
        </ThemedView>
        <FadeInView style={styles.right}>
          {href ? (
            <Feather
              name="chevron-right"
              size={24}
              color={chevronColor}
              style={{paddingLeft: PADDING / 4}}
            />
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
    flexDirection: 'row-reverse',
    ...common_styles.bg_view,
  },
})
