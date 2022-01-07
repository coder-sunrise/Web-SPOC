import { createListViewModel } from 'medisys-model'
import { notification } from '@/components'
import service from '../services'

export default createListViewModel({
  namespace: 'collectSpecimen',
  config: {},
  param: {
    service,
    state: {},
    setting: {},
    subscriptions: ({ dispatch, history }) => {},
    effects: {
      *getVisitLabWorkitems({ payload }, { call, put }) {
        const r = yield call(service.queryVisitLabWorkitems, payload)
        const { status, data } = r

        if (status === '200') {
          if (data) {
            const visitLabWorkitems = data
            return visitLabWorkitems
          }
          return null
        }
      },
      *upsertSpecimen({ payload }, { call, put }) {
        console.log('lab-module logs: upsertSpecimen', payload)
        const r = yield call(service.upsertSpecimen, payload)

        if (r && r.status === '200') {
          notification.success({ message: 'Saved' })
          return true
        }
        return r
      },
    },

    reducers: {},
  },
})
