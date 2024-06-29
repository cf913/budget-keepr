import { RecurringUpdateType } from '@/app/(app)/settings/recurring'
import { PADDING, TYPO } from '@/constants/Styles'
import { Recurring, RecurringUpdateInput } from '@/data/recurring'
import { useThemeColor } from '@/hooks/useThemeColor'
import { isLastItem } from '@/utils/helpers'
import { Feather } from '@expo/vector-icons'
import Content from './Layout/Content'
import List from './Lists/List'
import ListItemRecurring from './Lists/ListItemRecurring'
import { Loader } from './Loader'
import { ThemedText } from './ThemedText'
import { ThemedView } from './ThemedView'

export type RecurringListProps = {
  title?: string
  data: Recurring[] | undefined
  onDelete: (id: string) => void
  onUpdate: (
    recurringType: RecurringUpdateType,
    recurring: RecurringUpdateInput,
  ) => void
  isLoading: boolean
  error: Error | null
}

export default function RecurringList({
  title,
  data,
  onDelete,
  onUpdate,
  isLoading,
  error,
}: RecurringListProps) {
  const textColor = useThemeColor({}, 'text')

  return (
    <Content>
      {title ? (
        <ThemedView
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            marginTop: PADDING,
            marginBottom: 10,
          }}
        >
          <Feather name="archive" size={22} color={textColor} />
          <ThemedView style={{ marginLeft: PADDING / 2 }} />
          <ThemedText style={{ ...TYPO.title_compact, marginTop: 3 }}>{title}</ThemedText>
        </ThemedView>
      ) : null}
      {isLoading ? <Loader /> : null}
      {data ? (
        <>
          <List>
            {(data || []).map((recurring, i) => {
              return (
                <ListItemRecurring
                  key={recurring.id}
                  recurring={recurring}
                  onDelete={onDelete}
                  onUpdate={onUpdate}
                  lastItem={isLastItem(data, i)}
                />
              )
            })}
          </List>
        </>
      ) : null}

      {data && !data.length ? (
        <ThemedText>
          Looks like you don't have any recurring at this very point in time.
          Nice 💪
        </ThemedText>
      ) : null}
      {error ? <ThemedText>Error: {error.message}</ThemedText> : null}
    </Content>
  )
}
