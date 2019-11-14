import { createBasicModel } from 'medisys-model'
import { queryNotices } from '@/services/api'
import { notification } from '@/components'

import config from '@/utils/config'
// console.log(
//   localStorage.getItem('menuCollapsed') !== undefined,
//   Boolean(localStorage.getItem('menuCollapsed')),
//   localStorage.getItem('menuCollapsed'),
// )
let connection = null
const connectionObserver = {}
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
      clean (state, { payload }) {
        // window.beforeReloadHandlerAdded = false
        return { ...state, [payload]: undefined }
      },
    },
  },
})
