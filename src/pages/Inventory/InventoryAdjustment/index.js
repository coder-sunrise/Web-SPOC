import React, { PureComponent } from 'react'
import { connect } from 'dva'
import $ from 'jquery'
import { withStyles } from '@material-ui/core'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'

import { CardContainer, CommonModal } from '@/components'

import Filter from './Filter'
import Grid from './Grid'
import Detail from './Detail'
import moment from 'moment'

const styles = theme => ({
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

  componentDidMount() {
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
          {
            columnName: 'transactionDate',
            direction: 'desc',
            sortBy: 'adjustmentTransactionDate',
          },
          {
            columnName: 'transactionDate',
            sortBy: 'createDate',
            direction: 'desc',
          },
        ],
        lgteql_adjustmentTransactionDate: moment()
          .add(-30, 'day')
          .formatUTC(),
        lsteql_adjustmentTransactionDate: moment()
          .endOf('day')
          .formatUTC(false),
      },
    })
  }

  toggleModal = async () => {
    const { dispatch } = this.props
    this.setState(prevState => {
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

  render() {
    const { inventoryAdjustment, mainDivHeight = 700 } = this.props
    const cfg = {
      toggleModal: this.toggleModal,
    }
    let height =
      mainDivHeight - 120 - ($('.filterInventoryAdjustmentBar').height() || 0)
    if (height < 300) height = 300
    return (
      <CardContainer hideHeader>
        <div className='filterInventoryAdjustmentBar'>
          <Filter {...cfg} {...this.props} toggleModel={this.toggleModal} />
        </div>
        <Grid {...cfg} {...this.props} height={height} />
        <CommonModal
          open={this.state.open}
          observe='InventoryAdjustment'
          title={
            inventoryAdjustment.entity
              ? 'Edit Inventory Adjustment'
              : 'Add Inventory Adjustment'
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
