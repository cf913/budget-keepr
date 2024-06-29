import { RecurringUpdateType } from "@/app/(app)/settings/recurring";
import { RecurringUpdateInput, getRecurrings } from "@/data/recurring";
import { useLocalSettings } from "@/stores/localSettings";
import { useQuery } from "@tanstack/react-query";
import { forwardRef, useImperativeHandle } from "react";
import RecurringList from "../RecurringList";
import { Loader } from "../Loader";

export type RecurringListActiveProps = {
  onDelete: (id: string) => void
  onUpdate: (recurringType: RecurringUpdateType, recurring: RecurringUpdateInput) => void
}

const RecurringListActive = forwardRef(({
  onDelete,
  onUpdate,
}: RecurringListActiveProps, ref) => {

  const { defaultBudget } = useLocalSettings()

  const { data, error, refetch, isLoading } = useQuery({
    queryKey: ['recurringActive'],
    queryFn: () => getRecurrings(defaultBudget?.id, { archived: false }),
  })

  useImperativeHandle(ref, () => ({
    refetch,
  }), [])

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
})

export default RecurringListActive
