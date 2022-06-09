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
import { LoadingWrapper, ReportViewer } from '@/components/_medisys'
import FilterBar from './components/FilterBar'
import PurchaseRequestDataGrid from './components/PurchaseRequestDataGrid'
import { getPurchaseRequestStatusFK, getAccessRight } from './variables'
import Authorized from '@/utils/Authorized'

const styles = theme => ({
  ...basicStyle(theme),
  buttonGroup: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
})

@connect(({ purchaseRequestList, global }) => ({
  purchaseRequestList,
  mainDivHeight: global.mainDivHeight,
}))
@withFormik({
  name: 'purchaseRequestList',
  enableReinitialize: true,
  mapPropsToValues: ({ purchaseRequestList }) => {
    return purchaseRequestList
  },
})
class PurchaseRequest extends Component {
  state = {
    selectedRows: [],
    isLoading: false,
    showReport: false,
    selectedRowId: '',
  }

  componentDidMount() {
    this.queryList()
  }

  queryList = () => {
    const { dispatch, purchaseRequestList } = this.props
    dispatch({
      type: 'purchaseRequestList/query',
      payload: {
        sorting: [{ columnName: 'purchaseRequestNo', direction: 'desc' }],
        lgteql_purchaseRequestDate:
          purchaseRequestList.filterSearch.transactionDates[0],
        lsteql_purchaseRequestDate:
          purchaseRequestList.filterSearch.transactionDates[1],
      },
    })
  }

  printPRReport = rowId => {
    this.setState({ selectedRowId: rowId })
    this.toggleReport()
  }

  onDeleteRow = row => {
    const { dispatch } = this.props
    dispatch({
      type: 'global/updateAppState',
      payload: {
        openConfirm: true,
        openConfirmContent: `Confirm to delete ${row.purchaseRequestNo} ?`,
        openConfirmText: 'Confirm',
        onConfirmSave: () => {
          dispatch({
            type: 'purchaseRequestDetails/deletePR',
            payload: { id: row.id },
          }).then(r => {
            notification.success({ message: 'PR cancelled' })
            this.queryList()
          })
        },
      },
    })
  }

  onSelectionChange = selection => this.setState({ selectedRows: selection })

  handleLoadingVisibility = (visibility = false) =>
    this.setState({ isLoading: visibility })

  handleResetSelection = () => this.setState({ selectedRows: [] })

  onNavigate = (type, rowId) => {
    const { history } = this.props
    const { location } = history

    switch (type) {
      case 'new':
        history.push(`${location.pathname}/details?type=${type}`)
        break
      case 'edit':
        if (!getAccessRight('purchasingrequest.modifypurchasingrequest')) {
          notification.error({
            message: 'Current user is not authorized to access',
          })
          return
        }
        history.push(`${location.pathname}/details?id=${rowId}&type=${type}`)
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
      handleNavigate: this.onNavigate,
      handleOnSelectionChange: this.onSelectionChange,
      handlePrintPRReport: this.printPRReport,
      handleDelete: this.onDeleteRow,
    }
    const { selectedRows, isLoading } = this.state
    let height =
      mainDivHeight - 120 - ($('.filterPurchaseRequestBar').height() || 0)
    if (height < 300) height = 300
    return (
      <CardContainer hideHeader>
        <LoadingWrapper linear loading={isLoading} text='Loading...'>
          <div className='filterPurchaseRequestBar'>
            <FilterBar
              actions={actionProps}
              dispatch={dispatch}
              classes={classes}
            />
          </div>
          <PurchaseRequestDataGrid
            selectedRows={selectedRows}
            actions={actionProps}
            {...this.props}
            height={height}
          />
        </LoadingWrapper>

        <CommonModal
          open={this.state.showReport}
          onClose={this.toggleReport}
          title='Purchase Request'
          maxWidth='lg'
        >
          <ReportViewer
            reportID={91}
            reportParameters={{
              PurchaseRequestId: this.state.selectedRowId,
            }}
          />
        </CommonModal>
      </CardContainer>
    )
  }
}
export default withStyles(styles, { withTheme: true })(PurchaseRequest)
