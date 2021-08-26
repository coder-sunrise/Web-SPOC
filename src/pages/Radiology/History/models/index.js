import { createListViewModel } from 'medisys-model'
import service from '../services'
import { getUserPreference, saveUserPreference } from '@/services/user'

export default createListViewModel({
  namespace: 'radiologyHisotry',
  config: {},
  param: {
    service,
    state: {},
    setting: {},
    subscriptions: ({ dispatch, history }) => {
      history.listen(async loct => {
        const { query = {}, pathname } = loct
        if (pathname === '/radiology/history') {
          dispatch({
            type: 'getUserPreference',
            payload: {
              type: '4',
            },
          }).then(response => {
            if (response) {
              const { radiologyHistoryColumnSetting } = response
              dispatch({
                type: 'updateState',
                payload: {
                  radiologyHistoryColumnSetting: radiologyHistoryColumnSetting,
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
        if (r === 204) return true

        return false
      },
      *getUserPreference({ payload }, { call, put }) {
        const r = yield call(getUserPreference, payload.type)
        const { status, data } = r
        if (status === '200') {
          if (data) {
            const parsedColumnSetting = JSON.parse(data)
            let radiologyHistoryColumnSetting
            if (payload.type === '4') {
              radiologyHistoryColumnSetting = parsedColumnSetting.find(
                o => o.Identifier === 'RadiologyHistoryColumnSetting',
              )
            }
            if (parsedColumnSetting.length > 0) {
              const resultFavPatDBColumnSetting = {
                radiologyHistoryColumnSetting: radiologyHistoryColumnSetting
                  ? radiologyHistoryColumnSetting.value
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
