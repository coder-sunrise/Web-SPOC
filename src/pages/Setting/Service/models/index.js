import { createFormViewModel } from 'medisys-model'
import * as service from '../services'

export default createFormViewModel({
  namespace: 'settingClinicService',
  config: {
    // queryOnLoad: false,
  },
  param: {
    service,
    state: {
      default: {
        autoOrder: true,
        items: [
          {
            id: 1,
            serviceCenter: 'Doctor Consultation',
            isDefault: true,
            sellingPrice: 40,
          },
          {
            id: 2,
            serviceCenter: 'Doctor Consultation',
            isDefault: false,
            sellingPrice: 40,
          },
          {
            id: 3,
            serviceCenter: 'Doctor Consultation',
            isDefault: false,
            sellingPrice: 40,
          },
          {
            id: 4,
            serviceCenter: 'Doctor Consultation',
            isDefault: false,
            sellingPrice: 40,
          },
          {
            id: 5,
            serviceCenter: 'Doctor Consultation',
            isDefault: false,
            sellingPrice: 40,
          },
          {
            id: 6,
            serviceCenter: 'Doctor Consultation',
            isDefault: false,
            sellingPrice: 40,
          },
        ],
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
