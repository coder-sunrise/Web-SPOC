import { createFormViewModel } from 'medisys-model'

const initialState = {
  attachment: undefined,
}

export default createFormViewModel({
  namespace: 'imageViewer',
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
