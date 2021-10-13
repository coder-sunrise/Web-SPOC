import React, { Fragment, useState, useEffect, useContext } from 'react'
import { Typography, Card } from 'antd'
import ProCard from '@ant-design/pro-card'
import moment from 'moment'
import { Icon, dateFormatLongWithTimeNoSec, Tooltip } from '@/components'
import { VISIT_TYPE, VISIT_TYPE_NAME } from '@/utils/constants'
import { calculateAgeFromDOB } from '@/utils/dateUtils'
import WorklistContext from '../Worklist/WorklistContext'

const blueColor = '#1890f8'

const WorkitemLeftLabel = ({
  children,
  tooltip,
  width = 150,
  style,
  ...props
}) => (
  <Tooltip title={tooltip}>
    <div
      style={{
        textOverflow: 'ellipsis',
        width: width,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  </Tooltip>
)

const WorkitemTitle = ({ item }) => {
  const age = calculateAgeFromDOB(item.patientInfo.dob)

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        fontSize: '0.9rem',
        borderBottom: '#cdcdcd solid 1px',
        padding: 8,
      }}
    >
      <div
        style={{
          marginRight: 'auto',
        }}
      >
        <WorkitemLeftLabel style={{ color: blueColor, fontWeight: 500 }}>
          {item.patientInfo.name}
        </WorkitemLeftLabel>
        <WorkitemLeftLabel tooltip={item.patientInfo.patientReferenceNo}>
          {item.patientInfo.patientReferenceNo}
        </WorkitemLeftLabel>
      </div>
      <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
        <div>
          <Icon type='male' style={{ color: blueColor, fontSize: 15 }} />
          {age} {age === 1 ? 'Yr' : 'Yrs'}
        </div>
        <div width={80}>{item.patientInfo.patientAccountNo}</div>
      </div>
    </div>
  )
}

const WorkitemBody = ({ item }) => {
  const { setDetailsId } = useContext(WorklistContext)
  const orderDate = moment(item.generateDate).format(
    dateFormatLongWithTimeNoSec,
    false,
  )
  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        fontSize: '0.9rem',
        lineHeight: '1.8rem',
        padding: 8,
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
          <WorkitemLeftLabel style={{ fontWeight: 500 }}>
            {item.itemDescription}
          </WorkitemLeftLabel>
          <WorkitemLeftLabel tooltip={item.accessionNo}>
            {item.accessionNo}
            {item.primaryWorkitemFK && (
              <Icon
                type='link'
                style={{ fontSize: 18, color: blueColor, alignSelf: 'center' }}
              />
            )}
          </WorkitemLeftLabel>
          <WorkitemLeftLabel>{item.visitInfo.doctorName}</WorkitemLeftLabel>
          <WorkitemLeftLabel>{orderDate}</WorkitemLeftLabel>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <div>Q.No.: {item.visitInfo.queueNo}</div>
          {item.visitInfo.visitGroup && (
            <div>
              <Icon
                type='family'
                style={{
                  color: 'red',
                  fontSize: '1.5rem',
                  marginRight: 10,
                }}
              />
              {item.visitInfo.visitGroup}
            </div>
          )}
        </div>
      </div>
      <div
        style={{
          color: blueColor,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1fr',
        }}
      >
        <Typography.Text
          underline
          style={{
            cursor: 'pointer',
            gridColumnStart: 1,
            gridColumnEnd: 2,
            textAlign: 'left',
          }}
          onClick={() => {
            setDetailsId(item.radiologyWorkitemId)
          }}
        >
          Details
        </Typography.Text>
        {item.priority === 'Urgent' && (
          <div
            style={{
              color: 'red',
              gridColumnStart: 2,
              gridColumnEnd: 3,
              display: 'flex',
            }}
          >
            <Icon
              type='thunder'
              style={{ fontSize: 15, color: 'red', alignSelf: 'center' }}
            />
            URGENT
          </div>
        )}

        <span
          style={{
            gridColumnStart: 3,
            gridColumnEnd: 4,
            justifySelf: 'center',
          }}
        >
          {item.visitPurposeFK !== VISIT_TYPE.MC ? 'O/P' : 'MC'}
        </span>
      </div>
    </div>
  )
}

export const Workitem = item => (
  <div
    key={item.radiologyWorkitemId}
    style={{
      height: 220,
      margin: '10px 5px',
      borderRadius: 10,
      backgroundColor:
        item.isNurseActualized || !item.isNurseActualizeRequired
          ? '#d3fed1'
          : 'white',
      border: '#cdcdcd solid 2px',
    }}
  >
    <WorkitemTitle item={item} />
    <WorkitemBody item={item} />
  </div>
)
