import { createListViewModel } from 'medisys-model'
import _ from 'lodash'
import { getUniqueId } from '@/utils/utils'
import * as service from '../services'

const formTypes = [
  {
    value: '1',
    name: 'Letter of Certification',
    prop: 'corLetterOfCertification',
  },
]

const visitFormTypes = [
  {
    value: '1',
    name: 'Letter of Certification',
    prop: 'visitLetterOfCertification',
  },
]

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
          caseType: 'DaySurgery',
          procuderes: [],
          nonSurgicalCharges: [],
          others: null,
          signatureThumbnail: null,
          principalDiagnosisFK: null,
          principalDiagnosisCode: null,
          principalDiagnosisName: null,
          secondDiagnosisAFK: null,
          secondDiagnosisACode: null,
          secondDiagnosisAName: null,
          secondDiagnosisBFK: null,
          secondDiagnosisBCode: null,
          secondDiagnosisBName: null,
          otherDiagnosis: [],
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
      *getCORForms ({ payload }, { call, put, select }) {
        const response = yield call(service.getCORForms, payload)
        const { data, status } = response
        if (status === '200') {
          yield put({
            type: 'queryCORFormsDone',
            payload: response,
          })
          return data
        }
        return false
      },

      *getVisitForms ({ payload }, { call, put, select }) {
        const response = yield call(service.getVisitForms, payload)
        const { data, status } = response
        if (status === '200') {
          yield put({
            type: 'queryVisitFormsDone',
            payload: response,
          })
          return data
        }
        return false
      },

      *saveVisitForm ({ payload }, { call, put, select }) {
        const { visitID } = payload
        const response = yield call(service.saveVisitForm, visitID, payload)
        return response
      },

      *saveCORForm ({ payload }, { call, put, select }) {
        const { visitID } = payload
        const response = yield call(service.saveCORForm, visitID, payload)
        return response
      },

      *getCORForm ({ payload }, { call, put, select }) {
        const response = yield call(service.queryCORForm, payload)
        const { data, status } = response
        if (status === '200') {
          return data
        }
        return false
      },

      *getVisitForm ({ payload }, { call, put, select }) {
        const response = yield call(service.queryVisitForm, payload)
        const { data, status } = response
        if (status === '200') {
          return data
        }
        return false
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
              typeName: formTypes.find((t) => t.value === o.type).name,
            }
          }),
        }
      },

      queryCORFormsDone (st, { payload }) {
        const { data } = payload
        const { id, currentCORId, visitDate, isCanEditForms } = data
        let formRows = []
        formTypes.forEach((p) => {
          formRows = formRows.concat(
            (data[p.prop] || []).map((o) => {
              const d = {
                uid: getUniqueId(),
                type: p.value,
                typeName: p.name,
                ...o,
                formData: JSON.parse(o.formData),
                isCanEditForms,
              }
              return d
            }),
          )
        })

        return {
          ...st,
          visitDetail: {
            ...st.visitDetail,
            visitID: id,
            currentCORId,
            visitDate,
            isCanEditForms,
          },
          list: _.sortBy(formRows, 'sequence'),
        }
      },

      queryVisitFormsDone (st, { payload }) {
        const { data } = payload
        const { id, currentCORId, visitDate, isCanEditForms } = data
        let formRows = []
        visitFormTypes.forEach((p) => {
          formRows = formRows.concat(
            (data[p.prop] || []).map((o) => {
              const d = {
                uid: getUniqueId(),
                type: p.value,
                typeName: p.name,
                ...o,
                formData: JSON.parse(o.formData),
                statusFK: 1,
                isCanEditForms,
              }
              return d
            }),
          )
        })

        return {
          ...st,
          visitDetail: {
            ...st.visitDetail,
            visitID: id,
            currentCORId,
            visitDate,
            isCanEditForms,
          },
          list: _.sortBy(formRows, 'sequence'),
        }
      },
    },
  },
})
