import { fakeSubmitForm } from '@/services/api'
import { createFormViewModel } from 'medisys-model'
import * as service from '../services'
import { getUniqueGUID } from '@/utils/cdrss'

const { upsert } = service

export default createFormViewModel({
  namespace: 'demographic',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {},
    subscriptions: ({ dispatch, history }) => {},
    effects: {
      *submit ({ payload }, { call }) {
        // console.log(payload)
        return yield call(upsert, payload)
      },
      // const r = await service.query({
      //   id: query.pid,
      // })

      // dispatch({
      //   type: 'demographic/updateState',
      //   payload: {
      //     entity: r,
      //   },
      // })
    },
    reducers: {},
  },
})
