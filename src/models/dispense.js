import router from 'umi/router'
import _ from 'lodash'
import moment from 'moment'
import { createFormViewModel } from 'medisys-model'
import * as service from '../services/dispense'
import { getRemovedUrl, getAppendUrl, getUniqueId } from '@/utils/utils'
import { consultationDocumentTypes, orderTypes } from '@/utils/codes'
import { sendNotification } from '@/utils/realtime'
import { notification } from '@/components'

export default createFormViewModel({
  namespace: 'dispense',
  config: {},
  param: {
    service,
    state: {
      totalWithGST: 0,
      visitID: undefined,
      default: {
        corAttachment: [],
        corPatientNoteVitalSign: [],
        invoice: {
          isGSTInclusive: false,
          invoiceAdjustment: [],
          invoiceItem: [],
        },
      },
      selectedWidgets: [
        '1',
      ],
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (loct, method) => {
        const { pathname, search, query = {} } = loct

        // if (
        //   pathname.indexOf('/reception/queue/dispense') === 0 &&
        //   Number(query.vid) &&
        //   query.md2 === 'dsps'
        // ) {
        //   dispatch({
        //     type: 'initState',
        //     payload: {
        //       version: Number(query.v) || undefined,
        //       visitID: Number(query.vid),
        //       md2: query.md2,
        //     },
        //   })
        // }
        if (pathname === '/reception/queue/dispense' && Number(query.vid)) {
          dispatch({
            type: 'initState',
            payload: {
              version: Number(query.v) || undefined,
              visitID: Number(query.vid),
              pid: Number(query.pid),
              // md2: query.md2,
            },
          })
        }
      })
    },
    effects: {
      *initState ({ payload }, { all, put, select, take }) {
        const { version, visitID, md2 } = payload
        const patientState = yield select((st) => st.patient)

        if (
          payload.pid &&
          (!patientState.entity || patientState.entity.id !== payload.pid)
        ) {
          yield put({
            type: 'patient/query',
            payload: {
              id: payload.pid,
            },
          })
          yield take('patient/query/@@end')
        }
        yield put({
          type: 'updateState',
          payload: {
            visitID,
            patientID: payload.pid,
          },
        })
        yield put({
          type: 'query',
          payload: {
            id: visitID,
            version,
          },
        })
        yield take('query/@@end')
      },

      *start ({ payload }, { call, put }) {
        const response = yield call(service.create, payload.id)
        const { id } = response
        if (id) {
          yield put({
            type: 'updateState',
            payload: {
              entity: response,
              version: payload.version,
            },
          })
          // sendNotification('QueueListing', {
          //   message: `Dispense started`,
          // })
        }
        return response
      },
      *refresh ({ payload }, { call, put }) {
        const response = yield call(service.refresh, payload)
        if (response) {
          yield put({
            type: 'updateState',
            payload: {
              entity: response,
              version: Date.now(),
            },
          })
        }
        return response
      },

      *save ({ payload }, { call, put }) {
        const response = yield call(service.save, payload)
        return response
      },
      *discard ({ payload }, { call, put }) {
        const response = yield call(service.remove, payload)

        if (response) {
          sendNotification('QueueListing', {
            message: `Dispense discarded`,
          })
        }
        return response
      },
      *finalize ({ payload }, { call, put }) {
        const response = yield call(service.finalize, payload)
        if (response)
          yield put({
            type: 'closeModal',
            payload: {
              toBillingPage: true,
            },
          })
        return response
      },
      *unlock ({ payload }, { call }) {
        const response = yield call(service.unlock, payload)
        return response
      },
      *closeModal ({ payload = { toBillingPage: false } }, { call, put }) {
        const { toBillingPage = false } = payload
        // router.push(
        //   getRemovedUrl([
        //     'md2',
        //     // 'cmt',
        //     // 'vid',
        //   ]),
        // )

        yield put({
          type: 'global/updateAppState',
          payload: {
            disableSave: false,
            showDispensePanel: false,
            fullscreen: false,
          },
        })
        if (!toBillingPage) {
          yield put({
            type: 'updateState',
            payload: {
              entity: undefined,
            },
          })
          router.push('/reception/queue')
        }
      },

      *queryAddOrderDetails ({ payload }, { call, put }) {
        const response = yield call(
          service.queryAddOrderDetails,
          payload.invoiceId,
        )

        if (response.status === '200') {
          yield put({
            type: 'getAddOrderDetails',
            payload: response,
          })
          return response.data
        }
        return false
      },

      *saveAddOrderDetails ({ payload }, { call, put }) {
        const response = yield call(service.saveAddOrderDetails, payload)
        if (response === 204) {
          notification.success({ message: 'Saved' })
          return true
        }
        return false
      },

      *removeAddOrderDetails ({ payload }, { call, put }) {
        const response = yield call(service.removeAddOrderDetails, payload)
        if (response === 204) {
          notification.success({ message: 'Retail visit discarded' })
          return true
        }
        return false
      },
      *discardBillOrder ({ payload }, { call, put }) {
        const response = yield call(service.removeBillFirstVisit, payload)
        if (response === 204) {
          notification.success({ message: 'Bill-First visit discarded' })
          return true
        }
        return false
      },
      // *queryDone ({ payload }, { call, put, select }) {
      //   // console.log('queryDone', payload)
      //   const { data } = payload
      //   if (!data) return
      //   let cdRows = []
      //   dispenseDocumentTypes.forEach((p) => {
      //     cdRows = cdRows.concat(
      //       (data[p.prop] || []).map((o) => {
      //         const d = {
      //           uid: getUniqueId(),
      //           type: p.value,
      //           subject: p.getSubject ? p.getSubject(o) : '',
      //           ...o,
      //         }
      //         return p.convert ? p.convert(d) : d
      //       }),
      //     )
      //   })
      //   yield put({
      //     type: 'dispenseDocument/updateState',
      //     payload: {
      //       rows: _.sortBy(cdRows, 'sequence'),
      //     },
      //   })

      //   let oRows = []
      //   orderTypes.forEach((p) => {
      //     const datas =
      //       (p.filter ? data[p.prop].filter(p.filter) : data[p.prop]) || []
      //     // console.log(oRows, data[p.prop])
      //     oRows = oRows.concat(
      //       datas.map((o) => {
      //         const d = {
      //           uid: getUniqueId(),
      //           type: p.value,
      //           subject: p.getSubject ? p.getSubject(o) : '',
      //           ...o,
      //         }
      //         return p.convert ? p.convert(d) : d
      //       }),
      //     )
      //   })
      //   yield put({
      //     type: 'orders/updateState',
      //     payload: {
      //       rows: _.sortBy(oRows, 'sequence'),
      //       finalAdjustments: data.corOrderAdjustment.map((o) => ({
      //         ...o,
      //         uid: o.id,
      //       })),
      //     },
      //   })
      //   yield put({
      //     type: 'orders/calculateAmount',
      //   })

      //   yield put({
      //     type: 'diagnosis/updateState',
      //     payload: {
      //       rows: _.sortBy(data.corDiagnosis, 'sequence'),
      //     },
      //   })

      //   // if (data.corDiagnosis && data.corDiagnosis.length > 0) {
      //   //   data.corDiagnosis.forEach((cd) => {
      //   //     cd.complication = cd.corComplication.map((o) => o.complicationFK)
      //   //   })
      //   // }
      //   // if (data.corDiagnosis && data.corDiagnosis.length === 0) {
      //   //   data.corDiagnosis.push({
      //   //     onsetDate: moment(),
      //   //     isPersist: false,
      //   //     remarks: '',
      //   //   })
      //   // }
      //   // console.log(payload)
      //   return payload
      // },
    },
    reducers: {
      getAddOrderDetails (state, { payload }) {
        const { data } = payload
        return {
          ...state,
          addOrderDetails: data,
        }
      },
    },
  },
})
