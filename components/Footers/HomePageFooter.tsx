import { Feather } from '@expo/vector-icons'
import { router } from 'expo-router'
import { ThemedButton } from '../Buttons/ThemedButton'
import Footer from '../Layout/Footer'
import { AnimatedView, ThemedView } from '../ThemedView'
import { useThemeColor } from '@/hooks/useThemeColor'
import { Fragment, useState } from 'react'
import { Easing, FadeIn, FadeOut, SlideInDown } from 'react-native-reanimated'
import { Pressable, useWindowDimensions } from 'react-native'
import SelectBudget from '../Selects/SelectBudget'
import { PADDING, RADIUS, TYPO } from '@/constants/Styles'
import { BlurView } from 'expo-blur'
import { ThemedText } from '../ThemedText'
import Content from '../Layout/Content'
import Padder from '../Layout/Padder'

export default function HomePageFooter() {
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

  const entering = FadeIn.duration(100).easing(Easing.inOut(Easing.quad))
  const exiting = FadeOut.duration(50).easing(Easing.inOut(Easing.quad))

  return (
    <Fragment>
      {showBlur ? (
        <AnimatedView
          entering={FadeIn.duration(200).easing(Easing.inOut(Easing.quad))}
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
        <ThemedView
          style={{
            backgroundColor: 'transparent',
          }}
        >
          {/* TOGGLEABLE MENU TOP */}
          {showMenu ? (
            <AnimatedView
              // entering={SlideInDown.duration(200).easing(Easing.inOut(Easing.quad))}
              entering={entering}
              style={{
                paddingVertical: PADDING,
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                backgroundColor: 'transparent',
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
                <SelectBudget callback={() => setTimeout(toggleMenu, 200)} />
              </ThemedView>
            </AnimatedView>
          ) : null}
          {/* MENU BOTTOM */}
          <ThemedView
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
          </ThemedView>
        </ThemedView>
      </Footer>
    </Fragment>
  )
}
