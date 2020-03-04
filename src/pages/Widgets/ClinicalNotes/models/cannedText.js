import { createFormViewModel } from 'medisys-model'
// import * as service from '../services'
import * as service from '../services/cannedText'
import {
  CANNED_TEXT_TYPE_FIELD,
  DENTAL_CANNED_TEXT_TYPE_FIELD,
  CLINIC_TYPE,
} from '@/utils/constants'
import { CANNEDTEXT_FIELD_KEY } from '../CannedText/utils'

const defaultState = {
  clinicianNote: [],
  chiefComplaints: [],
  complaints: [],
  plan: [],
  associatedHistory: [],
  intraOral: [],
  extraOral: [],
  selectedNote: undefined,
  fields: [],
  cannedTextTypes: [],
}

export default createFormViewModel({
  namespace: 'cannedText',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      ...defaultState,
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (loct, method) => {
        const { pathname, search, query = {} } = loct
      })
    },
    effects: {
      *queryAll (_, { select, call, put, all }) {
        const cannedTextState = yield select((st) => st.cannedText)
        const clinicInfo = yield select((state) => state.clinicInfo)
        const queries = cannedTextState.cannedTextTypes
          .filter((types) => !!types)
          .map((types) => call(service.query, types))
        const responses = yield all(queries)
        const queryDone = responses
          .filter((response) => response)
          .map((response) =>
            put({
              type: 'queryDone',
              payload: {
                data: response.data,
                clinicTypeFK: clinicInfo.clinicTypeFK,
              },
            }),
          )
        yield all(queryDone)
      },
    },
    reducers: {
      filterDeleted (state, { payload }) {
        const { id } = payload
        const { fields, ...rest } = state
        const filterDeletedFromAllFields = (_result, field) => ({
          ..._result,
          [field]: (state[field] || []).filter((item) => item.id !== id),
        })
        const updatedFields = fields.reduce(filterDeletedFromAllFields, {
          ...rest,
        })

        return { ...state, ...updatedFields }
      },
      queryDone (state, { payload }) {
        const { data } = payload
        const clinicInfo = JSON.parse(localStorage.getItem('clinicInfo')) || {
          clinicTypeFK: CLINIC_TYPE.GP,
        }
        const { clinicTypeFK = CLINIC_TYPE.GP } = clinicInfo
        const { fields, selectedNote, ...restState } = state
        const splitByCannedTextType = (_result, cannedText) => {
          const fkField = CANNEDTEXT_FIELD_KEY[clinicTypeFK]

          const field = fkField[cannedText.cannedTextTypeFK]
          const currentField = _result[field] || []
          let rest = {}

          return {
            ..._result,
            [field]: [
              ...currentField.filter((item) => item.id !== cannedText.id),
              cannedText,
            ],
            ...rest,
          }
        }

        const result = data.reduce(splitByCannedTextType, { ...restState })
        return { ...state, ...result }
      },
      setList (state, { payload }) {
        const { field, list } = payload
        return { ...state, [field]: list }
      },
      setSelectedNote (state, { payload }) {
        return { ...state, selectedNote: payload }
      },
    },
  },
})
