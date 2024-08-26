import { HEIGHT, PADDING, RADIUS, TYPO } from '@/constants/Styles'
import { useThemeColor } from '@/hooks/useThemeColor'
import { Feather } from '@expo/vector-icons'
import { Link } from 'expo-router'
import { ReactNode } from 'react'
import { Pressable, StyleSheet } from 'react-native'
import { FadeIn } from 'react-native-reanimated'
import { Padder } from '../Layout'
import { Category } from '../RecentEntries'
import { ThemedText } from '../ThemedText'
import { AnimatedView, ThemedView } from '../ThemedView'

const Wrapper = ({
  href,
  replace,
  onSelectItem,
  children,
}: {
  href?: string
  replace?: boolean
  onSelectItem: (item: any) => void
  children: ReactNode
}) => {
  if (href)
    return (
      <Link href={href} asChild replace={replace}>
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
  replace = false,
  showHrefIcon = true,
  title,
  description,
  category,
  lastItem = false,
  firstItem = false,
  checked = false,
  right,
  rightColorOverride,
}: {
  item?: any
  onSelect?: (item: any) => void
  href?: string
  replace?: boolean
  showHrefIcon?: boolean
  title: string
  description?: string | null
  category?: Category
  lastItem?: boolean
  firstItem?: boolean
  checked?: boolean
  right?: string | number
  rightColorOverride?: string
}) {
  const backgroundColor = useThemeColor({}, 'bg_secondary')
  const borderColor = useThemeColor({}, 'mid2')
  const chevronColor = useThemeColor({}, 'mid')
  const rightColor = useThemeColor(
    { light: rightColorOverride, dark: rightColorOverride },
    'tint',
  )

  const onSelectItem = () => (onSelect ? onSelect(item) : null)

  return (
    <Wrapper href={href} onSelectItem={onSelectItem} replace={replace}>
      <ThemedView
        style={[
          styles.container,
          firstItem
            ? { borderTopLeftRadius: RADIUS, borderTopRightRadius: RADIUS }
            : undefined,
          lastItem
            ? {
              borderBottomLeftRadius: RADIUS,
              borderBottomRightRadius: RADIUS,
            }
            : undefined,
          {
            backgroundColor,
          },
        ]}
      >
        <ThemedView
          style={{
            backgroundColor: 'transparent',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          {category ? (
            <ThemedView
              style={{
                backgroundColor: category.color,
                flex: 1,
                height: HEIGHT.item,
                maxWidth: 5,
              }}
            ></ThemedView>
          ) : null}
          <Padder w={1} />
          <ThemedView style={[{}, styles.left]}>
            <ThemedText style={[{}, styles.title]}>{title}</ThemedText>
            {description ? (
              <ThemedText
                style={[{}, styles.description]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {description}
              </ThemedText>
            ) : null}
          </ThemedView>
        </ThemedView>
        <AnimatedView entering={FadeIn} style={styles.right}>
          {href && showHrefIcon ? (
            <Feather
              name="chevron-right"
              size={24}
              color={chevronColor}
              style={{ paddingLeft: PADDING / 4 }}
            />
          ) : null}
          {checked ? (
            <Feather
              name="check"
              size={24}
              color={rightColor}
              style={{ paddingLeft: PADDING / 4 }}
            />
          ) : null}
          {right ? (
            <ThemedText style={{ color: rightColor }}>{right}</ThemedText>
          ) : null}
        </AnimatedView>
      </ThemedView>
      {!+lastItem ? (
        <ThemedView
          style={{ width: '100%', height: 1, backgroundColor: borderColor }}
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
    paddingLeft: 0,
    height: HEIGHT.item,
    overflow: 'hidden',
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
