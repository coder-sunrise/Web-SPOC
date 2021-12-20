import { createListViewModel } from 'medisys-model'
import moment from 'moment'
import _ from 'lodash'
import { CALENDAR_RESOURCE } from '@/utils/constants'
import service from '../services'

export default createListViewModel({
  namespace: 'settingResource',
  codetable: {
    message: 'Resource updated',
    code: 'ctresource',
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
        calendarResource: {
          resourceType: CALENDAR_RESOURCE.RESOURCE,
          ctCalendarResourceCapacity: [],
        },
      },
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (loct, method) => {
        const { pathname, search, query = {} } = loct
      })
    },
    effects: {
      *queryOne({ payload }, { call, put }) {
        const result = yield call(service.query, payload)
        if (result && result.status === '200') {
          yield put({ type: 'queryOneDone', payload: result })
          return true
        }

        return false
      },
    },
    reducers: {
      queryDone(st, { payload }) {
        const { data } = payload

        return {
          ...st,
          list: data.data.map(o => {
            return {
              ...o,
              effectiveDates: [o.effectiveStartDate, o.effectiveEndDate],
            }
          }),
        }
      },
      queryOneDone(st, { payload }) {
        const { data } = payload
        const ctCalendarResourceCapacity = _.orderBy(
          data.calendarResource.ctCalendarResourceCapacity,
          ['startTime'],
          ['asc'],
        )
        return {
          ...st,
          entity: {
            ...data,
            effectiveDates: [data.effectiveStartDate, data.effectiveEndDate],
            calendarResource: {
              ...data.calendarResource,
              ctCalendarResourceCapacity: [...ctCalendarResourceCapacity],
              oldCtCalendarResourceCapacity: [...ctCalendarResourceCapacity],
            },
          },
        }
      },
    },
  },
})
