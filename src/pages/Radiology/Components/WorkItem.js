import React, { Fragment, useState, useEffect, useContext } from 'react'
import { Typography, Card } from 'antd'
import ProCard from '@ant-design/pro-card'
import { Icon } from '@/components'
import { VISIT_TYPE, VISIT_TYPE_NAME } from '@/utils/constants'
import WorlistContext from '../Worklist/WorklistContext'

const blueColor = '#1890f8'

const WorkitemTitle = ({ item }) => (
  <div
    style={{
      display: 'flex',
      width: '100%',
      fontSize: '0.9rem',
      borderBottom: '#cdcdcd solid 1px',
      padding: 8,
    }}
  >
    <div style={{ marginRight: 'auto' }}>
      <div style={{ color: blueColor, fontWeight: 500 }}>
        {item.patient.name}
      </div>
      <div>{item.patient.patientReferenceNo}</div>
    </div>
    <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
      <div>
        <Icon type='male' style={{ color: blueColor, fontSize: 15 }} />{' '}
        {item.patient.age} {item.patient.age === 1 ? 'Yr' : 'Yrs'}
      </div>
      <div>{item.patient.patientAccountNo}</div>
    </div>
  </div>
)

const WorkitemBody = ({ item }) => {
  const { setDetailsId } = useContext(WorlistContext)

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
          <div style={{ fontWeight: 500 }}>{item.itemDescription}</div>
          <div>{item.accessionNo}</div>
          <div>{item.visit.doctorName}</div>
          <div>{item.orderDate}</div>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <div>Q.No.: {item.visit.queueNo}</div>
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
            setDetailsId(item.id)
          }}
        >
          Details
        </Typography.Text>
        {item.isUrgent && (
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
    key={item.id}
    style={{
      height: 220,
      margin: '10px 5px',
      borderRadius: 10,
      backgroundColor: item.isNurseActualized ? '#d3fed1' : 'white',
      border: '#cdcdcd solid 2px',
    }}
  >
    <WorkitemTitle item={item} />
    <WorkitemBody item={item} />
  </div>
)
