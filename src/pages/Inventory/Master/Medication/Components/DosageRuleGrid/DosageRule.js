import React, { useState, useEffect, useContext } from 'react'
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
import { GridContainer, GridItem, CodeSelect, Popover } from '@/components'
import DetailsContext from '../../Details/DetailsContext'

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

const validOperators = {
  to: 'to',
  lessThan: 'less than',
  moreThan: 'more than',
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
  const [selectedOperator, setSelectedOperator] = useState('')
  const [rangeValidation, setRangeValidation] = useState({
    message: '',
  })
  const [editingKey, setEditingKey] = useState('')
  const codetable = useSelector(s => s.codetable)
  const maxInput = 999

  const { isEditingDosageRule, setIsEditingDosageRule } = useContext(
    DetailsContext,
  )

  useEffect(() => {
    setIsEditingDosageRule(editingKey !== '')
    if (data.length === 0) form.resetFields()
  }, [editingKey])

  useEffect(() => {
    if (initialData) {
      setEditingKey('')
      setData(initialData.map((item, index) => ({ ...item, key: index + 1 })))
    }
  }, [initialData])

  const isEditing = record => record.key === editingKey
  const dispatch = useDispatch()

  const getDisplayValue = (code, id) => {
    if (id) {
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

  const edit = record => {
    form.setFieldsValue({
      ...record,
    })
    setEditingKey(record.key)
  }

  const cancel = key => {
    console.log('key', key)
    if (key === -1) setData(data.filter(r => r.key !== key))

    form.resetFields()
    setRangeValidation({
      message: '',
    })
    setEditingKey('')
  }

  const validate = async () => {
    const fields = form.getFieldsValue(true)
    let rangeValidationErrorMessage = ''
    let rangeValidationErrorDetails = null
    let validationSuccess = true
    const operator = fields?.operator
    const leftOperand = fields?.leftOperand
    const rightOperand = fields?.rightOperand

    try {
      await form.validateFields()
    } catch {
      validationSuccess = false
    }

    const regex = /^(([0-9]+)|(0.5))+$/

    if (rule === 'age') {
      if (
        (leftOperand && !regex.test(leftOperand)) ||
        (rightOperand && !regex.test(rightOperand))
      ) {
        rangeValidationErrorMessage =
          'Invalid age range. 0.5 (6 months) or full year only.'
        validationSuccess = false
      }
    }

    if (rule === 'age' || rule === 'weight') {
      if (!operator) {
        rangeValidationErrorMessage = `Required.`
        validationSuccess = false
      } else if (operator === validOperators.to) {
        if (
          leftOperand === undefined ||
          leftOperand === null ||
          rightOperand === undefined ||
          rightOperand === null
        ) {
          rangeValidationErrorMessage = 'Both from and to are required.'
          validationSuccess = false
        }

        if (leftOperand > rightOperand) {
          rangeValidationErrorMessage = `${rule} from must be larger than ${rule} to.`
          validationSuccess = false
        }
      } else {
        if (rightOperand === undefined || rightOperand === null) {
          rangeValidationErrorMessage = `Required.`
          validationSuccess = false
        }
      }

      //To ensure that mandatory fields have the value before checking conflict with other rules.
      if (rangeValidationErrorMessage.length === 0) {
        const conflictValidationResult = validateRangeConflicts({
          operator,
          leftOperand,
          rightOperand,
        })

        if (!conflictValidationResult.validationSuccess) {
          ;({
            rangeValidationErrorMessage,
            rangeValidationErrorDetails,
            validationSuccess,
          } = conflictValidationResult)
        }
      }
    }

    setRangeValidation({
      message: rangeValidationErrorMessage,
      details: rangeValidationErrorDetails,
    })
    if (validationSuccess) return validationSuccess ? fields : undefined
  }

  const validateRangeConflicts = ({ operator, leftOperand, rightOperand }) => {
    let rangeValidationErrorMessage = ''
    let rangeValidationErrorDetails = null
    let validationSuccess = true

    // checking lenght as 1 because there is a temporary record added in state duing adding new row.
    if (!data || data.length === 1) {
      return {
        validationSuccess,
        rangeValidationErrorMessage,
      }
    }

    const getMinMax = ({ operator, leftOperand, rightOperand }) => {
      if (operator === validOperators.to)
        return { min: leftOperand, max: rightOperand }
      if (operator === validOperators.lessThan)
        return { min: 0, max: rightOperand }
      if (operator === validOperators.moreThan)
        return { min: rightOperand, max: maxInput }
    }

    const ranges = data
      .filter(d => d.key !== -1)
      .map(d => {
        const minMax = getMinMax({ ...d })
        return { ...d, ...minMax }
      })

    const currentRange = getMinMax({ operator, leftOperand, rightOperand })

    const conflict = ranges.filter(
      item =>
        (currentRange.min >= item.min && currentRange.min <= item.max) ||
        (currentRange.max >= item.min && currentRange.max <= item.max),
    )

    console.group('range conflict validation')
    console.log('ranges', ranges)
    console.log('currentRange', currentRange)
    console.log('conflict', conflict)
    console.groupEnd()

    if (conflict.length > 0) {
      rangeValidationErrorMessage = 'Range conflicting with other rules.'
      rangeValidationErrorDetails = conflict.map(item => (
        <div>{`${item.leftOperand ?? ''} ${item.operator} ${
          item.rightOperand
        }`}</div>
      ))
      validationSuccess = false
    }

    return {
      validationSuccess,
      rangeValidationErrorMessage,
      rangeValidationErrorDetails,
    }
  }

  const save = async key => {
    const row = await validate()

    if (!row) return

    const newData = [...data]
    const index = newData.findIndex(item => key === item.key)

    const item = newData[index]
    if (item.key === -1) {
      item.key = data.length
    }

    newData.splice(index, 1, { ...item, ...row })
    setData(newData)
    setEditingKey('')
    form.resetFields()

    if (onChange) onChange(newData)
  }

  const deleteData = async key => {
    const newData = data.filter(d => d.key !== key)
    setData(newData)
    form.resetFields()

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
      width: '20%',
      editable: true,
      render: (item = {}, record) => {
        if (rule === 'default') return <></>
        const editing = isEditing(record)
        return (
          <>
            {editing ? (
              <GridContainer gutter={4}>
                <GridItem md={3}>
                  {selectedOperator === validOperators.to && (
                    <Form.Item
                      name={['leftOperand']}
                      style={{
                        margin: 0,
                      }}
                    >
                      <InputNumber
                        style={{ width: 75, marginRight: 3 }}
                        min={0}
                        max={maxInput}
                        placeholder={rule}
                      ></InputNumber>
                    </Form.Item>
                  )}
                </GridItem>

                <GridItem md={6}>
                  <Form.Item
                    name={['operator']}
                    style={{
                      margin: 0,
                    }}
                  >
                    <Select
                      style={{ width: 110 }}
                      onChange={val => {
                        setSelectedOperator(val)
                        if (val !== validOperators.to)
                          form.setFieldsValue({ ['leftOperand']: null })
                      }}
                    >
                      <Option value={validOperators.lessThan}>
                        {validOperators.lessThan}
                      </Option>
                      <Option value={validOperators.to}>
                        {validOperators.to}
                      </Option>
                      <Option value={validOperators.moreThan}>
                        {validOperators.moreThan}
                      </Option>
                    </Select>
                  </Form.Item>
                </GridItem>
                <GridItem md={3}>
                  <Form.Item
                    name={['rightOperand']}
                    style={{
                      margin: 0,
                    }}
                  >
                    <InputNumber
                      style={{ width: 75, marginRight: 3 }}
                      min={0}
                      max={maxInput}
                      placeholder={rule}
                    ></InputNumber>
                  </Form.Item>
                </GridItem>
                {rangeValidation.message.length > 0 && (
                  <GridItem md={12}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <Typography.Text type='danger'>
                        {rangeValidation.message}
                      </Typography.Text>
                      {rangeValidation.details !== null &&
                        rangeValidation.details !== undefined && (
                          <Popover
                            icon={null}
                            title='Conflict Rule(s)'
                            content={rangeValidation.details}
                            trigger='click'
                          >
                            <Typography.Link> view </Typography.Link>
                          </Popover>
                        )}
                    </div>
                  </GridItem>
                )}
              </GridContainer>
            ) : (
              <span>
                {`${record.leftOperand ?? ''} ${record.operator} ${
                  record.rightOperand
                }`}
              </span>
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
      render: (item = {}, record) => {
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
                    message: `Required.`,
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
      render: (item = {}, record) => {
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
                rules={[
                  {
                    required: true,
                    message: `Required.`,
                  },
                ]}
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
      title: 'Duration(Days)',
      dataIndex: 'duration',
      align: 'center',
      editable: true,
      align: 'center',
      width: 120,
      render: (item = {}, record) => {
        const editing = isEditing(record)
        return (
          <div>
            {editing ? (
              <Form.Item
                name={['duration']}
                style={{
                  margin: 0,
                }}
                rules={[
                  {
                    required: true,
                    message: `Required.`,
                  },
                ]}
              >
                <InputNumber
                  style={{ width: 60 }}
                  min={1}
                  max={maxInput}
                ></InputNumber>
              </Form.Item>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <span>{record.duration}</span>
                  <span style={{ marginLeft: 3 }}>
                    {record.duration == 1 ? 'day' : 'days'}{' '}
                  </span>
                </div>
              </>
            )}
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
                rules={[
                  {
                    required: true,
                    message: `Required.`,
                  },
                ]}
              >
                <InputNumber
                  style={{ width: 60, marginRight: 3 }}
                  min={0}
                  max={maxInput}
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
      render: (item = {}, record) => {
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
      render: (item = {}, record) => {
        const editing = isEditing(record)
        return editing ? (
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
            setSelectedOperator(validOperators.to)
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
