import React from 'react'
import { connect } from 'dva'
// formik
import { withFormik } from 'formik'
// material ui
import { withStyles } from '@material-ui/core'
// common components
import { LoadingWrapper } from '@/components/_medisys'
import {
  CommonTableGrid,
  ProgressButton,
  GridContainer,
  GridItem,
  notification,
  CardContainer,
} from '@/components'
// sub components
import BaseSearchBar from '../../common/BaseSearchBar'
import TableGrid from '../../common/TableGrid'
import Authorized from '@/utils/Authorized'
// variables
import { NewCHASColumnExtensions, NewCHASColumns } from './variables'

const styles = (theme) => ({
  cardContainer: {
    margin: 1,
  },
  buttonGroup: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
})

const TableConfig2 = {
  FuncProps: {
    selectable: true,
    selectConfig: {
      showSelectAll: true,
      rowSelectionEnabled: () => true,
    },
  },
}

@connect(({ claimSubmissionNew }) => ({
  claimSubmissionNew,
}))
@withFormik({
  mapPropsToValues: () => ({}),
})
class NewCHAS extends React.Component {
  state = {
    selectedRows: [],
    isLoading: false,
  }

  componentWillMount () {
    // this.refreshDataGrid()
    this.props.dispatch({
      type: 'claimSubmissionNew/query',
    })
  }

  onRefreshClicked = () => this.refreshDataGrid()

  handleSelectionChange = (selection) =>
    this.setState({ selectedRows: selection })

  refreshDataGrid = () => {
    const { selectedRows } = this.state

    this.props.dispatch({
      type: 'claimSubmissionNew/refreshPatientDetails',
      payload:{claimIds: selectedRows},
    }).then((r)=>{
      if(!r){
        this.props.dispatch({
          type: 'claimSubmissionNew/query',
        })
      }
    })
  }

  handleLoadingVisibility = (visibility = false) =>
    this.setState({ isLoading: visibility })

  onSubmitClaimClicked = () => {
    const { selectedRows } = this.state
    if (selectedRows.length > 0) {
      this.handleLoadingVisibility(true)
      this.props
        .dispatch({
          type: 'claimSubmissionNew/submitChasClaim',
          payload: { claimIds: selectedRows },
        })
        .then((r) => {
          this.handleLoadingVisibility(false)
          if (r) {
            if (r.failedCount !== 0) {
              this.props.handleSubmitClaimStatus(r.failedCount)
            } else {
              notification.success({
                message: 'Claim Submission Success.',
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
      claimSubmissionNew,
      handleContextMenuItemClick,
      dispatch,
      values,
    } = this.props
    const { isLoading, selectedRows } = this.state
    const { list } = claimSubmissionNew || []

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
          modelsName='claimSubmissionNew'
        />
        <LoadingWrapper linear loading={isLoading} text='Submitting Claim...'>
          <GridContainer>
            <GridItem md={12}>
              <TableGrid
                data={list}
                columnExtensions={NewCHASColumnExtensions}
                columns={NewCHASColumns}
                // tableConfig={TableConfig2}
                FuncProps={{
                  selectable: true,
                  selectConfig: {
                    showSelectAll: true,
                    rowSelectionEnabled: () => true,
                  },
                }}
                selection={this.state.selectedRows}
                onSelectionChange={this.handleSelectionChange}
                onContextMenuItemClick={(row, id) =>
                  handleContextMenuItemClick(row, id, true)}
                type='new'
              />
              {/* <CommonTableGrid
                getRowId={(row) => row.id}
                type='claimSubmissionNew'
                // rows={data}
                columns={NewCHASColumns}
                columnExtensions={NewCHASColumnExtensions}
                // {...TableConfig}
                // selection={selection}
                // onSelectionChange={onSelectionChange}
                // ActionProps={{ TableCellComponent: Cell }}
              /> */}
            </GridItem>

            <GridItem md={4} className={classes.buttonGroup}>
              <ProgressButton
                icon={null}
                color='info'
                onClick={this.onRefreshClicked}
              >
                Refresh
              </ProgressButton>
              <Authorized authority='claimsubmission.submitclaim'>
                <ProgressButton
                  icon={null}
                  color='primary'
                  disabled={selectedRows.length <= 0}
                  onClick={this.onSubmitClaimClicked}
                >
                  Submit Claim
                </ProgressButton>
              </Authorized>
            </GridItem>
          </GridContainer>
        </LoadingWrapper>
      </CardContainer>
    )
  }
}

export default withStyles(styles, { name: 'NewCHAS' })(NewCHAS)
