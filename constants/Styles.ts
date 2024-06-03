import {StyleSheet} from 'react-native'
import {Colors} from './Colors'

export const RADIUS = 12

export const PADDING = 16

export const HEIGHT = {
  item: 56,
}

export const TYPO = StyleSheet.create({
  title: {
    fontSize: 30,
    lineHeight: 32,
    fontWeight: 'bold',
  },
  small: {
    fontSize: 11,
    lineHeight: 13,
  },
})

export const STYLES = StyleSheet.create({
  border: {
    borderWidth: 2,
    borderColor: 'red',
  },
  shadow: {
    shadowColor: Colors.dark.tint,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 50,
    elevation: 24,
  },
})
