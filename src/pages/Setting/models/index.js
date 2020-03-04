import { createFormViewModel } from 'medisys-model'
import * as service from '../services'

const defaultFilter = {
  searchText: '',
  actives: [
    0,
  ],
}

export default createFormViewModel({
  namespace: 'systemSetting',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      currentComponent: '1',
      default: {},
      filterValues: { ...defaultFilter },
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (loct, method) => {
        const { pathname, search, query = {} } = loct
      })
    },
    effects: {},
    reducers: {},
  },
})
