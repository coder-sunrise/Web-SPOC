import React, { Fragment, useState, useEffect } from 'react'
import { Typography } from 'antd'
import ProCard from '@ant-design/pro-card'
import { columns } from '@/pages/Widgets/ClinicalNotes/CannedText/utils'

const defaultColumnStyle = {
  height: '100%',
  backgroundColor: 'green',
  borderRadius: 5,
  display: 'flex',
  flexDirection: 'column',
}

const columnBodyStyle = {
  backgroundColor: 'white',
  margin: 3,
  flex: '1 1 auto',
  overflow: 'auto',
  height: 0,
  padding: '0 8px',
}

const WorlklistColumnTitle = ({ title, workItemCount }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 3fr 1fr',
        justifyItems: 'center',
        margin: 5,
      }}
    >
      <Typography.Title
        level={4}
        style={{ color: 'white', gridColumnStart: 2 }}
      >
        {title}
      </Typography.Title>
      <div
        style={{
          padding: '0px 20px',
          alignSelf: 'center',
          backgroundColor: 'white',
          gridColumnStart: 3,
          borderRadius: 10,
        }}
      >
        {workItemCount}
      </div>
    </div>
  )
}

const WorklistColumnBody = ({ data, renderWorkitem }) => (
  <div style={columnBodyStyle}>
    {data.workitems.map(item => renderWorkitem(item))}
  </div>
)

export const WorklistColumn = ({ data, renderWorkitem }) => (
  <div
    style={{
      ...defaultColumnStyle,
      backgroundColor: data.backgroundColor,
    }}
  >
    <WorlklistColumnTitle
      title={data.title}
      workItemCount={data.workitems.length}
    />
    <WorklistColumnBody data={data} renderWorkitem={renderWorkitem} />
  </div>
)
