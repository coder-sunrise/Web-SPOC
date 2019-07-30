import { createListViewModel } from 'medisys-model'
import * as service from '../services'

export default createListViewModel({
  namespace: 'settingUserProfile',
  config: {
    queryOnLoad: false,
  },
  param: {
    service,
    state: {
      currentSelectedUser: {},
      showUserProfileModal: false,
    },
    subscriptions: ({ dispatch, history }) => {},
    effects: {
      *fetchUserProfileByID ({ id }, { call, put }) {
        const response = yield call(service.fetchUserProfileByID, id)
        const { data = {}, status } = response

        return yield put({
          type: 'updateCurrentSelected',
          userProfile: { ...data },
        })
      },
    },
    reducers: {
      openModal (state) {
        return { ...state, showUserProfileModal: true }
      },
      closeModal (state) {
        return {
          ...state,
          showUserProfileModal: false,
          currentSelectedUser: {},
        }
      },
      updateCurrentSelected (state, { userProfile }) {
        return {
          ...state,
          showUserProfileModal: !!userProfile,
          currentSelectedUser: { ...userProfile },
        }
      },
    },
  },
})
