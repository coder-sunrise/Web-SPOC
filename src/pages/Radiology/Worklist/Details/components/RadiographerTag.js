import React, { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'dva'
import moment from 'moment'
import { Tag, Input, Tooltip, Select, Divider, Typography } from 'antd'
import { SaveFilled, PlusOutlined } from '@ant-design/icons'
import { CLINICAL_ROLE } from '@/utils/constants'
import Authorized from '@/utils/Authorized'

export const RadiographerTag = ({
  onChange,
  label,
  value = [],
  readonly = false,
}) => {
  const [inputVisible, setInputVisible] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const inputRef = useRef(null)
  const [assignedRadiographers, setAssignedRadiographers] = useState([])
  const [newTagInput, setNewTagInput] = useState([])
  const [radiographers, setRadiographers] = useState([])
  const [assignableRadiographers, setAssignableRadiographers] = useState([])
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'clinicianprofile',
        force: true,
      },
    }).then(o => {
      if (o) {
        const result = o.filter(
          c => c.userProfile.role.clinicRoleFK === CLINICAL_ROLE.RADIOGRAPHER,
        )
        setRadiographers(result)
      }
    })
  }, [])

  useEffect(() => {
    setAssignedRadiographers(value)
  }, [value])

  useEffect(() => {
    const tmpAssignableRadiographers = radiographers
      .filter(
        r => assignedRadiographers.findIndex(ar => ar.id === r.id) === -1, //filter out assigned radiographers in selection
      )
      .map(r => ({ label: r.name, value: r.id }))
    setAssignableRadiographers(tmpAssignableRadiographers)
  }, [radiographers, assignedRadiographers])

  useEffect(() => {
    inputRef.current?.focus()
  }, [inputVisible])

  const handleRemoveTag = val => {
    const tmpAssignedRadiographers =
      assignedRadiographers.filter(r => r.id !== val.id) ?? []

    setAssignedRadiographers(tmpAssignedRadiographers)

    onChange(tmpAssignedRadiographers)
  }

  const showInput = () => {
    setInputVisible(true)
  }

  const handleInputConfirm = val => {
    let tmpAssignedRadiographers = []
    if (val && assignedRadiographers.findIndex(r => r.id === val) === -1) {
      tmpAssignedRadiographers = [
        ...assignedRadiographers,
        radiographers.find(r => r.id === val),
      ]
    }

    setAssignedRadiographers(tmpAssignedRadiographers)
    setInputVisible(false)

    onChange(tmpAssignedRadiographers)
  }

  const handleInputCancel = () => {
    if (!dropdownOpen) {
      setInputVisible(false)
    }
  }

  return (
    <div>
      <Typography.Text readonly={readonly}>{label} </Typography.Text>

      {assignedRadiographers.map((assignedRadiographer, index) => {
        {
          const tagElem = (
            <Tag
              key={assignedRadiographer.id}
              style={
                readonly
                  ? { cursor: 'no-drop', margin: '3px' }
                  : { margin: '3px' }
              }
              closable={!readonly}
              onClose={() => handleRemoveTag(assignedRadiographer)}
            >
              <span>{assignedRadiographer.name}</span>
            </Tag>
          )
          return !readonly ? (
            tagElem
          ) : (
            <Tooltip
              title={assignedRadiographer.name}
              key={assignedRadiographer.id}
            >
              {assignedRadiographer.name}
            </Tooltip>
          )
        }
      })}

      {inputVisible && (
        <Select
          showSearch
          ref={inputRef}
          style={{ width: 250 }}
          size={'small'}
          onChange={handleInputConfirm}
          onBlur={e => handleInputCancel(e)}
          onDropdownVisibleChange={open => {
            setDropdownOpen(open)
          }}
          options={assignableRadiographers}
          optionFilterProp='label'
          filterOption={(input, options) =>
            options.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        />
      )}
      {!readonly && !inputVisible && (
        <Tag className='site-tag-plus' onClick={showInput}>
          <PlusOutlined /> New Technologist
        </Tag>
      )}
    </div>
  )
}
