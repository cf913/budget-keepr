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

export const toMoney = (cents: number) => {
  return formatter.format(cents / 100)
}
