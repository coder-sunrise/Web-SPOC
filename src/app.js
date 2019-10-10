import defaultSettings from '@/defaultSettings'

const initialState = {
  setting: defaultSettings,
  menu: {
    menuData: [],
    breadcrumb: {},
  },
  loading: {
    global: false,
    models: {},
    effects: {},
  },
  global: {
    collapsed:
      localStorage.getItem('menuCollapsed') !== undefined
        ? localStorage.getItem('menuCollapsed') === '1'
        : true,
    notices: [],
    currencySymbol: '$',
  },
}

export const dva = {
  config: {
    onError (e, ...args) {
      e.preventDefault()
      console.log({ args })
      console.log({ e })
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
