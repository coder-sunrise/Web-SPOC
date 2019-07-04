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
    effects: {},
    reducers: {},
  },
})
