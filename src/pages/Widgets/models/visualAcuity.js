import { createListViewModel } from 'medisys-model'

export default createListViewModel({
  namespace: 'visualAcuity',
  config: {
    queryOnLoad: false,
  },
  param: {
    service: {},
    state: {
      default: {
        corEyeVisualAcuityTest: {
          eyeVisualAcuityTestForms: [{}],
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
