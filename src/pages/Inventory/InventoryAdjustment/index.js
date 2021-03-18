import React, { PureComponent } from 'react'
import { connect } from 'dva'
import $ from 'jquery'
import { withStyles } from '@material-ui/core'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'

import { CardContainer, CommonModal } from '@/components'

import Filter from './Filter'
import Grid from './Grid'
import Detail from './Detail'

const styles = (theme) => ({
  ...basicStyle(theme),
})

@connect(({ inventoryAdjustment, global }) => ({
  inventoryAdjustment,
  mainDivHeight: global.mainDivHeight,
}))
class InventoryAdjustment extends PureComponent {
  state = {
    open: false,
  }

  componentDidMount () {
    this.props.dispatch({
      type: 'global/updateState',
      payload: {
        disableSave: false,
      },
    })
    this.props.dispatch({
      type: 'inventoryAdjustment/query',
      payload: {
        sorting: [
          { columnName: 'adjustmentTransactionNo', direction: 'asc' },
        ],
      },
    })
  }

  toggleModal = async () => {
    const { dispatch } = this.props
    this.setState((prevState) => {
      return {
        open: !prevState.open,
      }
    })

    if (this.state.open) {
      dispatch({
        type: 'global/updateState',
        payload: {
          disableSave: false,
        },
      })
    }
  }

  render () {
    const { inventoryAdjustment, mainDivHeight = 700 } = this.props
    const cfg = {
      toggleModal: this.toggleModal,
    }
    let height =
      mainDivHeight - 110 - $('.filterBar').height() ||
      0 - $('.footerBar').height() ||
      0
    if (height < 300) height = 300
    return (
      <CardContainer hideHeader>
        <div className='filterBar'>
          <Filter {...cfg} {...this.props} toggleModel={this.toggleModal} />
        </div>
        <Grid {...cfg} {...this.props} height={height} />
        <CommonModal
          open={this.state.open}
          observe='InventoryAdjustment'
          title={
            inventoryAdjustment.entity ? (
              'Edit Inventory Adjustment'
            ) : (
              'Add Inventory Adjustment'
            )
          }
          maxWidth='xl'
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

export default withStyles(styles, { withTheme: true })(InventoryAdjustment)
