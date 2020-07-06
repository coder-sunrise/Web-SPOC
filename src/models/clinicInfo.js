import { createFormViewModel } from 'medisys-model'
import * as service from '../services/clinicInfo'
import { subscribeNotification } from '@/utils/realtime'
import { notification } from '@/components'

export default createFormViewModel({
  namespace: 'clinicInfo',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      ...JSON.parse(localStorage.getItem('clinicInfo') || '{}'),
    },
    subscriptions: ({ dispatch, history, searchField }) => {
      subscribeNotification('ClinicInfoUpdated', {
        callback: () => {
          dispatch({
            type: 'query',
            payload: { clinicCode: localStorage.getItem('clinicCode') },
          })
        },
      })

      history.listen((loct) => {
        const { pathname } = loct
      })
    },

    effects: {
      *upsertClinicInfo ({ payload }, { call, put }) {
        const r = yield call(service.upsert, payload)

        if (r) {
          notification.success({ message: 'Saved' })
          return true
        }
        return r
      },
    },
    reducers: {
      queryDone (st, { payload }) {
        const { data } = payload
        const contact = {
          contactAddress: [
            {
              // countryFK: 107,
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
        const clinicInfo = {
          ...data,
          contact: data.contact ? data.contact : contact,
        }

        localStorage.setItem('clinicInfo', JSON.stringify(clinicInfo))

        return {
          ...clinicInfo,
        }
      },
    },
  },
})
