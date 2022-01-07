import { createListViewModel } from 'medisys-model'
import service from '../services'
import { getUserPreference, saveUserPreference } from '@/services/user'

export default createListViewModel({
  namespace: 'specimenCollection',
  config: {},
  param: {
    service,
    state: {},
    setting: {},
    subscriptions: ({ dispatch, history }) => {
      history.listen(async loct => {
        const { query = {}, pathname } = loct
        if (pathname === '/lab/specimenCollection') {
          dispatch({
            type: 'getUserPreference',
            payload: {
              type: '4',
            },
          }).then(response => {
            if (response) {
              const { specimenCollectionColumnSetting } = response
              dispatch({
                type: 'updateState',
                payload: {
                  specimenCollectionColumnSetting: specimenCollectionColumnSetting,
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
            let specimenCollectionColumnSetting
            if (payload.type === '4') {
              specimenCollectionColumnSetting = parsedColumnSetting.find(
                o => o.Identifier === 'SpecimenCollectionColumnSetting',
              )
            }
            if (parsedColumnSetting.length > 0) {
              const columnSetting = {
                specimenCollectionColumnSetting: specimenCollectionColumnSetting
                  ? specimenCollectionColumnSetting.value
                  : [],
              }
              return columnSetting
            }
          }
        }
        return null
      },
    },
    reducers: {},
  },
})
