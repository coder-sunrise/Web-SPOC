import { createListViewModel } from 'medisys-model'
import _ from 'lodash'
import { getUniqueId } from '@/utils/utils'
import * as service from '../services'
import { DOCUMENT_CATEGORY, FORM_CATEGORY } from '@/utils/constants'

const formTypes = [
  {
    value: '2',
    name: 'From',
    prop: 'corForm',
  },
]

const visitFormTypes = [
  {
    value: '2',
    name: 'From',
    prop: 'visitForm',
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
      defaultForm: {
        type: '2',
        typeName: 'From',
        statusFK: 1,
        formName: 'From',
        formData: { content: null, signature: [] },
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
      *initState({ payload }, { select, put, take }) {
        const { formCategory } = payload
        yield put({
          type: 'settingDocumentTemplate/query',
          payload: {
            isActive: true,
            documentCategoryFK: DOCUMENT_CATEGORY.FORM,
          },
        })
        yield take('settingDocumentTemplate/query/@@end')
        const settingDocumentTemplate = yield select(
          st => st.settingDocumentTemplate,
        )
        const formTemplateList = settingDocumentTemplate?.list || []
        const formTemplates = formTemplateList.map(x => ({
          value: '2',
          name: x.displayValue,
          prop:
            formCategory === FORM_CATEGORY.CORFORM ? 'corForm' : 'visitForm',
          documentTemplateTypeFK: x.documentTemplateTypeFK,
          formTemplateFK: x.id,
          templateContent: x.templateContent,
        }))
        yield put({
          type: 'updateState',
          payload: {
            formTemplates,
          },
        })
      },
      *getCORForms({ payload }, { call, put, select }) {
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

      *getVisitForms({ payload }, { call, put, select }) {
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

      *saveVisitForm({ payload }, { call, put, select }) {
        const { type, visitID } = payload
        const response = yield call(
          service.saveVisitForm,
          type,
          visitID,
          payload,
        )
        return response
      },

      *saveCORForm({ payload }, { call, put, select }) {
        const { type, visitID } = payload
        const response = yield call(service.saveCORForm, type, visitID, payload)
        return response
      },

      *getCORForm({ payload }, { call, put, select }) {
        const { type } = payload
        const response = yield call(service.queryCORForm, type, payload)
        const { data, status } = response
        if (status === '200') {
          return data
        }
        return false
      },

      *getVisitForm({ payload }, { call, put, select }) {
        const { type } = payload
        const response = yield call(service.queryVisitForm, type, payload)
        const { data, status } = response
        if (status === '200') {
          return data
        }
        return false
      },
    },
    reducers: {
      queryDone(st, { payload }) {
        const { data } = payload

        return {
          ...st,
          list: data.data.map(o => {
            return {
              ...o,
              typeName: formTypes.find(t => t.value === o.type).name,
            }
          }),
        }
      },

      queryCORFormsDone(st, { payload }) {
        const { data } = payload
        const { id, currentCORId, visitDate, isCanEditForms } = data
        let formRows = []
        formTypes.forEach(p => {
          formRows = formRows.concat(
            (data[p.prop] || []).map(o => {
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

      queryVisitFormsDone(st, { payload }) {
        const { data } = payload
        const { id, currentCORId, visitDate, isCanEditForms } = data
        let formRows = []
        visitFormTypes.forEach(p => {
          formRows = formRows.concat(
            (data[p.prop] || []).map(o => {
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
    },
  },
})
