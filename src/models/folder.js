import { createListViewModel } from 'medisys-model'
import moment from 'moment'
import { notification } from '@/components'
import * as service from '../services/folder'

export default createListViewModel({
  namespace: 'folder',
  codetable: {
    message: 'Folder updated',
    code: 'ctfolder',
  },
  param: {
    service,
    state: {
      default: {
        isUserMaintainable: true,
        effectiveDates: [
          moment().formatUTC(),
          moment('2099-12-31T23:59:59').formatUTC(false),
        ],
        description: '',
      },
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (loct, method) => {
        const { pathname, search, query = {} } = loct
      })
    },
    effects: {
      *upsertList ({ payload }, { call, put }) {
        const response = yield call(service.upsertList, payload)
        notification.success({ message: 'Updated.' })
        return response
      },
    },
    reducers: {
      queryDone (st, { payload }) {
        const { data } = payload

        return {
          ...st,
          list: data.data.map((o) => {
            return {
              ...o,
              effectiveDates: [
                o.effectiveStartDate,
                o.effectiveEndDate,
              ],
            }
          }),
        }
      },
    },
  },
})