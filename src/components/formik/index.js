import * as formik from 'formik'

// console.log(formik)

// const { FastField } = formik

// const FastFieldExtend = (props) => {
//   console.log(props)
//   return <FastField {...props} />
// }
module.exports = {
  ...formik,
  // FastField: FastFieldExtend,
  ...module.exports,
}
