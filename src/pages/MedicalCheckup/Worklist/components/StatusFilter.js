import React, { useState, useContext, useEffect } from 'react'
import { Form, Button, Card, Tag, Avatar, Badge, Tooltip } from 'antd'
import { CheckSquareFilled } from '@ant-design/icons'
import {
  MEDICALCHECKUP_WORKITEM_STATUS,
  MEDICALCHECKUP_WORKITEM_STATUS_COLORS,
  MEDICALCHECKUP_WORKITEM_STATUS_ALL_COLOR,
  MEDICALCHECKUP_WORKITEM_STATUS_LABELS,
  MEDICALCHECKUP_WORKITEM_STATUS_DESCRIPTION,
} from '@/utils/constants'

const ALL_STATUS_VALUE = -99
const allMedicalCheckupReportStatuses = Object.values(
  MEDICALCHECKUP_WORKITEM_STATUS,
)

const TagWithCount = ({
  tagColor,
  label,
  tooltip,
  count,
  checked,
  onClick,
}) => {
  return (
    <Tooltip title={tooltip}>
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
            <span style={{ flexGrow: 1, marginRight: 5 }}>{label}</span>
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
    </Tooltip>
  )
}

const getStatusColor = statusId =>
  MEDICALCHECKUP_WORKITEM_STATUS_COLORS[`${statusId}`]
const getStatusLabel = statusId =>
  MEDICALCHECKUP_WORKITEM_STATUS_LABELS[`${statusId}`]
const getStatusDescription = statusId =>
  MEDICALCHECKUP_WORKITEM_STATUS_DESCRIPTION[`${statusId}`]

export const StatusFilter = ({
  counts,
  style,
  onFilterChange,
  defaultSelection = [allMedicalCheckupReportStatuses],
}) => {
  const [selectedStatus, setSelectedStatus] = useState([])

  useEffect(() => setSelectedStatus(defaultSelection), [defaultSelection])

  const handleTagClick = status => {
    let newSelectedStatus

    if (status === ALL_STATUS_VALUE) {
      {
        newSelectedStatus =
          selectedStatus.length === allMedicalCheckupReportStatuses.length
            ? []
            : [...allMedicalCheckupReportStatuses]
      }
    } else
      newSelectedStatus = selectedStatus.includes(status)
        ? selectedStatus.filter(item => item !== status)
        : [...selectedStatus, status]

    setSelectedStatus(newSelectedStatus)
    onFilterChange && onFilterChange(newSelectedStatus)
  }

  return (
    <div style={{ display: 'flex', ...style }}>
      <TagWithCount
        checked={
          selectedStatus.length === allMedicalCheckupReportStatuses.length
        }
        tagColor={MEDICALCHECKUP_WORKITEM_STATUS_ALL_COLOR}
        label='All'
        tooltip='All'
        count={counts.reduce((prev, cur) => prev + cur.count, 0)}
        onClick={() => {
          handleTagClick(ALL_STATUS_VALUE)
        }}
      />

      {allMedicalCheckupReportStatuses.map((status, index) => (
        <TagWithCount
          key={index}
          tagColor={getStatusColor(status)}
          label={getStatusLabel(status)}
          tooltip={getStatusDescription(status)}
          checked={selectedStatus.includes(status)}
          count={(() => {
            const statusCount = counts.find(item => item.status === status)
            return statusCount ? statusCount.count : 0
          })()}
          onClick={() => {
            handleTagClick(status)
          }}
        />
      ))}
    </div>
  )
}
