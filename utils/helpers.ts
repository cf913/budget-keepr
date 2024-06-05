//////////// HELPERS
export const logRes = (funcName: string, data: any, error: any) => {
  if (data) {
    console.log('========= ' + funcName + ' DATA ==========')
    console.log(JSON.stringify(data, null, 2))
  }
  if (error) {
    console.log('========== ' + funcName + ' ERROR =========')
    console.log(JSON.stringify(error, null, 2))
  }
}

export const getFirstName = (fullName?: string) => {
  if (!fullName) return ''

  const name = fullName.split(' ')
  const firstName = name[0]

  if (!firstName) return ''

  return firstName
}

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'AUD',

  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
})

export const toMoney = (cents: number, round?: boolean) => {
  const res = formatter.format(cents / 100)
  return round ? res.slice(0, -3) : res
}

export const isLastItem = (arr: any[], index: number) => {
  if (!arr) return false
  return index === arr.length - 1
}

export const getWeekNumber = (date?: Date) => {
  const actualDate = date || new Date()
  var d = new Date(
    Date.UTC(
      actualDate.getFullYear(),
      actualDate.getMonth(),
      actualDate.getDate(),
    ),
  )
  var dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
}
