import { createListViewModel } from 'medisys-model'
import moment from 'moment'
import service from '../services'

export default createListViewModel({
  namespace: 'settingPackage',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      currentId: '',
      default: {
        effectiveDates: [
          moment().formatUTC(),
          moment('2099-12-31T23:59:59').formatUTC(false),
        ],
        totalPrice: 0,
        isUserMaintainable: true,
        servicePackageItem: [],
        consumablePackageItem: [],
        medicationPackageItem: [],
        vaccinationPackageItem: [],
        isActive: true,
      },
    },
    effects: {},
    reducers: {
      reset(st) {
        return {
          ...st,
          default: {
            ...st.default,
            rows: [],
          },
        }
      },
      queryOneDone(st, { payload }) {
        const {
          effectiveStartDate,
          effectiveEndDate,
          visitOrderTemplateItemDtos,
          ...restValues
        } = payload.data
        return {
          ...st,
          entity: {
            ...restValues,
            effectiveDates: [effectiveStartDate, effectiveEndDate],
          },
        }
      },
      queryDone(st, { payload }) {
        const { data } = payload

        return {
          ...st,
          list: data.data.map(o => {
            return {
              ...o,
              effectiveDates: [o.effectiveStartDate, o.effectiveEndDate],
            }
          }),
        }
      },
    },
  },
})
