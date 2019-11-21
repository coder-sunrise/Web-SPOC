import { createFormViewModel } from 'medisys-model'

const initialState = {
  reportTypeID: undefined,
  reportParameters: {},
}

export default createFormViewModel({
  namespace: 'report',
  config: {
    queryOnLoad: false,
  },
  param: {
    state: {
      ...initialState,
    },
    subscriptions: {},
    effects: {},
    reducers: {
      reset () {
        return { ...initialState }
      },
    },
  },
})
