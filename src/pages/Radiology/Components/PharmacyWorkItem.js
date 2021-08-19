import React, { Fragment, useState, useEffect, useContext } from 'react'
import { Typography, Card } from 'antd'
import ProCard from '@ant-design/pro-card'
import moment from 'moment'
import { Icon, dateFormatLongWithTimeNoSec12h, Tooltip } from '@/components'
import { VISIT_TYPE, VISIT_TYPE_NAME } from '@/utils/constants'
import { calculateAgeFromDOB } from '@/utils/dateUtils'
import { FileDoneOutlined } from '@ant-design/icons'
import Warning from '@material-ui/icons/Error'
import WorlistContext from '../Worklist/WorklistContext'

const blueColor = '#1890f8'

const printPrescription = (visitID) => {

}

const WorkitemTitle = ({ item }) => {
  console.log('item', item)
  const age = item.patientInfo.dob ? calculateAgeFromDOB(item.patientInfo.dob) : 0
  let gender
  let genderColor
  if (item.patientInfo.genderFK === 1) {
    gender = 'female'
    genderColor = 'pink'
  }
  else if (item.patientInfo.genderFK === 2) {
    gender = 'male'
    genderColor = blueColor
  }
  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        fontSize: '0.9rem',
        borderBottom: '#cdcdcd solid 1px',
        padding: '5px 8px',
      }}
    >
      <div style={{ marginRight: 'auto' }}>
        <div style={{ color: blueColor, fontWeight: 500, fontSize: '1rem' }}>
          {item.patientInfo.name}
        </div>
        <div>{item.patientInfo.patientReferenceNo}</div>
      </div>
      <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
        <div>
          <Tooltip title='Family Numbers'>
            <Icon type='team' style={{ color: 'red', fontSize: '1rem', marginRight: 3 }} />
          </Tooltip>
          <Tooltip title={gender}>
            <Icon type={gender} style={{ color: genderColor, fontSize: '1rem', marginRight: 3 }} />
          </Tooltip>
          <span style={{ fontSize: '0.7rem' }}> {age} {age > 1 ? 'Yrs' : 'Yr'}</span>
        </div>
        <div>{item.patientInfo.patientAccountNo}</div>
      </div>
    </div >
  )
}

const WorkitemBody = ({ item }) => {
  const { setDetailsId } = useContext(WorlistContext)
  const orderDate = moment(item.generateDate).format(
    dateFormatLongWithTimeNoSec12h,
  )
  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        fontSize: '0.8rem',
        lineHeight: '1.6rem',
        padding: '3px 8px',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          display: 'flex',
          width: '100%',
        }}
      >
        <div style={{ marginRight: 'auto', flexGrow: 1 }}>
          <div>{`${item.visitInfo.doctorTitle && item.visitInfo.doctorTitle.trim().length ? `${item.visitInfo.doctorTitle}.` : ''}${item.visitInfo.doctorName || ''}`}</div>
          <div><FileDoneOutlined style={{ color: blueColor, fontSize: '1rem', marginRight: 3 }} />{orderDate}</div>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <div>Q. No.: {item.visitInfo.queueNo}</div>
          <div>
            <Tooltip title='Paid'>
              <Icon type='Dollar' style={{ color: 'green', fontSize: '1rem', marginRight: 3 }} />
            </Tooltip>
            {moment().format('hh:mm A, DD MMM')}
          </div>
        </div>
      </div>
      <div
        style={{
          color: blueColor,
        }}
      >
        <Typography.Text
          underline
          style={{
            cursor: 'pointer',
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
            marginLeft: 8
          }}
          onClick={() => {
            printPrescription(item.visitFK)
          }}
        >
          Print Prescription
        </Typography.Text>
        <Tooltip title='Order updated by doctor'>
          <Warning style={{ color: 'red', marginLeft: 8, position: 'relative', bottom: '-4px' }} />
        </Tooltip>
      </div>
    </div>
  )
}

export const PharmacyWorkItem = (item) => (
  <div
    key={item.id}
    style={{
      height: 140,
      margin: '5px',
      borderRadius: 6,
      border: '#cdcdcd solid 2px',
    }}
  >
    <WorkitemTitle item={item} />
    <WorkitemBody item={item} />
  </div>
)
