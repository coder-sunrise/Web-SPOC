import { createFormViewModel } from 'medisys-model'
import * as service from '../services/cannedText'
import * as patientHistoryService from '../../../../services/patientHistory'
import { CANNED_TEXT_TYPE_FIELD_NAME } from '../CannedText/utils'

const defaultState = {
  chiefComplaints: [],
  note: [],
  plan: [],
  history: [],
  medicalcertification: [],
  selectedNote: undefined,
  fields: [],
  cannedTextTypes: [],
  prevDoctorNotes: undefined,
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
    subscriptions: {},
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
      *queryPrevDoctorNotes ({ payload }, { call, put }) {
        const response = yield call(
          patientHistoryService.queryPrevDoctorNotes,
          payload,
        )
        if (response.status === '200') {
          yield put({
            type: 'updateState',
            payload: {
              prevDoctorNotes: response.data,
            },
          })
          return response.data
        }
        return false
      },
      *changeOrder ({ payload }, { call, put }) {
        const response = yield call(service.changeOrder, payload)
        return response
      },
    },
    reducers: {
      filterDeleted (state, { payload }) {
        const { id, cannedTextTypeFK } = payload

        const fieldName = CANNED_TEXT_TYPE_FIELD_NAME[cannedTextTypeFK]
        return {
          ...state,
          [fieldName]: (state[fieldName] || [])
            .filter((item) => item.id !== id),
        }
      },
      queryDone (state, { payload }) {
        const { data } = payload

        const { fields, selectedNote, ...restState } = state
        const splitByCannedTextType = (_result, cannedText) => {
          const fieldName =
            CANNED_TEXT_TYPE_FIELD_NAME[cannedText.cannedTextTypeFK]
          const currentField = _result[fieldName] || []
          let rest = {}

          return {
            ..._result,
            [fieldName]: [
              ...currentField.filter((item) => item.id !== cannedText.id),
              cannedText,
            ],
            ...rest,
          }
        }
 
        const result = data.reduce(splitByCannedTextType, { ...restState })
        return { ...state, ...result }
      },
      setSelectedNote (state, { payload }) {
        return { ...state, selectedNote: payload }
      },
    },
  },
})
