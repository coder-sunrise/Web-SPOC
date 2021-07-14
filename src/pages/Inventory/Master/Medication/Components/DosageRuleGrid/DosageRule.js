import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'dva'
import _ from 'lodash'
import ReactDOM from 'react-dom'
import './DosageRule.less'
import {
  Table,
  Input,
  InputNumber,
  Button,
  Popconfirm,
  Form,
  Typography,
  Select,
} from 'antd'
import { GridContainer, GridItem, CodeSelect } from '@/components'

const EditableRow = ({ index, ...props }) => {
  return <tr {...props} style={{ verticalAlign: 'top' }} />
}

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  console.log('record', record)
  console.log('dataIndex', dataIndex)
  if (!record)
    return (
      <td {...restProps}>
        <div>{children}</div>
      </td>
    )

  if (dataIndex === 'operation' || dataIndex === 'range')
    return (
      <td {...restProps}>
        <div>{children}</div>
      </td>
    )

  return editing ? (
    <td {...restProps}>
      <div>{children}</div>
    </td>
  ) : (
    <td {...restProps}>
      <div>{record[dataIndex]}</div>
    </td>
  )
}

const EditableTable = ({ initialData = [] }) => {
  const [form] = Form.useForm()
  const [data, setData] = useState(initialData)
  const [editingKey, setEditingKey] = useState('')
  const codetable = useSelector(s => s.codetable)
  console.log('codetable', codetable)
  console.log('codetable.ctmedicationdosage', codetable.ctmedicationdosage)
  const isEditing = record => record.key === editingKey
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'ctmedicationdosage',
        force: true,
      },
    })

    dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'ctmedicationfrequency',
        force: true,
      },
    })
  }, [])

  const edit = record => {
    form.setFieldsValue({
      ...record,
    })
    setEditingKey(record.key)
  }

  const cancel = key => {
    console.log('key', key)
    if (key === -1) setData(data.filter(r => r.key !== key))
    setEditingKey('')
  }

  const save = async key => {
    try {
      const row = await form.validateFields()

      const newData = [...data]
      const index = newData.findIndex(item => key === item.key)

      const item = newData[index]
      if (item.key === -1) {
        item.key = data.length
      }
      newData.splice(index, 1, { ...item, ...row })
      setData(newData)
      setEditingKey('')
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo)
    }
  }

  const columns = [
    {
      title: 'By Weight (KG)',
      dataIndex: 'range',
      align: 'center',
      width: '18%',
      editable: true,
      render: (item = {}, record) => {
        const editInProgess = isEditing(record)
        return (
          <>
            {editInProgess ? (
              <GridContainer gutter={4}>
                <GridItem md={3}>
                  <Form.Item
                    name={['range', 'from']}
                    style={{
                      margin: 0,
                    }}
                  >
                    <Input placeholder='From' />
                  </Form.Item>
                </GridItem>
                <GridItem md={6}>
                  <Form.Item
                    name={['range', 'operator']}
                    style={{
                      margin: 0,
                    }}
                  >
                    <Select style={{ width: 100 }}>
                      <Option value='less than'>less than</Option>
                      <Option value='to'>to</Option>
                      <Option value='more than'>more than</Option>
                    </Select>
                  </Form.Item>
                </GridItem>
                <GridItem md={3}>
                  <Form.Item
                    name={['range', 'to']}
                    style={{
                      margin: 0,
                    }}
                  >
                    <Input placeholder='To' />
                  </Form.Item>
                </GridItem>
              </GridContainer>
            ) : (
              <span>
                {record.From}
                {' less than '}
                {record.to}
              </span>
            )}
          </>
        )
      },
    },
    {
      title: 'Consumption Method',
      dataIndex: 'consumptionMethod',
      align: 'center',
      editable: true,
      width: 180,
      render: (item = {}, record) => {
        return <span>Take</span>
      },
    },
    {
      title: 'Dosage',
      dataIndex: 'dosage',
      align: 'center',
      editable: true,
      width: 150,
      render: (item = {}, record) => {
        return (
          <>
            <Form.Item
              name={['dosage']}
              style={{
                margin: 0,
              }}
              rules={[
                {
                  required: true,
                  message: `*Required.`,
                },
              ]}
            >
              <Select
                options={codetable.ctmedicationdosage?.map(item => {
                  return { label: item.displayValue, value: item.id }
                })}
                maxLength={10}
                placeholder='Dosage'
              />
            </Form.Item>
          </>
        )
      },
    },
    {
      title: 'Frequency',
      dataIndex: 'frequency',
      align: 'center',
      editable: true,
      width: 150,
      render: (item = {}, record) => {
        return (
          <Form.Item
            name={['frequency']}
            style={{
              margin: 0,
            }}
          >
            <Select
              options={codetable.ctmedicationfrequency?.map(item => {
                return { label: item.displayValue, value: item.id }
              })}
              maxLength={10}
              placeholder='Frequency'
            />
          </Form.Item>
        )
      },
    },
    {
      title: 'Duration(days)',
      dataIndex: 'duration',
      align: 'center',
      editable: true,
      width: 100,
      render: (item = {}, record) => {
        return <Input type='number'></Input>
      },
    },
    {
      title: 'Dispense Qty',
      dataIndex: 'dosage',
      align: 'center',
    },
    {
      title: 'Dispense UOM',
      dataIndex: 'dosage',
      align: 'center',
    },
    {
      title: 'Action',
      dataIndex: 'operation',
      align: 'center',
      render: (_, record) => {
        const editable = isEditing(record)
        return editable ? (
          <span>
            <a
              href='javascript:;'
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </a>
            <Popconfirm
              title='Sure to cancel?'
              onConfirm={() => cancel(record.key)}
            >
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <Typography.Link
              disabled={editingKey !== ''}
              onClick={() => edit(record)}
            >
              Edit
            </Typography.Link>
            <Typography.Link
              disabled={editingKey !== ''}
              onClick={() => edit(record)}
            >
              Delete
            </Typography.Link>
          </div>
        )
      },
    },
  ]
  const mergedColumns = columns.map(col => {
    if (!col.editable) {
      return col
    }

    return {
      ...col,
      onCell: record => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    }
  })
  return (
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            row: EditableRow,
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName='editable-row'
        pagination={false}
      />
      <Button
        disabled={editingKey !== ''}
        onClick={() => {
          const newRecord = { key: -1 }
          setData([...data, newRecord])
          edit(newRecord)
        }}
        type='link'
        style={{
          marginBottom: 16,
        }}
      >
        + NEW
      </Button>
    </Form>
  )
}

export default EditableTable
