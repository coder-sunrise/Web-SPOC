import React from 'react'
import { connect } from 'dva'
import {
  DragDropProvider,
  Grid as DevGrid,
  GroupingPanel,
  PagingPanel,
  Table,
  TableGroupRow,
  TableHeaderRow,
  TableSummaryRow,
  TableSelection,
  Toolbar,
  TableFixedColumns,
  VirtualTable,
  TableTreeColumn,
} from '@devexpress/dx-react-grid-material-ui'
// common component
import { Button, CardContainer, CommonModal } from '@/components'
// component
import ReportViewer from './ReportViewer'

@connect(({ codetable }) => ({ codetable }))
class Report extends React.Component {
  state = {
    showReport: false,
  }

  componentDidMount () {
    const { dispatch } = this.props
    dispatch({
      type: 'codetable/watchFetchCodes',
    })
  }

  viewReport = () => {
    this.setState({ showReport: true })
  }

  closeModal = () => {
    this.setState({ showReport: false })
  }

  getCodeTable = () => {
    const code = 'ctnationality'
    const { dispatch } = this.props
    dispatch({
      type: 'codetable/fetchCodes',
      code,
    })
  }

  testWatch = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'codetable/TEST',
    })
  }

  render () {
    const { showReport } = this.state
    // return (
    //   <CardContainer hideHeader size='sm'>
    //     <Button color='primary&#39;' onClick={this.viewReport}>
    //       View Report
    //     </Button>
    //     <Button color='primary&#39;' onClick={this.getCodeTable}>
    //       Get Codetable
    //     </Button>
    //     <Button color='primary&#39;' onClick={this.testWatch}>
    //       Test Watch
    //     </Button>
    //     <CommonModal
    //       open={showReport}
    //       onClose={this.closeModal}
    //       title='Report'
    //       maxWidth='lg'
    //     >
    //       <ReportViewer />
    //     </CommonModal>
    //   </CardContainer>
    // )
    return (
      <div>
        <DevGrid
          columns={[
            {
              name: 'name',
              title: 'Name',
            },
            {
              name: 'description',
              title: 'Description',
            },
          ]}
          rows={[
            { id: '1', name: '123', description: '123' },
            { id: '2', name: '123', description: '123' },
            { id: '3', name: '123', description: '123' },
            { id: '4', name: '123', description: '123' },
            { id: '5', name: '123', description: '123' },
            { id: '6', name: '123', description: '123' },
            { id: '7', name: '123', description: '123' },
            { id: '8', name: '123', description: '123' },
            { id: '9', name: '123', description: '123' },
            { id: '10', name: '123', description: '123' },
            { id: '11', name: '123', description: '123' },
            { id: '12', name: '123', description: '123' },
            { id: '13', name: '123', description: '123' },
            { id: '14', name: '123', description: '123' },
            { id: '15', name: '123', description: '123' },
          ]}
        >
          <VirtualTable />
          <TableHeaderRow />
        </DevGrid>
      </div>
    )
  }
}

export default Report
