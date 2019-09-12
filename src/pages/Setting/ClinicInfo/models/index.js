import { createFormViewModel } from 'medisys-model'
import * as service from '../services'

export default createFormViewModel({
  namespace: 'settingMasterClinicInfo',
  config: {
    // queryOnLoad: false,
  },
  param: {
    service,
    state: {
      default: {
        name: 'Ang mo kio Clinic ABC',
        hciCode: '17M0021',
        hospitalCode: ' ',
        primaryClinician: 1,
        primaryClinicianMCR: 'G123456',
        address: {
          blockNo: '',
        },
      },
    },
    subscriptions: ({ dispatch, history }) => {
      history.listen(async (loct, method) => {
        const { pathname, search, query = {} } = loct
      })
    },
    effects: {
      *fetchAddress ({ payload }, { call, put }) {
        const response = yield call(service.query, payload)
        console.log('response', response)
        if (response.data.data.length === 0)
          return {
            data: [
              {
                postalCode: '',
                blkHseNo: '',
                street: '',
                building: '',
                houseType: '',
              },
            ],
          }

        return response.data
      },
    },
    reducers: {},
  },
})
