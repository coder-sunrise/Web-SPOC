import React, { useEffect, useState } from 'react'
import Select from '@/components/Antd/AntdSelect'
import { formatMessage } from 'umi'
import { PlusOutlined } from '@ant-design/icons'
import Delete from '@material-ui/icons/Delete'
import {
  GridContainer,
  GridItem,
  Transfer,
  CodeSelect,
  NumberInput,
  Tooltip,
  TextField,
  Button,
  notification,
} from '@/components'
import SectionHeader from './SectionHeader'
import MultiLangCodeSelect from './MultiLangCodeSelect'
import MultiLangCodeList from './MultiLangCodeList'

const SelectList = props => {
  const {
    language,
    label,
    codeset,
    header,
    note = '',
    isMultiLanguage,
    onChange,
    isShowFreeText = false,
    labelField = 'displayValue',
    initialValue,
    ...restPros
  } = props
  const [currentSelected, setCurrentSelected] = useState(null)
  const [freeText, setFreeText] = useState(null)
  const [listItems, setListItems] = useState([])

  useEffect(() => {
    if (initialValue) setListItems(initialValue)
  }, [initialValue])

  const addItemToList = () => {
    const newListItems = [...listItems]

    if (!currentSelected) return

    const isDuplicate =
      listItems.findIndex(item => item.id === currentSelected.id) >= 0

    if (isDuplicate) {
      notification.error({
        message: `Selected ${label.toLowerCase()} is already in the list.`,
      })
      return
    }

    newListItems.push({ id: currentSelected.id, freeText: freeText })

    setListItems(newListItems)
    setCurrentSelected(null)
    if (onChange) onChange(newListItems)
  }
  return (
    <div style={{ position: 'relative', top: isShowFreeText ? -9 : 0 }}>
      <SectionHeader
        style={{
          marginBottom: 0,
          position: 'relative',
          top: isShowFreeText ? 10 : 0,
        }}
      >
        {header}
      </SectionHeader>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: isShowFreeText ? 3 : 10,
        }}
      >
        <MultiLangCodeSelect
          code={codeset}
          language={isMultiLanguage ? language : ''}
          localFilter={item => {
            return listItems.findIndex(i => i.id === item.id) === -1
          }}
          max={10}
          value={currentSelected ? currentSelected.id : null}
          valueField='id'
          isMultiLanguage={isMultiLanguage}
          labelField={labelField}
          onChange={(value, opt) => {
            if (value && opt) setCurrentSelected(opt)
          }}
        />
        {isShowFreeText && (
          <TextField
            label='Concentration'
            maxLength={50}
            style={{
              position: 'relative',
              width: 150,
              top: -8,
              marginLeft: 10,
            }}
            onChange={e => {
              setFreeText(e.target.value)
            }}
            inputProps={{ maxLength: 50 }}
          ></TextField>
        )}

        <Button
          style={{ marginLeft: 15 }}
          className='noPadding'
          color='primary'
          size='sm'
          justIcon
          rounded
          onClick={addItemToList}
        >
          <PlusOutlined />
        </Button>
      </div>

      <MultiLangCodeList isShowFreeText data={listItems} {...props} />

      <span
        style={{ fontStyle: 'italic', fontSize: '0.8rem', fontWeight: 400 }}
      >
        {note}
      </span>
    </div>
  )
}

export default SelectList
