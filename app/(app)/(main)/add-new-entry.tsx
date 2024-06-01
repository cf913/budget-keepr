import {StyleSheet, Modal, Pressable} from 'react-native'
import {ThemedView} from '@/components/ThemedView'
import {ReactNode, useState} from 'react'
import {ThemedText} from '@/components/ThemedText'
import {MaterialIcons} from '@expo/vector-icons'
import Page from '@/components/Layout/Page'
import ThemedInput from '@/components/Inputs/ThemedInput'

export default function AddNewEntry({
  isVisible,
  children,
  onClose,
}: {
  isVisible: boolean
  children: ReactNode
  onClose: () => void
}) {
  const [name, setName] = useState<string>('')
  return (
    <Page title="Add New Entry">
      <ThemedView>{children}</ThemedView>
      <ThemedText>the value: {name}</ThemedText>
      <ThemedInput
        value={name}
        onChangeText={(value: any) => {
          setName(value)
        }}
      />
    </Page>
  )
}

const styles = StyleSheet.create({
  title: {
    color: '#fff',
    fontSize: 16,
  },
})
