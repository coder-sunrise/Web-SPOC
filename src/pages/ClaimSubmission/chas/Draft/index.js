import React from 'react'
import { connect } from 'dva'
import $ from 'jquery'
// formik
import { withFormik } from 'formik'
import { formatMessage } from 'umi'
// material ui
import { withStyles } from '@material-ui/core'
// common components1
import NearMe from '@material-ui/icons/NearMe'
import {
  ProgressButton,
  GridContainer,
  GridItem,
  CardContainer,
  Tooltip,
} from '@/components'
// sub components
import BaseSearchBar from '../../common/BaseSearchBar'
import TableGrid from '../TableGrid'
// variables
import { DraftCHASColumnExtensions, DraftCHASColumns } from './variables'

const styles = theme => ({
  cardContainer: {
    margin: 1,
  },
  buttonGroup: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
})

@connect(({ chasClaimSubmissionDraft, global }) => ({
  chasClaimSubmissionDraft,
  mainDivHeight: global.mainDivHeight,
}))
@withFormik({
  mapPropsToValues: () => ({}),
})
class DraftCHAS extends React.Component {
  state = {
    selectedRows: [],
  }

  componentDidMount() {
    this.refreshDataGrid()
  }

  refreshDataGrid = () => {
    this.props.dispatch({
      type: 'chasClaimSubmissionDraft/query',
    })
  }

  handleSelectionChange = selection =>
    this.setState({ selectedRows: selection })

  onRefreshClicked = () => {
    const { selectedRows } = this.state
    this.props
      .dispatch({
        type: 'chasClaimSubmissionDraft/refreshPatientDetails',
        payload: { claimIds: selectedRows },
      })
      .then(r => {
        if (!r) {
          this.refreshDataGrid()
        }
      })
  }

  render() {
    const overrideContextMenuOptions = [
      {
        id: 0,
        label: 'Claim Details',
        Icon: NearMe,
      },
    ]
    const {
      classes,
      chasClaimSubmissionDraft,
      handleContextMenuItemClick,
      values,
      dispatch,
      mainDivHeight = 700,
    } = this.props
    const { list } = chasClaimSubmissionDraft || []

    const { selectedRows } = this.state
    let height =
      mainDivHeight -
      185 -
      ($('.filterChasDraftBar').height() || 0) -
      ($('.footerChasDraftBar').height() || 0)
    if (height < 300) height = 300
    return (
      <CardContainer
        hideHeader
        style={{
          marginLeft: 5,
          marginRight: 5,
        }}
      >
        <div className='filterChasDraftBar'>
          <BaseSearchBar
            hideInvoiceDate
            dispatch={dispatch}
            values={values}
            modelsName='chasClaimSubmissionDraft'
          />
        </div>
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
                  rowSelectionEnabled: row => row.patientIsActive,
                },
              }}
              selection={this.state.selectedRows}
              onSelectionChange={this.handleSelectionChange}
              onContextMenuItemClick={handleContextMenuItemClick}
              contextMenuOptions={overrideContextMenuOptions}
              isDraft
              type='draft'
              height={height}
            />
          </GridItem>
        </GridContainer>
        <div className='footerChasDraftBar'>
          <GridContainer>
            <GridItem md={12} className={classes.buttonGroup}>
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
            </GridItem>
          </GridContainer>
        </div>
      </CardContainer>
    )
  }
}

export default withStyles(styles, { name: 'DraftCHAS' })(DraftCHAS)
