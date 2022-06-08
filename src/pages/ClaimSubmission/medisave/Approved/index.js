import React from 'react'
import { connect } from 'dva'
import $ from 'jquery'
import moment from 'moment'
import { formatMessage } from 'umi'
// formik
import { withFormik } from 'formik'
// material ui
import { withStyles } from '@material-ui/core'
// common components
import { LoadingWrapper } from '@/components/_medisys'
import {
  ProgressButton,
  GridContainer,
  GridItem,
  notification,
  CardContainer,
  CommonModal,
} from '@/components'
// sub components
import { PAYMENT_MODE } from '@/utils/constants'
import BaseSearchBar from '../../common/BaseSearchBar'
import TableGrid from '../TableGrid'
import CollectPaymentModal from '../../common/CollectPaymentModal'
// variables
import {
  ApprovedMedisaveColumnExtensions,
  ApprovedMedisaveColumns,
} from './variables'

const styles = theme => ({
  cardContainer: {
    margin: 1,
  },
  buttonGroup: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
})

@connect(({ claimSubmission, medisaveClaimSubmissionApproved, global }) => ({
  claimSubmission,
  medisaveClaimSubmissionApproved,
  mainDivHeight: global.mainDivHeight,
}))
@withFormik({
  mapPropsToValues: () => ({}),
})
class ApprovedMedisave extends React.Component {
  state = {
    selectedRows: [],
    isLoading: false,
    showCollectPayment: false,
  }

  componentDidMount() {
    this.refreshDataGrid()
  }

  handleLoadingVisibility = (visibility = false) =>
    this.setState({ isLoading: visibility })

  handleSelectionChange = selection => {
    this.setState({
      selectedRows: selection,
    })
  }

  refreshDataGrid = () => {
    this.props.dispatch({
      type: 'medisaveClaimSubmissionApproved/query',
    })
  }

  handleGetStatusClicked = () => {
    const { selectedRows } = this.state
    if (selectedRows.length > 0) {
      this.handleLoadingVisibility(true)
      this.props
        .dispatch({
          type: 'medisaveClaimSubmissionApproved/getApprovedStatus',
          payload: { claimIds: selectedRows },
        })
        .then(r => {
          this.handleLoadingVisibility(false)
          if (r) {
            notification.success({
              message: 'Get Status Success.',
            })
            this.refreshDataGrid()
          }
        })
    }
  }

  collectPaymentIsDisabled = (selectedRows, list) => {
    if (!list || list.length === 0) return true
    const invoiceList = list.reduce((invoices, i) => {
      if (invoices.indexOf(i.invoiceNo) < 0) invoices.push(i.invoiceNo)
      return invoices
    }, [])
    return selectedRows.length === 0 || invoiceList.length < selectedRows.length
  }

  onClickCollectPayment = () => {
    const { dispatch, medisaveClaimSubmissionApproved } = this.props
    const { selectedRows } = this.state
    const { list } = medisaveClaimSubmissionApproved || []
    const rows = list.filter(i => selectedRows.includes(i.id))
    const outstandingPayment = rows
      .filter(
        x => x.approvedAmount > 0 || x.approvedAmount - x.collectedPayment > 0,
      )
      .map(x => {
        x.amountReceived = x.approvedAmount - x.collectedPayment
        return x
      })

    dispatch({
      type: 'medisaveClaimSubmissionApproved/updateState',
      payload: {
        entity: {
          rows: outstandingPayment,
          paymentDate: moment(),
          paymentModeFK: PAYMENT_MODE.GIRO,
        },
      },
    })
    this.setState({ showCollectPayment: true })
  }

  onCloseCollectPayment = () => this.setState({ showCollectPayment: false })

  collectPaymentSuccess = () => {
    this.refreshDataGrid()
    this.onCloseCollectPayment()
  }

  render() {
    const {
      classes,
      medisaveClaimSubmissionApproved,
      handleContextMenuItemClick,
      dispatch,
      values,
      mainDivHeight = 700,
    } = this.props
    const { isLoading } = this.state
    const { list } = medisaveClaimSubmissionApproved || []
    const { showCollectPayment } = this.state
    const { selectedRows } = this.state
    let height =
      mainDivHeight -
      185 -
      ($('.filterMedisaveApprovedBar').height() || 0) -
      ($('.footerMedisaveApprovedBar').height() || 0)
    if (height < 300) height = 300
    return (
      <CardContainer
        hideHeader
        style={{
          marginLeft: 5,
          marginRight: 5,
        }}
      >
        <div className='filterMedisaveApprovedBar'>
          <BaseSearchBar
            dispatch={dispatch}
            values={values}
            modelsName='medisaveClaimSubmissionApproved'
          />
        </div>
        <LoadingWrapper linear loading={isLoading} text='Get status...'>
          <GridContainer>
            <GridItem md={12}>
              <TableGrid
                data={list}
                columnExtensions={ApprovedMedisaveColumnExtensions}
                columns={ApprovedMedisaveColumns}
                FuncProps={{
                  selectable: true,
                  selectConfig: {
                    showSelectAll: true,
                    rowSelectionEnabled: row =>
                      row.patientIsActive &&
                      !(row.approvedAmount === row.collectedPayment),
                  },
                }}
                selection={this.state.selectedRows}
                onSelectionChange={this.handleSelectionChange}
                onContextMenuItemClick={handleContextMenuItemClick}
                type='approved'
                height={height}
              />
            </GridItem>
          </GridContainer>
          <div className='footerMedisaveApprovedBar'>
            <GridContainer>
              <GridItem md={12} style={{ marginTop: 10 }}>
                <p className={classes.footerNote}>
                  Approved Amt. only available for Paid claim status.
                </p>
              </GridItem>
              <GridItem md={12} className={classes.buttonGroup}>
                <ProgressButton
                  icon={null}
                  color='primary'
                  disabled={selectedRows.length <= 0}
                  onClick={this.handleGetStatusClicked}
                >
                  {formatMessage({
                    id: 'claimsubmission.invoiceClaim.GetStatus',
                  })}
                </ProgressButton>
                <ProgressButton
                  icon={null}
                  color='success'
                  onClick={this.onClickCollectPayment}
                  disabled={this.collectPaymentIsDisabled(selectedRows, list)}
                >
                  {formatMessage({
                    id: 'claimsubmission.invoiceClaim.CollectPayment',
                  })}
                </ProgressButton>
              </GridItem>
            </GridContainer>
          </div>
        </LoadingWrapper>
        <CommonModal
          title='Collect Payment'
          maxWidth='lg'
          open={showCollectPayment}
          onClose={this.onCloseCollectPayment}
          onConfirm={this.collectPaymentSuccess}
        >
          <CollectPaymentModal closeModal={this.onCloseCollectPayment} />
        </CommonModal>
      </CardContainer>
    )
  }
}

export default withStyles(styles, { name: 'ApprovedMedisave' })(
  ApprovedMedisave,
)
