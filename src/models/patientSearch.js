import { createListViewModel } from 'medisys-model'
import service from '@/services/patient'

export default createListViewModel({
  namespace: 'patientSearch',
  config: {},
  queryFnName: 'queryForNewVisit',
  param: {
    service,
    state: {},
    subscriptions: ({ dispatch, history }) => {},
    effects: {},
    reducers: {},
  },
})
