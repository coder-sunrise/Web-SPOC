import * as service from '@/services/common'
import moment from 'moment'

const url = '/api/ctcalendarresource'

const fns = {
  // remove: (params) => service.remove(url, params),
  query: params => service.query(url, params),
  queryForDailyResource: params =>
    service.query(
      `${url}/DailyResource/${params.id}?dateFrom=${moment(
        params.dateFrom,
      ).format('YYYY-MMM-DD HH:mm:ss')}&dateTo=${moment(params.dateTo).format(
        'YYYY-MMM-DD HH:mm:ss',
      )}`,
      {},
    ),
  queryList: params => service.queryList(url, params),
  upsert: params => service.upsert(url, params),
}

export default fns
