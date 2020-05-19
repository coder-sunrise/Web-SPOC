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
          caseType: '2',
          procuderes: [],
          otherDiagnosis: [],
          surgicalCharges: [],
          nonSurgicalCharges: [],
          others: '',
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
      *saveForm ({ payload }, { call, put, select }) {
        const { visitID } = payload
        const response = yield call(service.saveForm, visitID, payload)
        return response
      },

      *getVisitForm ({ payload }, { call, put, select }) {
        const response = yield call(service.getVisitForm, payload)
        const { data, status } = response
        if (status === '200') {
          yield put({
            type: 'queryFormDone',
            payload: response,
          })
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
          list: data.map((o) => {
            return {
              ...o,
              formData: JSON.parse(o.formData),
              typeName: formTypes.find((t) => t.value === o.type).name,
            }
          }),
        }
      },

      queryFormDone (st, { payload }) {
        const { data } = payload
        let formRows = []
        if (data.formType === 'VisitForm') {
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
                }
                return d
              }),
            )
          })
        } else {
          formTypes.forEach((p) => {
            formRows = formRows.concat(
              (data[p.prop] || []).map((o) => {
                const d = {
                  uid: getUniqueId(),
                  type: p.value,
                  typeName: p.name,
                  ...o,
                  formData: JSON.parse(o.formData),
                }
                return d
              }),
            )
          })
        }

        const {
          id,
          currentCORId,
          visitDate,
          doctorProfileFK,
          patientName,
          patientNRICNo,
          patientAccountNo,
          isCanEditForms,
          cORDiagnosis,
        } = data
        return {
          ...st,
          visitDetail: {
            visitID: id,
            currentCORId,
            visitDate,
            doctorProfileFK,
            patientName,
            patientNRICNo,
            patientAccountNo,
            isCanEditForms,
            cORDiagnosis,
          },
          list: _.sortBy(formRows, 'sequence'),
        }
      },
    },
  },
})
