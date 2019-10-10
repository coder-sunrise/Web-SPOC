const initialState = {
  user: {},
  login: {},
}

export const dva = {
  config: {
    onError (e) {
      e.preventDefault()
      console.log(e.message)
    },
    // onReducer (reducer) {
    //   return (state, action) => {
    //     // const newState =
    //     //   action.type === 'RESET' ? initialState : reducer(state, action)
    //     const newState =
    //       action.type === 'RESET' ? initialState : reducer(state, action)
    //     return { ...newState, routing: newState.routing }
    //   }
    // },
  },
  // plugins: [
  //   require('dva-logger')(),
  // ],
}
