import React from 'react'
import { connect } from 'dva'
// formik
import { withFormik } from 'formik'
import { formatMessage } from 'umi/locale'
// material ui
import { withStyles } from '@material-ui/core'
// common components1
import NearMe from '@material-ui/icons/NearMe'
import { Progress } from 'antd'
import {
  ProgressButton,
  GridContainer,
  GridItem,
  CardContainer, Tooltip,
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
  state = {
    selectedRows: [],
    isLoading: false,
  }



  componentDidMount () {
    this.refreshDataGrid()
  }

  refreshDataGrid = () => {
    const { selectedRows } = this.state
    this.props.dispatch({
      type: 'claimSubmissionDraft/refreshPatientDetails',
      payload:{claimIds: selectedRows},
    }).then((r)=>{
      if(!r){
        this.props.dispatch({
          type: 'claimSubmissionDraft/query',
        })
      }
    })
  }

  handleSelectionChange = (selection) =>
    this.setState({ selectedRows: selection })

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
    const { isLoading, selectedRows } = this.state
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
              FuncProps={{
                selectable: true,
                selectConfig: {
                  showSelectAll: true,
                  rowSelectionEnabled: () => true,
                },
              }}
              selection={this.state.selectedRows}
              onSelectionChange={this.handleSelectionChange}
              onContextMenuItemClick={handleContextMenuItemClick}
              contextMenuOptions={overrideContextMenuOptions}
              isDraft
              type='draft'
            />
          </GridItem>
          <GridItem md={4} className={classes.buttonGroup}>
            <Tooltip placement='bottom-start'
              title={formatMessage({
                       id: 'claimsubmission.invoiceClaim.refreshPatientDetail.tooltips',
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
          </GridItem>
        </GridContainer>
      </CardContainer>
    )
  }
}

export default withStyles(styles, { name: 'DraftCHAS' })(DraftCHAS)
