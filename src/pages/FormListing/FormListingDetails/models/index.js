import { createListViewModel } from 'medisys-model'
import moment from 'moment'
import * as service from '../services'

export default createListViewModel({
  namespace: 'formListing',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      defaultLCForm: {
        type: '1',
        typeName: 'Letter of Certification',
        statusFK: 1,
        formData: {
          caseType: '2',
          procuderes: [],
          otherDiagnosis: [],
          surgicalCharges: [],
          nonSurgicalCharges: [],
        },
      },
      default: {},
      showModal: false,
      list: [],
    },

    subscriptions: ({ dispatch, history }) => {
      history.listen(async (loct, method) => {
        const { pathname, search, query = {} } = loct
      })
    },
    effects: {
      *initState ({ payload }, { call, put, select, take }) {
        const { visitID } = payload

        let visit
        if (visitID) {
          yield put({
            type: 'visitRegistration/query',
            payload: { id: visitID },
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
          payload: { id: visit.patientProfileFK },
        })

        yield take('patient/query/@@end')
      },

      *update ({ payload }, { call, put }) {
        const response = yield call(service.upsert, payload)
        return response
      },
    },
    reducers: {
      queryDone (st, { payload }) {
        const { data } = payload
        return {
          ...st,
          list: data.data.map((o) => {
            return {
              ...o,
            }
          }),
        }
      },

      queryOneDone (st, { payload }) {
        const { data } = payload
        return {
          ...st,
          entity: data,
        }
      },
    },
  },
})
