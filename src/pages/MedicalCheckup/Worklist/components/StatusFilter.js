import React, { useState, useContext, useEffect } from 'react'
import { CheckSquareFilled } from '@ant-design/icons'
import { TagWithCount } from '@/components/_medisys'
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
