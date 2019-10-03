import React from 'react'
import { connect } from 'dva'
// formik
import { withFormik } from 'formik'
// material ui
import { withStyles } from '@material-ui/core'
// common components
import { Button, CardContainer, GridContainer, GridItem } from '@/components'
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

@connect(({ claimSubmissionDraft }) => ({
  claimSubmissionDraft,
}))
@withFormik({
  mapPropsToValues: () => ({}),
})
class DraftCHAS extends React.Component {
  componentDidMount () {
    this.refreshDataGrid()
  }

  refreshDataGrid = () => {
    this.props.dispatch({
      type: 'claimSubmissionDraft/fakeQueryDone',
      payload: {
        status: 'draft',
      },
    })
  }

  onRefreshClicked = () => this.refreshDataGrid()

  render () {
    const {
      classes,
      claimSubmissionDraft,
      handleContextMenuItemClick,
    } = this.props
    const { list } = claimSubmissionDraft || []

    return (
      <CardContainer hideHeader size='sm'>
        <BaseSearchBar hideInvoiceDate />
        <GridContainer>
          <GridItem md={12}>
            <TableGrid
              data={list}
              columnExtensions={NewCHASColumnExtensions}
              columns={NewCHASColumns}
              tableConfig={TableConfig}
              onContextMenuItemClick={handleContextMenuItemClick}
            />
          </GridItem>
          <GridItem md={4} className={classes.buttonGroup}>
            <Button color='info' onClick={this.onRefreshClicked}>
              Refresh
            </Button>
          </GridItem>
        </GridContainer>
      </CardContainer>
    )
  }
}

export default withStyles(styles, { name: 'DraftCHAS' })(DraftCHAS)
