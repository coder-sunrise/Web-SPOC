import { query as queryUsers, queryCurrent } from '@/services/user'
import { fetchUserProfileByID } from '@/pages/Setting/UserProfile/services'

const convertServerRights = ({ accessRight, type, permission }) => {
  // const orgName = accessRight
  const name = accessRight.replace('SEMRWebApp:', '').toLowerCase()
  const rights = permission.toLowerCase()
  if (type === 'Module') {
    return [
      {
        name,
        rights,
        // orgName,
      },
      // {
      //   name: `${name}.view`,
      //   rights: rights.indexOf('read') >= 0 ? 'enable' : 'disable',
      // },
      // {
      //   name: `${name}.edit`,
      //   rights: rights.indexOf('write') >= 0 ? 'enable' : 'disable',
      // },
    ]
  }
  if (type === 'Action') {
    // test only
    // if (name === 'queue.dispense') {
    //   return [
    //     { name, rights: 'hidden' },
    //   ]
    // }
    return [
      {
        name,
        rights,
        // orgName,
      },
    ]
  }

  return []
}

const defaultState = {
  accessRights: [],
  data: {
    clinicianProfile: {
      userProfile: {},
    },
  },
  profileDetails: undefined,
}

export default {
  namespace: 'user',

  state: {
    ...defaultState,
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
      if (response.data) {
        const { userProfileDetailDto } = response.data
        const accessRights = response.data.userClientAccessRightDto.reduce(
          (a, b) => {
            return a.concat(convertServerRights(b))
          },
          [],
        )
        // accessRights.forEach((a) => {
        //   console.log(a.name)
        // })
        // console.log({ data: response.data, accessRights })
        yield put({
          type: 'saveCurrentUser',
          payload: {
            data: response.data.userProfileDetailDto,
            accessRights,
          },
        })

        yield put({
          type: 'queueLog/refresh',
        })

        if (
          !userProfileDetailDto.clinicianProfile.userProfile
            .lastPasswordChangedDate
        )
          yield put({
            type: 'global/updateState',
            payload: {
              showChangePasswordModal: true,
            },
          })

        return response.data
      }
      return null
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
    reset (_) {
      return { ...defaultState }
    },
    save (state, action) {
      return {
        ...state,
        list: action.payload,
      }
    },
    saveCurrentUser (state, { payload }) {
      // console.log({ payload })
      sessionStorage.setItem(
        'accessRights',
        JSON.stringify(payload.accessRights),
      )
      return {
        ...state,
        ...payload,
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
