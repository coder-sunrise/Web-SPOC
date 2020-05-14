import React, { PureComponent, Fragment } from 'react'
import Edit from '@material-ui/icons/Edit'
import Print from '@material-ui/icons/Print'
import { connect } from 'dva'
import {
  CommonTableGrid,
  Button,
  Tooltip,
  notification,
  CommonModal,
} from '@/components'
import { status, gstEnabled } from '@/utils/codes'
import Authorized from '@/utils/Authorized'
import { ReportViewer } from '@/components/_medisys'
import withWebSocket from '@/components/Decorator/withWebSocket'
import { getRawData } from '@/services/report'
import { REPORT_ID } from '@/utils/constants'

@connect(({ clinicSettings }) => ({
  clinicSettings,
}))
class Grid extends PureComponent {
  state = {
    showReport: false,
    selectedPrintCopayerId: null,
  }

  FuncConfig = {
    sort: true,
    sortConfig: {
      defaultSorting: [
        { columnName: 'isActive', direction: 'asc' },
        { columnName: 'coPayerTypeName', direction: 'asc' },
      ],
    },
  }

  editRow = (row, e) => {
    const { dispatch, settingCompany, route } = this.props
    const { name } = route
    const accessRight = name === 'copayer' ? Authorized.check('copayer.copayerdetails') : Authorized.check('settings.supplier.supplierdetails')

    if (accessRight && accessRight.rights !== 'enable') {
      notification.error({
        message: 'Current user is not authorized to access',
      })
      return
    }

    const { list } = settingCompany

    dispatch({
      type: 'settingCompany/updateState',
      payload: {
        showModal: true,
        entity: list.find((o) => o.id === row.id),
      },
    })
  }

  handleClick = async (copayerId) => {
    if (!Number.isInteger(copayerId)) return

    const { handlePrint, clinicSettings } = this.props
    const { labelPrinterSize } = clinicSettings.settings

    const sizeConverter = (sizeCM) => {
      return sizeCM
        .split('x')
        .map((o) =>
          (10 * parseFloat(o.replace('cm', ''))).toString().concat('MM'),
        )
        .join('_')
    }
    const { route } = this.props
    const reportID = 
      REPORT_ID[(route.name === 'copayer' ? 'COPAYER_ADDRESS_LABEL_' : 'SUPPLIER_ADDRESS_LABEL_').concat(sizeConverter(labelPrinterSize))]

    const data = await getRawData(reportID, route.name === 'copayer' ? { copayerId } : { supplierId: copayerId })
    const payload = [
      {
        ReportId: reportID,
        ReportData: JSON.stringify({
          ...data,
        }),
      },
    ]
    handlePrint(JSON.stringify(payload))
  }

  render() {
    const { settingCompany, route } = this.props
    const { name } = route
    const { companyType } = settingCompany
    const { showReport, selectedPrintCopayerId } = this.state

    return (
      <Fragment>
        <CommonTableGrid
          style={{ margin: 0 }}
          type='settingCompany'
          onRowDoubleClick={this.editRow}
          FuncProps={this.FuncConfig}
          forceRender
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
                  { name: 'isGSTEnabled', title: 'GST Enable' },
                  { name: 'isActive', title: 'Status' },
                  { name: 'action', title: 'Action' },
                ]
              )
          }
          // FuncProps={{ pager: false }}
          columnExtensions={[
            {
              columnName: 'url',
              sortingEnabled: false,
              width: 400,
              render: (row) => {
                return (
                  <a
                    rel='noopener noreferrer'
                    target='_blank'
                    href={
                      row.contact &&
                        row.contact.contactWebsite &&
                        row.contact.contactWebsite.website !== '' ? (
                          row.contact.contactWebsite.website
                        ) : (
                          '-'
                        )
                    }
                  >
                    {row.contact &&
                      row.contact.contactWebsite &&
                      row.contact.contactWebsite.website !== '' ? (
                        row.contact.contactWebsite.website
                      ) : (
                        '-'
                      )}
                  </a>
                )
              },
            },
            {
              columnName: 'coPayerTypeName',
              sortBy: 'coPayerTypeFK',
              width: 200,
            },
            {
              columnName: 'officeNum',
              sortingEnabled: false,
              width: 120,
              render: (row) => (
                <span>
                  {row.contact &&
                    row.contact.officeContactNumber &&
                    row.contact.officeContactNumber.number !== '' ? (
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
              width: 120,
              render: (row) => (
                <span>
                  {row.contact &&
                    row.contact.faxContactNumber &&
                    row.contact.faxContactNumber.number !== '' ? (
                      row.contact.faxContactNumber.number
                    ) : (
                      '-'
                    )}
                </span>
              ),
            },
            {
              columnName: 'displayValue',
              width: 500,
            },

            {
              columnName: 'contactNo',
              sortingEnabled: false,
              width: 120,
              render: (row) => (
                <span>
                  {row.contact &&
                    row.contact.mobileContactNumber &&
                    row.contact.mobileContactNumber.number !== '' ? (
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
              align: 'center',
              width: 120,
            },
            {
              columnName: 'isGSTEnabled',
              type: 'select',
              options: gstEnabled,
              width: 120,
              sortBy: 'isGSTEnabled',
            },
            {
              columnName: 'action',
              align: 'center',
              width: 100,
              render: (row) => {
                return (
                  name === 'copayer' ?
                    <Authorized authority='copayer.copayerdetails'>
                      <Fragment>
                        <Tooltip
                          title='Edit Co-Payer'
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
                        <Tooltip title='Print Copayer Label' placement='bottom'>
                          <Button
                            size='sm'
                            justIcon
                            color='primary'
                            onClick={() => this.handleClick(row.id)}
                          >
                            <Print />
                          </Button>
                        </Tooltip>
                      </Fragment>
                    </Authorized>
                    :
                    <Authorized authority='settings.supplier.supplierdetails'>
                      <Fragment>
                        <Tooltip
                          title="Edit Supplier"
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
                        <Tooltip title='Print Supplier Label' placement='bottom'>
                          <Button
                            size='sm'
                            justIcon
                            color='primary'
                            onClick={() => this.handleClick(row.id)}
                          >
                            <Print />
                          </Button>
                        </Tooltip>
                      </Fragment>
                    </Authorized>
                )
              },
            },
          ]}
        />
      </Fragment>
    )
  }
}

export default withWebSocket()(Grid)
