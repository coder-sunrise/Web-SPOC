import { createBasicModel } from 'medisys-model'

export default createBasicModel({
  namespace: 'formik',
  config: {},
  param: {
    // service,
    state: {},
    setting: {},
    subscriptions: ({ dispatch, history }) => {},
    effects: {},
    reducers: {
      clean(state, { payload }) {
        // window.beforeReloadHandlerAdded = false
        return { ...state, [payload]: undefined }
      },
    },
  },
})
