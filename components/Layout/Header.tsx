import { Pressable, ViewProps } from 'react-native'
import { router } from 'expo-router'
import { Feather } from '@expo/vector-icons'
import { useThemeColor } from '@/hooks/useThemeColor'
import {
  FadeInLeft,
  FadeInRight,
  FadeOut,
  FadeOutRight,
} from 'react-native-reanimated'
import { AnimatedView, ThemedView } from '../ThemedView'
import { ThemedText } from '../ThemedText'
import { Padder } from './Padder'

type HeaderProps = {
  title?: string
  back?: boolean
  down?: boolean
} & ViewProps

export function Header(props: HeaderProps) {
  const { title, back = true, down = false } = props
  const colorMid = useThemeColor({}, 'mid')
  return (
    <ThemedView>
      <Padder />
      <ThemedView style={{ flexDirection: 'row' }}>
        {back || down ? (
          <AnimatedView
            entering={FadeInLeft.duration(400)}
            exiting={FadeOut.duration(100)}
          >
            <Pressable onPress={router.back} hitSlop={30} style={{ zIndex: 2 }}>
              {back ? (
                <Feather
                  name="chevron-left"
                  size={28}
                  color={colorMid}
                  style={{ marginLeft: -10 }}
                />
              ) : (
                <Feather
                  name={'x'}
                  size={28}
                  color={colorMid}
                  style={{ marginLeft: -6, paddingRight: 2 }}
                />
              )}
            </Pressable>
          </AnimatedView>
        ) : null}
        <AnimatedView
          entering={FadeInRight.duration(500)}
          exiting={FadeOutRight}
        >
          <ThemedText type="title">{title}</ThemedText>
        </AnimatedView>
      </ThemedView>
      <Padder />
    </ThemedView>
  )
}
