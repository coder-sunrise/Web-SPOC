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
  Input,
} from 'antd'
import {
  dateFormatLongWithTimeNoSec,
  DatePicker,
  Select,
  CommonModal,
  NumberInput,
  TextField,
} from '@/components'
import { useCodeTable } from '@/utils/hooks'

export const DiscardSpecimen = ({ open, id, onClose, onConfirm }) => {
  const [showModal, setShowModal] = useState(false)
  const [hasDiscardReason, setHasDiscardReason] = useState(false)
  const ctspecimentype = useCodeTable('ctspecimentype')
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
      setHasDiscardReason(false)
      form.setFieldsValue({})
      form.resetFields()
      dispatch({
        type: 'worklistSpecimenDetails/updateState',
        payload: { entity: {} },
      })
    }
  }, [id])

  return (
    <CommonModal
      open={showModal}
      title='Discard Specimen'
      footProps={{
        confirmProps: {
          disabled: !hasDiscardReason,
        },
      }}
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
          title={
            <span style={{ fontWeight: 'normal' }}>
              Confirm to discard the specimen below?
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
        </Descriptions>
        <Form
          form={form}
          initialValues={{
            specimenDiscardReason: '',
          }}
          onFinish={({ specimenDiscardReason }) => {
            const payload = {
              ...entity,
              specimenDiscardReason,
            }

            dispatch({
              type: 'labWorklist/discardSpecimen',
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
            name='specimenDiscardReason'
            style={{ margin: 8 }}
            rules={[{ required: true, message: 'Reason is required.' }]}
          >
            <TextField
              label='Reason'
              onChange={e =>
                setHasDiscardReason(e.target.value && e.target.value !== '')
              }
            />
          </Form.Item>
        </Form>
      </div>
    </CommonModal>
  )
}
