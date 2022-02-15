import React, { useState, useContext, useEffect } from 'react'
import { Form, Button, Card, Tag, Avatar, Badge } from 'antd'
import { CheckSquareFilled } from '@ant-design/icons'
import { Tooltip } from '@/components'
import {
  LAB_SPECIMEN_STATUS,
  LAB_SPECIMEN_STATUS_COLORS,
  LAB_SPECIMEN_ALL_COLOR,
  LAB_SPECIMEN_STATUS_LABELS,
  LAB_SPECIMEN_ALL_LABEL,
  LAB_SPECIMEN_STATUS_DESCRIPTION,
  LAB_SPECIMEN_ALL_DESCRIPTION,
} from '@/utils/constants'

const ALL_STATUS_VALUE = -99
const allSpecimenStatuses = Object.values(LAB_SPECIMEN_STATUS)

const TagWithCount = ({
  tagColor,
  label,
  tooltip,
  count,
  checked,
  onClick,
}) => {
  console.log('lab-module logs: checked', checked)
  return (
    <Tooltip title={tooltip}>
      <span>
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
              style={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
              }}
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
      </span>
    </Tooltip>
  )
}

const getStatusColor = statusId => LAB_SPECIMEN_STATUS_COLORS[`${statusId}`]
const getStatusLabel = statusId => LAB_SPECIMEN_STATUS_LABELS[`${statusId}`]
const getStatusDescription = statusId =>
  LAB_SPECIMEN_STATUS_DESCRIPTION[`${statusId}`]

export const StatusFilter = ({
  counts,
  style,
  onFilterChange,
  defaultSelection = [allSpecimenStatuses],
}) => {
  const [selectedStatus, setSelectedStatus] = useState([])

  useEffect(() => setSelectedStatus(defaultSelection), [defaultSelection])

  const handleTagClick = status => {
    let newSelectedStatus

    if (status === ALL_STATUS_VALUE) {
      {
        newSelectedStatus =
          selectedStatus.length === allSpecimenStatuses.length
            ? []
            : [...allSpecimenStatuses]
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
        checked={selectedStatus.length === allSpecimenStatuses.length}
        tagColor={LAB_SPECIMEN_ALL_COLOR}
        label={LAB_SPECIMEN_ALL_LABEL}
        tooltip={LAB_SPECIMEN_ALL_DESCRIPTION}
        count={counts.reduce((prev, cur) => prev + cur.count, 0)}
        onClick={() => {
          handleTagClick(ALL_STATUS_VALUE)
        }}
      />

      {allSpecimenStatuses.map((status, index) => (
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
