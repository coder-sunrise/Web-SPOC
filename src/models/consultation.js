import router from 'umi/router'
import _ from 'lodash'
import moment from 'moment'
import { createFormViewModel } from 'medisys-model'
import * as service from '../services/consultation'
import { getRemovedUrl, getAppendUrl, getUniqueId } from '@/utils/utils'
import {
  consultationDocumentTypes,
  orderTypes,
  getServices,
} from '@/utils/codes'
import { sendNotification } from '@/utils/realtime'

export default createFormViewModel({
  namespace: 'consultation',
  config: {},
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
      autoOrderList: [],
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (loct, method) => {
        const { pathname, search, query = {} } = loct

        if (
          pathname.indexOf('/reception/queue/patientdashboard') === 0 &&
          Number(query.cid)
        ) {
          dispatch({
            type: 'initState',
            payload: {
              version: Number(query.v) || undefined,
              consultationID: Number(query.cid),
              md: query.md2,
            },
          })
        }
      })
    },
    effects: {
      *initState ({ payload }, { call, put, select, take }) {
        const { version, consultationID, md } = payload
        yield put({
          type: 'query',
          payload: {
            id: consultationID,
            version,
          },
        })

        yield take('query/@@end')
        if (md === 'cons') {
          yield put({
            type: 'global/updateState',
            payload: {
              fullscreen: true,
              showConsultationPanel: true,
            },
          })
        }
      },

      *start ({ payload }, { call, put, select, take }) {
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

          yield put({
            type: 'queryDone',
            payload: {
              data: response,
            },
          })

          sendNotification('QueueListing', {
            message: `Consultation started`,
          })
        }
        return response
      },
      *pause ({ payload }, { call, put }) {
        const response = yield call(service.pause, payload)
        if (response) {
          sendNotification('QueueListing', {
            message: `Consultation paused`,
          })

      
          yield put({ type: 'closeModal' })
        }
        return response
      },

      *resume ({ payload }, { call, put, select }) {
        const response = yield call(service.resume, payload.id)
        if (response) {
          yield put({
            type: 'updateState',
            payload: {
              entity: response,
              version: payload.version,
            },
          })

          yield put({
            type: 'queryDone',
            payload: {
              data: response,
              status: 'PAUSED',
            },
          })
          sendNotification('QueueListing', {
            message: `Consultation resumed`,
          })
        }
        return response
      },
      *addAutoOrder ({ payload }, { call, put, select, take }) {
        let orders = []

        // const codetable = yield put.resolve({
        //   type: 'codetable/fetchCodes',
        //   payload: {
        //     code: 'ctservice',
        //     filter: {
        //       'serviceFKNavigation.IsActive': true,
        //       combineCondition: 'or',
        //     },
        //   },
        // })
        // yield take('codetable/fetchCodes/@@end')
        let codetableState = yield select((state) => state.codetable)

        const {
          services,
          serviceCenters,
          serviceCenterServices = [],
        } = getServices(codetableState.ctservice)

        let orderList = serviceCenterServices.filter(
          (o) => o.isAutoOrder === true && o.isDefault === true,
        )

        for (let i = 0; i < orderList.length; i++) {
          let serviceFKValue = 0
          let serviceCenterFKValue = 0
          let serviceNameValue = ''
          let adjAmountValue = 0

          for (let a = 0; a < services.length; a++) {
            if (orderList[i].displayValue === services[a].name) {
              serviceFKValue = services[a].value
              serviceNameValue = services[a].name
            }
          }

          for (let b = 0; b < serviceCenters.length; b++) {
            if (orderList[i].serviceCenter === serviceCenters[b].name) {
              serviceCenterFKValue = serviceCenters[b].value
            }
          }

          adjAmountValue = 0

          let rowRecord = {
            sequence: i,
            type: '3',
            serviceFK: serviceFKValue,
            serviceCenterFK: serviceCenterFKValue,
            serviceCenterServiceFK: orderList[i].serviceCenter_ServiceId,
            serviceName: serviceNameValue,
            unitPrice: orderList[i].unitPrice,
            total: orderList[i].unitPrice,
            quantity: 1,
            totalAfterItemAdjustment: orderList[i].unitPrice,
            adjAmount: adjAmountValue,
            remark: '',
            subject: orderList[i].displayValue,
            uid: getUniqueId(),
            weightage: 0,
            totalAfterOverallAdjustment: 0,
          }

          orders.push(rowRecord)
        }

        return orders
      },
      *edit ({ payload }, { call, put }) {
        const response = yield call(service.edit, payload.id)
        if (response) {
          yield put({
            type: 'updateState',
            payload: {
              entity: response,
              version: payload.version,
            },
          })

          yield put({
            type: 'queryDone',
            payload: {
              data: response,
            },
          })
        }
        return response
      },
      *sign ({ payload }, { call, put }) {
        const response = yield call(service.sign, payload)
        if (response) {
          sendNotification('QueueListing', {
            message: `Consultation signed`,
          })
          yield put({ type: 'closeModal' })
          console.log("payload ", payload)
        }
        return response
      },
      *discard ({ payload }, { call, put }) {
        if (!payload) {
          yield put({ type: 'closeModal' })
          return null
        }
        const response = yield call(service.remove, payload)

        if (response) {
          sendNotification('QueueListing', {
            message: `Consultation discarded`,
          })
          yield put({ type: 'closeModal' })
        }
        return response
      },
      *saveLayout ({ payload }, { call, put, select }) {
        const user = yield select((st) => st.user)
        const response = yield call(service.saveLayout, user.data.id, {
          userPreferenceDetails: JSON.stringify(payload),
        })

        return response
      },
      *editOrder ({ payload }, { call, put }) {
        const response = yield call(service.editOrder, payload.id)
        if (response) {
          yield put({
            type: 'updateState',
            payload: {
              entity: response,
              version: payload.version,
            },
          })

          yield put({
            type: 'queryDone',
            payload: {
              data: response,
              page: 'edit order',
            },
          })
        }
        return response
      },
      *signOrder ({ payload }, { call, put }) {
        const response = yield call(service.signOrder, payload)
        console.log(response)
        return response
      },
      *closeModal ({ payload }, { call, put, take }) {
        yield put({
          type: 'global/updateAppState',
          payload: {
            disableSave: false,
            showConsultationPanel: false,
            fullscreen: false,
          },
        })
        yield take('global/updateAppState/@@end')
        yield put({
          type: 'formik/updateState',
          payload: {
            ConsultationPage: undefined,
            ConsultationDocumentList: undefined,
          },
        })
        router.push('/reception/queue')
      },
      *queryDone ({ payload }, { call, put, select, take }) {
        // console.log('queryDone', payload)
        const { data, autoOrderList, page, status } = payload

        yield take('visitRegistration/query/@@end')
        const visitRegistration = yield select((st) => st.visitRegistration)
        const { entity } = visitRegistration
        const { visit } = entity
        const { visitStatus } = visit
        let orderList = []

        if (visitStatus === 'IN CONS' && status !== 'PAUSED') {
          orderList = yield put.resolve({
            type: 'addAutoOrder',
          })
        }

        if (!data) return null
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
        if (page !== 'edit order') {
          orderTypes.forEach((p) => {
            const datas =
              (p.filter ? data[p.prop].filter(p.filter) : data[p.prop]) || []
            oRows = oRows.concat(
              datas.map((o) => {
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
        }

        yield put({
          type: 'orders/updateState',
          payload: {
            rows:
              orderList.length === 0
                ? _.sortBy(oRows, 'sequence')
                : _.sortBy(orderList, 'sequence'),
            finalAdjustments: data.corOrderAdjustment.map((o) => ({
              ...o,
              uid: o.id,
            })),
          },
        })

        yield put({
          type: 'orders/calculateAmount',
        })

        yield put({
          type: 'diagnosis/updateState',
          payload: {
            rows: _.sortBy(data.corDiagnosis, 'sequence'),
          },
        })

        // if (data.corDiagnosis && data.corDiagnosis.length > 0) {
        //   data.corDiagnosis.forEach((cd) => {
        //     cd.complication = cd.corComplication.map((o) => o.complicationFK)
        //   })
        // }
        // if (data.corDiagnosis && data.corDiagnosis.length === 0) {
        //   data.corDiagnosis.push({
        //     onsetDate: moment(),
        //     isPersist: false,
        //     remarks: '',
        //   })
        // }
        // console.log(payload)
        return payload
      },
    },
    reducers: {},
  },
})
