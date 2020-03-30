import { createListViewModel } from 'medisys-model'
import * as service from '../services'

export default createListViewModel({
  namespace: 'labTrackingDetails',
  config: {
   queryOnLoad:false,
  },
  param: {
    service,
    state: {
      default: {
        description: '',
      },
    },
    effects: {},
    reducers: {
      queryDone (st, { payload }) {
        const { data } = payload
        return {
          ...st,
          list: data.data,
        }
      },
    },
  },
})
