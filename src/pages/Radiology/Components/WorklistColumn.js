import React, { Fragment, useState, useEffect } from 'react'
import { Typography } from 'antd'
import _ from 'lodash'
import ProCard from '@ant-design/pro-card'
import { columns } from '@/pages/Widgets/ClinicalNotes/CannedText/utils'
import { RADIOLOGY_WORKITEM_STATUS } from '@/utils/constants'

const defaultColumnStyle = {
  height: '100%',
  backgroundColor: 'green',
  borderRadius: 5,
  display: 'flex',
  flexDirection: 'column',
  padding: 1,
  margin: '0px 4px',
}

const columnBodyStyle = {
  backgroundColor: 'white',
  margin: 3,
  flex: '1 1 auto',
  overflow: 'auto',
  height: 0,
  padding: '3px',
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
        style={{ color: 'white', gridColumnStart: 2, marginBottom: 5 }}
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

const sortItems = data => {
  if (!data || !data.workitems || data.workitems.length === 0) return []

  //If the order is combined, the sort value is based on primary workitem.
  const getSortValueItem = (collection, item) => {
    return !item.primaryWorkitemFK ||
      item.primaryWorkitemFK === item.radiologyWorkitemId ||
      collection.findIndex(
        current => current.radiologyWorkitemId === item.primaryWorkitemFK,
      ) === -1
      ? item
      : collection.find(
          current => current.radiologyWorkitemId === item.primaryWorkitemFK,
        )
  }

  const getEpochTime = date => Math.round(date / 1000)

  const calculateSortValue = item => {
    let sortValue = 1
    const sortValueItem = getSortValueItem(data.workitems, item)

    //If not new item, the sorting is based on status update date.
    if (sortValueItem.statusFK === RADIOLOGY_WORKITEM_STATUS.NEW) {
      sortValue += getEpochTime(
        new Date() - Date.parse(sortValueItem.generateDate),
      )

      if (
        !sortValueItem.isNurseActualizeRequired ||
        (sortValueItem.isNurseActualizeRequired &&
          sortValueItem.isNurseActualized)
      )
        sortValue = sortValue * 10

      if (sortValueItem.priority === 'Urgent') sortValue = sortValue * 100
    } else {
      sortValue = getEpochTime(
        new Date() - Date.parse(sortValueItem.statusUpdateDate),
      )
    }

    if (item.primaryWorkitemFK === item.radiologyWorkitemId)
      sortValue = sortValue + 1

    return sortValue
  }

  const sortedData = _.sortBy(
    data.workitems.map(item => ({
      ...item,
      sortValue: calculateSortValue(item),
    })),
    item => item.sortValue,
  )

  const currentColumnStatus = data.workitems[0].statusFK
  //New and In Progress show oldest at the top.
  if (
    currentColumnStatus === RADIOLOGY_WORKITEM_STATUS.NEW ||
    currentColumnStatus === RADIOLOGY_WORKITEM_STATUS.INPROGRESS
  )
    return sortedData.reverse()

  return sortedData
}

const WorklistColumnBody = ({ data, renderWorkitem }) => {
  const sortedData = sortItems(data)

  return (
    <div style={columnBodyStyle}>
      {sortedData.map(item => renderWorkitem(item))}
    </div>
  )
}

export const WorklistColumn = ({ data, renderWorkitem, columnPercentage }) => (
  <div
    style={{
      ...defaultColumnStyle,
      backgroundColor: data.backgroundColor,
      width: `${columnPercentage}%`,
    }}
  >
    <WorlklistColumnTitle
      title={data.title}
      workItemCount={data.workitems.length}
    />
    <WorklistColumnBody data={data} renderWorkitem={renderWorkitem} />
  </div>
)
