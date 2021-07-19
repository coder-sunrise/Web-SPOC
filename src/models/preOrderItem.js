import {createListViewModel} from 'medisys-model'
import moment from 'moment'
import service from '../services/preOrderItem'

export default createListViewModel({
    namespace: 'patientPreOrderItem',
    config:{
        queryOnLoad: false,
    },
    param:{
        service,
        state:{
            default:{
                isUserMaintainable:true,
                patientPreOrderItem: [],
            },
        },
        subscriptions: ({ dispatch, history }) => {
            history.listen(async (loct, method) => {
              const { pathname, search, query = {} } = loct
            })
          },
        effects:{},
        reducers: {
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
    }
})