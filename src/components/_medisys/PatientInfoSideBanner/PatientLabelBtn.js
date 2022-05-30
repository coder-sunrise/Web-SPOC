import React, { useState } from 'react'
// material ui
import Print from '@material-ui/icons/Print'
import {
  MenuList,
  ClickAwayListener,
  MenuItem,
  makeStyles,
} from '@material-ui/core'
// ant design
import { InputNumber } from 'antd'
import _ from 'lodash'
// common components
import { Button, Popper, IconButton } from '@/components'
import { REPORT_ID } from '@/utils/constants'
import withWebSocket from '@/components/Decorator/withWebSocket'
// services
import { getRawData } from '@/services/report'

const labelTypes = [
  'Patient_Label',
  'Patient_Lab_Label',
  'Patient_Address_Label',
  'Patient_Cover_Page',
]

const useStyles = makeStyles(() => ({
  root: {
    marginBottom: 8,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputStyle: {
    width: '50px',
    textAlign: 'right',
  },
  qtyFont: {
    fontSize: '0.75rem',
  },
}))

const PatientLabelButton = ({
  handlePrint,
  patientId,
  clinicSettings,
  sendingJob,
  iconOnly = false,
  codetable,
  ...restProps
}) => {
  const classes = useStyles()

  const [copyNo, setCopyNo] = useState(
    labelTypes.reduce((a, b) => {
      return { ...a, [b]: 1 }
    }, {}),
  )

  const [popperOpen, setPopperOpen] = useState(false)

  const openPopper = () => setPopperOpen(true)
  const closePopper = () => setPopperOpen(false)

  const sizeConverter = sizeCM => {
    return sizeCM
      .split('x')
      .map(o => (10 * parseFloat(o.replace('cm', ''))).toString().concat('MM'))
      .join('_')
  }

  const handleClick = async labelType => {
    if (!Number.isInteger(copyNo[labelType])) return

    if (labelType !== 'Patient_Cover_Page') {
      const { labelPrinterSize } = clinicSettings

      const reportID =
        REPORT_ID[
          labelType
            .concat('_')
            .concat(sizeConverter(labelPrinterSize))
            .toString()
            .toUpperCase()
        ]
      const data = await getRawData(reportID, { patientId })
      const payload = [
        {
          ReportId: reportID,
          Copies: copyNo[labelType],
          ReportData: JSON.stringify(data),
        },
      ]
      handlePrint(JSON.stringify(payload))
    } else {
      const data = {}
      const { ctcountry } = codetable
      const { name } = restProps.entity
      const { contactAddress = [] } = restProps.entity.contact
      let address =
        contactAddress.length > 0
          ? contactAddress.find(x => x.isMailing) ||
            contactAddress.find(x => x.isPrimary) ||
            contactAddress[0]
          : {}
      data.MailingInformation = [
        {
          Title: name,
          Content: `${address.blockNo}${
            address.street ? ' ' + address.street : ''
          }${address.blockNo || address.street ? '\n' : ''}${address.unitNo}${
            address.buildingName ? ' ' + address.buildingName : ''
          }${address.unitNo || address.buildingName ? '\n' : ''}${
            ctcountry.find(x => x.id === address.countryFK)?.name
          } ${address.postcode ? ' ' + address.postcode : ''}`,
        },
      ]
      const payload = [
        {
          ReportId: 95,
          Copies: copyNo[labelType],
          ReportData: JSON.stringify(data),
        },
      ]
      handlePrint(JSON.stringify(payload))
    }
  }

  const handleCopyNoChange = (value, labelType) =>
    setCopyNo({
      ...copyNo,
      [labelType]: value,
    })

  return (
    <div className={classes.root}>
      <Popper
        open={popperOpen}
        placement='bottom-start'
        transition
        overlay={
          <ClickAwayListener onClickAway={closePopper}>
            <MenuList role='menu'>
              {labelTypes.length > 0 &&
                labelTypes.map(o => {
                  return (
                    <MenuItem>
                      <Button
                        color='primary'
                        size='sm'
                        style={{ width: 120 }}
                        onClick={() => handleClick(o)}
                        disabled={!Number.isInteger(copyNo[o]) || sendingJob}
                      >
                        {o !== 'Patient_Label'
                          ? o.replace('Patient_', '').replace('_', ' ')
                          : o.replace('_', ' ')}
                      </Button>
                      <InputNumber
                        size='small'
                        min={1}
                        max={10}
                        value={copyNo[o]}
                        onChange={value => handleCopyNoChange(value, o)}
                        className={classes.inputStyle}
                      />
                      <span className={classes.qtyFont}>&nbsp;Copies</span>
                    </MenuItem>
                  )
                })}
            </MenuList>
          </ClickAwayListener>
        }
      >
        {!iconOnly ? (
          <Button
            color='primary'
            onClick={openPopper}
            size='sm'
            style={{ height: 25, marginTop: 2 }}
          >
            <Print /> Print
          </Button>
        ) : (
          <IconButton
            size='small'
            style={{
              marginLeft: 10,
              color: '#4255bd',
              position: 'relative',
              top: '-3px',
            }}
          >
            <Print style={{ width: 22, height: 22 }} onClick={openPopper} />
          </IconButton>
        )}
      </Popper>
    </div>
  )
}

export default withWebSocket()(PatientLabelButton)
