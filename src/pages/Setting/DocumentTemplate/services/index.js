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
  // remove: (params) => service.remove(url, params),
  // query: (params) => service.query(url, params),
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
  upsert: params => service.upsert(getUrl(), params),
}

export default fns
