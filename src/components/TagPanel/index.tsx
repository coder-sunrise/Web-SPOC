import React, { useState, useEffect, useRef, MutableRefObject } from 'react'
import { useSelector, useDispatch } from 'dva'
import moment from 'moment'
import { Tag, Input, Tooltip, Select, Divider } from 'antd'
import { SaveFilled, PlusOutlined } from '@ant-design/icons'
import * as service from '../../services/tag'

export interface TagPanelProps {
  tagCategory: 'Service' | 'Patient'
  onChange: (value: string[], tags: object[]) => void
  defaultTags: string[]
}

const TagPanel: React.FC<TagPanelProps> = ({
  tagCategory,
  onChange,
  defaultTags = [],
}) => {
  const [inputVisible, setInputVisible] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const inputRef = useRef<Input>(null)
  const [tags, setTags] = useState([])
  const [currentCategoryTags, setTagsUnderCategory] = useState([])
  const [validTags, setValidTags] = useState([])
  const [newTagInput, setNewTagInput] = useState([])
  const dispatch = useDispatch()

  function fetchTags() {
    dispatch({
      type: 'codetable/fetchCodes',

      payload: { code: 'cttag', force: true },
    }).then(result => {
      if (result) {
        setTagsUnderCategory(result.filter(t => t.category === tagCategory))
      }
    })
  }

  useEffect(() => {
    fetchTags()
  }, [tagCategory])

  useEffect(() => {
    setTags(defaultTags)
  }, [defaultTags])

  useEffect(() => {
    setValidTags(
      currentCategoryTags
        .filter(t => tags.findIndex(v => v === t.displayValue) === -1)
        .map(t => {
          return { value: t.displayValue }
        }),
    )
  }, [tags, currentCategoryTags])

  useEffect(() => {
    inputRef.current?.focus()
  }, [inputVisible])

  const handleRemoveTag = (removedTag: string) => {
    const newTags = tags.filter(tag => tag !== removedTag)
    setTags(newTags)
    onChange(
      newTags,
      currentCategoryTags.filter(t => newTags.includes(t.displayValue)),
    )
  }

  const showInput = () => {
    setInputVisible(true)
  }

  const handleInputConfirm = val => {
    let newTags: string[] = []
    if (val && tags.indexOf(val) === -1) {
      newTags = [...tags, val]
    }
    setTags(newTags)
    setInputVisible(false)

    onChange(
      newTags,
      currentCategoryTags.filter(t => newTags.includes(t.displayValue)),
    )
  }

  const handleInputCancel = e => {
    if (!dropdownOpen) {
      setInputVisible(false)
    }
  }

  const saveAsNewTag = async () => {
    await service.default.upsert({
      description: newTagInput,
      displayValue: newTagInput,
      category: tagCategory,
      isUserMaintainable: true,
      effectiveStartDate: moment().formatUTC(),
      effectiveEndDate: moment('2099-12-31T23:59:59').formatUTC(false),
    })
    fetchTags()
  }

  return (
    <div>
      <label>Tags: </label>

      {tags.map((tag, index) => {
        {
          const tagElem = (
            <Tag
              key={tag}
              style={{ margin: '3px' }}
              closable={true}
              onClose={() => handleRemoveTag(tag)}
            >
              <span>{tag}</span>
            </Tag>
          )
          return (
            <Tooltip title={tag} key={tag}>
              {tagElem}
            </Tooltip>
          )
        }
      })}

      {inputVisible && (
        <Select
          showSearch
          ref={inputRef}
          style={{ width: 150 }}
          size={'small'}
          onChange={handleInputConfirm}
          onSearch={v => setNewTagInput(v)}
          onBlur={e => handleInputCancel(e)}
          onDropdownVisibleChange={open => {
            setDropdownOpen(open)
          }}
          dropdownRender={menu => (
            <div>
              {menu}
              {currentCategoryTags.findIndex(t =>
                t.displayValue.includes(newTagInput),
              ) === -1 && (
                <>
                  <Divider style={{ margin: '4px 0' }} />
                  <div
                    style={{ display: 'flex', flexWrap: 'nowrap', padding: 4 }}
                  >
                    <a
                      style={{
                        flex: 'none',
                        padding: '4px',
                        display: 'block',
                        cursor: 'pointer',
                      }}
                      onClick={saveAsNewTag}
                    >
                      Save As New Tag <SaveFilled />
                    </a>
                  </div>
                </>
              )}
            </div>
          )}
        >
          {validTags.map(item => (
            <Option key={item.value}>{item.value}</Option>
          ))}
        </Select>
      )}
      {!inputVisible && (
        <Tag className='site-tag-plus' onClick={showInput}>
          <PlusOutlined /> New Tag
        </Tag>
      )}
    </div>
  )
}

export default TagPanel
