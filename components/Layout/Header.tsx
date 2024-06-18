import {Pressable, ViewProps} from 'react-native'
import {router} from 'expo-router'
import {Feather} from '@expo/vector-icons'
import {useThemeColor} from '@/hooks/useThemeColor'
import {
  FadeInLeft,
  FadeInRight,
  FadeOut,
  FadeOutRight,
} from 'react-native-reanimated'
import {AnimatedView, ThemedView} from '../ThemedView'
import Padder from './Padder'
import {ThemedText} from '../ThemedText'

type HeaderProps = {
  title?: string
  back?: boolean
} & ViewProps

export function Header(props: HeaderProps) {
  const {title, back = true} = props
  const color = useThemeColor({}, 'text')
  const colorMid = useThemeColor({}, 'mid')
  return (
    <ThemedView>
      <Padder />
      <ThemedView style={{flexDirection: 'row'}}>
        {back && (
          <AnimatedView
            entering={FadeInLeft.duration(400)}
            exiting={FadeOut.duration(100)}
          >
            <Pressable onPress={router.back} hitSlop={30} style={{zIndex: 2}}>
              <Feather
                name="chevron-left"
                size={28}
                color={colorMid}
                style={{marginLeft: -10}}
              />
            </Pressable>
          </AnimatedView>
        )}
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
