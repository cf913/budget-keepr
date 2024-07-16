import React from 'react'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import Padder from '@/components/Layout/Padder'
import { Loader } from '@/components/Loader'
import { TYPO } from '@/constants/Styles'

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
