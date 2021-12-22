import React, { useState, useEffect } from 'react'
import { Space, Collapse, Checkbox, InputNumber } from 'antd'
import Banner from '@/pages/PatientDashboard/Banner'
import { useSelector, useDispatch } from 'dva'
import {
  dateFormatLongWithTimeNoSec,
  DatePicker,
  Select,
  CommonModal,
  NumberInput,
} from '@/components'

const { Panel } = Collapse

export const SpecimenDetails = ({ open, onClose }) => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch({ type: 'specimentDetails/query' })
  }, [])

  return (
    <CommonModal
      open={open}
      title='Specimen Details'
      onClose={onClose}
      showFooter={true}
      maxWidth='lg'
    >
      <div style={{ minHeight: 600 }}>
        <Banner style={{ top: 5 }} />
      </div>
    </CommonModal>
  )
}
