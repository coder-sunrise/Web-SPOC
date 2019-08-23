import React, { PureComponent } from 'react'
import { CommonTableGrid, Button } from '@/components'
import { Table } from '@devexpress/dx-react-grid-material-ui'
import { status } from '@/utils/codes'
import Delete from '@material-ui/icons/Delete'
import Edit from '@material-ui/icons/Edit'
import { queryOne } from './services'
import request from '@/utils/request'
import { showErrorNotification } from '@/utils/error'

class Grid extends PureComponent {
  editRow = async (row) => {
    const { dispatch, settingClinicService } = this.props

    const { list } = settingClinicService
    const queryServiceDetails = async () => {
      return await queryOne(row.serviceId)
    }

    const serviceList = await queryServiceDetails()

    if (serviceList.status != '200') {
      showErrorNotification('', 'Server busy. Please try again later.')
      return
    } else {
      let serviceInfo = serviceList.data

      serviceInfo.ctServiceCenter_ServiceNavigation.map((x) => {
        delete x.serviceCenterFKNavigation
      })

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
          //entity: list.find((o) => o.id === row.id),
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
          { name: 'isActive', title: 'Status' },
          { name: 'action', title: 'Action' },
        ]}
        columnExtensions={[
          { columnName: 'unitPrice', type: 'number', currency: true },
          {
            columnName: 'isActive',
            sortingEnabled: false,
            type: 'select',
            options: status,
          },
          {
            columnName: 'action',
            align: 'center',
            render: (row) => {
              return (
                <Button
                  size='sm'
                  onClick={() => {
                    this.editRow(row)
                  }}
                  justIcon
                  color='primary'
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
