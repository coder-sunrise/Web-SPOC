import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'dva'
import { compose } from 'redux'
import Order from '../../Widgets/Orders'
import { withFormikExtend } from '@/components'

const styles = () => ({})

const AddOrder = ({ footer, handleSubmit }) => {
  return (
    <React.Fragment>
      <Order fromDispense='dispense' />
      {footer &&
        footer({
          onConfirm: handleSubmit,
          confirmBtnText: 'Save',
          confirmProps: {
            disabled: false,
          },
        })}
    </React.Fragment>
  )
}
export default compose(
  withStyles(styles, { withTheme: true }),
  connect(({ orders }) => ({
    orders,
  })),
  withFormikExtend({
    handleSubmit: (values, { props, resetForm }) => {
      const { dispatch, history, orders, onClose } = props
      const { rows } = orders
      const payload = {}
      alert(JSON.stringify(rows))
      dispatch({
        type: 'orders/updateState',
        payload: {
          rows: [],
        },
      })
      onClose()
    },
    displayName: 'AddOrder',
  }),
)(AddOrder)
