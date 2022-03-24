import * as service from '../services/workitem'
import { createBasicModel } from 'medisys-model'
export default createBasicModel({
  namespace: 'workitem',
  param: {
    state: [],
    effects: {
      *getResultDetails({ payload }, { call, put, select }) {
        const r = yield call(service.queryResultDetails, payload)
        const { status, data = [] } = r
        if (status === '200') return data
        return []
      },
      *getTestPanelItemWithRefRange({ payload }, { call, put, select }) {
        const r = yield call(service.getTestPanelItemWithRefRange, payload)
        const { status, data = [] } = r
        if (status === '200') return data
        return []
      },
      *getLabResults({ payload }, { call, put, select }) {
        const r = yield call(service.getLabResults, payload)
        const { status, data = [] } = r
        if (status === '200') return data
        return []
      },
    },
  },
})
