import router from 'umi/router'
import _ from 'lodash'
import { createFormViewModel } from 'medisys-model'
import * as service from '../services/consultation'
import { getRemovedUrl, getAppendUrl, getUniqueId } from '@/utils/utils'
import { consultationDocumentTypes, orderTypes } from '@/utils/codes'
import { sendNotification } from '@/utils/realtime'

export default createFormViewModel({
  namespace: 'consultation',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      default: {
        corAttachment: [],
        corPatientNoteVitalSign: [],
      },
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
          sendNotification('QueueListing', {
            message: `Consultation started`,
          })
          yield put({
            type: 'query',
            payload: id,
          })
        }
      },
      *pause ({ payload }, { call, put }) {
        const response = yield call(service.pause, payload)
        if (response) {
          sendNotification('QueueListing', {
            message: `Consultation paused`,
          })
        }
        return response
      },
      *resume ({ payload }, { call, put }) {
        const response = yield call(service.resume, payload)
        // if (response) {
        //   sendNotification('QueueListing', {
        //     message: `Consultation resumed`,
        //   })
        // }
        return response
      },
      *edit ({ payload }, { call, put }) {
        const response = yield call(service.edit, payload)

        return response
      },
      *sign ({ payload }, { call, put }) {
        const response = yield call(service.sign, payload)
        if (response) {
          sendNotification('QueueListing', {
            message: `Consultation signed`,
          })
        }
        return response
      },
      *discard ({ payload }, { call, put }) {
        const response = yield call(service.delete, payload)
        if (response) {
          sendNotification('QueueListing', {
            message: `Consultation discarded`,
          })
        }
        return response
      },
      *closeConsultationModal ({ payload }, { call, put }) {
        router.push(
          getRemovedUrl([
            'md2',
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
        router.push('/reception/queue')
      },
      *queryDone ({ payload }, { call, put, select }) {
        console.log('queryDone', payload)
        const { data } = payload
        let cdRows = []
        consultationDocumentTypes.forEach((p) => {
          cdRows = cdRows.concat(
            (data[p.prop] || []).map((o) => {
              const d = {
                uid: getUniqueId(),
                type: p.value,
                subject: p.getSubject ? p.getSubject(o) : '',
                ...o,
              }
              return p.convert ? p.convert(d) : d
            }),
          )
        })
        yield put({
          type: 'consultationDocument/updateState',
          payload: {
            rows: _.sortBy(cdRows, 'sequence'),
          },
        })

        let oRows = []
        orderTypes.forEach((p) => {
          const datas =
            (p.filter ? data[p.prop].filter(p.filter) : data[p.prop]) || []
          console.log('orderTypes', datas)
          oRows = oRows.concat(
            datas.map((o) => {
              const d = {
                uid: getUniqueId(),
                editType: p.value,
                subject: p.getSubject ? p.getSubject(o) : '',
                ...o,
              }
              return p.convert ? p.convert(d) : d
            }),
          )
        })
        console.log(cdRows)
        yield put({
          type: 'orders/updateState',
          payload: {
            rows: _.sortBy(oRows, 'sequence'),
          },
        })

        return payload
      },
      // *submit ({ payload }, { call }) {
      //   // console.log(payload)
      //   return yield call(service.upsert, payload)
      // },
    },
    reducers: {},
  },
})
