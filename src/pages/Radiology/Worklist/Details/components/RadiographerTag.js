import React, { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'dva'
import moment from 'moment'
import { Tag, Input, Tooltip, Select, Divider, Typography } from 'antd'
import { SaveFilled, PlusOutlined } from '@ant-design/icons'
import { CLINICAL_ROLE } from '@/utils/constants'
import Authorized from '@/utils/Authorized'
import { withStyles } from '@material-ui/core'
import _ from 'lodash'

const styles = () => ({
  tagSelect: {
    '& > div > span > input.ant-select-selection-search-input': {
      height: '30px !important',
    },
  },
})

const RadiographerTag = ({
  classes,
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
          c =>
            (c.userProfile.role.clinicRoleFK === CLINICAL_ROLE.RADIOGRAPHER ||
              c.userProfile.role.clinicRoleFK === CLINICAL_ROLE.DOCTOR) &&
            c.isActive &&
            c.userProfile.isActive,
        )
        setRadiographers(result)
      }
    })
  }, [])

  useEffect(() => {
    setAssignedRadiographers(value)
  }, [value])

  useEffect(() => {
    let tmpAssignableRadiographers = radiographers
      .filter(
        r => assignedRadiographers.findIndex(ar => ar.id === r.id) === -1, //filter out assigned radiographers in selection
      )
      .map(r => ({
        label: r.name,
        value: r.id,
        sortorder:
          r.userProfile.role.clinicRoleFK === CLINICAL_ROLE.RADIOGRAPHER
            ? 0
            : 1,
      }))
    tmpAssignableRadiographers = _.orderBy(
      tmpAssignableRadiographers,
      ['sortorder', o => (o.label || '').toLowerCase()],
      ['asc', 'asc'],
    )
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
                  ? {
                      cursor: 'no-drop',
                      padding: '4px 6px',
                      marginBottom: 3,
                      fontSize: 14,
                    }
                  : { padding: '4px 6px', marginBottom: 3, fontSize: 14 }
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
              <span style={{ position: 'relative', top: 3 }}>
                {assignedRadiographer.name}
              </span>
            </Tooltip>
          )
        }
      })}

      {inputVisible && (
        <Select
          showSearch
          ref={inputRef}
          className={classes.tagSelect}
          style={{ width: 250 }}
          size={'middle'}
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
        <Tag
          className='site-tag-plus'
          onClick={showInput}
          style={{ padding: '4px 6px', fontSize: 14 }}
        >
          <PlusOutlined /> New Technologist
        </Tag>
      )}
    </div>
  )
}

export default withStyles(styles, { name: 'RadiographerTag' })(RadiographerTag)
