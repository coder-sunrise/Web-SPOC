import { createListViewModel } from 'medisys-model'
import * as service from '@/services/patient'
// import { convertToQuery } from '@/utils/cdrss'
import { convertToQuery } from '@/utils/utils'

export default createListViewModel({
  namespace: 'patientSearch',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {},
    subscriptions: ({ dispatch, history }) => {
      // history.listen((loct, method) => {
      //   // const { pathname, search, query = {} } = loct
      // })
    },
    effects: {
      *fetchList ({ payload }, { call, put }) {
        const response = yield call(service.queryList)
        console.log('patientsearch/search', response)
        yield put({
          type: 'updateState',
          payload: {
            list: Array.isArray(response) ? response : [],
          },
        })
      },
      *search ({ payload }, { call, put }) {
        // console.log(payload)
        // const response = yield call(service.queryList, payload)
        const prefix = payload.isExactSearch ? 'eql_' : 'like_'
        yield put({
          type: 'query',
          payload: {
            [`${prefix}name`]: payload.search,
            // [`${prefix}refNo`]: payload.search,
          },
        })
      },
      *submit ({ payload }, { call }) {
        return yield call(service.fakeSubmitForm, payload)
      },
    },
    reducers: {},
  },
})
