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

export const SpecimenDiscarding = ({ open, onClose }) => {
  return (
    <CommonModal
      open={open}
      title='Discard Specimen'
      onClose={onClose}
      showFooter={true}
      maxWidth='lg'
    >
      <div style={{ minHeight: 400 }}></div>
    </CommonModal>
  )
}