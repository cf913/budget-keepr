import {PADDING} from '@/constants/Styles'
import {ThemedView} from '@/components/ThemedView'
import {ReactNode} from 'react'

export default function Content({children}: {children: ReactNode}) {
  return (
    <ThemedView style={{paddingHorizontal: PADDING}}>{children}</ThemedView>
  )
}
