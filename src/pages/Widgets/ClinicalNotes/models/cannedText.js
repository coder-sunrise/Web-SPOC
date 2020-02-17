import { createFormViewModel } from 'medisys-model'
// import * as service from '../services'
import * as service from '../services/cannedText'
import { CANNED_TEXT_TYPE_FIELD } from '@/utils/constants'

const defaultState = {
  clinicianNote: [],
  chiefComplaints: [],
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
        const { fields, selectedNote, ...restState } = state
        const splitByCannedTextType = (_result, cannedText) => {
          const field = CANNED_TEXT_TYPE_FIELD[cannedText.cannedTextTypeFK]
          const currentField = _result[field] || []
          let rest = {}
          if (cannedText.isShared) {
            const insertIntoOtherFields = (merged, eachField) => ({
              ...merged,
              [eachField]: [
                ...(_result[eachField] || [])
                  .filter((item) => item.id !== cannedText.id),
                cannedText,
              ],
            })
            rest = fields.reduce(insertIntoOtherFields, {
              ...restState,
            })
          }

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
