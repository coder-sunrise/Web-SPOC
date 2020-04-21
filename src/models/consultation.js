import router from 'umi/router'
import _ from 'lodash'
import { createFormViewModel } from 'medisys-model'
import * as service from '../services/consultation'
import { getUniqueId } from '@/utils/utils'
import { consultationDocumentTypes, formTypes } from '@/utils/codes'
import { sendQueueNotification } from '@/pages/Reception/Queue/utils'
import { orderTypes } from '@/pages/Consultation/utils'

const getSequence = (sequence, maxSeq) => {
  if (sequence === 0) return sequence
  return sequence || maxSeq
}

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
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (loct, method) => {
        const { pathname, search, query = {} } = loct

        if (
          pathname.indexOf('/reception/queue/consultation') === 0 &&
          Number(query.cid)
        ) {
          dispatch({
            type: 'initState',
            payload: {
              version: Number(query.v) || undefined,
              consultationID: Number(query.cid),
              md: query.md2,
              queueID: Number(query.qid) || 0,
              patientID: Number(query.pid) || 0,
            },
          })
        }
      })
    },
    effects: {
      *initState ({ payload }, { call, put, select, take }) {
        const { queueID, patientID, version } = payload

        let visit
        if (queueID) {
          yield put({
            type: 'visitRegistration/query',
            payload: { id: queueID, version },
          })
          yield take('visitRegistration/query/@@end')
          const visitRegistration = yield select((st) => st.visitRegistration)
          visit = visitRegistration.entity.visit
          if (!visit) return
        } else {
          yield put({
            type: 'visitRegistration/reset',
          })
        }

        yield put({
          type: 'patient/query',
          payload: { id: patientID || visit.patientProfileFK, version },
        })

        yield take('patient/query/@@end')

        const { consultationID, md } = payload
        yield put({
          type: 'query',
          payload: {
            id: consultationID,
            version,
          },
        })

        // yield take('query/@@end')
        // if (md === 'cons') {
        //   yield put({
        //     type: 'global/updateState',
        //     payload: {
        //       fullscreen: true,
        //       showConsultationPanel: true,
        //     },
        //   })
        // }
      },

      *start ({ payload }, { call, put, select, take }) {
        yield put({
          type: 'updateState',
          payload: {
            entity: undefined,
          },
        })
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

          // at this point visitRegistration state does not have any entity yet
          // so get queueNo from payload instead of visitRegistration model
          sendQueueNotification({
            message: 'Consultation started.',
            queueNo: payload.queueNo,
          })
        }
        return response
      },
      *pause ({ payload }, { call, put, select }) {
        const visitRegistration = yield select(
          (state) => state.visitRegistration,
        )
        const { entity } = visitRegistration

        const response = yield call(service.pause, payload)
        if (response) {
          sendQueueNotification({
            message: 'Consultation paused.',
            queueNo: entity.queueNo,
          })

          yield put({ type: 'closeModal' })
        }
        return response
      },

      *resume ({ payload }, { call, put, select }) {
        const visitRegistration = yield select(
          (state) => state.visitRegistration,
        )
        const { entity } = visitRegistration
        yield put({
          type: 'updateState',
          payload: {
            entity: undefined,
          },
        })

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
            },
          })
          sendQueueNotification({
            message: 'Consultation resumed.',
            queueNo: entity.queueNo,
          })
        }
        return response
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
      *overwrite ({ payload }, { call, put }) {
        const response = yield call(service.overwrite, payload.id)
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
      *sign ({ payload }, { call, put, select }) {
        const visitRegistration = yield select(
          (state) => state.visitRegistration,
        )
        const { entity } = visitRegistration

        const response = yield call(service.sign, payload)
        if (response) {
          sendQueueNotification({
            message: 'Consultation signed-off.',
            queueNo: entity.queueNo,
          })
          yield put({ type: 'closeModal' })
          // console.log('payload ', payload)
        }
        return response
      },
      *discard ({ payload }, { call, put, select }) {
        // if (!payload) {
        //   yield put({ type: 'closeModal' })
        //   return null
        // }
        const visitRegistration = yield select(
          (state) => state.visitRegistration,
        )
        const { entity } = visitRegistration

        const response = yield call(service.remove, payload)

        if (response) {
          sendQueueNotification({
            message: 'Consultation discarded.',
            queueNo: entity.queueNo,
          })
          // yield put({ type: 'closeModal', payload })
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
      *editOrder ({ payload }, { call, put, take }) {
        const response = yield call(service.editOrder, payload.id)
        const { queueID } = payload

        if (response) {
          if (queueID) {
            yield put({
              type: 'visitRegistration/query',
              payload: { id: queueID, version: Date.now() },
            })
            yield take('visitRegistration/query/@@end')
          }

          yield put({
            type: 'updateState',
            payload: {
              entity: response,
              version: payload.version,
            },
          })
          // console.log(response)
          yield put({
            type: 'queryDone',
            payload: {
              data: response,
            },
          })
        }
        return response
      },
      *signOrder ({ payload }, { call, put }) {
        const response = yield call(service.signOrder, payload)
        return response
      },
      *completeBillFirstOrder ({ payload }, { call, put }) {
        const response = yield call(service.completeOrder, payload)
        return response
      },
      *closeModal ({ payload = { history: {} } }, { call, put, take }) {
        const { history = {} } = payload
        yield put({
          type: 'global/updateAppState',
          payload: {
            disableSave: false,
            showConsultationPanel: false,
            fullscreen: false,
          },
        })
        yield take('global/updateAppState/@@end')
        // yield put({
        //   type: 'formik/updateState',
        //   payload: {
        //     ConsultationPage: undefined,
        //     ConsultationDocumentList: undefined,
        //   },
        // })

        router.push('/reception/queue')
      },
      *queryDone ({ payload }, { call, put, select, take }) {
        // console.log('queryDone', payload)
        const { data, page } = payload
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

        let formRows = []
        formTypes.forEach((p) => {
          formRows = formRows.concat(
            (data[p.prop] || []).map((o) => {
              const d = {
                uid: getUniqueId(),
                type: p.value,
                typeName: p.name,
                ...o,
              }
              return d
            }),
          )
        })
        yield put({
          type: 'forms/updateState',
          payload: {
            rows: _.sortBy(formRows, 'sequence'),
          },
        })

        let oRows = []
        if (page !== 'edit order') {
          orderTypes.forEach((p) => {
            const datas =
              (p.filter ? data[p.prop].filter(p.filter) : data[p.prop]) || []

            let maxSeq = 0
            if (datas && datas.length > 0)
              maxSeq = _.maxBy(datas, 'sequence').sequence

            oRows = oRows.concat(
              datas.map((o) => {
                if (!o.sequence) maxSeq += 1
                const d = {
                  uid: getUniqueId(),
                  type: p.value,
                  subject: p.getSubject ? p.getSubject(o) : '',
                  ...o,
                  sequence: getSequence(o.sequence, maxSeq),
                  instruction: o.instruction || o.itemNotes,
                }

                let newObj = {
                  ...d,
                }
                let instructionArray = []
                if (d.corPrescriptionItemInstruction) {
                  instructionArray = d.corPrescriptionItemInstruction.map(
                    (instruction) => {
                      return {
                        ...instruction,
                        stepdose: instruction.stepdose || 'AND',
                      }
                    },
                  )
                  newObj = {
                    ...newObj,
                    corPrescriptionItemInstruction: instructionArray,
                  }
                }

                return p.convert ? p.convert(newObj) : newObj
              }),
            )
          })
        }

        yield put({
          type: 'orders/updateState',
          payload: {
            type: '1',
            rows: _.sortBy(oRows, 'sequence'),
            _originalRows: _.sortBy(oRows, 'sequence'),
            finalAdjustments: data.corOrderAdjustment.map((o) => ({
              ...o,
              uid: o.id,
            })),
            entity: undefined,
            isGSTInclusive: data.isGstInclusive,
            gstValue: data.gstValue,
          },
        })

        yield put({
          type: 'orders/calculateAmount',
          payload: {
            isGSTInclusive: data.isGstInclusive,
            gstValue: data.gstValue,
          },
        })

        yield put({
          type: 'diagnosis/updateState',
          payload: {
            rows: _.sortBy(data.corDiagnosis, 'sequence'),
          },
        })

        data.corDiagnosis = data.corDiagnosis.map((diagnosis) => {
          return {
            ...diagnosis,
            defaultIsPersist: diagnosis.isPersist,
          }
        })

        // if (data.corEyeVisualAcuityTest)
        //   yield put({
        //     type: 'visualAcuity/updateState',
        //     payload: {
        //       entity: data.corEyeVisualAcuityTest,
        //     },
        //   })

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
