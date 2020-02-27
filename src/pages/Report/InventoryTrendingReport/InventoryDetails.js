import React, { PureComponent } from 'react'
import SolidExpandMore from '@material-ui/icons/ArrowDropDown'
import { IntegratedSummary } from '@devexpress/dx-react-grid'
import { ReportDataGrid, AccordionTitle } from '@/components/_medisys'
import { Accordion } from '@/components'

class InventoryDetails extends PureComponent {
  render () {
    let listData = []
    const { reportDatas } = this.props
    if (!reportDatas || !reportDatas.ListingDetails[0].showDetails) return null
    if (reportDatas.InventoryDetails) {
      listData = reportDatas.InventoryDetails.map((item, index) => ({
        ...item,
        id: `InventoryDetails-${index}-${item.inventoryType}`,
        groupName: `${item.inventoryItem} (${item.inventoryType})`,
        genderAge: `${item.gender}/${item.age}`,
      }))
    }
    const FuncProps = {
      pager: false,
      grouping: true,
      groupingConfig: {
        state: {
          grouping: [
            { columnName: 'groupName' },
          ],
        },
      },
      summary: true,
      summaryConfig: {
        state: {
          totalItems: [
            { columnName: 'quantity', type: 'sum', precision: 0 },
          ],
        },
        integrated: {
          calculator: IntegratedSummary.defaultCalculator,
        },
        row: {
          messages: {
            sum: 'Total',
          },
        },
      },
    }

    const InventoryDetailsColumns = [
      { name: 'groupName', title: 'Inventory' },
      { name: 'visitDate', title: 'Visit Date' },
      { name: 'doctorName', title: 'Visit Doctor' },
      { name: 'patientName', title: 'Patient Name' },
      { name: 'genderAge', title: 'Gender/Age' },
      { name: 'quantity', title: 'Dispense Quantity' },
    ]
    const InventoryDetailsExtensions = [
      { columnName: 'groupName', sortingEnabled: false },
      { columnName: 'visitDate', sortingEnabled: false },
      { columnName: 'doctorName', sortingEnabled: false },
      { columnName: 'patientName', sortingEnabled: false },
      { columnName: 'genderAge', sortingEnabled: false },
      {
        columnName: 'quantity',
        sortingEnabled: false,
        type: 'number',
        precision: 0,
      },
    ]

    return (
      <Accordion
        leftIcon
        expandIcon={<SolidExpandMore fontSize='large' />}
        collapses={[
          {
            title: <AccordionTitle title='Inventory Details' />,
            content: (
              <ReportDataGrid
                data={listData}
                columns={InventoryDetailsColumns}
                columnExtensions={InventoryDetailsExtensions}
                FuncProps={FuncProps}
              />
            ),
          },
        ]}
      />
    )
  }
}
export default InventoryDetails
