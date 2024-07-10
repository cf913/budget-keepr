import { Feather } from '@expo/vector-icons'
import { router } from 'expo-router'
import { ThemedButton } from '../Buttons/ThemedButton'
import Footer from '../Layout/Footer'
import { AnimatedView, ThemedView } from '../ThemedView'
import { useThemeColor } from '@/hooks/useThemeColor'
import { Fragment, useState } from 'react'
import { Easing, FadeIn, FadeOut, SlideInDown, useAnimatedStyle, useSharedValue, withDecay } from 'react-native-reanimated'
import { Pressable, useWindowDimensions } from 'react-native'
import SelectBudget from '../Selects/SelectBudget'
import { PADDING, RADIUS, TYPO } from '@/constants/Styles'
import { BlurView } from 'expo-blur'
import { ThemedText } from '../ThemedText'
import Content from '../Layout/Content'
import Padder from '../Layout/Padder'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'

export default function HomePageFooter() {
  const offset = useSharedValue(0)
  const { width, height } = useWindowDimensions()
  // state
  const [showMenu, setShowMenu] = useState(false)
  const [showBlur, setShowBlur] = useState(false)

  // colors
  const textColor = useThemeColor({}, 'text')

  const toggleMenu = () => {
    if (!showMenu) {
      // show both at the same time on open
      setShowMenu(true)
      setShowBlur(true)
    } else {
      // hide menu, then hide blur
      setShowMenu(false)
      setTimeout(() => setShowBlur(false), 51)
    }
  }

  const pan = Gesture.Pan()
    .onBegin(() => { })
    .onChange(event => {
      offset.value += event.changeY
    })
    .onEnd(() => { })
    .onFinalize((event) => {
      offset.value = withDecay({
        velocity: event.velocityY,
        rubberBandEffect: true,
        clamp: [
          0,
          0
        ],
      })
    })

  const entering = SlideInDown.duration(200).easing(Easing.out(Easing.ease))
  const exiting = FadeOut.duration(50).easing(Easing.inOut(Easing.quad))

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: offset.value }]
  }))

  return (
    <Fragment>
      {showBlur ? (
        <AnimatedView
          entering={FadeIn.duration(150).easing(Easing.inOut(Easing.quad))}
          exiting={exiting}
          style={{
            height,
            width,
            backgroundColor: 'transparent',
            position: 'absolute',
            bottom: 0,
            left: 0,
            pointerEvents: 'none',
            zIndex: 97,
          }}
        >
          <BlurView
            style={{ flex: 1 }}
          ></BlurView>
        </AnimatedView>
      ) : null}
      {showBlur ? (
        <Pressable onPress={toggleMenu}>
          <ThemedView
            style={{
              height,
              width,
              backgroundColor: 'transparent',
              position: 'absolute',
              bottom: 0,
              left: 0,
              zIndex: 97,
            }}
          >
          </ThemedView>
        </Pressable>
      ) : null}
      <Footer>
        <GestureDetector gesture={pan}>
          <ThemedView
            style={{
              backgroundColor: 'transparent',
            }}
          >
            {/* TOGGLEABLE MENU TOP */}
            {showMenu ? (
              <AnimatedView
                entering={entering}
                style={{
                  paddingVertical: PADDING,
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  backgroundColor: 'transparent',
                  ...animatedStyle
                }}
              >
                <ThemedView
                  style={{
                    paddingVertical: PADDING,
                    flex: 1,
                    borderRadius: RADIUS + 4
                  }}
                >
                  <Content>
                    <ThemedText style={{ ...TYPO.title_mini, textAlign: 'center' }}>Default Budget</ThemedText>
                    <Padder h={.5} />
                  </Content>
                  <SelectBudget callback={toggleMenu} />
                </ThemedView>
              </AnimatedView>
            ) : null}
            {/* MENU BOTTOM */}
            {!showMenu ? <ThemedView
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                backgroundColor: 'transparent',
              }}
            >
              <ThemedButton
                round
                icon={<Feather name="list" size={24} color={textColor} />}
                onPress={toggleMenu}
                title="BUDGET"
                style={{ zIndex: 99 }}
              ></ThemedButton>
              <ThemedButton
                round
                onPress={() => router.navigate('add-new-entry')}
                title="ADD NEW ENTRY"
                style={{ zIndex: 95 }}
              ></ThemedButton>
            </ThemedView> : null}
          </ThemedView>
        </GestureDetector>
      </Footer>
    </Fragment>
  )
}
