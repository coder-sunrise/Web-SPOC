import React from 'react'
import { ReportDataGrid } from '@/components/_medisys'


const CategorySummary = ({ reportDatas }) => {
  if (!reportDatas)
    return null
  let listData = []
  const { CategoryDetails } = reportDatas
  if (CategoryDetails) {
    listData = CategoryDetails.map((item, index) => ({
      ...item,
      id: `CategoryDetails-${index}-${item.categoryCode}`,
    }))
  }

  const CategoryCategorySummaryColumns = [
    { name: 'categoryCode', title: 'Category' },
    { name: 'categoryDisplayValue', title: 'Display Value' },
    { name: 'totalAmount', title: 'Total Amount' },
  ]
  const CategoryCategorySummaryColumnsExtensions = [
    { columnName: 'totalAmount', type: 'currency', currency: true },
  ]

  return (
    <ReportDataGrid
      data={listData}
      columns={CategoryCategorySummaryColumns}
      columnExtensions={CategoryCategorySummaryColumnsExtensions}
    />
  )
}

export default CategorySummary
