import { createFormViewModel } from 'medisys-model'
import * as service from '../services/clinic'

export default createFormViewModel({
  namespace: 'clinicInfo',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {},
    subscriptions: ({ dispatch, history, searchField }) => {
      history.listen((loct) => {
        const { pathname } = loct
      })
    },

    effects: {
      // *getClinicInfo ({ payload }, { call, put }) {
      //   console.log('ant', payload)
      //   const response = yield call(service.query, payload)
      //   yield put({
      //     type: 'save',
      //     payload: response,
      //   })
      // },
    },
    reducers: {
      // save (state, { payload }) {
      //   const { data } = payload
      //   console.log('data', data)
      //   // const gst = {}
      //   // data.forEach((p) => {
      //   //   gst[p.settingKey] = p.settingValue
      //   // })
      //   return {
      //     // gst,
      //   }
      // },

      queryDone (st, { payload }) {
        const { data } = payload
        const contact = {
          contactAddress: [
            {
              countryFK: 107,
              isPrimary: true,
              isMailing: true,
            },
          ],
          contactEmailAddress: {
            emailAddress: '',
          },
          mobileContactNumber: {
            number: '',
          },
          homeContactNumber: {
            number: '',
          },
          officeContactNumber: {
            number: '',
          },
          faxContactNumber: {
            number: '',
          },
          contactWebsite: {
            website: '',
          },
        }
        return {
          ...data,
          contact: data.contact ? data.contact : contact,
        }
      },
    },
  },
})
