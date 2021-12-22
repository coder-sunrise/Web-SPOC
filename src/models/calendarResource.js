import { createListViewModel } from 'medisys-model'
import moment from 'moment'
import _ from 'lodash'
import { CALENDAR_RESOURCE } from '@/utils/constants'
import { getUniqueId } from '@/utils/utils'
import service from '@/services/calendarResource'

export default createListViewModel({
  namespace: 'calendarResource',
  param: {
    service,
    state: {
      default: {
        dailyCapacity: [],
      },
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (loct, method) => {
        const { pathname, search, query = {} } = loct
      })
    },
    effects: {
      *queryForDailyResource(payload, { put, call }) {
        const result = yield call(
          service.queryForDailyResource,
          payload.payload,
        )
        if (result && result.status === '200') {
          let dailyCapacity = []
          const resourceCapacity = _.orderBy(
            result.data.ctCalendarResourceCapacity,
            'startTime',
            ['asc'],
          )
          resourceCapacity.forEach((csc, index) => {
            if (csc.ctCalendarResourceDailyCapacityDto.length) {
              dailyCapacity = dailyCapacity.concat(
                csc.ctCalendarResourceDailyCapacityDto.map(c => {
                  return {
                    ...c,
                    uid: getUniqueId(),
                    countNumber: index === 0 ? 1 : 0,
                    rowSpan: index === 0 ? resourceCapacity.length : 0,
                  }
                }),
              )
            }
          })
          dailyCapacity = _.orderBy(
            dailyCapacity,
            ['dailyDate', 'startTime'],
            ['asc'],
          )
          yield put({
            type: 'updateState',
            payload: {
              entity: { ...result.data, dailyCapacity },
            },
          })
        }
        return result
      },
    },
    reducers: {
      queryDone(st, { payload }) {
        const { data } = payload

        return {
          ...st,
        }
      },
    },
  },
})
