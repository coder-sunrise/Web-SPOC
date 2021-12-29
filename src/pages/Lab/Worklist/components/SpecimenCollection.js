import React, { useState, useEffect } from 'react'
import { Space, Collapse, Checkbox, InputNumber } from 'antd'
import {
  dateFormatLongWithTimeNoSec,
  DatePicker,
  Select,
  CommonModal,
  NumberInput,
} from '@/components'

const { Panel } = Collapse

export const SpecimenCollection = ({ open, onClose }) => {
  return (
    <CommonModal
      open={open}
      title='Collect Specimen'
      onClose={onClose}
      showFooter={true}
      maxWidth='sm'
    >
      <div style={{ minHeight: 400 }}>
        <Space style={{ display: 'flex', marginBottom: 12 }}>
          <DatePicker
            showTime
            style={{ width: 150 }}
            label='Collection Date'
            format={dateFormatLongWithTimeNoSec}
          />
          <Select
            label='Specimen Type'
            style={{ width: 160 }}
            options={[
              { value: 1, name: 'Pure Blood' },
              { value: 2, name: 'EDTA Blood' },
            ]}
          ></Select>
        </Space>
        <Collapse
          defaultActiveKey={['1']}
          onChange={() => {}}
          defaultActiveKey={[1, 2, 3]}
        >
          <Panel header='Biochemistry' key='1'>
            <div>
              <Checkbox defaultChecked={false} /> <span>GOT</span>
            </div>
            <div>
              <Checkbox defaultChecked /> <span>ALP</span>
            </div>
          </Panel>
          <Panel header='Serology/Immunology' key='2'>
            <div>
              <Checkbox defaultChecked={false} /> <span>AFP</span>
            </div>
            <div>
              <Checkbox defaultChecked /> <span>CEA</span>
            </div>
          </Panel>
          <Panel header='Hematology' key='3'>
            <div>
              <Checkbox defaultChecked /> <span>FBC</span>
            </div>
          </Panel>
        </Collapse>
        <div
          style={{
            justifyContent: 'end',
            margin: '10px 0px',
            display: 'flex',
            alignItems: 'end',
          }}
        >
          <Checkbox>Print Label</Checkbox>
          <InputNumber
            size='small'
            min={1}
            max={10}
            style={{ width: '50px', textAlign: 'right' }}
          />
        </div>
      </div>
    </CommonModal>
  )
}
