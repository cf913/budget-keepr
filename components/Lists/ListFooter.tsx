import { Loader } from '@/components/Loader'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { TYPO } from '@/constants/Styles'
import React from 'react'
import { Padder } from '../Layout'

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
