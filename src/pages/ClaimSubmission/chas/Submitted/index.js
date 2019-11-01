import React from 'react'
import { connect } from 'dva'
// formik
import { withFormik } from 'formik'
// material ui
import { withStyles } from '@material-ui/core'
// common components
import { LoadingWrapper } from '@/components/_medisys'
import {
  GridContainer,
  GridItem,
  notification,
  ProgressButton,
  CardContainer,
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

@connect(({ claimSubmissionSubmitted }) => ({
  claimSubmissionSubmitted,
}))
@withFormik({
  mapPropsToValues: () => ({}),
})
class SubmittedCHAS extends React.Component {
  state = {
    selectedRows: [],
    isLoading: false,
  }

  componentDidMount () {
    this.refreshDataGrid()
  }

  handleLoadingVisibility = (visibility = false) =>
    this.setState({ isLoading: visibility })

  onRefreshClicked = () => this.refreshDataGrid()

  handleSelectionChange = (selection) =>
    this.setState({ selectedRows: selection })

  refreshDataGrid = () => {
    this.props.dispatch({
      type: 'claimSubmissionSubmitted/query',
    })
  }

  handleSelectionChange = (selection) => {
    this.setState({ selectedRows: selection })
  }

  handleGetStatusClicked = () => {
    const { selectedRows } = this.state
    if (selectedRows.length > 0) {
      this.handleLoadingVisibility(true)
      this.props
        .dispatch({
          type: 'claimSubmissionSubmitted/getSubmittedStatus',
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
      claimSubmissionSubmitted,
      handleContextMenuItemClick,
      dispatch,
      values,
    } = this.props
    const { isLoading } = this.state
    const { list } = claimSubmissionSubmitted || []

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
          modelsName='claimSubmissionSubmitted'
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
                type='submitted'
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
            </GridItem>
          </LoadingWrapper>
        </GridContainer>
      </CardContainer>
    )
  }
}

export default withStyles(styles, { name: 'SubmittedCHAS' })(SubmittedCHAS)
