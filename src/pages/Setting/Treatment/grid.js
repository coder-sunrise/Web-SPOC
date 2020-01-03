import React, { PureComponent } from 'react'
import Edit from '@material-ui/icons/Edit'
import { status, isAutoOrder } from '@/utils/codes'
import { CommonTableGrid, Button, Tooltip } from '@/components'

class Grid extends PureComponent {
  editRow = async (row) => {
    const { dispatch, settingClinicService } = this.props

    // const queryServiceDetails = async () => {
    //   return await queryOne(row.serviceId)
    // }
    // console.log({ row })
    const treatmentList = await dispatch({
      type: 'settingClinicService/queryOne',
      payload: {
        id: row.serviceId,
      },
    })

    // const treatmentList = await queryServiceDetails()

    if (treatmentList) {
      let treatmentInfo = treatmentList
      // console.log(treatmentInfo)
      treatmentInfo.ctServiceCenter_ServiceNavigation.map((x) => {
        delete x.treatmentFKNavigation
      })
      // console.log('test', treatmentInfo)

      treatmentInfo = {
        ...treatmentInfo,
        effectiveDates: [
          treatmentInfo.effectiveStartDate,
          treatmentInfo.effectiveEndDate,
        ],
      }

      dispatch({
        type: 'settingClinicService/updateState',
        payload: {
          // showModal: true,
          entity: treatmentInfo,
        },
      })

      this.props.toggleModal()
    }
  }

  render () {
    return (
      <CommonTableGrid
        style={{ margin: 0 }}
        getRowId={(r) => r.serviceCenter_ServiceId}
        type='settingClinicService'
        onRowDoubleClick={this.editRow}
        // getRowId={(row) => row.serviceId}
        columns={[
          { name: 'code', title: 'Code' },
          { name: 'displayValue', title: 'Display Value' },
          { name: 'description', title: 'Description' },
          { name: 'chartMethod', title: 'Chart Method' },
          { name: 'cost', title: 'Cost' },
          { name: 'unitPrice', title: 'Unit Selling Price' },
          { name: 'treatmentCategory', title: 'Treatment Category' },
          { name: 'revenueCategory', title: 'Revenue Category' },
          { name: 'isActive', title: 'Status' },
          { name: 'action', title: 'Action' },
        ]}
        columnExtensions={[
          { columnName: 'code', sortBy: 'treatmentFKNavigation.code' },
          {
            columnName: 'displayValue',
            sortBy: 'treatmentFKNavigation.displayValue',
          },
          {
            columnName: 'description',
            sortBy: 'treatmentFKNavigation.description',
          },
          {
            columnName: 'chartMethod',
            sortBy: 'treatmentFKNavigation.chartMethod',
            align: 'center',
            render: (row) => {
              return (
                <div>
                <img 
                src="https://png.pngtree.com/png-clipart/20190515/original/pngtree-light-effect-border-png-image_3552885.jpg"
                width="20px"
                height="20px"
                />
              </div>
              )
            },
          },
          {
            columnName: 'cost',
            type: 'number',
          },
          {
            columnName: 'unitPrice',
            type: 'number',
            currency: true,
            width: 150,
          },
          {
            columnName: 'treatmentCategory',
            sortBy: 'treatmentFKNavigation.treatmentCategory',
            width: 150,
          },          
          {
            columnName: 'revenueCategory',
            sortBy: 'treatmentFKNavigation.revenueCategory',
            width: 150,
          },
          {
            columnName: 'isActive',
            sortingEnabled: false,
            type: 'select',
            options: status,
            align: 'center',
            width: 100,
          },
          {
            columnName: 'action',
            align: 'center',
            width: 80,
            render: (row) => {
              return (
                <Tooltip title='Edit Treatment'>
                  <Button
                    size='sm'
                    onClick={() => {
                      this.editRow(row)
                    }}
                    justIcon
                    color='primary'
                    style={{ marginRight: 0 }}
                  >
                    <Edit />
                  </Button>
                </Tooltip>
              )
            },
          },
        ]}
      />
    )
  }
}

export default Grid
