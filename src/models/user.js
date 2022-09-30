import _ from 'lodash'
import {
  query as queryUsers,
  queryCurrent,
  getUserPreference,
  saveUserPreference,
} from '@/services/user'
import { fetchUserProfileByID } from '@/pages/Setting/UserProfile/services'
import { CLINIC_TYPE } from '@/utils/constants'
import * as serviceQueue from '../services/queue'

const convertServerRights = ({ accessRight, type, permission }) => {
  // const orgName = accessRight
  const name = accessRight.replace('SEMRWebApp:', '').toLowerCase()
  const rights = permission.toLowerCase()
  // for testing only
  // if (name === 'patientdatabase') {
  //   return [
  //     { name, rights: 'disable' },
  //   ]
  // }

  // if (rights === 'hidden') {
  //   return [
  //     { name, rights: 'enable' },
  //   ]
  // }
  // if (name === 'patientdatabase') {
  //   return [
  //     { name, rights: 'readOnly' },
  //   ]
  // }
  if (type === 'Module') {
    // if (name === 'inventory/purchasingandre ceiving') {
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
    // if (name === 'queue.dispense.editorder') {
    //   return [
    //     { name, rights: 'hidden' },
    //   ]
    // }
    // if (name === 'purchasingandreceiving.newpurchasingand receiving') {
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

  if (type === 'Field') {
    return [
      {
        name,
        rights,
        // orgName,
      },
    ]
  }
  return [
    {
      name,
      rights,
      // orgName,
    },
  ]
}

const parseUserRights = user => {
  const disableList = [
    'reception/appointment',
    'patientdatabase',
    'communication',
    'inventory',
    'finance',
    'report',
    'settings',
    'support',
  ]
  const result = {
    ...user,
    accessRights: user.accessRights.map(access => ({
      ...access,
      rights: disableList.includes(access.name) ? 'disable' : access.rights,
    })),
  }
  return result
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
    *fetch(state, { call, put }) {
      const response = yield call(queryUsers)
      yield put({
        type: 'save',
        payload: response,
      })
    },
    *fetchCurrent(state, { select, call, put }) {
      let user = JSON.parse(sessionStorage.getItem('user'))
      // const clinicInfo = yield select((state) => state.clinicInfo)
      if (!user) {
        const response = yield call(queryCurrent)
        if (!response) {
          return
        }
        const { data } = response
        if (data) {
          const accessRights = data.userClientAccessRightDto.reduce((a, b) => {
            return a.concat(convertServerRights(b))
          }, [])

          if (
            data.userProfileDetailDto &&
            data.userProfileDetailDto.clinicianProfile &&
            data.userProfileDetailDto.clinicianProfile.userProfile &&
            data.userProfileDetailDto.clinicianProfile.userProfile.userName ===
              'demouser'
          ) {
            // for demo only, TODO: should have a better way to handle it
            accessRights.push({
              name: 'demorights',
              rights: 'enable',
            })
          }

          const gridSetting = yield call(getUserPreference, 4)
          // console.log(gridSetting)
          user = {
            data: data.userProfileDetailDto,
            accessRights: _.orderBy(accessRights, o => o.name),
            gridSetting: JSON.parse(gridSetting.data || '[]'),
          }
          // for AiOT user only
          // if (user && user.data && user.data.id === 46) {
          //   user = parseUserRights(user)
          //   console.log({ user })
          // }
        }
        localStorage.setItem('user', JSON.stringify(user))
        sessionStorage.setItem('user', JSON.stringify(user))
      }
      // console.log({ accessRight: JSON.stringify(user.accessRights) })
      yield put({
        type: 'saveCurrentUser',
        payload: user,
      })
      if (!user.data.clinicianProfile.userProfile.lastPasswordChangedDate)
        yield put({
          type: 'global/updateState',
          payload: {
            showChangePasswordModal: true,
          },
        })
      return user
    },
    *fetchProfileDetails({ id }, { call, put }) {
      const resultSession = yield call(serviceQueue.getBizSession, {
        IsClinicSessionClosed: false,
      })
      yield put({
        type: 'queueLog/updateState',
        payload: {
          hasActiveSession:
            resultSession.data &&
            resultSession.data.data &&
            resultSession.data.data.length > 0,
        },
      })
      const result = yield call(fetchUserProfileByID, id)
      const { status, data } = result
      if (parseInt(status, 10) === 200)
        yield put({
          type: 'saveProfileDetails',
          profileDetails: { ...data },
        })
    },

    *saveUserPreference({ payload }, { call, put }) {
      const response = yield call(saveUserPreference, {
        List: [
          {
            userPreferenceDetails: JSON.stringify(payload.data),
            itemIdentifier: payload.itemIdentifier,
            type: 4,
          },
        ],
      })
      if (response) {
        const userSession = JSON.parse(sessionStorage.getItem('user'))
        const { gridSetting } = userSession
        const existIndex = gridSetting.indexOf(
          gridSetting.find(o => o.Identifier === payload.itemIdentifier),
        )
        if (existIndex >= 0) {
          gridSetting.splice(existIndex, 1, payload.data)
        } else {
          gridSetting.push(payload.data)
        }
        sessionStorage.setItem('user', JSON.stringify(userSession))
        localStorage.setItem('user', JSON.stringify(userSession))
        // console.log(gridSetting)
        yield put({
          type: 'saveCurrentUser',
          payload: {
            gridSetting,
          },
        })
        window.g_app._store.dispatch({
          type: 'codetable/refreshCodes',
          payload: {
            code: 'userpreference',
            force: true,
          },
        })
      }
    },
  },

  reducers: {
    reset(state) {
      return { ...defaultState }
    },
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      }
    },
    saveCurrentUser(state, { payload }) {
      // console.log({ payload })

      return {
        ...state,
        ...payload,
      }
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      }
    },
    saveProfileDetails(state, { profileDetails }) {
      return { ...state, profileDetails }
    },
  },
}
