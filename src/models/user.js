import { query as queryUsers, queryCurrent } from '@/services/user'
import { fetchUserProfileByID } from '@/pages/Setting/UserProfile/services'

export default {
  namespace: 'user',

  state: {
    accessRights: [],
    data: {},
    profileDetails: undefined,
  },

  effects: {
    *fetch (_, { call, put }) {
      const response = yield call(queryUsers)
      yield put({
        type: 'save',
        payload: response,
      })
    },
    *fetchCurrent (_, { call, put }) {
      const response = yield call(queryCurrent)
      yield put({
        type: 'saveCurrentUser',
        payload: response.data.userProfileDto,
      })
    },
    *fetchProfileDetails ({ id }, { call, put }) {
      const result = yield call(fetchUserProfileByID, id)
      const { status, data } = result
      if (parseInt(status, 10) === 200)
        yield put({
          type: 'saveProfileDetails',
          profileDetails: { ...data },
        })
    },
  },

  reducers: {
    save (state, action) {
      return {
        ...state,
        list: action.payload,
      }
    },
    saveCurrentUser (state, action) {
      return {
        ...state,
        data: action.payload,
      }
    },
    changeNotifyCount (state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      }
    },
    saveProfileDetails (state, { profileDetails }) {
      return { ...state, profileDetails }
    },
  },
}
