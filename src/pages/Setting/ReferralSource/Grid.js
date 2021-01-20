import React, { PureComponent, Fragment } from 'react'
import { connect } from 'dva'
import classNames from 'classnames'
import Edit from '@material-ui/icons/Edit'
import Print from '@material-ui/icons/Print'
import { MenuItem, MenuList } from '@material-ui/core'
import withWebSocket from '@/components/Decorator/withWebSocket'
import { CommonTableGrid, Button, Tooltip, Popper } from '@/components'
import { status } from '@/utils/codes'
import { REPORT_ID } from '@/utils/constants'
import { getRawData } from '@/services/report'

@connect(({ clinicSettings }) => ({
  clinicSettings,
}))
class Grid extends PureComponent {
  editRow = (row, e) => {
    const { dispatch, settingReferralSource } = this.props

    const { list } = settingReferralSource

    dispatch({
      type: 'settingReferralSource/updateState',
      payload: {
        showModal: true,
        entity: list.find((o) => o.id === row.id),
      },
    })
  }

  handleClick = async (referralSourceId, referralPersonId) => {
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
    const reportID =
      REPORT_ID[
        'REFERRAL_SOURCE_LABEL_'.concat(sizeConverter(labelPrinterSize))
      ]

    const data = await getRawData(reportID, {
      referralSourceId,
      referralPersonId,
    })
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

  render () {
    const { classes } = this.props
    return (
      <CommonTableGrid
        style={{ margin: 0 }}
        type='settingReferralSource'
        onRowDoubleClick={this.editRow}
        columns={[
          { name: 'name', title: 'Name' },
          { name: 'address', title: 'Address' },
          { name: 'officeNo', title: 'Office No.' },
          { name: 'website', title: 'Website' },
          { name: 'faxNo', title: 'Fax' },
          { name: 'email', title: 'Email' },
          { name: 'remarks', title: 'Remarks' },
          { name: 'isActive', title: 'Status' },
          {
            name: 'action',
            title: 'Action',
          },
        ]}
        columnExtensions={[
          {
            columnName: 'officeNo',
            sortingEnabled: false,
          },
          {
            columnName: 'address',
            sortingEnabled: false,
          },
          {
            columnName: 'email',
            sortingEnabled: false,
          },
          {
            columnName: 'faxNo',
            sortingEnabled: false,
          },
          {
            columnName: 'remarks',
            sortingEnabled: false,
          },
          {
            columnName: 'website',
            sortingEnabled: false,
          },
          {
            columnName: 'isActive',
            sortingEnabled: false,
            type: 'select',
            options: status,
            width: 120,
            align: 'center',
          },
          {
            columnName: 'sortOrder',
            width: 120,
            render: (row) => {
              return <p>{row.sortOrder === null ? '-' : row.sortOrder}</p>
            },
          },
          {
            columnName: 'action',
            align: 'center',
            width: 100,
            render: (row) => {
              return (
                <Fragment>
                  <Tooltip title='Edit Referral Source' placement='bottom'>
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
                  <Tooltip title='Print Referral Source Label'>
                    {!row.referralPersons || !row.referralPersons.length ? (
                      <Button
                        size='sm'
                        justIcon
                        color='primary'
                        onClick={() => this.handleClick(row.id)}
                      >
                        <Print />
                      </Button>
                    ) : (
                      <Popper
                        className={classNames({
                          [classes.pooperResponsive]: true,
                          [classes.pooperNav]: true,
                        })}
                        overlay={
                          <MenuList role='menu'>
                            {[
                              { name: 'Without Ref. Person' },
                              ...(row.referralPersons || []),
                            ].map((rp) => {
                              return (
                                <MenuItem
                                  onClick={() =>
                                    this.handleClick(row.id, rp.id)}
                                >
                                  {rp.name}
                                </MenuItem>
                              )
                            })}
                          </MenuList>
                        }
                      >
                        <Button size='sm' justIcon color='primary'>
                          <Print />
                        </Button>
                      </Popper>
                    )}
                  </Tooltip>
                </Fragment>
              )
            },
          },
        ]}
      />
    )
  }
}

export default withWebSocket()(Grid)
