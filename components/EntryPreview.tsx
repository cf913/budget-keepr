import Padder from '@/components/Layout/Padder'
import { ThemedText } from '@/components/ThemedText'
import { TYPO } from '@/constants/Styles'
import { toMoney } from '@/utils/helpers'
import dayjs from 'dayjs'
import List from './Lists/List'
import ListItem from './Lists/ListItem'

export default function EntryPreview({ subCategory, amount }: any) {
  return (
    subCategory ? (
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
        <Padder />
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
        <Padder h={0.5} />
        <ThemedText
          style={{ opacity: 0.3, ...TYPO.small, textAlign: 'justify' }}
        >
          Please make sure the values above look correct. The DELETE entries
          feature has not been implemented yet. A mistake here will follow
          you forever and you might end up filled with regrets for not
          having double checked your entry. Do the right thing. It only
          takes a couple seconds. Sorry for the inconvenience.
        </ThemedText>
      </>
    ) : null
  )
}
