import { queryFakeList, fakeSubmitForm } from '@/services/api'
import { createFormViewModel } from 'medisys-model'
// import * as service from '../services'

export default createFormViewModel({
  namespace: 'purchaseOrder',
  config: {
    queryOnLoad: false,
  },
  param: {
    // service,
    state: {
      currentTab: 0,
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen((loct, method) => {
        const { pathname, query = {} } = loct
        if (pathname === '/inventory/pd/Detail') {
          dispatch({
            type: 'updateState',
            payload: {
              currentTab: Number(query.t) || 0,
            },
          })
        }
      })
    },
    effects: {},
    reducers: {},
  },
})
