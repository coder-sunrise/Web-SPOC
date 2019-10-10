export const dva = {
  config: {
    onError (e) {
      e.preventDefault()
      console.log(e.message)
    },
    // onReducer: (reducer) => {
    //   console.log({ reducer })
    //   // return {...state}
    // },
  },
  // plugins: [
  //   require('dva-logger')(),
  // ],
}
