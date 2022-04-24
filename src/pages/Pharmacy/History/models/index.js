import { createListViewModel } from 'medisys-model'
import service from '../services'
import { getUserPreference, saveUserPreference } from '@/services/user'

export default createListViewModel({
  namespace: 'pharmacyHisotry',
  config: {},
  param: {
    service,
    state: {},
    setting: {},
    subscriptions: ({ dispatch, history }) => {
      history.listen(async loct => {
        const { query = {}, pathname } = loct
        if (pathname === '/pharmacy/history') {
          dispatch({
            type: 'getUserPreference',
            payload: {
              type: '4',
            },
          }).then(response => {
            if (response) {
              const { pharmacyHistoryColumnSetting } = response
              dispatch({
                type: 'updateState',
                payload: {
                  pharmacyHistoryColumnSetting: pharmacyHistoryColumnSetting,
                },
              })
            }
          })
        }
      })
    },
    effects: {
      *saveUserPreference({ payload }, { call, put, select }) {
        const r = yield call(saveUserPreference, {
          userPreferenceDetails: JSON.stringify(payload.userPreferenceDetails),
          itemIdentifier: payload.itemIdentifier,
          type: payload.type,
        })
        if (r === 204) {
          window.g_app._store.dispatch({
            type: 'codetable/refreshCodes',
            payload: {
              code: 'userpreference',
              force: true,
            },
          })
          return true
        }

        return false
      },
      *getUserPreference({ payload }, { call, put }) {
        const r = yield call(getUserPreference, payload.type)
        const { status, data } = r
        if (status === '200') {
          if (data) {
            const parsedColumnSetting = JSON.parse(data)
            let pharmacyHistoryColumnSetting
            if (payload.type === '4') {
              pharmacyHistoryColumnSetting = parsedColumnSetting.find(
                o => o.Identifier === 'PharmacyHistoryColumnSetting',
              )
            }
            if (parsedColumnSetting.length > 0) {
              const resultFavPatDBColumnSetting = {
                pharmacyHistoryColumnSetting: pharmacyHistoryColumnSetting
                  ? pharmacyHistoryColumnSetting.value
                  : [],
              }
              return resultFavPatDBColumnSetting
            }
          }
        }
        return null
      },
    },
    reducers: {},
  },
})
