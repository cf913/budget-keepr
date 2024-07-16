import React from 'react'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import Padder from '@/components/Layout/Padder'
import { Loader } from '@/components/Loader'
import { TYPO } from '@/constants/Styles'

interface ListFooterProps {
  isFetchingNextPage: boolean
  hasNextPage: boolean | undefined
}

const ListFooter: React.FC<ListFooterProps> = ({
  isFetchingNextPage,
  hasNextPage,
}) => {
  if (isFetchingNextPage) {
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
        <ThemedText style={TYPO.small}>You're up to date</ThemedText>
        <Padder />
      </ThemedView>
    )
  }

  return null
}

export default React.memo(ListFooter)
