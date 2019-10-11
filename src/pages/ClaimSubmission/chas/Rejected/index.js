import React from 'react'
import { connect } from 'dva'
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
} from '@/components'
import { LoadingWrapper } from '@/components/_medisys'
// sub components
import BaseSearchBar from '../../common/BaseSearchBar'
import TableGrid from '../../common/TableGrid'
// variables
import {
  NewCHASColumnExtensions,
  NewCHASColumns,
  TableConfig,
} from './variables'

const styles = (theme) => ({
  cardContainer: {
    margin: 1,
  },
  buttonGroup: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
})

@connect(({ claimSubmissionRejected }) => ({
  claimSubmissionRejected,
}))
@withFormik({
  mapPropsToValues: () => ({}),
})
class RejectedCHAS extends React.Component {
  state = {
    selectedRows: [],
    isLoading: false,
  }

  componentDidMount () {
    this.refreshDataGrid()
  }

  onRefreshClicked = () => this.refreshDataGrid()

  refreshDataGrid = () => {
    this.props.dispatch({
      type: 'claimSubmissionRejected/query',
    })
  }

  handleSelectionChange = (selection) =>
    this.setState({ selectedRows: selection })

  handleLoadingVisibility = (visibility = false) =>
    this.setState({ isLoading: visibility })

  onReSubmitClaimClicked = () => {
    const { selectedRows } = this.state
    if (selectedRows.length > 0) {
      this.handleLoadingVisibility(true)
      this.props
        .dispatch({
          type: 'claimSubmissionRejected/reSubmitChasClaim',
          payload: { claimIds: selectedRows },
        })
        .then((r) => {
          this.handleLoadingVisibility(false)
          if (r) {
            if (r.failedCount !== 0) {
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

  render () {
    const {
      classes,
      claimSubmissionRejected,
      handleContextMenuItemClick,
      dispatch,
      values,
    } = this.props
    const { isLoading } = this.state
    const { list } = claimSubmissionRejected || []

    return (
      <React.Fragment>
        <BaseSearchBar
          dispatch={dispatch}
          values={values}
          modelsName='claimSubmissionRejected'
        />
        <GridContainer>
          <LoadingWrapper linear loading={isLoading} text='Get status...'>
            <GridItem md={12}>
              <TableGrid
                data={list}
                columnExtensions={NewCHASColumnExtensions}
                columns={NewCHASColumns}
                tableConfig={TableConfig}
                selection={this.state.selectedRows}
                onSelectionChange={this.handleSelectionChange}
                onContextMenuItemClick={handleContextMenuItemClick}
              />
            </GridItem>
            <GridItem md={4} className={classes.buttonGroup}>
              <ProgressButton
                icon={null}
                color='info'
                onClick={this.onRefreshClicked}
              >
                Refresh
              </ProgressButton>
              <ProgressButton
                icon={null}
                color='primary'
                onClick={this.onReSubmitClaimClicked}
              >
                Re-Submit Claim
              </ProgressButton>
            </GridItem>
          </LoadingWrapper>
        </GridContainer>
      </React.Fragment>
    )
  }
}

export default withStyles(styles, { name: 'RejectedCHAS' })(RejectedCHAS)
