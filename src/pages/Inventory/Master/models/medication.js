import { createListViewModel } from 'medisys-model'
import service from '../Medication/services'

const namespace = 'medication'
export default createListViewModel({
  namespace,
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      namespace,
      currentTab: 0,
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen((loct, method) => {
        const { pathname, search, query = {} } = loct 
      })
    },
    effects: {
      *export(_, { call }) {
        const result = yield call(service.export)
        return result
      },

      *import({ payload }, { call }) {
        const result = yield call(service.import, { content: payload.content })
        if (result === false) return false
        return result
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
              effectiveDates: [o.effectiveStartDate, o.effectiveEndDate],
              genericMedication: o.genericMedication
                ? o.genericMedication.id
                : null,
              medicationGroup: o.medicationGroup ? o.medicationGroup.id : null,
              dispensingUOM: o.dispensingUOM ? o.dispensingUOM.id : null,
              favouriteSupplier: o.favouriteSupplier
                ? o.favouriteSupplier.id
                : null,
            }
          }),
        }
      },
    },
  },
})
