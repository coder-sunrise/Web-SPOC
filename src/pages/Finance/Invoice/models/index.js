import moment from 'moment'
import { createListViewModel } from 'medisys-model'
import * as service from '../services'

const defaultFilterValues = {
  invoiceStartDate: moment().add(-1, 'month').formatUTC(),
  invoiceEndDate: moment()
    .set({ hour: 23, minute: 59, second: 59 })
    .formatUTC(false),
}

export default createListViewModel({
  namespace: 'invoiceList',
  config: {},
  param: {
    service,
    state: {
      default: {},
      filterValues: { ...defaultFilterValues },
    },
    subscriptions: ({ dispatch, history }) => {},
    effects: {},
    reducers: {
      resetFilter (state) {
        return { ...state, filterValues: { ...defaultFilterValues } }
      },
    },
  },
})
