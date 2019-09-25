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
module.exports = {
  // remove: (params) => service.remove(url, params),
  // query: (params) => service.query(url, params),
  queryList: (params) => service.queryList(getUrl(), params),
  upsert: (params) => service.upsert(getUrl(), params),
}
