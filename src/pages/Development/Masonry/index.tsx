import React, { PureComponent, Suspense } from 'react'
import { Form, Input, ProForm } from '@medisys/component'

const Masonry = () => {
  return (
    <div>
      test
      <ProForm
        initialValues={{
          field1: 'ssss',
        }}
        discardCheck
      >
        <Form.Item name='field1'>
          <Input />
        </Form.Item>
      </ProForm>
    </div>
  )
}
export default Masonry
