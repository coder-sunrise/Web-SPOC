import { createListViewModel } from 'medisys-model'
import { VISIT_TYPE } from '@/utils/constants'
import * as service from '../services/patientHistory'
import { formTypes } from '@/utils/codes'

const ParseEyeFormData = (response) => {
  const { corEyeRefractionForm = {}, corEyeExaminationForm = {} } = response
  let refractionFormData = {}
  let examinationFormData = {}
  if (corEyeRefractionForm.formData) {
    refractionFormData = JSON.parse(corEyeRefractionForm.formData)
  }

  if (corEyeExaminationForm.formData) {
    examinationFormData = JSON.parse(corEyeExaminationForm.formData)
  }

  const newResponse = {
    ...response,
    corEyeRefractionForm: {
      ...corEyeRefractionForm,
      formData: refractionFormData,
    },
    corEyeExaminationForm: {
      ...corEyeExaminationForm,
      formData: examinationFormData,
    },
  }
  return newResponse
}

export default createListViewModel({
  namespace: 'patientHistory',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      default: {},
      invoiceHistory: {
        list: [],
      },
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (loct, method) => {
        // const { pathname, search, query = {} } = loct
        // if (
        //   pathname.indexOf('/reception/queue/patientdashboard') === 0 ||
        //   query.md === 'pt'
        // ) {
        //   dispatch({
        //     type: 'initState',
        //     payload: {
        //       queueID: Number(query.qid) || 0,
        //       version: Number(query.v) || undefined,
        //       visitID: query.visit,
        //       patientID: Number(query.pid) || 0,
        //     },
        //   })
        // }
      })
    },
    effects: {
      *initState ({ payload }, { call, put, select, take }) {
        let { queueID, version, patientID, mode } = payload

        if (!patientID) {
          yield put({
            type: 'visitRegistration/query',
            payload: { id: queueID, version },
          })
          yield take('visitRegistration/query/@@end')
          const visitRegistration = yield select((st) => st.visitRegistration)
          const { visit } = visitRegistration.entity
          if (!visit) return
          patientID = visit.patientProfileFK
          yield
        }
        yield put({
          type: 'query',
          payload: {
            patientProfileFK: patientID,
            sorting: [
              {
                columnName: 'VisitDate',
                direction: 'desc',
              },
            ],
            version,
            'neql_VisitStatusFKNavigation.Status': 'WAITING',
          },
        })
        yield take('query/@@end')

        if (mode === 'split') {
          const st = yield select((s) => s.patientHistory)

          const { list = [] } = st
          const filteredList = list.filter(
            (o) =>
              o.coHistory.length >= 1 || o.visitPurposeFK === VISIT_TYPE.RETAIL,
          )

          if (filteredList.length > 0) {
            if (
              filteredList[0].visitPurposeFK === VISIT_TYPE.RETAIL
              // && filteredList[0].coHistory.length > 0
            ) {
              yield put({
                type: 'updateState',
                payload: {
                  defaultItem: filteredList[0],
                },
              })
              yield put({
                type: 'queryRetailHistory',
                payload: {
                  id: filteredList[0].invoiceFK,
                },
              })
            } else {
              yield put({
                type: 'queryOne',
                payload: filteredList[0].coHistory[0].id,
              })
            }
          }
        }

        yield put({
          type: 'updateState',
          payload: {
            queueID,
            patientID,
          },
        })
      },
      *queryDispenseHistory ({ payload }, { call, put }) {
        const response = yield call(service.queryDispenseHistory, payload)
        if (response.status === '200') {
          yield put({
            type: 'updateState',
            payload: {
              dispenseHistory: response.data,
            },
          })
          return response.data
        }
        return false
      },
      *queryRetailHistory ({ payload }, { call, put }) {
        const response = yield call(service.queryRetailHistory, payload)

        if (response.status === '200') {
          yield put({
            type: 'getRetailHistory',
            payload: response,
          })
          return response
        }
        return false
      },

      *queryInvoiceHistory ({ payload }, { call, put }) {
        const response = yield call(service.queryInvoiceHistory, payload)

        if (response.status === '200') {
          yield put({
            type: 'getInvoiceHistory',
            payload: response,
          })
          return response
        }
        return false
      },
    },
    reducers: {
      queryOneDone (st, { payload }) {
        // const { data } = payload
        const { entity } = st
        st.entity = ParseEyeFormData(entity)

        st.entity = {
          ...st.entity,
          forms: st.entity.forms.map((o) => {
            return {
              ...o,
              typeName: formTypes.find(
                (type) => parseInt(type.value, 10) === o.type,
              ).name,
            }
          }),
        }
        let sortedPatientHistory = st.list
          ? st.list.filter((o) => o.coHistory.length >= 1)
          : []

        return {
          ...st,
          selected:
            sortedPatientHistory.length > 0 ? sortedPatientHistory[0] : '',
          selectedSubRow:
            sortedPatientHistory.length > 0
              ? sortedPatientHistory[0].coHistory[0]
              : '',
        }
      },
      getRetailHistory (st, { payload }) {
        const { data } = payload
        const { defaultItem } = st
        return {
          ...st,
          entity: data,
          selected: defaultItem,
          selectedSubRow: defaultItem,
        }
      },
      getInvoiceHistory (st, { payload }) {
        const { data } = payload
        return {
          ...st,
          invoiceHistory: {
            entity: data,
            list: data.data.map((o) => {
              return {
                ...o,
                invoicePayer: o.invoicePayer.map((ip) => {
                  let paymentTxnList = []
                  const {
                    invoicePayment,
                    invoicePayerWriteOff,
                    creditNote,
                    statementInvoice,
                  } = ip

                  // Payment
                  paymentTxnList = (paymentTxnList || []).concat(
                    (invoicePayment || []).map((z) => {
                      return {
                        ...z,
                        // id: z.id,
                        type: 'Payment',
                        itemID: z.receiptNo,
                        date: z.paymentReceivedDate,
                        amount: z.totalAmtPaid,
                        isCancelled: z.isCancelled,
                      }
                    }),
                  )

                  // Write-Off
                  paymentTxnList = (paymentTxnList || []).concat(
                    (invoicePayerWriteOff || []).map((z) => {
                      return {
                        ...z,
                        // id: z.id,
                        type: 'Write Off',
                        itemID: z.writeOffCode,
                        date: z.writeOffDate,
                        amount: z.writeOffAmount,
                        reason: z.writeOffReason,
                        isCancelled: z.isCancelled,
                      }
                    }),
                  )

                  // Credit Note
                  paymentTxnList = (paymentTxnList || []).concat(
                    (creditNote || []).map((z) => {
                      return {
                        ...z,
                        // id: z.id,
                        type: 'Credit Note',
                        itemID: z.creditNoteNo,
                        date: z.generatedDate,
                        amount: z.totalAftGST,
                        reason: z.remark,
                        isCancelled: z.isCancelled,
                      }
                    }),
                  )

                  // Statement Corporate Charges
                  paymentTxnList = (paymentTxnList || []).concat(
                    (statementInvoice || [])
                      .filter((x) => x.adminCharge > 0)
                      .map((z) => {
                        return {
                          ...z,
                          // id: z.id,
                          type: 'Corporate Charges',
                          itemID: z.statementNo,
                          date: z.statementDate,
                          amount: z.adminCharge,
                          reason: '',
                          isCancelled: undefined,
                        }
                      }),
                  )

                  // Statement Adjustment
                  paymentTxnList = (paymentTxnList || []).concat(
                    (statementInvoice || [])
                      .filter(
                        (x) =>
                          x.statementAdjustment && x.statementAdjustment > 0,
                      )
                      .map((z) => {
                        return {
                          ...z,
                          // id: z.id,
                          type: 'Statement Adjustment',
                          itemID: z.statementNo,
                          date: z.statementDate,
                          amount: z.statementAdjustment,
                          reason: '',
                          isCancelled: undefined,
                        }
                      }),
                  )
                  return {
                    ...ip,
                    paymentTxnList,
                  }
                }),
              }
            }),
          },
        }
      },
    },
  },
})
