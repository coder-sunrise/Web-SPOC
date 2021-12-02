import { createListViewModel } from 'medisys-model'
import moment from 'moment'
import service from '../services'
import { getTranslationValue } from '@/utils/utils'

export default createListViewModel({
  namespace: 'settingMedicineTrivia',
  config: {
    codetable: {
      message: 'Medicine Trivia updated',
      code: 'ctmedicinetrivia',
    },
  },
  param: {
    service,
    state: {
      default: {},
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (loct, method) => {
        const { pathname, search, query = {} } = loct
      })
    },
    effects: {
      *query({ payload }, { put, select, call }) {
        const clinicSetting = yield select(st => st.clinicSettings)
        const result = yield call(service.queryList, payload)

        if (result.status === '200') {
          yield put({
            type: 'queryDone',
            payload: {
              clinicSetting,
              data: result.data,
            },
          })
        }
      },
    },
    reducers: {
      queryDone(st, { payload }) {
        const {
          data,
          clinicSetting: {
            settings: { secondaryPrintoutLanguage = '' },
          },
        } = payload

        return {
          ...st,
          list: data.data.map(o => {
            return {
              ...o,
              translatedDisplayValue: getTranslationValue(
                o.translationData,
                secondaryPrintoutLanguage,
                'displayValue',
              ),
            }
          }),
          pagination: {
            ...st.pagination,
            current: data.currentPage || 1,
            pagesize: data.pageSize || 10,
            totalRecords: data.totalRecords,
          },
        }
      },
    },
  },
})
