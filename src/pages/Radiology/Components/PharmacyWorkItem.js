import React, { Fragment, useState, useEffect, useContext } from 'react'
import { Typography, Card } from 'antd'
import ProCard from '@ant-design/pro-card'
import moment from 'moment'
import { connect } from 'dva'
import { compose } from 'redux'
import numeral from 'numeral'
import { withStyles } from '@material-ui/core'
import {
  Icon,
  dateFormatLongWithTimeNoSec12h,
  Tooltip,
  CommonTableGrid,
  Popover,
} from '@/components'
import { VISIT_TYPE, VISIT_TYPE_NAME } from '@/utils/constants'
import { calculateAgeFromDOB } from '@/utils/dateUtils'
import { FileDoneOutlined } from '@ant-design/icons'
import Warning from '@material-ui/icons/Error'
import tablestyles from '@/pages/Widgets/PatientHistory/PatientHistoryStyle.less'
import WorlistContext from '../Worklist/WorklistContext'
import VisitGroupIcon from './VisitGroupIcon'

const blueColor = '#1890f8'

const styles = theme => ({
  mainPanel: {
    height: 140,
    margin: '8px 3px',
    borderRadius: 6,
    border: '#cdcdcd solid 1px',
    padding: 3,
  },
  titlePanel: {
    width: '100%',
    fontSize: '0.9rem',
    borderBottom: '#cdcdcd solid 1px',
    padding: '5px 8px',
  },
  commonText: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  subRow: {
    '& > td:first-child': {
      paddingLeft: theme.spacing(1),
    },
  },
  bodayPanel: {
    width: '100%',
    fontSize: '0.9rem',
    lineHeight: '1.6rem',
    padding: '3px 8px',
  },
  warningIcon: {
    color: 'red',
    marginLeft: 10,
    position: 'relative',
    bottom: '-4px',
    fontSize: '1rem',
  },
})

const printPrescription = visitID => {}

const WorkitemTitle = ({ item, classes }) => {
  const age = item.dob ? calculateAgeFromDOB(item.dob) : 0
  let gender
  let genderColor
  if (item.genderFK === 1) {
    gender = 'female'
    genderColor = '#F5559F'
  } else if (item.genderFK === 2) {
    gender = 'male'
    genderColor = blueColor
  }
  return (
    <div className={classes.titlePanel}>
      <div style={{ position: 'relative', paddingRight: 70 }}>
        <Tooltip title={item.name}>
          <div
            className={classes.commonText}
            style={{
              color: blueColor,
              fontWeight: 600,
              fontSize: '1rem',
            }}
          >
            {item.name}
          </div>
        </Tooltip>
        <div
          style={{
            width: 70,
            position: 'absolute',
            right: 0,
            top: 0,
            textAlign: 'right',
          }}
        >
          {gender && (
            <Tooltip title={gender}>
              <Icon
                type={gender}
                style={{
                  color: genderColor,
                  fontSize: '1rem',
                  marginRight: 3,
                }}
              />
            </Tooltip>
          )}
          <span>
            {age} {age > 1 ? 'Yrs' : 'Yr'}
          </span>
        </div>
      </div>
      <div style={{ position: 'relative', paddingRight: 90 }}>
        <Tooltip title={item.patientReferenceNo}>
          <div className={classes.commonText}>{item.patientReferenceNo}</div>
        </Tooltip>
        <Tooltip title={item.patientAccountNo}>
          <div
            className={classes.commonText}
            style={{
              width: 90,
              position: 'absolute',
              right: 0,
              top: 0,
              textAlign: 'right',
            }}
          >
            {item.patientAccountNo}
          </div>
        </Tooltip>
      </div>
    </div>
  )
}

const WorkitemBody = ({ item, classes, clinicSettings }) => {
  const { setDetailsId } = useContext(WorklistContext)
  const orderDate = moment(item.generateDate).format('DD MMM YYYY HH:mm')

  const showGroup = item.visitGroup && item.visitGroup.trim().length
  const doctorName = `${
    item.doctorTitle && item.doctorTitle.trim().length
      ? `${item.doctorTitle}. `
      : ''
  }${item.doctorName || ''}`

  const { isQueueNoDecimal } = clinicSettings
  const queueNo =
    !item.queueNo || !item.queueNo.trim().length
      ? '-'
      : numeral(item.queueNo).format(isQueueNoDecimal ? '0.0' : '0')
  return (
    <div className={classes.bodayPanel}>
      <div style={{ position: 'relative', paddingRight: 90 }}>
        <Tooltip title={doctorName}>
          <div className={classes.commonText}>{doctorName}</div>
        </Tooltip>
        <div
          style={{
            width: 90,
            position: 'absolute',
            right: 0,
            top: 0,
            textAlign: 'right',
          }}
        >
          Q. No.: {queueNo}
        </div>
      </div>
      <div style={{ position: 'relative', paddingRight: 150 }}>
        <Tooltip title={`Order Created Time: ${orderDate}`}>
          <div className={classes.commonText}>
            <FileDoneOutlined
              style={{ color: blueColor, fontSize: '0.9rem', marginRight: 3 }}
            />
            {orderDate}
          </div>
        </Tooltip>
        {item.isPaid && (
          <div
            style={{
              width: 150,
              position: 'absolute',
              right: 0,
              top: 0,
              textAlign: 'right',
            }}
          >
            <Tooltip title='Paid'>
              <Icon
                type='Dollar'
                style={{ color: 'green', fontSize: '1rem', marginRight: 3 }}
              />
            </Tooltip>
            {moment(item.paymentDate).format('DD MMM YYYY HH:mm')}
          </div>
        )}
      </div>
      <div>
        <Typography.Text
          underline
          style={{
            cursor: 'pointer',
            color: blueColor,
          }}
          onClick={() => {
            setDetailsId(item.id)
          }}
        >
          Details
        </Typography.Text>
        <Typography.Text
          underline
          style={{
            cursor: 'pointer',
            marginLeft: 10,
            color: blueColor,
          }}
          onClick={() => {
            printPrescription(item.visitFK)
          }}
        >
          Print Prescription
        </Typography.Text>
        {item.isOrderUpdate && (
          <Tooltip title='Order has been amended, please retrieve latest order from Details link'>
            <Warning className={classes.warningIcon} />
          </Tooltip>
        )}
        {showGroup && (
          <VisitGroupIcon
            visitGroup={item.visitGroup}
            visitFK={item.visitFK}
            isQueueNoDecimal={isQueueNoDecimal}
          />
        )}
      </div>
    </div>
  )
}

const PharmacyWorkItem = props => {
  const { item, classes } = props
  return (
    <div
      key={item.id}
      className={classes.mainPanel}
      style={{
        backgroundColor: item.isPaid ? '#D3FED1' : 'white',
      }}
    >
      <WorkitemTitle {...props} />
      <WorkitemBody {...props} />
    </div>
  )
}

export default compose(
  withStyles(styles),
  connect(({ clinicSettings }) => ({
    clinicSettings: clinicSettings.settings || clinicSettings.default,
  })),
)(PharmacyWorkItem)
