import Padder from '@/components/Layout/Padder'
import { ThemedText } from '@/components/ThemedText'
import { TYPO } from '@/constants/Styles'
import { toMoney } from '@/utils/helpers'
import dayjs from 'dayjs'
import List from './../Lists/List'
import ListItem from './../Lists/ListItem'

export default function EntryPreview({ subCategory, amount }: any) {
  return subCategory ? (
    <>
      <ThemedText
        style={{
          // fontWeight: 'bold',
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
          description={dayjs().format('HH:mm - ddd D MMM')}
          category={subCategory.category}
          // description={entry.categories.name}
          right={toMoney(+amount * 100)}
        />
      </List>
    </>
  ) : null
}
