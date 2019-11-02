import React from 'react'
import { connect } from 'dva'
// formik
import { withFormik } from 'formik'
// material ui
import { withStyles } from '@material-ui/core'
// common components
import NearMe from '@material-ui/icons/NearMe'
import { Progress } from 'antd'
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
import { DraftCHASColumnExtensions, DraftCHASColumns } from './variables'

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
              columnExtensions={DraftCHASColumnExtensions}
              columns={DraftCHASColumns}
              // tableConfig={TableConfig}
              // FuncProps={{
              //   selectable: false,
              //   selectConfig: {
              //     showSelectAll: true,
              //     rowSelectionEnabled: () => true,
              //   },
              // }}
              onContextMenuItemClick={handleContextMenuItemClick}
              contextMenuOptions={overrideContextMenuOptions}
              isDraft
              type='draft'
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
