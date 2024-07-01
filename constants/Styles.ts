import { StyleSheet } from 'react-native'
import { Colors } from './Colors'

export const RADIUS = 16

export const PADDING = 16

export const HEIGHT = {
  item: 56,
}

export const TYPO = StyleSheet.create({
  card_value: {
    fontWeight: 'bold',
    fontSize: 22,
    lineHeight: 24,
  },
  card_value_compact: {
    fontWeight: 'bold',
    fontSize: 20,
    lineHeight: 22,
  },
  title: {
    fontSize: 30,
    lineHeight: 32,
    fontWeight: 'bold',
  },
  title_compact: {
    fontSize: 24,
    lineHeight: 26,
    fontWeight: 'bold',
  },
  title_mini: {
    fontSize: 20,
    lineHeight: 22,
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
