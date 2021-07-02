import { createListViewModel } from 'medisys-model'
import moment from 'moment'
import service from '../services'

export default createListViewModel({
  namespace: 'settingMedicationUOM',
  config: {
    codetable: {
      message: 'Medication UOM updated',
      code: 'ctmedicationunitofmeasurement',
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
      *query ({ payload }, { put, select, call }) {

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
      }
    },
    reducers: {
      queryDone (st, { payload }) {
        const { data, clinicSetting: { settings: { secondaryPrintOutLanguage = '' } } } = payload
        return {
          ...st,
          list: data.data.map(o => {
            let secondDisplayValue = ''
            const translationData = o.translationData.find(t => t.language === secondaryPrintOutLanguage)
            if (translationData) {
              const displayValueItem = (translationData.list || []).find(l => l.key === "displayValue")
              if (displayValueItem) {
                secondDisplayValue = displayValueItem.value
              }
            }
            return {
              ...o,
              effectiveDates: [o.effectiveStartDate, o.effectiveEndDate],
              translatedDisplayValue: secondDisplayValue,
            }
          }),
        }
      },
    },
  },
})
