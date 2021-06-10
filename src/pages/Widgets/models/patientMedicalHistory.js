import { createFormViewModel } from 'medisys-model'

export default createFormViewModel({
  namespace: 'patientMedicalHistory',
  config: {
    queryOnLoad: false,
  },
  param: {
    service: {},
    state: {
      default: {
        patientMedicalHistory: [
          {
            medicalHistory: '',
            socialHistory: '',
            familyHistory: '',
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
