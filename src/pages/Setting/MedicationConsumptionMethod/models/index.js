import { createListViewModel } from 'medisys-model'
import moment from 'moment'
import service from '../services'
import { getTranslationValue } from '@/utils/utils'

export default createListViewModel({
  namespace: 'settingMedicationConsumptionMethod',
  config: {
    codetable: {
      message: 'Medication Usage updated',
      code: 'ctmedicationusage',
    },
  },
  param: {
    service,
    state: {
      default: {
        isUserMaintainable: true,
        effectiveDates: [
          moment().formatUTC(),
          moment('2099-12-31T23:59:59').formatUTC(false),
        ],
        description: '',
      },
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (loct, method) => {
        const { pathname, search, query = {} } = loct
      })
    },
    effects: {
      *query({ payload }, { put, select, call }) {
        const clinicSetting = yield select(st => st.clinicSettings)
        const settingMedicationConsumptionMethod = yield select(
          st => st.settingMedicationConsumptionMethod,
        )
        const result = yield call(service.queryList, {
          ...payload,
          pageSize:
            payload.pageSize ||
            settingMedicationConsumptionMethod.pagination.pagesize ||
            20,
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
              effectiveDates: [o.effectiveStartDate, o.effectiveEndDate],
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
