import * as service from '@/services/common'

const getUrl = () => {
  // const pathname = window.location.pathname.trim().toLowerCase()

  // const url =
  //   pathname == '/setting/smstemplate'
  //     ? '/api/smstemplate'
  //     : '/api/CTReferralLetterTemplate'

  const url = '/api/DocumentTemplate'

  return url
}
const fns = {
  queryList: params =>
    service.queryList(
      getUrl(),
      (() => {
        if (params?.sorting?.length === 0)
          return {
            ...params,
            sorting: [{ columnName: 'displayValue', direction: 'asc' }],
          }
        return params
      })(),
    ),
  query: params => service.query(getUrl(), params),
  upsert: params => service.upsert(getUrl(), params),
} 

export default fns
