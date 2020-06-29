import React, { PureComponent } from 'react'
import { withStyles } from '@material-ui/core'
import {
  Table,
} from '@devexpress/dx-react-grid-material-ui'
import { ReportDataGrid } from '@/components/_medisys'

const styles = (theme) => ({
  subRow: {
    '& > td:first-child': {
      paddingLeft: theme.spacing(1),
    },
  },
})
class AgeingList extends PureComponent {
  render () {
    let listData = []
    const { reportDatas } = this.props
    if (!reportDatas)
      return null
    if (reportDatas && reportDatas.AgeingDetails) {
      const item = reportDatas.AgeingDetails[0]
        listData.splice(0, 0, {
          ...item, 
          id: `AgeingList-Current`,
          countNumber: 1,
          rowspan: 1, 
        })
    }
    const AgeingDetailsCols = [
      { name: 'current', title: 'Current' },
      { name: 'oneMonth', title: '1 Month' },
      { name: 'twoMonths', title: '2 Months' },
      { name: 'threeMonths', title: '>=3 Months' },
    ]
    const AgeingDetailsExtensions = [
      { columnName: 'current', type: 'currency', currency: true, width: 120, sortingEnabled: false },
      { columnName: 'oneMonth', type: 'currency', currency: true, width: 120, sortingEnabled: false },
      { columnName: 'twoMonths', type: 'currency', currency: true, width: 120, sortingEnabled: false },
      { columnName: 'threeMonths', type: 'currency', currency: true, width: 120, sortingEnabled: false },
    ]

    let FuncProps = {
      pager: false,
      summary: false,
    }
    let AgeingListCols = AgeingDetailsCols
    let AgeingListColsExtension = AgeingDetailsExtensions
    
    const listingRow = (p) => {
      const { children } = p
      return <Table.Row {...p}>{children}</Table.Row>
    }


    return (
      <ReportDataGrid
        data={listData}
        columns={AgeingListCols}
        columnExtensions={AgeingListColsExtension}
        FuncProps={FuncProps}
        TableProps={{ rowComponent: listingRow }}
      />
    )
  }
}
export default withStyles(styles, { withTheme: true })(AgeingList)
