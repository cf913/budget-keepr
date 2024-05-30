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
