import React, { useState, useEffect, useRef, MutableRefObject } from 'react'
import { Tag, Input, Tooltip, Select, Divider } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

export interface TagPanelProps {
  tagCategory: 'service' | 'patient'
}

const TagPanel: React.FC<TagPanelProps> = props => {
  const [tags, setTags] = useState(['tag 1', 'tag 2'])
  const [inputVisible, setInputVisible] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const inputRef = useRef<Input>(null)

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
  }

  const handleInputCancel = e => {
    console.log('drop down opened', dropdownOpen)
    if (!dropdownOpen) {
      setInputVisible(false)
    }
  }

  return (
    <div>
      <label>Tags: </label>

      {tags.map((tag, index) => {
        {
          const isLongTag = tag.length > 20

          const tagElem = (
            <Tag key={tag} closable={true} onClose={() => handleClose(tag)}>
              <span>{isLongTag ? `${tag.slice(0, 20)}...` : tag}</span>
            </Tag>
          )
          return isLongTag ? (
            <Tooltip title={tag} key={tag}>
              {tagElem}
            </Tooltip>
          ) : (
            tagElem
          )
        }
      })}

      {inputVisible && (
        <Select
          showSearch
          ref={inputRef}
          style={{ width: 200 }}
          size={'small'}
          options={[{ value: 'Tag 1' }, { value: 'Tag 2' }]}
          onChange={handleInputConfirm}
          onBlur={e => handleInputCancel(e)}
          onDropdownVisibleChange={open => {
            setDropdownOpen(open)
          }}
          dropdownRender={menu => (
            <div>
              {menu}
              <Divider style={{ margin: '4px 0' }} />
              <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                <Input
                  style={{ margin: '4px', flex: 'auto', height: '20px' }}
                />
                <a
                  style={{
                    flex: 'none',
                    padding: '4px',
                    display: 'block',
                    cursor: 'pointer',
                  }}
                  // onClick={this.addItem}
                >
                  <PlusOutlined /> Add Tag
                </a>
              </div>
            </div>
          )}
        />
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
