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

models.forEach((model) => {
  initialState[model.namespace] = model.state
})

export const dva = {
  config: {
    onError (e, ...args) {
      e.preventDefault()
      const [
        action,
        { key, effectArgs },
      ] = args
      console.log({ e, effectArgs })

      const message = `Error occured in  effects: ${key}, with payload:`
      console.log(message, { ...effectArgs })
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
