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

    effects: {},
    reducers: {
      queryDone (st, { payload }) {
        console.log('clinic ino reducer')
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
