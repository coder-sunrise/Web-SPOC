import { createListViewModel } from 'medisys-model'
import * as service from '@/services/patient'
// import { convertToQuery } from '@/utils/cdrss'
import { convertToQuery } from '@/utils/utils'

export default createListViewModel({
  namespace: 'patientSearch',
  config: {},
  param: {
    service,
    state: {},
    subscriptions: ({ dispatch, history }) => {},
    effects: {},
    reducers: {},
  },
})
