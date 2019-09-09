import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { formatMessage } from 'umi/locale'
import { Divider, withStyles } from '@material-ui/core'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'
import { GridContainer, GridItem, Button, CommonModal } from '@/components'
import DeliveryOrderDetails from './Details/DeliveryOrderDetails'
import Grid from './Grid'
import Add from '@material-ui/icons/Add'

const styles = (theme) => ({
  ...basicStyle(theme),
  buttonGroup: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
})

@connect(({ deliveryOrder }) => ({
  deliveryOrder,
}))
class index extends PureComponent {
  componentDidMount () {
    this.props.dispatch({
      type: 'deliveryOrder/query',
    })
  }

  toggleDeliveryOrderDetailsModal = () => {
    this.props.dispatch({
      type: 'deliveryOrder/updateState',
      payload: {
        showModal: !this.props.deliveryOrder.showModal,
      },
    })
  }

  render () {
    const { props } = this
    const { classes, deliveryOrder } = props
    const cfg = {
      toggleDeliveryOrderDetailsModal: this.toggleDeliveryOrderDetailsModal,
    }
    return (
      <div>
        <GridContainer>
          <GridItem xs={12} md={12}>
            <h4 style={{ fontWeight: 'bold' }}>
              {formatMessage({
                id: 'inventory.pr.detail.dod.do',
              })}
            </h4>
          </GridItem>
          <Grid {...this.props} />
          <CommonModal
            open={deliveryOrder.showModal}
            observe='DeliveryOrderDetail'
            title={
              deliveryOrder.entity ? (
                'Edit Delivery Order'
              ) : (
                'Delivery Order Details'
              )
            }
            maxWidth='lg'
            bodyNoPadding
            onClose={this.toggleDeliveryOrderDetailsModal}
            onConfirm={this.toggleDeliveryOrderDetailsModal}
          >
            <DeliveryOrderDetails {...cfg} {...this.props} />
          </CommonModal>
          <Button
            onClick={this.toggleDeliveryOrderDetailsModal}
            hideIfNoEditRights
            color='info'
            link
          >
            <Add />
            {formatMessage({
              id: 'inventory.pr.detail.dod.addDeliveryOrder',
            })}
          </Button>
        </GridContainer>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(index)
