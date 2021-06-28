import React, { useState, useEffect, useRef, MutableRefObject } from 'react'
import { useSelector, useDispatch } from 'dva'
import * as service from '../../services/tag'
import moment from 'moment'
import { Tag, Input, Tooltip, Select, Divider } from 'antd'
import { SaveFilled, PlusOutlined } from '@ant-design/icons'

export interface TagPanelProps {
  tagCategory: 'service' | 'patient'
  onChange: (value: string[], tags: object[]) => void
}

const TagPanel: React.FC<TagPanelProps> = props => {
  const [inputVisible, setInputVisible] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const inputRef = useRef<Input>(null)
  const [tags, setTags] = useState([])
  const [tagsUnderCategory, setTagsUnderCategory] = useState([])
  const [availableTags, setAvailableTags] = useState([])
  const [newTagInput, setNewTagInput] = useState([])
  const dispatch = useDispatch()

  function fetchTags() {
    dispatch({
      type: 'codetable/fetchCodes',

      payload: { code: 'cttag', force: true },
    }).then(result => {
      if (result) {
        setTagsUnderCategory(
          result.filter(t => t.category === props.tagCategory),
        )

        setAvailableTags(
          result
            .filter(t => t.category === props.tagCategory)
            .filter(t => tags.findIndex(v => v === t.displayValue) === -1)
            .map(t => {
              return { value: t.displayValue }
            }),
        )
      }
    })
  }

  useEffect(() => {
    fetchTags()
  }, [props.tagCategory])

  useEffect(() => {
    setAvailableTags(
      tagsUnderCategory
        .filter(t => tags.findIndex(v => v === t.displayValue) === -1)
        .map(t => {
          return { value: t.displayValue }
        }),
    )
  }, [tags])

  useEffect(() => {
    inputRef.current?.focus()
  }, [inputVisible])

  const handleClose = (removedTag: string) => {
    const newTags = tags.filter(tag => tag !== removedTag)
    setTags(newTags)
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

    props.onChange(
      newTags,
      tagsUnderCategory.filter(t => newTags.includes(t.displayValue)),
    )
  }

  const handleInputCancel = e => {
    console.log('drop down opened', dropdownOpen)
    if (!dropdownOpen) {
      setInputVisible(false)
    }
  }

  const addNewTag = async () => {
    await service.default.upsert({
      description: newTagInput,
      displayValue: newTagInput,
      category: 'service',
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
          const isLongTag = tag.length > 20

          const tagElem = (
            <Tag
              key={tag}
              style={{ margin: '3px' }}
              closable={true}
              onClose={() => handleClose(tag)}
            >
              <span>{isLongTag ? `${tag.slice(0, 20)}...` : tag}</span>
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
              {tagsUnderCategory.findIndex(t =>
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
                      onClick={addNewTag}
                    >
                      Save As New Tag <SaveFilled />
                    </a>
                  </div>
                </>
              )}
            </div>
          )}
        >
          {availableTags.map(item => (
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
