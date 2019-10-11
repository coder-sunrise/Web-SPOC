import React from 'react'
import { connect } from 'dva'
// formik
import { withFormik, FastField } from 'formik'
// material ui
import { withStyles } from '@material-ui/core'
// common components
import { LoadingWrapper } from '@/components/_medisys'
import {
  ProgressButton,
  GridContainer,
  GridItem,
  Select,
  notification,
} from '@/components'
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

@connect(({ claimSubmissionApproved }) => ({
  claimSubmissionApproved,
}))
@withFormik({
  mapPropsToValues: () => ({}),
})
class ApprovedCHAS extends React.Component {
  state = {
    selectedRows: [],
    isLoading: false,
  }

  componentDidMount () {
    this.refreshDataGrid()
  }

  onRefreshClicked = () => this.refreshDataGrid()

  handleLoadingVisibility = (visibility = false) =>
    this.setState({ isLoading: visibility })

  handleSelectionChange = (selection) =>
    this.setState({ selectedRows: selection })

  refreshDataGrid = () => {
    this.props.dispatch({
      type: 'claimSubmissionApproved/query',
    })
  }

  handleGetStatusClicked = () => {
    const { selectedRows } = this.state
    if (selectedRows.length > 0) {
      this.handleLoadingVisibility(true)
      this.props
        .dispatch({
          type: 'claimSubmissionApproved/getApprovedStatus',
          payload: { claimIds: selectedRows },
        })
        .then((r) => {
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

  render () {
    const {
      classes,
      claimSubmissionApproved,
      handleContextMenuItemClick,
      dispatch,
      values,
    } = this.props
    const { isLoading } = this.state
    const { list } = claimSubmissionApproved || []

    return (
      <React.Fragment>
        <BaseSearchBar
          dispatch={dispatch}
          values={values}
          modelsName='claimSubmissionApproved'
        >
          <GridItem md={12}>
            <FastField
              name='claimStatus'
              render={(args) => (
                <Select {...args} label='Claim Status' options={[]} />
              )}
            />
          </GridItem>
        </BaseSearchBar>{' '}
        <LoadingWrapper linear loading={isLoading} text='Get status...'>
          <GridContainer>
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
                color='primary'
                onClick={this.handleGetStatusClicked}
              >
                Get Status
              </ProgressButton>
              <ProgressButton icon={null} color='success'>
                Collect Payment
              </ProgressButton>
            </GridItem>
          </GridContainer>
        </LoadingWrapper>
      </React.Fragment>
    )
  }
}

export default withStyles(styles, { name: 'ApprovedCHAS' })(ApprovedCHAS)
