import React, { useContext, useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import { Table, Input, Button, Popconfirm, Form, InputNumber } from 'antd'
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
  console.log('Editable Cell: render', render)

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

export const EditableTable = ({ value, onChange }) => {
  const cttestpanelitem = useCodeTable('cttestpanelitem')
  console.log('Editable Table: Value', value)
  const columns = [
    {
      title: 'Test Panel Item',
      dataIndex: 'testPanelItemFK',
      width: 150,
      render: (record, onSave) => {
        return <span>{record.testPanelItemFK}</span>
      },
    },
    {
      title: 'Result',
      dataIndex: record => {
        const testpanelItem = cttestpanelitem.find(
          item => item.id === record.testPanelItemFK,
        )
        console.log('Editable Cell: cttestpanelitem', cttestpanelitem)
        console.log('Editable Cell: testpanelItem', testpanelItem)

        return testpanelItem?.resultTypeFK === 1
          ? 'numericResult'
          : 'stringResult'
      },
      width: 80,
      editable: true,
      render: (record, text, onSave) => (
        <InputNumber
          defaultValue={text}
          controls={false}
          onPressEnter={onSave}
          onBlur={onSave}
        />
      ),
    },
    {
      title: 'Raw Data',
      dataIndex: 'rawResult',
      width: 120,
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
  const tableColumns = columns.map(col => {
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
}
