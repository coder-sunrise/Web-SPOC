import * as service from '../services/workitem'
import { createBasicModel } from 'medisys-model'
export default createBasicModel({
  namespace: 'workitem',
  param: {
    state: [],
    effects: {
      *getResultDetails({ payload }, { call, put, select }) {
        console.log(1)
        const r = yield call(service.queryResultDetails, payload)
        const { status, data = [] } = r
        if (status === '200') return data
        return []
      },
    },
  },
})
