import React from 'react'
import { connect } from 'dva'
import $ from 'jquery'
import { formatMessage } from 'umi'
// formik
import { withFormik } from 'formik'
// material ui
import { withStyles } from '@material-ui/core'
// common components
import {
  ProgressButton,
  GridContainer,
  GridItem,
  notification,
  CardContainer,
  Tooltip,
} from '@/components'
import { LoadingWrapper } from '@/components/_medisys'
import Authorized from '@/utils/Authorized'
// sub components
import BaseSearchBar from '../../common/BaseSearchBar'
import TableGrid from '../TableGrid'
// variables
import { RejectedCHASColumnExtensions, RejectedCHASColumns } from './variables'

const styles = theme => ({
  cardContainer: {
    margin: 1,
  },
  buttonGroup: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
})

@connect(({ chasClaimSubmissionRejected, global }) => ({
  chasClaimSubmissionRejected,
  mainDivHeight: global.mainDivHeight,
}))
@withFormik({
  mapPropsToValues: () => ({}),
})
class RejectedCHAS extends React.Component {
  state = {
    selectedRows: [],
    isLoading: false,
  }

  componentDidMount() {
    this.refreshDataGrid()
  }

  onRefreshClicked = () => {
    const { selectedRows } = this.state
    this.props
      .dispatch({
        type: 'chasClaimSubmissionRejected/refreshPatientDetails',
        payload: { claimIds: selectedRows },
      })
      .then(r => {
        if (!r) {
          this.refreshDataGrid()
        }
      })
  }

  refreshDataGrid = () => {
    this.props.dispatch({
      type: 'chasClaimSubmissionRejected/query',
    })
  }

  handleSelectionChange = selection =>
    this.setState({ selectedRows: selection })

  handleLoadingVisibility = (visibility = false) =>
    this.setState({ isLoading: visibility })

  onReSubmitClaimClicked = () => {
    const { selectedRows } = this.state
    if (selectedRows.length > 0) {
      this.handleLoadingVisibility(true)
      this.props
        .dispatch({
          type: 'chasClaimSubmissionRejected/reSubmitChasClaim',
          payload: { claimIds: selectedRows },
        })
        .then(r => {
          this.handleLoadingVisibility(false)
          if (r) {
            if (r.failedCount !== 0) {
              console.log(this.props)
              this.props.handleSubmitClaimStatus(r.failedCount)
            } else {
              notification.success({
                message: 'Claim Re-Submission Success.',
              })
            }

            this.refreshDataGrid()
          }
        })
    }
  }

  render() {
    const {
      classes,
      chasClaimSubmissionRejected,
      handleContextMenuItemClick,
      dispatch,
      values,
      mainDivHeight = 700,
    } = this.props
    const { isLoading, selectedRows } = this.state
    const { list } = chasClaimSubmissionRejected || []
    let height =
      mainDivHeight -
      185 -
      ($('.filterChasRejectedBar').height() || 0) -
      ($('.footerChasRejectedBar').height() || 0)
    if (height < 300) height = 300
    return (
      <CardContainer
        hideHeader
        style={{
          marginLeft: 5,
          marginRight: 5,
        }}
      >
        <div className='filterChasRejectedBar'>
          <BaseSearchBar
            dispatch={dispatch}
            values={values}
            modelsName='chasClaimSubmissionRejected'
          />
        </div>
        <LoadingWrapper
          linear
          loading={isLoading}
          text='Re-submitting Claim...'
        >
          <GridContainer>
            <GridItem md={12}>
              <TableGrid
                data={list}
                columnExtensions={RejectedCHASColumnExtensions}
                columns={RejectedCHASColumns}
                FuncProps={{
                  selectable: true,
                  selectConfig: {
                    showSelectAll: true,
                    rowSelectionEnabled: row => row.patientIsActive,
                  },
                }}
                selection={this.state.selectedRows}
                onSelectionChange={this.handleSelectionChange}
                onContextMenuItemClick={(row, id) =>
                  handleContextMenuItemClick(row, id, true)
                }
                type='rejected'
                height={height}
              />
            </GridItem>
          </GridContainer>
          <div className='footerChasRejectedBar'>
            <GridContainer>
              <GridItem md={12} className={classes.buttonGroup}>
                <Tooltip
                  placement='bottom-start'
                  title={formatMessage({
                    id:
                      'claimsubmission.invoiceClaim.refreshPatientDetail.tooltips',
                  })}
                >
                  <div style={{ display: 'inline-block' }}>
                    <ProgressButton
                      icon={null}
                      color='info'
                      disabled={selectedRows.length <= 0}
                      onClick={this.onRefreshClicked}
                    >
                      {formatMessage({
                        id: 'claimsubmission.invoiceClaim.refreshPatientDetail',
                      })}
                    </ProgressButton>
                  </div>
                </Tooltip>
                <Authorized authority='claimsubmission.submitclaim'>
                  <ProgressButton
                    icon={null}
                    color='primary'
                    disabled={selectedRows.length <= 0}
                    onClick={this.onReSubmitClaimClicked}
                  >
                    {formatMessage({
                      id: 'claimsubmission.invoiceClaim.ResubmitClaim',
                    })}
                  </ProgressButton>
                </Authorized>
              </GridItem>
            </GridContainer>
          </div>
        </LoadingWrapper>
      </CardContainer>
    )
  }
}

export default withStyles(styles, { name: 'RejectedCHAS' })(RejectedCHAS)
