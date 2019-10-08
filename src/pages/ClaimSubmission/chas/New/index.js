import React from 'react'
import { connect } from 'dva'
// formik
import { withFormik } from 'formik'
// material ui
import { withStyles } from '@material-ui/core'
// common components
import { Button, GridContainer, GridItem } from '@/components'
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

@connect(({ claimSubmissionNew }) => ({
  claimSubmissionNew,
}))
@withFormik({
  mapPropsToValues: () => ({}),
})
class NewCHAS extends React.Component {
  state = {
    selectedRows: [],
  }

  componentDidMount () {
    this.refreshDataGrid()
  }

  onRefreshClicked = () => this.refreshDataGrid()

  handleSelectionChange = (selection) =>
    this.setState({ selectedRows: selection })

  refreshDataGrid = () => {
    this.props.dispatch({
      type: 'claimSubmissionNew/query',
    })
  }

  render () {
    const {
      classes,
      claimSubmissionNew,
      handleContextMenuItemClick,
      dispatch,
      values,
    } = this.props
    const { list } = claimSubmissionNew || []

    return (
      <React.Fragment>
        <BaseSearchBar
          dispatch={dispatch}
          values={values}
          modelsName='claimSubmissionNew'
        />
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
            <Button color='info' onClick={this.onRefreshClicked}>
              Refresh
            </Button>
            <Button color='primary'>Submit Claim</Button>
          </GridItem>
        </GridContainer>
      </React.Fragment>
    )
  }
}

export default withStyles(styles, { name: 'NewCHAS' })(NewCHAS)
