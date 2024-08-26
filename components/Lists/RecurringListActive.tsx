import { RecurringUpdateType } from '@/app/(app)/(main)/recurrings'
import { RecurringUpdateInput, getRecurrings } from '@/data/recurring'
import { useQuery } from '@tanstack/react-query'
import { forwardRef, useImperativeHandle } from 'react'
import { Loader } from '../Loader'
import RecurringList from '../RecurringList'
export type RecurringListActiveProps = {
  onDelete: (id: string) => void
  onUpdate: (
    recurringType: RecurringUpdateType,
    recurring: RecurringUpdateInput,
  ) => void
}

const RecurringListActive = forwardRef(
  ({ onDelete, onUpdate }: RecurringListActiveProps, ref) => {
    const { data, error, refetch, isLoading } = useQuery({
      queryKey: ['recurringActive'],
      queryFn: () => getRecurrings(undefined, { archived: false }),
    })

    useImperativeHandle(
      ref,
      () => ({
        refetch,
      }),
      [],
    )

    if (error) {
      console.log('error', error.message)
      alert('Oops. ' + error.message)
    }

    if (isLoading) {
      return <Loader />
    }

    return (
      <RecurringList
        data={data}
        onDelete={onDelete}
        onUpdate={onUpdate}
        isLoading={isLoading}
        error={error}
      />
    )
  },
)

export default RecurringListActive
