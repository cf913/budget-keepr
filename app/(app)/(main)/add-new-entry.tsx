import {StyleSheet, Modal, Pressable} from 'react-native'
import {ThemedView} from '@/components/ThemedView'
import {ReactNode} from 'react'
import {ThemedText} from '@/components/ThemedText'
import {MaterialIcons} from '@expo/vector-icons'
import Page from '@/components/Layout/Page'

export default function AddNewEntry({
  isVisible,
  children,
  onClose,
}: {
  isVisible: boolean
  children: ReactNode
  onClose: () => void
}) {
  return (
    <Page>
      <ThemedView style={styles.modalContent}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText style={styles.title}>Add New Entry</ThemedText>
          <Pressable onPress={onClose} hitSlop={30} style={{zIndex: 2}}>
            <MaterialIcons name="close" color="#fff" size={22} />
          </Pressable>
        </ThemedView>
        {children}
      </ThemedView>
    </Page>
  )
}

const styles = StyleSheet.create({
  modalContent: {
    height: '75%',
    width: '100%',
    backgroundColor: '#25292e',
    borderTopRightRadius: 18,
    borderTopLeftRadius: 18,
    position: 'absolute',
    bottom: 0,
  },
  titleContainer: {
    height: 40,
    backgroundColor: '#464C55',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: '#fff',
    fontSize: 16,
  },
})
