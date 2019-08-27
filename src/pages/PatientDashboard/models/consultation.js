import router from 'umi/router'

import { createFormViewModel } from 'medisys-model'
import * as service from '../services/consultation'
import { getRemovedUrl, getAppendUrl } from '@/utils/utils'

export default createFormViewModel({
  namespace: 'consultation',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      selectedWidgets: [
        '1',
      ],
    },
    subscriptions: ({ dispatch, history }) => {
      // history.listen(async (loct, method) => {
      //   const { pathname, search, query = {} } = loct
      //   if (query.md === 'cons') {
      //     dispatch({
      //       type: 'updateState',
      //       payload: {
      //         queueID: Number(query.qid),
      //       },
      //     })
      //   }
      // })
    },
    effects: {
      *newConsultation ({ payload }, { call, put }) {
        // console.log(22, payload)
        const response = yield call(service.create, payload)
        // console.log(11, response)
        const { id } = response
        if (id) {
          yield put({
            type: 'query',
            payload: id,
          })
        }
      },
      *pause ({ payload }, { call, put }) {
        const response = yield call(service.pause, payload)
        return response
      },
      *resume ({ payload }, { call, put }) {
        const response = yield call(service.resume, payload)
        return response
      },
      *sign ({ payload }, { call, put }) {
        const response = yield call(service.sign, payload)
        return response
      },
      *closeConsultationModal ({ payload }, { call, put }) {
        router.push(
          getRemovedUrl([
            'md',
            'cmt',
            // 'pid',
            'new',
          ]),
        )
        yield put({
          type: 'updateState',
          payload: {
            entity: undefined,
          },
        })
        yield put({
          type: 'global/updateAppState',
          payload: {
            disableSave: false,
            showConsultationPanel: false,
            fullscreen: false,
          },
        })
      },
      // *queryOne ({ payload }, { call, put }) {
      //   const response = yield call(service.query, payload)
      //   yield put({
      //     type: 'updateState',
      //     payload: {
      //       entity: response.data,
      //     },
      //   })
      //   return response.data
      // },
      // *submit ({ payload }, { call }) {
      //   // console.log(payload)
      //   return yield call(service.upsert, payload)
      // },
    },
    reducers: {},
  },
})
