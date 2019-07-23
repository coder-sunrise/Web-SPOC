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
        const { data, status } = response

        return yield put({
          type: 'updateCurrentSelected',
          showUserProfileModal: status === 200,
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
      updateCurrentSelected (state, { showUserProfileModal, userProfile }) {
        return {
          ...state,
          currentSelectedUser: { ...userProfile },
          showUserProfileModal,
        }
      },
    },
  },
})
