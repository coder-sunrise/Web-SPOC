import React, { PureComponent } from 'react'
import { ReportDataGrid } from '@/components/_medisys'

class ChasStatusList extends PureComponent {
  render () {
    let listData = []
    const { reportDatas } = this.props
    if (!reportDatas)
      return null
    if (reportDatas && reportDatas.CHASClaimsStatusCnt) {
      listData = reportDatas.CHASClaimsStatusCnt.map(
        (item, index) => ({
          ...item,
          id: `ChasStatusList-${index}-${item.claimStatus}`,
        }),
      )
    }

    const ChasStatusListCols = [
      { name: 'claimStatus', title: 'Claim Status' },
      { name: 'claimStatusCount', title: 'No. Of Claims' },
    ]
    const ChasStatusListColsExtension = [
      { columnName: 'claimStatus', sortingEnabled: false, width: 140 },
      { columnName: 'claimStatusCount', sortingEnabled: false, wordWrapEnabled: true, width: 160 },
    ]
    return (
      <ReportDataGrid
        data={listData}
        columns={ChasStatusListCols}
        style={{ width: 300, marginTop: 6 }}
        columnExtensions={ChasStatusListColsExtension}
      />
    )
  }
}
export default ChasStatusList
