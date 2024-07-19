import { Loader } from '@/components/Loader'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { TYPO } from '@/constants/Styles'
import React from 'react'
import { Padder } from '../Layout'

interface ListEmptyProps {
  isLoading: boolean
  hasNextPage: boolean | undefined
  text?: string
}

const ListEmpty: React.FC<ListEmptyProps> = ({
  isLoading,
  hasNextPage,
  text = 'No data found',
}) => {
  if (isLoading) {
    return (
      <ThemedView>
        <Padder />
        <Loader />
        <Padder />
      </ThemedView>
    )
  }

  if (!hasNextPage) {
    return (
      <ThemedView style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Padder />
        <ThemedText style={TYPO.small}>{text}</ThemedText>
        <Padder />
      </ThemedView>
    )
  }

  return null
}

export default React.memo(ListEmpty)
