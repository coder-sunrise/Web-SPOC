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
class InventoryAdjustment extends PureComponent {
  state = {
    // runningNo: '',
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
    // this.props
    //   .dispatch({
    //     type: 'inventoryAdjustment/generateRunningNo',
    //   })
    //   .then((v) => {
    //     const { data } = v
    //     this.setState({ runningNo: data })
    //   })
  }

  toggleModal = async () => {
    const { dispatch, inventoryAdjustment } = this.props
    // await dispatch({
    //   type: 'inventoryAdjustment/updateState',
    //   payload: {
    //     showModal: !inventoryAdjustment.showModal,
    //   },
    // })
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

  // getRunningNo = () => {
  //   this.props
  //     .dispatch({
  //       type: 'inventoryAdjustment/generateRunningNo',
  //     })
  //     .then((v) => {
  //       const { data } = v
  //       this.setState({ runningNo: data })
  //     })
  // }

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
        <Filter {...cfg} {...this.props} toggleModel={this.toggleModal} />
        <Grid {...cfg} {...this.props} />
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
          <Detail
            {...cfg}
            {...this.props}
            // runningNo={this.state.runningNo}
            // getRunningNo={this.getRunningNo}
          />
        </CommonModal>
      </CardContainer>
    )
  }
}

export default withStyles(styles, { withTheme: true })(InventoryAdjustment)
