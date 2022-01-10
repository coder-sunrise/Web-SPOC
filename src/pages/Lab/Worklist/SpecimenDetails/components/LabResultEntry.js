import React from 'react'
import { Form, Input, Button, Space } from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'

export const LabResultForm = ({ data, form }) => {
  // const data = [
  //   { testPanel: 'CRE', rawData: '100', unit: 'mmHg', referenceRange: 0 - 10 },
  //   { testPanel: 'BUN', rawData: '100', unit: 'mmHg', referenceRange: 0 - 10 },
  //   { testPanel: 'GOT', rawData: '100', unit: 'mmHg', referenceRange: 0 - 10 },
  // ]

  return (
    <React.Fragment>
      <Space style={{ display: 'flex', marginBottom: 8 }} align='baseline'>
        <div style={{ width: 200 }}>Test Panel Item </div>
        <div style={{ width: 150 }}>Result</div>
        <div style={{ width: 150 }}>Raw Data</div>
        <div style={{ width: 100 }}>Unit</div>
        <div style={{ width: 150 }}>Reference Range</div>
      </Space>
      <Form.List name='labResults' initialValue={data}>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space
                key={key}
                style={{ display: 'flex', marginBottom: 8 }}
                align='baseline'
              >
                <div style={{ width: 200 }}>
                  <span> {data[key].testPanel}</span>
                </div>
                <div style={{ width: 150 }}>
                  <Form.Item
                    {...restField}
                    name={'result'}
                    rules={[{ required: true, message: 'Missing last name' }]}
                  >
                    <Input placeholder='Last Name' />
                  </Form.Item>
                </div>
                <div style={{ width: 150 }}>{name}</div>
                <div style={{ width: 100 }}>
                  <Form.Item
                    {...restField}
                    name={[name, 'last']}
                    rules={[{ required: true, message: 'Missing last name' }]}
                  >
                    <Input placeholder='Last Name' />
                  </Form.Item>
                </div>
                <div style={{ width: 150 }}>
                  <Form.Item
                    {...restField}
                    name={[name, 'last']}
                    rules={[{ required: true, message: 'Missing last name' }]}
                  >
                    <Input placeholder='Last Name' />
                  </Form.Item>
                </div>
              </Space>
            ))}
          </>
        )}
      </Form.List>
    </React.Fragment>
  )
}
