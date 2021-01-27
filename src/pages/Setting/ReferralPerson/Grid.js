import React, { PureComponent, Fragment } from 'react'
import { connect } from 'dva'
import classNames from 'classnames'
import withWebSocket from '@/components/Decorator/withWebSocket'
import Edit from '@material-ui/icons/Edit'
import Print from '@material-ui/icons/Print'
import { CommonTableGrid, Button, Tooltip, Popper } from '@/components'
import { MenuItem, MenuList } from '@material-ui/core'
import { status } from '@/utils/codes'
import { getRawData } from '@/services/report'
import { REPORT_ID } from '@/utils/constants'

@connect(({ clinicSettings }) => ({
  clinicSettings,
}))
class Grid extends PureComponent {
  editRow = (row, e) => {
    const { dispatch, settingReferralPerson } = this.props

    const { list } = settingReferralPerson

    dispatch({
      type: 'settingReferralPerson/updateState',
      payload: {
        showModal: true,
        entity: list.find((o) => o.id === row.id),
      },
    })
  }

  handleClick = async (referralPersonId, referralSourceId) => {
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
        'REFERRAL_PERSON_LABEL_'.concat(sizeConverter(labelPrinterSize))
      ]

    const data = await getRawData(reportID, {
      referralPersonId,
      referralSourceId,
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
        type='settingReferralPerson'
        onRowDoubleClick={this.editRow}
        columns={[
          { name: 'name', title: 'Name' },
          { name: 'mobileNo', title: 'Mobile No.' },
          { name: 'officeNo', title: 'Office No.' },
          { name: 'companyName', title: 'Company Name' },
          { name: 'address', title: 'Address' },
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
            columnName: 'mobileNo',
            sortingEnabled: false,
          },
          {
            columnName: 'officeNo',
            sortingEnabled: false,
          },
          {
            columnName: 'companyName',
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
                  <Tooltip title='Edit Referral Person' placement='bottom'>
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
                  <Tooltip title='Print Referral Person Label'>
                    {row.referralSources && row.referralSources.length === 1 ? (
                      <Button
                        size='sm'
                        justIcon
                        color='primary'
                        onClick={() =>
                          this.handleClick(row.id, row.referralSources[0].id)}
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
                            {(row.referralSources || []).map((rs) => {
                              return (
                                <MenuItem
                                  onClick={() =>
                                    this.handleClick(row.id, rs.id)}
                                >
                                  {rs.name}
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
