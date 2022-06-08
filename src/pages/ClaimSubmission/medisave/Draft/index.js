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
  notification,
  Tooltip,
} from '@/components'
// sub components
import BaseSearchBar from '../../common/BaseSearchBar'
import TableGrid from '../TableGrid'
// variables
import {
  DraftMedisaveColumnExtensions,
  DraftMedisaveColumns,
} from './variables'

const styles = theme => ({
  cardContainer: {
    margin: 1,
  },
  buttonGroup: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
})

@connect(({ medisaveClaimSubmissionDraft, global }) => ({
  medisaveClaimSubmissionDraft,
  mainDivHeight: global.mainDivHeight,
}))
@withFormik({
  mapPropsToValues: () => ({}),
})
class DraftMedisave extends React.Component {
  state = {
    selectedRows: [],
  }

  componentDidMount() {
    this.refreshDataGrid()
  }

  refreshDataGrid = () => {
    this.props.dispatch({
      type: 'medisaveClaimSubmissionDraft/query',
    })
  }

  handleSelectionChange = selection =>
    this.setState({ selectedRows: selection })

  onRefreshClicked = () => {
    const { selectedRows } = this.state
    this.props
      .dispatch({
        type: 'medisaveClaimSubmissionDraft/refreshPatientDetails',
        payload: { claimIds: selectedRows },
      })
      .then(r => {
        if (!r) {
          this.refreshDataGrid()
          notification.success({
            message: 'Patient Info Updated.',
          })
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
      medisaveClaimSubmissionDraft,
      handleContextMenuItemClick,
      values,
      dispatch,
      mainDivHeight = 700,
    } = this.props
    const { list } = medisaveClaimSubmissionDraft || []

    const { selectedRows } = this.state
    let height =
      mainDivHeight -
      185 -
      ($('.filterMedisaveDraftBar').height() || 0) -
      ($('.footerMedisaveDraftBar').height() || 0)
    if (height < 300) height = 300
    return (
      <CardContainer
        hideHeader
        style={{
          marginLeft: 5,
          marginRight: 5,
        }}
      >
        <div className='filterMedisaveDraftBar'>
          <BaseSearchBar
            hideInvoiceDate
            dispatch={dispatch}
            values={values}
            modelsName='medisaveClaimSubmissionDraft'
          />
        </div>
        <GridContainer>
          <GridItem md={12}>
            <TableGrid
              data={list}
              columnExtensions={DraftMedisaveColumnExtensions}
              columns={DraftMedisaveColumns}
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
        <div className='footerMedisaveDraftBar'>
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

export default withStyles(styles, { name: 'DraftMedisave' })(DraftMedisave)
