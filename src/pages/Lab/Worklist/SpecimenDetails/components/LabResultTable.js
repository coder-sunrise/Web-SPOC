import React, { useContext, useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import {
  Table,
  Input,
  Button,
  Popconfirm,
  Form,
  InputNumber,
  Select,
} from 'antd'
import { useCodeTable } from '@/utils/hooks'
const EditableContext = React.createContext(null)

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm()

  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  )
}

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  render,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false)
  const form = useContext(EditableContext)

  const fieldName =
    typeof dataIndex === 'function' ? dataIndex(record) : dataIndex

  if (typeof dataIndex === 'function')
    console.log('Editable Cell: fieldName', fieldName)

  useEffect(() => {
    if (record) {
      form.setFieldsValue({
        [fieldName]: record[fieldName],
      })
    }
  }, [record])

  const save = async () => {
    try {
      const values = await form.validateFields()
      handleSave({ ...record, ...values })
    } catch (errInfo) {
      console.log('Save failed:', errInfo)
    }
  }

  let childNode = (
    <Form.Item
      noStyle
      style={{
        margin: 0,
      }}
      name={fieldName}
    >
      {render ? render(record, record[fieldName], save) : children}
    </Form.Item>
  )

  return <td {...restProps}>{childNode}</td>
}

export const EditableTable = ({
  value,
  onChange,
  showRawData = false,
  isReadonly = false,
}) => {
  const cttestpanelitem = useCodeTable('cttestpanelitem')
  const ctresultoption = useCodeTable('cttestpanelitemresultoption')
  const allColumns = [
    {
      title: 'Test Panel Item',
      dataIndex: 'testPanelItemFK',
      width: 150,
      render: record => {
        const testPanelItem = cttestpanelitem.find(
          x => x.id === record.testPanelItemFK,
        )
        return <span>{testPanelItem?.displayValue}</span>
      },
    },
    {
      title: 'Result',
      dataIndex: 'finalResult',
      width: 150,
      editable: true,
      render: (record, text, onSave) => {
        const testpanelItem = cttestpanelitem.find(
          item => item.id === record?.testPanelItemFK,
        )

        if (testpanelItem?.resultTypeFK === 1) {
          return !isReadonly ? (
            <InputNumber
              defaultValue={text}
              controls={false}
              onPressEnter={onSave}
              onBlur={onSave}
            />
          ) : (
            text
          )
        } else if (testpanelItem?.resultTypeFK === 2) {
          const options = ctresultoption
            .filter(x => x.testPanelItemFK === testpanelItem.id)
            .map(x => ({ label: x.resultOption, value: x.resultOption }))

          return (
            <Select defaultValue={text} options={options} onChange={onSave} />
          )
        }
      },
    },
    {
      title: 'Raw Data',
      dataIndex: 'resultBeforeInterpretation',
      width: 150,
    },
    {
      title: 'Unit',
      dataIndex: 'unit',
      width: 100,
    },
    {
      title: 'Reference Range',
      dataIndex: 'referenceRange',
    },
  ]

  const displayColumns = showRawData
    ? allColumns
    : allColumns.filter(x => x.dataIndex !== 'resultBeforeInterpretation')

  const handleSave = row => {
    const newData = [...value]
    const index = newData.findIndex(item => row.id === item.id)
    const item = newData[index]
    newData.splice(index, 1, { ...item, ...row })
    onChange(newData)
  }

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  }
  const tableColumns = displayColumns.map(col => {
    return {
      ...col,
      onCell: record => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        width: col.width,
        handleSave: handleSave,
        ...col,
      }),
    }
  })
  return (
    <div>
      <Table
        components={components}
        bordered
        dataSource={value}
        columns={tableColumns}
        pagination={false}
        size='small'
      />
    </div>
  )
}

EditableTable.propTypes = {
  value: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onChange: PropTypes.func,
  showRawData: PropTypes.bool,
  isReadonly: PropTypes.bool,
}
