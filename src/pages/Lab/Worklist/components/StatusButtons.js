import React, { useState, useContext, useEffect } from 'react'
import { Form, Button, Card, Tag, Avatar, Badge } from 'antd'

export const StatusButtons = ({ style }) => {
  return (
    <div style={{ display: 'flex', ...style }}>
      <Tag color='#5a9cde' style={{ minWidth: 80 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ flexGrow: 1, marginRight: 5 }}>All</span>
          <span
            style={{
              textAlign: 'center',
              justifyContent: 'end',
              alignItems: 'flex-end',
              background: 'white',
              borderRadius: '10px',
              margin: '3px 0px',
              color: '#5a9cde',
              width: '20px',
              height: '20px',
              fontSize: '0.8em',
            }}
          >
            90
          </span>
        </div>
      </Tag>

      <Tag color='#999900' style={{ minWidth: 80 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ flexGrow: 1, marginRight: 5 }}>New</span>
          <span
            style={{
              textAlign: 'center',
              justifyContent: 'end',
              alignItems: 'flex-end',
              background: 'white',
              borderRadius: '10px',
              margin: '3px 0px',
              color: '#999900',
              width: '20px',
              height: '20px',
              fontSize: '0.8em',
            }}
          >
            8
          </span>
        </div>
      </Tag>

      <Tag color='#009999' style={{ minWidth: 80 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ flexGrow: 1, marginRight: 5 }}>In Progress</span>
          <span
            style={{
              textAlign: 'center',
              justifyContent: 'end',
              alignItems: 'flex-end',
              background: 'white',
              borderRadius: '10px',
              margin: '3px 0px',
              color: '#009999',
              width: '20px',
              height: '20px',
              fontSize: '0.8em',
            }}
          >
            8
          </span>
        </div>
      </Tag>

      <Tag color='#993333' style={{ minWidth: 80 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ flexGrow: 1, marginRight: 5 }}> P. 1st Verify</span>
          <span
            style={{
              textAlign: 'center',
              justifyContent: 'end',
              alignItems: 'flex-end',
              background: 'white',
              borderRadius: '10px',
              margin: '3px 0px',
              color: '#993333',
              width: '20px',
              height: '20px',
              fontSize: '0.8em',
            }}
          >
            0
          </span>
        </div>
      </Tag>

      <Tag color='#0000ff' style={{ minWidth: 80 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ flexGrow: 1, marginRight: 5 }}>P. 2nd Verify</span>
          <span
            style={{
              textAlign: 'center',
              justifyContent: 'end',
              alignItems: 'flex-end',
              background: 'white',
              borderRadius: '10px',
              margin: '3px 0px',
              color: '#0000ff',
              width: '20px',
              height: '20px',
              fontSize: '0.8em',
            }}
          >
            3
          </span>
        </div>
      </Tag>

      <Tag color='#0000ff' style={{ minWidth: 80 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ flexGrow: 1, marginRight: 5 }}>P. 2nd Verify</span>
          <span
            style={{
              textAlign: 'center',
              justifyContent: 'end',
              alignItems: 'flex-end',
              background: 'white',
              borderRadius: '10px',
              margin: '3px 0px',
              color: '#0000ff',
              width: '20px',
              height: '20px',
              fontSize: '0.8em',
            }}
          >
            3
          </span>
        </div>
      </Tag>

      <Tag color='#009933' style={{ minWidth: 80 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ flexGrow: 1, marginRight: 5 }}>Completed</span>
          <span
            style={{
              textAlign: 'center',
              justifyContent: 'end',
              alignItems: 'flex-end',
              background: 'white',
              borderRadius: '10px',
              margin: '3px 0px',
              color: '#009933',
              width: '20px',
              height: '20px',
              fontSize: '0.8em',
            }}
          >
            23
          </span>
        </div>
      </Tag>

      <Tag color='#cc6633' style={{ minWidth: 80 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ flexGrow: 1, marginRight: 5 }}>Cancelled</span>
          <span
            style={{
              textAlign: 'center',
              justifyContent: 'end',
              alignItems: 'flex-end',
              background: 'white',
              borderRadius: '10px',
              margin: '3px 0px',
              color: '#cc6633',
              width: '20px',
              height: '20px',
              fontSize: '0.8em',
            }}
          >
            23
          </span>
        </div>
      </Tag>

      <Tag color='#33cc99' style={{ minWidth: 80 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ flexGrow: 1, marginRight: 5 }}>Discarded</span>
          <span
            style={{
              textAlign: 'center',
              justifyContent: 'end',
              alignItems: 'flex-end',
              background: 'white',
              borderRadius: '10px',
              margin: '3px 0px',
              color: '#33cc99',
              width: '20px',
              height: '20px',
              fontSize: '0.8em',
            }}
          >
            2
          </span>
        </div>
      </Tag>
    </div>
  )
}
