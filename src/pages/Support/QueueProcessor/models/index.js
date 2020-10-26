import { createListViewModel } from 'medisys-model'
import moment from 'moment'
import * as service from '../services'

export default createListViewModel({
  namespace: 'queueProcessor',
  param: {
    service,
    state: {
      default: {
        isUserMaintainable: true, 
        description: '',
      },
    },
    effects: {},
    reducers: { 
      queryDone (st, { payload }) {
        const { data } = payload

        return {
          ...st,
          list: data.data.map((o) => {
            return {
              ...o, 
            }
          }),
        }
      },
    },
  },
})
