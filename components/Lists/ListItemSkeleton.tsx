import {useThemeColor} from '@/hooks/useThemeColor'
import {ThemedText} from '../ThemedText'
import {ThemedView} from '../ThemedView'
import {StyleSheet} from 'react-native'
import {HEIGHT, PADDING, TYPO} from '@/constants/Styles'
import FadeInView from '../FadeInView'

export default function ListItemSkeleton({
  lastItem = false,
}: {
  lastItem?: boolean
}) {
  const backgroundColor = useThemeColor({}, 'bg_secondary')
  const borderColor = useThemeColor({}, 'bg')
  const chevronColor = useThemeColor({}, 'mid')
  const rightColor = useThemeColor({}, 'tint')

  return (
    <ThemedView
      style={[
        styles.container,
        {backgroundColor, borderColor, borderBottomWidth: +!lastItem},
      ]}
    >
      <FadeInView style={styles.left}>
        <ThemedText
          style={[
            {
              overflow: 'hidden',
              borderRadius: 5,
              backgroundColor: chevronColor,
              color: chevronColor,
              marginBottom: 6,
            },
            styles.title,
          ]}
        >
          skeleskeleton ton skeleton
        </ThemedText>
        <ThemedText
          style={[
            {
              overflow: 'hidden',
              borderRadius: 5,
              backgroundColor: chevronColor,
              color: chevronColor,
              height: 10,
              width: 40,
            },
            styles.description,
          ]}
        >
          skeleton
        </ThemedText>
      </FadeInView>
      <ThemedView style={[{borderRadius: 5, overflow: 'hidden'}, styles.right]}>
        <FadeInView style={{}}>
          <ThemedText
            style={{
              borderRadius: 5,
              color: rightColor,
              backgroundColor: rightColor,
            }}
          >
            skeleton
          </ThemedText>
        </FadeInView>
      </ThemedView>
    </ThemedView>
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
    paddingVertical: 2,
  },
  right: {
    ...common_styles.bg_view,
  },
})
