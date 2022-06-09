import React, { Component } from 'react'
import { connect } from 'dva'
import $ from 'jquery'
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
import { ReportViewer } from '@/components/_medisys'
import FilterBar from './components/FilterBar'
import ReceivingGoodsDataGrid from './components/ReceivingGoodsDataGrid'
import WriteOff from './components/Modal/WriteOff'
import DuplicateRG from './components/Modal/DuplicateRG'
import { getAccessRight } from './variables'

const styles = theme => ({
  ...basicStyle(theme),
  buttonGroup: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
})

@connect(({ receivingGoodsList, global }) => ({
  receivingGoodsList,
  mainDivHeight: global.mainDivHeight,
}))
@withFormik({
  name: 'receivingGoodsList1',
  enableReinitialize: true,
  mapPropsToValues: ({ receivingGoodsList }) => {
    return receivingGoodsList
  },
})
class ReceivingGoods extends Component {
  state = {
    showWriteOff: false,
    showDuplicateRG: false,
    selectedRows: [],
    showReport: false,
    selectedRowId: '',
  }

  componentDidMount() {
    const { dispatch, receivingGoodsList } = this.props
    dispatch({
      type: 'receivingGoodsList/query',
      payload: {
        sorting: [{ columnName: 'receivingGoodsNo', direction: 'asc' }],
        lgteql_receivingGoodsDate:
          receivingGoodsList.filterSearch.transactionDates[0],
        lsteql_receivingGoodsDate:
          receivingGoodsList.filterSearch.transactionDates[1],
      },
    })
  }

  printRGReport = rowId => {
    this.setState({ selectedRowId: rowId })
    this.toggleReport()
  }

  onSelectionChange = selection => this.setState({ selectedRows: selection })

  onWriteOffClick = () => this.setState({ showWriteOff: true })

  onDuplicateRGClick = rowId => {
    const { dispatch, receivingGoodsList } = this.props
    const { list } = receivingGoodsList
    dispatch({
      type: 'receivingGoodsList/updateState',
      payload: {
        entity: list.find(o => o.id === rowId),
      },
    })
    this.setState({ showDuplicateRG: true })
  }

  handleResetSelection = () => this.setState({ selectedRows: [] })

  closeWriteOffModal = () => this.setState({ showWriteOff: false })

  closeDuplicateRGModal = () => this.setState({ showDuplicateRG: false })

  onSubmitWriteOff = writeOffReason => {
    this.closeWriteOffModal()
    this.handleBatchWriteOff(writeOffReason)
  }

  handleBatchWriteOff = writeOffReason => {
    const { selectedRows } = this.state
    const { dispatch } = this.props
    dispatch({
      type: 'receivingGoodsList/batchWriteOff',
      payload: {
        receivingGoodsIds: selectedRows,
        writeOffReason,
      },
    }).then(r => {
      if (r) {
        this.handleResetSelection()
        notification.success({
          message: 'Write-Off complete.',
        })
        dispatch({
          type: 'receivingGoodsList/query',
        })
      }
    })
  }

  onNavigate = (type, rowId) => {
    const { history } = this.props
    const { location } = history

    switch (type) {
      case 'new':
        history.push(`${location.pathname}/rgdetails?type=${type}`)
        break
      case 'dup':
        history.push(`${location.pathname}/rgdetails?id=${rowId}&type=${type}`)
        break
      case 'edit':
        if (!getAccessRight()) {
          notification.error({
            message: 'Current user is not authorized to access',
          })
          return
        }
        history.push(`${location.pathname}/rgdetails?id=${rowId}&type=${type}`)
        break
      default:
        break
    }
  }

  toggleReport = () => {
    this.setState(preState => ({
      showReport: !preState.showReport,
    }))
  }

  render() {
    const { classes, dispatch, mainDivHeight = 700 } = this.props
    const actionProps = {
      handleWriteOff: this.onWriteOffClick,
      handleDuplicateRG: this.onDuplicateRGClick,
      handleNavigate: this.onNavigate,
      handleOnSelectionChange: this.onSelectionChange,
      handlePrintRGReport: this.printRGReport,
    }
    const { showWriteOff, showDuplicateRG, selectedRows } = this.state
    let height =
      mainDivHeight -
      120 -
      ($('.filterReceivingGoodsBar').height() || 0) -
      ($('.footerReceivingGoodsBar').height() || 0)
    if (height < 300) height = 300
    return (
      <CardContainer hideHeader>
        <div className='filterReceivingGoodsBar'>
          <FilterBar
            actions={actionProps}
            dispatch={dispatch}
            classes={classes}
          />
        </div>
        <ReceivingGoodsDataGrid
          selectedRows={selectedRows}
          actions={actionProps}
          {...this.props}
          height={height}
        />

        <CommonModal
          open={showWriteOff}
          title='Write-Off'
          maxWidth='sm'
          onConfirm={this.closeWriteOffModal}
          onClose={this.closeWriteOffModal}
        >
          <WriteOff handleSubmit={this.onSubmitWriteOff} />
        </CommonModal>

        <CommonModal
          open={showDuplicateRG}
          title='Duplicate Receiving Goods'
          maxWidth='sm'
          onConfirm={this.closeDuplicateRGModal}
          onClose={this.closeDuplicateRGModal}
        >
          <DuplicateRG actions={actionProps} {...this.props} />
        </CommonModal>
        <div className='footerReceivingGoodsBar' style={{ marginTop: 10 }}>
          <Button
            color='primary'
            onClick={this.onWriteOffClick}
            disabled={selectedRows.length === 0 || selectedRows === undefined}
          >
            Write-Off
          </Button>
        </div>

        <CommonModal
          open={this.state.showReport}
          onClose={this.toggleReport}
          title='Receiving Goods'
          maxWidth='lg'
        >
          <ReportViewer
            reportID={65}
            reportParameters={{
              receivingGoodsId: this.state.selectedRowId,
            }}
          />
        </CommonModal>
      </CardContainer>
    )
  }
}
export default withStyles(styles, { withTheme: true })(ReceivingGoods)
