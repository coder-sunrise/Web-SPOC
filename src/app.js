const initialState = {
  loading: {
    global: false,
    models: {},
    effects: {},
  },
}

const models = []
models.push(require('@/models/setting'))
models.push(require('@/models/menu'))
models.push(require('@/models/global'))
models.push(require('@/models/user'))
models.push(require('@/models/header'))

models.forEach((model) => {
  initialState[model.default.namespace] = model.default.state
})

export const dva = {
  config: {
    onError (e, ...args) {
      // e.preventDefault()
      const [
        action,
        { key, effectArgs },
      ] = args
      console.group('onError')
      console.log({ e, effectArgs })
      const message = `Error occured in  effects: ${key}, with payload: `
      const { payload } =
        effectArgs && effectArgs.length > 0
          ? effectArgs[0]
          : { payload: undefined }
      console.log(message, JSON.stringify(payload))
      console.groupEnd('onError')
    },
    onReducer (reducer) {
      return (state, action) => {
        const newState =
          action.type === 'RESET_APP_STATE'
            ? { ...initialState, routing: state.routing }
            : reducer(state, action)

        return { ...newState, routing: newState.routing }
      }
    },
  },
  // plugins: [
  //   require('dva-logger')(),
  // ],
}
