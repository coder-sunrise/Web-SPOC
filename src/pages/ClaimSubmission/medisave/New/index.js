import React from 'react'
import { connect } from 'dva'
// formik
import { withFormik } from 'formik'
// material ui
import { withStyles } from '@material-ui/core'
// common components
import { formatMessage } from 'umi/locale'
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

const styles = (theme) => ({
  cardContainer: {
    margin: 1,
  },
  buttonGroup: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
})

@connect(({ medisaveClaimSubmissionNew }) => ({
  medisaveClaimSubmissionNew,
}))
@withFormik({
  mapPropsToValues: () => ({}),
})
class NewMedisave extends React.Component {
  state = {
    selectedRows: [],
    isLoading: false,
  }

  componentWillMount () {
    // this.refreshDataGrid()
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
      .then((r) => {
        if (!r) {
          console.log('onRefreshClicked',r)
          this.refreshDataGrid()
            notification.success({
              message: 'Patient Info Updated.',
            })
        }
      })
  }

  handleSelectionChange = (selection) =>
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
      console.log('onSubmitClaimClicked',this.props)
      this.props
        .dispatch({
          type: 'medisaveClaimSubmissionNew/submitMedisaveClaim',
          payload: { claimIds: selectedRows },
        })
        .then((r) => {
          this.handleLoadingVisibility(false)
          if (r) {
            const failedCount = r.filter(t => t.status !== 'SUCCESS').length
            console.log('saved',r)
            if(failedCount === 0){ 
              notification.success({
                message: 'Claim Submission Success.',
              })
            }
            else {
              this.props.handleSubmitClaimStatus(failedCount)
            } 

            this.refreshDataGrid()
          }
        })
    }
  }

  render () {
    const {
      classes,
      medisaveClaimSubmissionNew,
      handleContextMenuItemClick,
      dispatch,
      values,
    } = this.props
    const { isLoading, selectedRows } = this.state
    const { list } = medisaveClaimSubmissionNew || []

    console.log('New',list)

    return (
      <CardContainer
        hideHeader
        style={{
          marginLeft: 5,
          marginRight: 5,
        }}
      >
        <BaseSearchBar
          dispatch={dispatch}
          values={values}
          modelsName='medisaveClaimSubmissionNew'
        />
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
                    rowSelectionEnabled: (row) => row.patientIsActive,
                  },
                }}
                selection={this.state.selectedRows}
                onSelectionChange={this.handleSelectionChange}
                onContextMenuItemClick={(row, id) =>
                  handleContextMenuItemClick(row, id, true)}
                type='new'
              />
              {/* <CommonTableGrid
                getRowId={(row) => row.id}
                type='medisaveClaimSubmissionNew'
                // rows={data}
                columns={NewMedisaveColumns}
                columnExtensions={NewMedisaveColumnExtensions}
                // {...TableConfig}
                // selection={selection}
                // onSelectionChange={onSelectionChange}
                // ActionProps={{ TableCellComponent: Cell }}
              /> */}
            </GridItem>

            <GridItem md={4} className={classes.buttonGroup}>
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
        </LoadingWrapper>
      </CardContainer>
    )
  }
}

export default withStyles(styles, { name: 'NewMedisave' })(NewMedisave)
