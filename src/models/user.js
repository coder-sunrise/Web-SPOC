import { query as queryUsers, queryCurrent } from '@/services/user'
import { fetchUserProfileByID } from '@/pages/Setting/UserProfile/services'
import * as serviceQueue from '../services/queue'
import { CLINIC_TYPE } from '@/utils/constants'

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
  return []
}

const parseUserRights = (user) => {
  const disableList = [
    'reception/appointment',
    'patientdatabase',
    'communication',
    'inventory',
    'finance',
    'report',
    'settings',
    'support',
    'claimsubmission',
  ]
  const result = {
    ...user,
    accessRights: user.accessRights.map((access) => ({
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
    *fetch (_, { call, put }) {
      const response = yield call(queryUsers)
      yield put({
        type: 'save',
        payload: response,
      })
    },
    *fetchCurrent (_, { select, call, put }) {
      let user = JSON.parse(sessionStorage.getItem('user'))
      const clinicInfo = yield select((state) => state.clinicInfo)
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

          if (clinicInfo && clinicInfo.clinicTypeFK === CLINIC_TYPE.DENTAL) {
            // temporary use this for demo

            accessRights.push({
              name: 'queue.registervisit.vitalsign',
              rights: 'hidden',
            })
            accessRights.push({
              name: 'queue.consultation.widgets.clinicalnotes',
              rights: 'enable',
            })
            accessRights.push({
              name: 'queue.consultation.widgets.diagnosis',
              rights: 'hidden',
            })
            accessRights.push({
              name: 'queue.consultation.widgets.consultationdocument',
              rights: 'hidden',
            })
            accessRights.push({
              name: 'queue.consultation.widgets.patienthistory',
              rights: 'hidden',
            })
            accessRights.push({
              name: 'queue.consultation.widgets.order',
              rights: 'enable',
            })
            accessRights.push({
              name: 'queue.consultation.widgets.vitalsign',
              rights: 'hidden',
            })
            accessRights.push({
              name: 'queue.consultation.widgets.attachment',
              rights: 'enable',
            })
            accessRights.push({
              name: 'queue.consultation.widgets.dentalchart',
              rights: 'enable',
            })
          }

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

          user = {
            data: data.userProfileDetailDto,
            accessRights,
          }
          // for AiOT user only
          // if (user && user.data && user.data.id === 46) {
          //   user = parseUserRights(user)
          //   console.log({ user })
          // }
        }
        sessionStorage.setItem('user', JSON.stringify(user))
      }

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
    *fetchProfileDetails ({ id }, { call, put }) {
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
