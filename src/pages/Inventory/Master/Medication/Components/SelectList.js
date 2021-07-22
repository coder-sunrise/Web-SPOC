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
    initialValue,
    ...restPros
  } = props
  const [currentSelected, setCurrentSelected] = useState(null)
  const [listItems, setListItems] = useState([])

  useEffect(() => {
    if (initialValue) setListItems(initialValue)
  }, [initialValue])

  const addItemToList = () => {
    const newListItems = [...listItems]

    if (!currentSelected) return

    const isDuplicate =
      listItems.findIndex(item => item === currentSelected.id) >= 0

    if (isDuplicate) {
      notification.error({
        message: `Selected ${label.toLowerCase()} is already in the list.`,
      })
      return
    }

    newListItems.push(currentSelected.id)

    setListItems(newListItems)
    if (onChange) onChange(newListItems)
  }

  return (
    <div>
      <SectionHeader style={{ marginBottom: 0 }}>{header}</SectionHeader>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
        <MultiLangCodeSelect
          code={codeset}
          language={isMultiLanguage ? language : ''}
          max={10}
          valueField='id'
          onChange={(value, opt) => {
            if (value && opt) setCurrentSelected(opt)
          }}
        />

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

      <MultiLangCodeList data={listItems} {...props} />

      <span
        style={{ fontStyle: 'italic', fontSize: '0.8rem', fontWeight: 400 }}
      >
        {note}
      </span>
    </div>
  )
}

export default SelectList
