import React, { useContext, useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import { Table, Input, Button, Popconfirm, Form } from 'antd'
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
  ...restProps
}) => {
  const [editing, setEditing] = useState(false)
  const inputRef = useRef(null)
  const form = useContext(EditableContext)
  useEffect(() => {
    if (editing) {
      inputRef.current.focus()
    }
  }, [editing])

  const toggleEdit = () => {
    setEditing(!editing)
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    })
  }

  const save = async () => {
    try {
      const values = await form.validateFields()
      toggleEdit()
      handleSave({ ...record, ...values })
    } catch (errInfo) {
      console.log('Save failed:', errInfo)
    }
  }

  let childNode = children

  if (editable) {
    childNode = (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    )
  }

  return <td {...restProps}>{childNode}</td>
}

export const EditableTable = props => {
  const [dataSource, setDataSource] = useState([])

  useEffect(
    () =>
      setDataSource([
        {
          key: '0',
          testPanelItem: 'CRE',
          result: 'hello',
          rawResult: '32',
          unit: 'mmHg',
          referenceRange: '1-10',
        },
        {
          key: '1',
          testPanelItem: 'BUN',
          result: 'hello',
          rawResult: '32',
          unit: 'mmHg',
          referenceRange: '50-80',
        },
      ]),
    [],
  )

  const columns = [
    {
      title: 'Test Panel Item',
      dataIndex: 'testPanelItem',
      width: 150,
    },
    {
      title: 'Result',
      dataIndex: 'result',
      width: 120,
      editable: true,
    },
    {
      title: 'Raw Data',
      dataIndex: 'rawResult',
      width: 120,
      editable: true,
    },
    {
      title: 'Unit',
      dataIndex: 'unit',
      width: 100,
    },
    {
      title: 'Reference Range',
      dataIndex: 'referenceRange',
      width: 200,
    },
  ]

  const handleSave = row => {
    const newData = [...dataSource]
    const index = newData.findIndex(item => row.key === item.key)
    const item = newData[index]
    newData.splice(index, 1, { ...item, ...row })
    setDataSource(newData)
  }

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  }
  const tableColumns = columns.map(col => {
    if (!col.editable) {
      return col
    }

    return {
      ...col,
      onCell: record => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: handleSave,
      }),
    }
  })
  return (
    <div>
      <Table
        components={components}
        bordered
        dataSource={dataSource}
        columns={tableColumns}
        pagination={false}
        size='small'
      />
    </div>
  )
}
