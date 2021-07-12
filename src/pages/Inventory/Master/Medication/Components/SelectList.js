import React, { useEffect, useState } from 'react'
import { List } from 'antd'
import Select from '@/components/Antd/AntdSelect'
import { useDispatch } from 'dva'
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

const SelectList = ({
  language,
  label,
  codeset,
  header,
  note = '',
  isMultiLanguage,
}) => {
  const dispatch = useDispatch()
  const [formattedCodes, setFormattedCodes] = useState([])
  const [currentSelected, setCurrentSelected] = useState(null)
  const [codeList, setCodeLlist] = useState([])

  const addItemToList = () => {
    if (!currentSelected) return

    const isDuplicate =
      codeList.findIndex(item => item.id === currentSelected.id) >= 0

    if (isDuplicate) {
      notification.error({
        message: `Selected ${label.toLowerCase()} is already in the list.`,
      })
      return
    }

    if (currentSelected) {
      setCodeLlist([...codeList, currentSelected])
    }
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

      <List
        bordered
        split={false}
        locale={{
          emptyText: <span></span>,
        }}
        style={{ height: 200, overflow: 'auto' }}
        dataSource={codeList}
        renderItem={(item, i) => (
          <div style={{ padding: 10, display: 'flex' }}>
            <span style={{ marginRight: 15, fontWeight: 200 }}>
              {label} {i + 1}
            </span>
            <span style={{ flexGrow: 1 }}>
              {item['displayValue' + language]}
            </span>
            <span>
              <Tooltip title={`Remove ${label.toLowerCase()}`}>
                <Button
                  className='noPadding'
                  color='danger'
                  size='sm'
                  id={item.id}
                  justIcon
                  rounded
                  onClick={() => {}}
                >
                  <Delete />
                </Button>
              </Tooltip>
            </span>
          </div>
        )}
      ></List>
      <span
        style={{ fontStyle: 'italic', fontSize: '0.8rem', fontWeight: 400 }}
      >
        {note}
      </span>
    </div>
  )
}

export default SelectList
