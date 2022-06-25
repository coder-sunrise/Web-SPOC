import React, { useState, useEffect } from 'react'
import {
  MultipleTextField,
  Field,
  withFormikExtend,
  Button,
} from '@/components'
import { compose } from 'redux'
import Yup from '@/utils/yup'
import { MEDICALCHECKUP_REPORTSTATUS } from '@/utils/constants'

const VerifyForm = props => {
  const { onClose, onReject, onVerify, setFieldValue, handleSubmit } = props
  return (
    <div>
      <div style={{ position: 'relative', paddingLeft: 80 }}>
        <div style={{ position: 'absolute', top: 0, left: 0 }}>Remarks:</div>
        <Field
          name='verifyRemarks'
          render={args => (
            <MultipleTextField
              maxLength={2000}
              autoSize={{ minRows: 4, maxRows: 4 }}
              {...args}
            />
          )}
        />
      </div>
      <div style={{ textAlign: 'right', padding: '8px 0px' }}>
        <Button color='danger' size='sm' onClick={onClose}>
          Cancel
        </Button>
        <Button
          color='primary'
          size='sm'
          onClick={async () => {
            await setFieldValue('status', MEDICALCHECKUP_REPORTSTATUS.REJECT)
            handleSubmit()
          }}
        >
          Reject
        </Button>
        <Button
          color='success'
          size='sm'
          onClick={async () => {
            await setFieldValue('status', MEDICALCHECKUP_REPORTSTATUS.VERIFIED)
            handleSubmit()
          }}
        >
          Verify
        </Button>
      </div>
    </div>
  )
}
export default compose(
  withFormikExtend({
    mapPropsToValues: ({ medicalCheckupReportingDetails }) => {
      return {}
    },
    validationSchema: Yup.object().shape({
      // verifyRemarks: Yup.string().required(),
    }),
    handleSubmit: (values, { props }) => {
      const { onVerificationSave } = props
      onVerificationSave({ ...values })
    },
    enableReinitialize: true,
    displayName: 'VerifyForm',
  }),
)(VerifyForm)
