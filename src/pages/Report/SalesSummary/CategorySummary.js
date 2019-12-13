import React from 'react'
import { ReportDataGrid } from '@/components/_medisys'

const CategorySummary = ({ reportDatas }) => {
  if (!reportDatas) return null
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
    { columnName: 'categoryCode', sortingEnabled: false },
    { columnName: 'categoryDisplayValue', sortingEnabled: false },
    {
      columnName: 'totalAmount',
      type: 'currency',
      currency: true,
      sortingEnabled: false,
    },
  ]

  return (
    <ReportDataGrid
      noHeight
      data={listData}
      columns={CategoryCategorySummaryColumns}
      columnExtensions={CategoryCategorySummaryColumnsExtensions}
    />
  )
}

export default CategorySummary
