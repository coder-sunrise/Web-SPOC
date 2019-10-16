import React from 'react'
import { connect } from 'dva'
// formik
import { withFormik } from 'formik'
// material ui
import { withStyles } from '@material-ui/core'
// common components
import NearMe from '@material-ui/icons/NearMe'
import {
  ProgressButton,
  GridContainer,
  GridItem,
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
import { Progress } from 'antd'

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
      type: 'claimSubmissionDraft/query',
    })
  }

  onRefreshClicked = () => this.refreshDataGrid()

  render () {
    const overrideContextMenuOptions = [
      {
        id: 0,
        label: 'Claim Details',
        Icon: NearMe,
      },
    ]
    const {
      classes,
      claimSubmissionDraft,
      handleContextMenuItemClick,
      values,
      dispatch,
    } = this.props
    const { list } = claimSubmissionDraft || []

    return (
      <CardContainer
        hideHeader
        style={{
          marginLeft: 5,
          marginRight: 5,
        }}
      >
        <BaseSearchBar
          hideInvoiceDate
          dispatch={dispatch}
          values={values}
          modelsName='claimSubmissionDraft'
        />
        <GridContainer>
          <GridItem md={12}>
            <TableGrid
              data={list}
              columnExtensions={NewCHASColumnExtensions}
              columns={NewCHASColumns}
              tableConfig={TableConfig}
              onContextMenuItemClick={handleContextMenuItemClick}
              contextMenuOptions={overrideContextMenuOptions}
              isDraft
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
          </GridItem>
        </GridContainer>
      </CardContainer>
    )
  }
}

export default withStyles(styles, { name: 'DraftCHAS' })(DraftCHAS)
