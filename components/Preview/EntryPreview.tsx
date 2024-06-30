import Padder from '@/components/Layout/Padder'
import { ThemedText } from '@/components/ThemedText'
import { TYPO } from '@/constants/Styles'
import { toMoney } from '@/utils/helpers'
import dayjs from 'dayjs'
import { SubCategory } from '../RecentEntries'
import List from './../Lists/List'
import ListItem from './../Lists/ListItem'

type EntryPreviewProps = {
  subCategory: null | SubCategory
  amount: string
  description?: string
}

export default function EntryPreview({ subCategory, amount, description }: EntryPreviewProps) {
  return subCategory ? (
    <>
      <ThemedText
        style={{
          textAlign: 'center',
          letterSpacing: 3,
          ...TYPO.small,
        }}
      >
        PREVIEW
      </ThemedText>
      <Padder h={0.5} />
      <List>
        <ListItem
          lastItem
          title={subCategory.name}
          description={description ? description : dayjs().format('HH:mm - ddd D MMM')}
          category={subCategory.category}
          right={toMoney(+amount * 100)}
        />
      </List>
    </>
  ) : null
}
