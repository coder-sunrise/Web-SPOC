import React, { PureComponent } from 'react'
import Edit from '@material-ui/icons/Edit'
import { status, isAutoOrder } from '@/utils/codes'
import { CommonTableGrid, Button } from '@/components'

class Grid extends PureComponent {
  editRow = async (row) => {
    const { dispatch, settingClinicService } = this.props

    // const queryServiceDetails = async () => {
    //   return await queryOne(row.serviceId)
    // }
    // console.log({ row })
    const serviceList = await dispatch({
      type: 'settingClinicService/queryOne',
      payload: {
        id: row.serviceId,
      },
    })

    // const serviceList = await queryServiceDetails()

    if (serviceList) {
      let serviceInfo = serviceList
      console.log(serviceInfo)
      serviceInfo.ctServiceCenter_ServiceNavigation.map((x) => {
        delete x.serviceCenterFKNavigation
      })
      console.log('test', serviceInfo)

      serviceInfo = {
        ...serviceInfo,
        effectiveDates: [
          serviceInfo.effectiveStartDate,
          serviceInfo.effectiveEndDate,
        ],
      }

      dispatch({
        type: 'settingClinicService/updateState',
        payload: {
          showModal: true,
          entity: serviceInfo,
        },
      })
    }
  }

  render () {
    return (
      <CommonTableGrid
        style={{ margin: 0 }}
        type='settingClinicService'
        onRowDoubleClick={this.editRow}
        columns={[
          { name: 'code', title: 'Code' },
          { name: 'displayValue', title: 'Display Value' },
          { name: 'description', title: 'Description' },
          { name: 'serviceCenter', title: 'Service Center' },
          { name: 'unitPrice', title: 'Unit Selling Price' },
          { name: 'isAutoOrder', title: 'Auto Order' },
          { name: 'isActive', title: 'Status' },
          { name: 'action', title: 'Action' },
        ]}
        columnExtensions={[
          { columnName: 'code', sortBy: 'serviceFKNavigation.code' },
          {
            columnName: 'displayValue',
            sortBy: 'serviceFKNavigation.displayValue',
          },
          {
            columnName: 'description',
            sortBy: 'serviceFKNavigation.description',
          },
          {
            columnName: 'serviceCenter',
            sortBy: 'serviceCenterFKNavigation.displayValue',
          },
          { columnName: 'unitPrice', type: 'number', currency: true },
          {
            columnName: 'isAutoOrder',
            align: 'center',
            width: 120,
            type: 'select',
            options: isAutoOrder,
          },
          {
            columnName: 'isActive',
            sortingEnabled: false,
            type: 'select',
            options: status,
            align: 'center',
            width: 120,
          },
          {
            columnName: 'action',
            align: 'center',
            width: 100,
            render: (row) => {
              return (
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
              )
            },
          },
        ]}
      />
    )
  }
}

export default Grid
