import React from 'react'
import { connect } from 'dva'
import $ from 'jquery'
// formik
import { withFormik } from 'formik'
// material ui
import { withStyles } from '@material-ui/core'
// common components
import { formatMessage } from 'umi'
import { LoadingWrapper } from '@/components/_medisys'
import {
  ProgressButton,
  GridContainer,
  GridItem,
  notification,
  CardContainer,
  Tooltip,
} from '@/components'
// sub components
import Authorized from '@/utils/Authorized'
import BaseSearchBar from '../../common/BaseSearchBar'
import TableGrid from '../TableGrid'
// variables
import { NewMedisaveColumnExtensions, NewMedisaveColumns } from './variables'

const styles = theme => ({
  cardContainer: {
    margin: 1,
  },
  buttonGroup: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
})

@connect(({ medisaveClaimSubmissionNew, global }) => ({
  medisaveClaimSubmissionNew,
  mainDivHeight: global.mainDivHeight,
}))
@withFormik({
  mapPropsToValues: () => ({}),
})
class NewMedisave extends React.Component {
  state = {
    selectedRows: [],
    isLoading: false,
  }

  componentWillMount() {
    this.props.dispatch({
      type: 'medisaveClaimSubmissionNew/query',
    })
  }

  onRefreshClicked = () => {
    const { selectedRows } = this.state
    this.props
      .dispatch({
        type: 'medisaveClaimSubmissionNew/refreshPatientDetails',
        payload: { claimIds: selectedRows },
      })
      .then(r => {
        if (!r) {
          this.refreshDataGrid()
          notification.success({
            message: 'Patient Info Updated.',
          })
        }
      })
  }

  handleSelectionChange = selection =>
    this.setState({ selectedRows: selection })

  refreshDataGrid = () => {
    this.props.dispatch({
      type: 'medisaveClaimSubmissionNew/query',
    })
  }

  handleLoadingVisibility = (visibility = false) =>
    this.setState({ isLoading: visibility })

  onSubmitClaimClicked = () => {
    const { selectedRows } = this.state
    if (selectedRows.length > 0) {
      this.handleLoadingVisibility(true)
      this.props
        .dispatch({
          type: 'medisaveClaimSubmissionNew/submitMedisaveClaim',
          payload: { claimIds: selectedRows },
        })
        .then(r => {
          this.handleLoadingVisibility(false)
          if (r) {
            const failedCount = r.filter(t => t.status !== 'SUCCESS').length
            if (failedCount === 0) {
              notification.success({
                message: 'Claim Submission Success.',
              })
            } else {
              this.props.handleSubmitClaimStatus(failedCount)
            }

            this.refreshDataGrid()
          }
        })
    }
  }

  render() {
    const {
      classes,
      medisaveClaimSubmissionNew,
      handleContextMenuItemClick,
      dispatch,
      values,
      mainDivHeight = 700,
    } = this.props
    const { isLoading, selectedRows } = this.state
    const { list } = medisaveClaimSubmissionNew || []
    let height =
      mainDivHeight -
      185 -
      ($('.filterMedisaveNewBar').height() || 0) -
      ($('.footerMedisaveNewBar').height() || 0)
    if (height < 300) height = 300
    return (
      <CardContainer
        hideHeader
        style={{
          marginLeft: 5,
          marginRight: 5,
        }}
      >
        <div className='filterMedisaveNewBar'>
          <BaseSearchBar
            dispatch={dispatch}
            values={values}
            modelsName='medisaveClaimSubmissionNew'
          />
        </div>
        <LoadingWrapper linear loading={isLoading} text='Submitting Claim...'>
          <GridContainer>
            <GridItem md={12}>
              <TableGrid
                data={list}
                columnExtensions={NewMedisaveColumnExtensions}
                columns={NewMedisaveColumns}
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
                type='new'
                height={height}
              />
            </GridItem>
          </GridContainer>
          <div className='footerMedisaveNewBar'>
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
                    onClick={this.onSubmitClaimClicked}
                  >
                    {formatMessage({
                      id: 'claimsubmission.invoiceClaim.SubmitClaim',
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

export default withStyles(styles, { name: 'NewMedisave' })(NewMedisave)
