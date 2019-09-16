import React, { PureComponent } from 'react'

import { Table } from '@devexpress/dx-react-grid-material-ui'
import Delete from '@material-ui/icons/Delete'
import Edit from '@material-ui/icons/Edit'
import { CommonTableGrid, Button } from '@/components'
import { status } from '@/utils/codes'
import * as service from './services'
import { Tooltip } from '@material-ui/core'

class Grid extends PureComponent {
  editRow = (row, e) => {
    const { dispatch, settingCompany } = this.props

    const { list } = settingCompany

    dispatch({
      type: 'settingCompany/updateState',
      payload: {
        showModal: true,
        entity: list.find((o) => o.id === row.id),
      },
    })
  }

  // getCoPayer = (data) => {
  //   return data.filter((eachRow) => eachRow.companyTypeFK === 1)
  // }

  // getSupplier = (data) => {
  //   return data.filter((eachRow) => eachRow.companyTypeFK === 2)
  // }

  render () {
    const { dispatch, classes, settingCompany, toggleModal, route } = this.props
    const { name } = route
    const { list, companyType } = settingCompany
    console.log('props', this.props)
    // const data =
    //   name === 'copayer' ? this.getCoPayer(list) : this.getSupplier(list)

    return (
      <CommonTableGrid
        style={{ margin: 0 }}
        type='settingCompany'
        // rows={data}
        onRowDoubleClick={this.editRow}
        columns={
          name === 'copayer' ? (
            [
              {
                name: 'code',
                title: 'Co-payer Code',
              },

              {
                name: 'displayValue',
                title: 'Co-payer Name',
              },

              { name: 'coPayerTypeName', title: 'Co-payer Type' },

              {
                name: 'contactNo',
                title: 'Contact No.',
              },

              { name: 'url', title: 'URL' },

              { name: 'isActive', title: 'Status' },
              { name: 'action', title: 'Action' },
            ]
          ) : (
            [
              {
                name: 'code',
                title: 'Company Code',
              },

              {
                name: 'displayValue',
                title: 'Company Name',
              },

              { name: 'contactPerson', title: 'Contact Person' },
              { name: 'contactNo', title: 'Contact No.' },

              { name: 'officeNum', title: 'Office Number' },

              { name: 'faxNo', title: 'Fax Number' },
              { name: 'isActive', title: 'Status' },
              { name: 'action', title: 'Action' },
            ]
          )
        }
        // FuncProps={{ pager: false }}
        columnExtensions={[
          name === 'copayer'
            ? {
                columnName: 'url',

                render: (row) => (
                  <a
                    rel='noopener noreferrer'
                    target='_blank'
                    href={
                      row.contact.contactWebsite.website !== '' ? (
                        row.contact.contactWebsite.website
                      ) : (
                        '-'
                      )
                    }
                  >
                    {row.contact.contactWebsite.website !== '' ? (
                      row.contact.contactWebsite.website
                    ) : (
                      '-'
                    )}
                  </a>
                ),
              }
            : {
                columnName: 'officeNum',
                sortingEnabled: false,
                render: (row) => (
                  <span>
                    {row.contact.officeContactNumber.number !== '' ? (
                      row.contact.officeContactNumber.number
                    ) : (
                      '-'
                    )}
                  </span>
                ),
              },
          {
            columnName: 'contactPerson',
            render: (row) => (
              <span>{row.contactPerson ? row.contactPerson : '-'}</span>
            ),
          },
          {
            columnName: 'faxNo',
            sortingEnabled: false,
            render: (row) => (
              <span>
                {row.contact.faxContactNumber.number !== '' ? (
                  row.contact.faxContactNumber.number
                ) : (
                  '-'
                )}
              </span>
            ),
          },

          {
            columnName: 'contactNo',
            sortingEnabled: false,
            render: (row) => (
              <span>
                {row.contact.mobileContactNumber.number !== '' ? (
                  row.contact.mobileContactNumber.number
                ) : (
                  '-'
                )}
              </span>
            ),
          },
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
                <Tooltip
                  title={
                    companyType.id === 1 ? 'Edit Co-Payer' : 'Edit Supplier'
                  }
                  placement='bottom'
                >
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
