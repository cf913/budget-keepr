
import { RecurringUpdateType } from "@/app/(app)/settings/recurring";
import { RecurringUpdateInput, getRecurrings } from "@/data/recurring";
import { useLocalSettings } from "@/stores/localSettings";
import { useQuery } from "@tanstack/react-query";
import { forwardRef, useImperativeHandle } from "react";
import RecurringList from "../RecurringList";
import { Loader } from "../Loader";

export type RecurringListArchivedProps = {
  onDelete: (id: string) => void
  onUpdate: (recurringType: RecurringUpdateType, recurring: RecurringUpdateInput) => void
}

const RecurringListArchived = forwardRef(({
  onDelete,
  onUpdate,
}: RecurringListArchivedProps, ref) => {

  const { defaultBudget } = useLocalSettings()

  const { data, error, refetch, isLoading } = useQuery({
    queryKey: ['recurringArchived'],
    queryFn: () => getRecurrings(defaultBudget?.id, { archived: true }),
  })

  useImperativeHandle(ref, () => ({
    refetch,
  }), [])

  if (error) {
    console.log('error', error.message)
    alert('Oops. ' + error.message)
  }

  if (!data || data?.length === 0) {
    return null
  }

  if (isLoading) {
    return <Loader />
  }

  return (
    <RecurringList
      title="Archived"
      data={data}
      onDelete={onDelete}
      onUpdate={onUpdate}
      isLoading={isLoading}
      error={error}
    />
  )
})

export default RecurringListArchived
