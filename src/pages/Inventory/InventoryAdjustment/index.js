import React, { PureComponent } from 'react'
import { connect } from 'dva'

import { withStyles, Divider } from '@material-ui/core'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'

import { CardContainer, CommonModal } from '@/components'

import Filter from './Filter'
import Grid from './Grid'
import Detail from './Detail'

const styles = (theme) => ({
  ...basicStyle(theme),
})

@connect(({ inventoryAdjustment }) => ({
  inventoryAdjustment,
}))
class Room extends PureComponent {
  state = {}

  // componentDidMount () {
  //   this.props.dispatch({
  //     type: 'inventoryAdjustment/query',
  //   })
  // }

  toggleModal = () => {
    this.props.dispatch({
      type: 'inventoryAdjustment/updateState',
      payload: {
        showModal: !this.props.inventoryAdjustment.showModal,
      },
    })
  }

  render () {
    const {
      classes,
      inventoryAdjustment,
      dispatch,
      theme,
      ...restProps
    } = this.props
    const cfg = {
      toggleModal: this.toggleModal,
    }
    return (
      <CardContainer hideHeader>
        <Filter {...cfg} {...this.props} />
        <Grid {...cfg} {...this.props} />
        <CommonModal
          open={inventoryAdjustment.showModal}
          observe='InventoryAdjustment'
          title={
            inventoryAdjustment.entity ? (
              'Edit Inventory Adjustment'
            ) : (
              'Add Inventory Adjustment'
            )
          }
          maxWidth='md'
          bodyNoPadding
          onClose={this.toggleModal}
          onConfirm={this.toggleModal}
        >
          <Detail {...cfg} {...this.props} />
        </CommonModal>
      </CardContainer>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Room)
