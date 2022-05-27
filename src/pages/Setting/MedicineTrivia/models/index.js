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
        const settingMedicineTrivia = yield select(
          st => st.settingMedicineTrivia,
        )
        const result = yield call(service.queryList, {
          ...payload,
          pageSize: settingMedicineTrivia.pagination.pagesize || 20,
        })

        if (result.status === '200') {
          yield put({
            type: 'queryDone',
            payload: {
              currentFilter: payload,
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
          currentFilter,
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
          currentFilter,
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
