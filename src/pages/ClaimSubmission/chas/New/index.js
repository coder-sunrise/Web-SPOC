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
import { NewCHASColumnExtensions, NewCHASColumns } from './variables'

const styles = (theme) => ({
  cardContainer: {
    margin: 1,
  },
  buttonGroup: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
})

@connect(({ chasClaimSubmissionNew }) => ({
  chasClaimSubmissionNew,
}))
@withFormik({
  mapPropsToValues: () => ({}),
})
class NewCHAS extends React.Component {
  state = {
    selectedRows: [],
    isLoading: false,
  }

  componentWillMount () {
    // this.refreshDataGrid()
    this.props.dispatch({
      type: 'chasClaimSubmissionNew/query',
    })
  }

  onRefreshClicked = () => {
    const { selectedRows } = this.state
    this.props
      .dispatch({
        type: 'chasClaimSubmissionNew/refreshPatientDetails',
        payload: { claimIds: selectedRows },
      })
      .then((r) => {
        if (!r) {
          this.refreshDataGrid()
        }
      })
  }

  handleSelectionChange = (selection) =>
    this.setState({ selectedRows: selection })

  refreshDataGrid = () => {
    this.props.dispatch({
      type: 'chasClaimSubmissionNew/query',
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
          type: 'chasClaimSubmissionNew/submitChasClaim',
          payload: { claimIds: selectedRows },
        })
        .then((r) => {
          this.handleLoadingVisibility(false)
          if (r) {
            if (r.failedCount !== 0) {
              this.props.handleSubmitClaimStatus(r.failedCount)
            } else {
              notification.success({
                message: 'Claim Submission Success.',
              })
            }

            this.refreshDataGrid()
          }
        })
    }
  }

  render () {
    const {
      classes,
      chasClaimSubmissionNew,
      handleContextMenuItemClick,
      dispatch,
      values,
    } = this.props
    const { isLoading, selectedRows } = this.state
    const { list } = chasClaimSubmissionNew || []

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
          modelsName='chasClaimSubmissionNew'
        />
        <LoadingWrapper linear loading={isLoading} text='Submitting Claim...'>
          <GridContainer>
            <GridItem md={12}>
              <TableGrid
                data={list}
                columnExtensions={NewCHASColumnExtensions}
                columns={NewCHASColumns}
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
                type='chasClaimSubmissionNew'
                // rows={data}
                columns={NewCHASColumns}
                columnExtensions={NewCHASColumnExtensions}
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

export default withStyles(styles, { name: 'NewCHAS' })(NewCHAS)
