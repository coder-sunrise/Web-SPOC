import React, { PureComponent } from 'react'
import { FastField, withFormik } from 'formik'
import { withStyles } from '@material-ui/core'
import { compose } from 'redux'
import { NavPills } from '@/components'
import { connect } from 'dva'
import { getAppendUrl } from '@/utils/utils'

const styles = () => ({})
const Detail = (props) => {
  console.log(props)
  const { history, purchaseOrder } = props
  return (
    <NavPills
      color='info'
      onChange={(event, active) => {
        history.push(
          getAppendUrl({
            t: active,
          }),
        )
      }}
      index={purchaseOrder.currentTab}
      contentStyle={{ margin: '0 -5px' }}
      tabs={[
        {
          tabButton: 'Purchase Order Details',
          tabContent: <div />,
        },
        {
          tabButton: 'Receiving',
          tabContent: <div />,
        },
      ]}
    />
  )
}
export default compose(
  // withFormik({
  //   mapPropsToValues: () => ({}),
  // }),
  React.memo,
  // withStyles(styles, { withTheme: true }),
  connect(({ purchaseOrder }) => ({
    purchaseOrder,
  })),
)(Detail)
