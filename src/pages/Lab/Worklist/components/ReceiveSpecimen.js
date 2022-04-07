import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'dva'
import moment from 'moment'
import {
  Space,
  Collapse,
  Checkbox,
  InputNumber,
  Descriptions,
  Form,
} from 'antd'
import {
  dateFormatLongWithTimeNoSec,
  DatePicker,
  Select,
  CommonModal,
  NumberInput,
} from '@/components'
import { useCodeTable } from '@/utils/hooks'

export const ReceiveSpecimen = ({ open, id, onClose, onConfirm }) => {
  const [showModal, setShowModal] = useState(false)
  const ctspecimentype = useCodeTable('ctspecimentype')
  const cttestcategory = useCodeTable('cttestcategory')
  const { entity } = useSelector(s => s.worklistSpecimenDetails)
  const { entity: patient } = useSelector(s => s.patient)
  const dispatch = useDispatch()
  const [form] = Form.useForm()

  useEffect(() => {
    setShowModal(open)
    if (open && id) {
      form.resetFields()
      dispatch({
        type: 'worklistSpecimenDetails/query',
        payload: { id },
      })
    }

    return () => {
      form.setFieldsValue({})
      dispatch({
        type: 'worklistSpecimenDetails/updateState',
        payload: { entity: {} },
      })
    }
  }, [id])

  return (
    <CommonModal
      open={showModal}
      title='Receive Specimen'
      onClose={() => {
        setShowModal(false)
        onClose && onClose()
      }}
      onConfirm={() => {
        form.submit()
      }}
      showFooter={true}
      maxWidth='sm'
    >
      <div>
        <Descriptions
          labelStyle={{ width: 150 }}
          title={
            <span style={{ fontWeight: 'normal' }}>
              Confirm to receive the specimen below?
            </span>
          }
          layout='horizontal'
          column={1}
          bordered
          size='small'
        >
          <Descriptions.Item label='Patient Name'>
            {patient?.name}
          </Descriptions.Item>
          <Descriptions.Item label='Patient Ref. No.'>
            {patient?.patientReferenceNo}
          </Descriptions.Item>
          <Descriptions.Item label='Accession No.'>
            {entity.accessionNo}
          </Descriptions.Item>
          <Descriptions.Item label='Specimen Type'>
            {
              ctspecimentype.find(item => item.id === entity.specimenTypeFK)
                ?.name
            }
          </Descriptions.Item>
          <Descriptions.Item label='Test Panels'>
            {entity.testPanels}
          </Descriptions.Item>
          <Descriptions.Item label='Receiving Date'>
            <Form
              form={form}
              initialValues={{
                dateReceived: moment(),
              }}
              onFinish={({ dateReceived }) => {
                const payload = {
                  ...entity,
                  dateReceived,
                }

                dispatch({
                  type: 'labWorklist/receiveSpecimen',
                  payload,
                }).then(result => {
                  if (result) {
                    setShowModal(false)
                    onConfirm && onConfirm()
                  }
                })
              }}
            >
              <Form.Item
                name='dateReceived'
                rules={[
                  { required: true, message: 'Receiving date is required.' },
                ]}
              >
                <DatePicker
                  showTime
                  style={{ width: 150 }}
                  format={dateFormatLongWithTimeNoSec}
                />
              </Form.Item>
            </Form>
          </Descriptions.Item>
        </Descriptions>
      </div>
    </CommonModal>
  )
}
