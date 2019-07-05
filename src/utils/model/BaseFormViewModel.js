import { formatUrlPath, sortAll, decrypt } from 'medisys-util'
import BaseCRUDViewModel from './BaseCRUDViewModel'
import { notification } from '@/components'

export default class BaseFormViewModel extends BaseCRUDViewModel {
  constructor (options) {
    super(options)
    this.options = options
  }

  create () {
    const _this = this
    // //console.log(this.options)
    const { namespace, param, setting = {} } = this.options
    const { service, state, subscriptions, effects, reducers } = param
    const {
      detailPath = '',
      ignoreFields = [],
      queryAfterUpdate = true,
      skipDefaultListen = false,
    } = setting
    const superSubscription = super.subscriptions
    return {
      namespace,
      state: {
        ...super.state(),
        // data: {},
        ...state,
      },

      subscriptions: {
        setup ({ dispatch, history }) {
          superSubscription.call(_this, { dispatch, history })
          if (!skipDefaultListen) {
            history.listen((location) => {
              // console.log(state)
              const { urlPatten } = state
              let url = location.pathname + location.search
              const listUrl = namespace.replace('Detail', '').toLowerCase()
              // //console.log(`\\/${namespace.replace('Detail', '').toLowerCase()}\\/detail\\?(.*)`)
              const match = url.match(
                `\\/${urlPatten || listUrl}\\/detail\\?{0,1}(.*)`,
              )
              // //console.log(match)
              if (match) {
                if (!match[1]) {
                  history.push(`/${urlPatten || listUrl}`)
                }
                // //console.log(decrypt(match[1]))
                // //console.log(url)
                const search = decrypt(match[1])
                // if (search.bread) {
                //   location.bread = search.bread
                //   dispatch({
                //     type: 'app/updateMenu',
                //     payload: { location },
                //   })

                //   delete search.bread
                // }

                dispatch({
                  type: 'query',
                  payload: {
                    ...search,
                    defaultQuery: true,
                  },
                  history,
                })
                // console.log(history)
              }
            })
          }

          if (typeof subscriptions === 'function') {
            subscriptions({ dispatch, history })
          }
        },
      },

      effects: {
        ...super.effects({ queryFnName: 'query' }),
        *upsert ({ payload, history }, { select, call, put }) {
          console.log('upsert', payload)
          const { cfg = {} } = payload
          const r = yield call(service.upsert, payload)
          let message = r.id ? 'Created' : 'Saved'
          if (cfg.message) {
            message = cfg.message
          }
          notification.success({
            // duration:0,`
            message,
          })

          return r
        },

        *create ({ payload, history }, { select, call, put }) {
          console.log('create', payload)

          const s = yield select((st) => st[namespace])
          const { currentItem, newDetailPath } = s
          let path = detailPath
          if (newDetailPath) {
            path = newDetailPath
          }
          const newObj = yield select((st) => st[namespace].currentItem)
          const newEntity = payload || { ...newObj }
          ignoreFields.forEach((f) => {
            delete newEntity[f]
          })
          const response = yield call(service.create, newEntity)
          const { data } = response
          const { data: obj } = data
          // console.log(obj)
          if (response.success) {
            if (obj) {
              yield put({
                type: 'updateState',
                payload: {
                  modalType: 'update',
                  currentItem: obj,
                },
              })
              yield put({ type: 'created', payload: { data } })
              if (history && path) {
                history.push(formatUrlPath(path, obj))
              }
              return data
            }
          } else {
            throw response
          }
        },

        *update ({ payload, history }, { select, call, put }) {
          console.log('update', payload)

          const data = yield select((st) => st[namespace].currentItem)
          if (data) {
            const { id } = data
            const newEntity = payload ? { ...payload, id } : { ...data }
            ignoreFields.forEach((f) => {
              delete newEntity[f]
            })
            // console.log(newEntity)
            const response = yield call(service.update, newEntity)
            // //console.log(queryAfterUpdate)
            if (response.success) {
              // console.log(response, queryAfterUpdate)
              // const { data } = response
              yield put({
                type: 'updateState',
                payload: {
                  currentItem: {
                    ...data,
                    timeStamp: response.data.data.timeStamp,
                  },
                },
              })
              if (queryAfterUpdate)
                yield put({ type: 'query', payload: { keepFilter: true } })
            } else {
              throw response
            }
          }
        },
        ...effects,
      },

      reducers: {
        ...super.reducers(),
        querySuccess (st, { payload }) {
          // console.log(payload)
          // const { response } = payload
          const { data } = payload
          sortAll(data)
          // //console.log(data)
          return {
            ...st,
            entity: data,
            // modalType:
            //   data.id !== '00000000-0000-0000-0000-000000000000'
            //     ? 'update'
            //     : 'create',
            queryCount: (st.queryCount || 0) + 1,
          }
        },
        ...reducers,
      },
    }
  }
}
