import React, { Component } from 'react'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'
import {
  CardContainer,
  withFormikExtend,
  CommonModal,
  GridItem,
  Button,
} from '@/components'
import FilterBar from './components/FilterBar'
import PurchaseReceiveDataGrid from './components/PurchaseReceiveDataGrid'
import WriteOff from './components/Modal/WriteOff'
import DuplicatePO from './components/Modal/DuplicatePO'

const styles = (theme) => ({
  ...basicStyle(theme),
  buttonGroup: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
})

@connect(({ purchaseReceiveList }) => ({
  purchaseReceiveList,
}))
@withFormikExtend({
  name: 'purchaseReceiveList',
  mapPropsToValues: ({ purchaseReceiveList }) => {
    return purchaseReceiveList
  },
})
class PurchaseReceive extends Component {
  state = {
    showWriteOff: false,
    showDuplicatePO: false,
  }

  componentDidMount () {
    this.props.dispatch({
      type: 'purchaseReceiveList/query',
    })
  }

  onWriteOffClick = () => this.setState({ showWriteOff: true })

  onDuplicatePOClick = (rowId) => {
    const { dispatch, purchaseReceiveList } = this.props
    const { list } = purchaseReceiveList
    dispatch({
      type: 'purchaseReceiveList/updateState',
      payload: {
        entity: list.find((o) => o.id === rowId),
      },
    })
    this.setState({ showDuplicatePO: true })
  }

  closeWriteOffModal = () => this.setState({ showWriteOff: false })

  closeDuplicatePOModal = () => this.setState({ showDuplicatePO: false })

  onSubmitWriteOff = (writeOffReason) => {
    this.closeWriteOffModal()
  }

  onNavigate = (type, rowId) => {
    const { history } = this.props
    const { location } = history
    switch (type) {
      case 'new':
        history.push(`${location.pathname}/pdodetails?type=${type}`)
        break
      case 'dup':
        history.push(`${location.pathname}/pdodetails?id=${rowId}&type=${type}`)
        break
      case 'edit':
        history.push(`${location.pathname}/pdodetails?id=${rowId}&type=${type}`)
        break
      default:
        break
    }
  }

  render () {
    const { classes } = this.props
    const actionProps = {
      handleWriteOff: this.onWriteOffClick,
      handleDuplicatePO: this.onDuplicatePOClick,
      handleNavigate: this.onNavigate,
    }

    const { showWriteOff, showDuplicatePO } = this.state

    return (
      <CardContainer hideHeader>
        <FilterBar actions={actionProps} {...this.props} />
        <PurchaseReceiveDataGrid actions={actionProps} {...this.props} />
        <CommonModal
          open={showWriteOff}
          title='Write-Off'
          maxWidth='xs'
          onConfirm={this.closeWriteOffModal}
          onClose={this.closeWriteOffModal}
        >
          <WriteOff handleSubmit={this.onSubmitWriteOff} />
        </CommonModal>

        <CommonModal
          open={showDuplicatePO}
          title='Duplicate Purchase Order'
          maxWidth='xs'
          onConfirm={this.closeDuplicatePOModal}
          onClose={this.closeDuplicatePOModal}
        >
          <DuplicatePO actions={actionProps} {...this.props} />
        </CommonModal>
        <GridItem md={4} className={classes.buttonGroup}>
          <Button color='primary' onClick={this.onWriteOffClick}>
            Write-Off
          </Button>
        </GridItem>
      </CardContainer>
    )
  }
}
export default withStyles(styles, { withTheme: true })(PurchaseReceive)
