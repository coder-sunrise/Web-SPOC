import React, { Component } from 'react'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'
import {
  CardContainer,
  withFormik,
  CommonModal,
  GridItem,
  Button,
  notification,
} from '@/components'
import { LoadingWrapper, ReportViewer } from '@/components/_medisys'
import FilterBar from './components/FilterBar'
import PurchaseReceiveDataGrid from './components/PurchaseReceiveDataGrid'
import WriteOff from './components/Modal/WriteOff'
import DuplicatePO from './components/Modal/DuplicatePO'
import { getPurchaseOrderStatusFK } from './variables'

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
@withFormik({
  name: 'purchaseReceiveList',
  enableReinitialize: true,
  mapPropsToValues: ({ purchaseReceiveList }) => {
    // console.log('purchaseReceiveList', purchaseReceiveList)
    return purchaseReceiveList
  },
})
class PurchaseReceive extends Component {
  state = {
    showWriteOff: false,
    showDuplicatePO: false,
    selectedRows: [],
    isLoading: false,
    showReport: false,
    selectedRowId: '',
  }

  componentDidMount () {
    // this.props.dispatch({
    //   type: 'purchaseReceiveList/query',
    //   payload: {
    //     sorting: [
    //       { columnName: 'purchaseOrderNo', direction: 'asc' },
    //     ],
    //   },
    // })
  }

  printPOReport = (rowId) => {
    this.setState({ selectedRowId: rowId })
    this.toggleReport()
  }

  onSelectionChange = (selection) => this.setState({ selectedRows: selection })

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

  handleLoadingVisibility = (visibility = false) =>
    this.setState({ isLoading: visibility })

  handleResetSelection = () => this.setState({ selectedRows: [] })

  closeWriteOffModal = () => this.setState({ showWriteOff: false })

  closeDuplicatePOModal = () => this.setState({ showDuplicatePO: false })

  onSubmitWriteOff = (writeOffReason) => {
    this.handleLoadingVisibility(true)
    this.closeWriteOffModal()
    this.handleBatchWriteOff(writeOffReason)
  }

  handleBatchWriteOff = async (writeOffReason) => {
    const { selectedRows } = this.state
    const { dispatch, purchaseReceiveList } = this.props
    const { list } = purchaseReceiveList

    await selectedRows.map((item, index, arr) => {
      const searchedPO = list.find((po) => po.id === item)
      dispatch({
        type: 'purchaseReceiveList/batchWriteOff',
        payload: {
          ...searchedPO,
          purchaseOrderStatusFK: getPurchaseOrderStatusFK(
            searchedPO.purchaseOrderStatus,
          ).id,
          invoiceStatusFK: 4,
          invoiceStatus: 'Write-Off',
          purchaseOrderStatusCode: 'WRITEOFF',
          writeOffReason,
          // ** HARDCODED FIELD BELOW, remove these field once Soe updated the API
          // isGstInclusive: false,
          // AdjustmentAmount: 0,
          // GSTValue: 0,
          // GSTAmount: 0,
          // TotalAmount: 0,
          // supplierFK: 11,
        },
      }).then((r) => {
        if (r) {
          //
        }

        // Handle action at last iteration
        if (arr.length - 1 === index) {
          this.handleLoadingVisibility(false)
          this.handleResetSelection()
          notification.success({
            message: 'Write-Off complete.',
          })
          dispatch({
            type: 'purchaseReceiveList/query',
          })
        }
      })
    })
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

  toggleReport = () => {
    this.setState((preState) => ({
      showReport: !preState.showReport,
    }))
  }

  render () {
    const { classes, dispatch } = this.props
    const actionProps = {
      handleWriteOff: this.onWriteOffClick,
      handleDuplicatePO: this.onDuplicatePOClick,
      handleNavigate: this.onNavigate,
      handleOnSelectionChange: this.onSelectionChange,
      handlePrintPOReport: this.printPOReport,
    }
    const {
      showWriteOff,
      showDuplicatePO,
      selectedRows,
      isLoading,
    } = this.state

    return (
      <CardContainer hideHeader>
        <LoadingWrapper
          linear
          loading={isLoading}
          text='Processing Write-Off...'
        >
          <FilterBar
            actions={actionProps}
            dispatch={dispatch}
            classes={classes}
          />
          <PurchaseReceiveDataGrid
            selectedRows={selectedRows}
            actions={actionProps}
            {...this.props}
          />

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
            maxWidth='sm'
            onConfirm={this.closeDuplicatePOModal}
            onClose={this.closeDuplicatePOModal}
          >
            <DuplicatePO actions={actionProps} {...this.props} />
          </CommonModal>
          <GridItem md={4} className={classes.buttonGroup}>
            <Button
              color='primary'
              onClick={this.onWriteOffClick}
              disabled={selectedRows.length === 0 || selectedRows === undefined}
            >
              Write-Off
            </Button>
          </GridItem>
        </LoadingWrapper>

        <CommonModal
          open={this.state.showReport}
          onClose={this.toggleReport}
          title='Purchase Order'
          maxWidth='lg'
        >
          <ReportViewer
            reportID={26}
            reportParameters={{
              PurchaseOrderId: this.state.selectedRowId,
            }}
          />
        </CommonModal>
      </CardContainer>
    )
  }
}
export default withStyles(styles, { withTheme: true })(PurchaseReceive)
