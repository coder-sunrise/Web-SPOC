import React, { useState, useContext, useEffect } from 'react'
import { Form, Button, Card, Tag, Avatar, Badge } from 'antd'
import { CheckSquareFilled } from '@ant-design/icons'

const StatusTag = ({ tagColor, text, count, checked = false, onClick }) => {
  return (
    <Badge
      offset={[-10, 0]}
      count={
        checked ? (
          <CheckSquareFilled
            style={{ color: '#4255bd', backgroundColor: 'white' }}
          />
        ) : (
          0
        )
      }
    >
      <Tag color={tagColor} style={{ minWidth: 80 }} onClick={onClick}>
        <div
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
        >
          <span style={{ flexGrow: 1, marginRight: 5 }}>{text}</span>
          <span
            style={{
              textAlign: 'center',
              justifyContent: 'end',
              alignItems: 'flex-end',
              background: 'white',
              borderRadius: '10px',
              margin: '3px 0px',
              color: tagColor,
              width: '20px',
              height: '20px',
              fontSize: '0.8em',
            }}
          >
            {count}
          </span>
        </div>
      </Tag>
    </Badge>
  )
}

export const StatusButtons = ({ style }) => {
  return (
    <div style={{ display: 'flex', ...style }}>
      <StatusTag tagColor='#5a9cde' text='All' count='90' checked />
      <StatusTag tagColor='#999900' text='New' count='8' checked />
      <StatusTag tagColor='#009999' text='In Progress' count='8' />
      <StatusTag tagColor='#993333' text='P. 1st Verify' count='0' checked />
      <StatusTag tagColor='#0000ff' text='P. 2nd Verify' count='0' />
      <StatusTag tagColor='#009933' text='Completed' count='0' />
      <StatusTag tagColor='#33cc99' text='Discarded' count='5' />
    </div>
  )
}
