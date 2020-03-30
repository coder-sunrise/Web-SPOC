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
// common components
import { Button, Popper } from '@/components'
import { REPORT_ID } from '@/utils/constants'
import withWebSocket from '@/components/Decorator/withWebSocket'
// services
import { getRawData } from '@/services/report'

const labelTypes = [
  'PATIENT_LABEL',
  'PATIENT_LAB_LABEL',
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
}) => {
  const classes = useStyles()

  const [
    copyNo,
    setCopyNo,
  ] = useState(
    labelTypes.reduce((a, b) => {
      return { ...a, [b]: 1 }
    }, {}),
  )

  const [
    popperOpen,
    setPopperOpen,
  ] = useState(false)

  const openPopper = () => setPopperOpen(true)
  const closePopper = () => setPopperOpen(false)

  const sizeConverter = (sizeCM) => {
    return sizeCM
      .split('x')
      .map((o) =>
        (10 * parseFloat(o.replace('cm', ''))).toString().concat('MM'),
      )
      .join('_')
  }

  const handleClick = async (labelType) => {
    if (!Number.isInteger(copyNo[labelType])) return

    const { labelPrinterSize } = clinicSettings

    const reportID =
      REPORT_ID[labelType.concat('_').concat(sizeConverter(labelPrinterSize))]

    const data = await getRawData(reportID, { patientId })
    const payload = [
      {
        ReportId: reportID,
        ReportData: JSON.stringify({
          ...data,
        }),
      },
    ]

    for (let i = 0; i < copyNo[labelType]; i++) {
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
        transition
        overlay={
          <ClickAwayListener onClickAway={closePopper}>
            <MenuList role='menu'>
              {labelTypes.length > 0 &&
                labelTypes.map((o) => {
                  return (
                    <MenuItem>
                      <Button
                        color='primary'
                        onClick={() => handleClick(o)}
                        disabled={!Number.isInteger(copyNo[o]) || sendingJob}
                      >
                        {o.includes('_LAB_') ? (
                          'LAB LABEL'
                        ) : (
                          o.replace('_', ' ')
                        )}
                      </Button>
                      <InputNumber
                        size='small'
                        min={1}
                        max={10}
                        value={copyNo[o]}
                        onChange={(value) => handleCopyNoChange(value, o)}
                        className={classes.inputStyle}
                      />
                      <span className={classes.qtyFont}>&nbsp;Qty</span>
                    </MenuItem>
                  )
                })}
            </MenuList>
          </ClickAwayListener>
        }
      >
        <Button color='primary' onClick={openPopper}>
          <Print />
        </Button>
      </Popper>
    </div>
  )
}

export default withWebSocket()(PatientLabelButton)
