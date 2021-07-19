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
  return (
    <td {...restProps}>
      <div>{children}</div>
    </td>
  )
}

const DosageRuleTable = ({
  initialData,
  rule,
  medicationUsageFK,
  dispenseUomFK,
  prescribeUomFK,
  onChange,
}) => {
  const [form] = Form.useForm()
  const [data, setData] = useState([])
  const [rangeValidation, setRangeValidation] = useState('')
  const [editingKey, setEditingKey] = useState('')
  const codetable = useSelector(s => s.codetable)

  useEffect(() => {
    if (initialData)
      setData(initialData.map((item, index) => ({ ...item, key: index + 1 })))
    console.log('initialData', initialData)
  }, [initialData])

  const isEditing = record => record.key === editingKey
  const dispatch = useDispatch()

  const getDisplayValue = (code, id) => {
    if (id) {
      console.log('code', code)
      const item = codetable[code]?.filter(c => c.id === id)[0]
      if (item) {
        return 'displayValue' in item ? item.displayValue : item.name
      }
    }
    return ''
  }

  useEffect(() => {
    dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'ctmedicationdosage',
      },
    })

    dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'ctmedicationfrequency',
      },
    })

    dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'ctmedicationusage',
      },
    })
    dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'ctmedicationunitofmeasurement',
      },
    })
  }, [])

  useEffect(() => {
    console.log('rule', rule)
  }, [rule])

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

  const validateRange = fieldValues => {
    const fields = fieldValues(true)

    const regex = /^(([0-9]+)|(0.5))+$/
    const from = fields?.rangeStart
    if (!regex.test(form)) {
      setRangeValidation('Invalid age range.')
      return
    }

    setRangeValidation('')
  }

  const save = async key => {
    try {
      validateRange(form.getFieldsValue)
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

      if (onChange) onChange(newData)
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo)
    }
  }

  const deleteData = async key => {
    const newData = data.filter(d => d.key !== key)
    setData(newData)

    if (onChange) onChange(newData)
  }

  const ruleLabel = {
    age: 'By Age (Years)',
    weight: 'By Weight (KG)',
    default: 'Default',
  }
  const columns = [
    {
      title: ruleLabel[rule ?? 'default'],
      dataIndex: 'range',
      align: 'center',
      width: '18%',
      editable: true,
      render: (item = {}, record) => {
        const editing = isEditing(record)

        if (rule === 'default') return <></>

        return (
          <>
            {editing ? (
              <GridContainer gutter={4}>
                <GridItem md={3}>
                  <Form.Item
                    name={['rangeStart']}
                    style={{
                      margin: 0,
                    }}
                  >
                    <InputNumber
                      style={{ width: 60, marginRight: 3 }}
                      min={0}
                      max={999}
                      placeholder='From'
                    ></InputNumber>
                  </Form.Item>
                </GridItem>
                <GridItem md={6}>
                  <Form.Item
                    name={['operator']}
                    style={{
                      margin: 0,
                    }}
                  >
                    <Select style={{ width: 110 }}>
                      <Option value='less than'>less than</Option>
                      <Option value='to'>to</Option>
                      <Option value='more than'>more than</Option>
                    </Select>
                  </Form.Item>
                </GridItem>
                <GridItem md={3}>
                  <Form.Item
                    name={['rangeEnd']}
                    style={{
                      margin: 0,
                    }}
                  >
                    <InputNumber
                      style={{ width: 60, marginRight: 3 }}
                      min={0}
                      max={999}
                      placeholder='To'
                    ></InputNumber>
                  </Form.Item>
                </GridItem>
                {rangeValidation.length > 0 && (
                  <GridItem md={12}>
                    <Typography.Text type='danger'>
                      {rangeValidation}
                    </Typography.Text>
                  </GridItem>
                )}
              </GridContainer>
            ) : (
              <span>{`${record.rangeStart} ${record.operator} ${record.rangeEnd}`}</span>
            )}
          </>
        )
      },
    },
    {
      title: 'Usage',
      dataIndex: 'usage',
      align: 'center',
      editable: true,
      width: 180,
      render: () => {
        return (
          <span>{getDisplayValue('ctmedicationusage', medicationUsageFK)}</span>
        )
      },
    },
    {
      title: 'Dosage',
      dataIndex: 'prescribingDosageFK',
      align: 'center',
      editable: true,
      width: 120,
      render: (item = {}, record) => {
        const editing = isEditing(record)
        return (
          <>
            {editing ? (
              <Form.Item
                name={['prescribingDosageFK']}
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
            ) : (
              <span>
                {getDisplayValue(
                  'ctmedicationdosage',
                  record.prescribingDosageFK,
                )}
              </span>
            )}
          </>
        )
      },
    },
    {
      title: 'Prescribe UOM',
      dataIndex: 'prescribeUom',
      align: 'center',
      editable: true,
      width: 180,
      render: () => {
        return (
          <span>
            {getDisplayValue('ctmedicationunitofmeasurement', prescribeUomFK)}
          </span>
        )
      },
    },
    {
      title: 'Frequency',
      dataIndex: 'medicationFrequencyFK',
      align: 'center',
      editable: true,
      width: 200,
      render: (item = {}, record) => {
        const editing = isEditing(record)
        return (
          <>
            {editing ? (
              <Form.Item
                name={['medicationFrequencyFK']}
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
            ) : (
              <span>
                {getDisplayValue(
                  'ctmedicationfrequency',
                  record.medicationFrequencyFK,
                )}
              </span>
            )}
          </>
        )
      },
    },
    {
      title: 'Duration(days)',
      dataIndex: 'duration',
      align: 'center',
      editable: true,
      align: 'center',
      width: 120,
      render: (item = {}, record) => {
        const editing = isEditing(record)
        return (
          <div style={{ display: 'flex' }}>
            {editing ? (
              <Form.Item
                name={['duration']}
                style={{
                  margin: 0,
                }}
              >
                <InputNumber
                  style={{ width: 60, marginRight: 3 }}
                  min={0}
                  max={999}
                ></InputNumber>
              </Form.Item>
            ) : (
              <span>{record.duration}</span>
            )}
            <span
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {record.duration == 1 ? 'day' : 'days'}{' '}
            </span>
          </div>
        )
      },
    },
    {
      title: 'Dispense Qty',
      dataIndex: 'dispensingQuantity',
      align: 'center',
      width: 120,
      render: (item = {}, record) => {
        const editing = isEditing(record)
        return (
          <>
            {editing ? (
              <Form.Item
                name={['dispensingQuantity']}
                style={{
                  margin: 0,
                }}
              >
                <InputNumber
                  style={{ width: 60, marginRight: 3 }}
                  min={0}
                  max={999}
                ></InputNumber>
              </Form.Item>
            ) : (
              <span>{record.dispensingQuantity}</span>
            )}
          </>
        )
      },
    },
    {
      title: 'Dispense UOM',
      dataIndex: 'dispenseUom',
      align: 'center',
      editable: true,
      width: 180,
      render: () => {
        return (
          <span>
            {getDisplayValue('ctmedicationunitofmeasurement', dispenseUomFK)}
          </span>
        )
      },
    },
    {
      title: 'Action',
      dataIndex: 'operation',
      align: 'center',
      render: (_, record) => {
        const editable = isEditing(record)
        return editable ? (
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <Typography.Link onClick={() => save(record.key)}>
              Save
            </Typography.Link>
            <Typography.Link>
              <Popconfirm
                title='Sure to cancel?'
                onConfirm={() => cancel(record.key)}
              >
                <a>Cancel</a>
              </Popconfirm>
            </Typography.Link>
          </div>
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
              onClick={() => deleteData(record.key)}
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
      {(rule !== 'default' || data.length === 0) && (
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
      )}
    </Form>
  )
}

export default DosageRuleTable
