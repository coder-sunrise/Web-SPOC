import React, { Component, PureComponent } from 'react'
import moment from 'moment'

import Yup from '@/utils/yup'
import {
  GridContainer,
  GridItem,
  TextField,
  CodeSelect,
  DatePicker,
  withFormikExtend,
  FastField,
} from '@/components'
import CopayerDropdownOption from '@/components/Select/optionRender/copayer'
import CommonSpectacleOrderForm from '@/pages/Widgets/ConsultationDocument/CommonSpectacleOrderForm'

@withFormikExtend({
  mapPropsToValues: ({
    consultationDocument,
    user,
    corVisionRefraction,
    forDispense,
    consultation,
  }) => {
    if (consultationDocument.entity) return consultationDocument.entity
    let formVisionRefraction = corVisionRefraction || {}
    if (forDispense) {
      formVisionRefraction =
        consultation.entity?.latestCORVisionRefraction || {}
    }
    const values = {
      type: consultationDocument.type,
      ...(consultationDocument.entity ||
        consultationDocument.defaultSpectacleOrderForm()),
      issuedByUserFK: user.data.clinicianProfile.userProfileFK,
      issuedByUser: user.data.clinicianProfile.name,
      issuedByUserTitle: user.data.clinicianProfile.title,
      dateOrdered: moment(),
      issuedByUserTitle: user.data.clinicianProfile.title,
      prescription_LE_SPH: formVisionRefraction.subjectiveRefraction_LE_SPH,
      prescription_LE_CYL: formVisionRefraction.subjectiveRefraction_LE_CYL,
      prescription_LE_AXIS: formVisionRefraction.subjectiveRefraction_LE_AXIS,
      prescription_LE_ADD:
        formVisionRefraction.subjectiveRefraction_NearAddition_LE_Value,
      prescription_LE_VA: `${formVisionRefraction.subjectiveRefraction_LE_VA ||
        ''}/${formVisionRefraction.subjectiveRefraction_LE_VA_Comments || ''}`,
      prescription_LE_PH: formVisionRefraction.subjectiveRefraction_LE_PH,
      prescription_RE_SPH: formVisionRefraction.subjectiveRefraction_RE_SPH,
      prescription_RE_CYL: formVisionRefraction.subjectiveRefraction_RE_CYL,
      prescription_RE_AXIS: formVisionRefraction.subjectiveRefraction_RE_AXIS,
      prescription_RE_ADD:
        formVisionRefraction.subjectiveRefraction_NearAddition_RE_Value,
      prescription_RE_VA: `${formVisionRefraction.subjectiveRefraction_RE_VA ||
        ''}/${formVisionRefraction.subjectiveRefraction_RE_VA_Comments || ''}`,
      prescription_RE_PH: formVisionRefraction.subjectiveRefraction_RE_PH,
    }
    return values
  },
  validationSchema: Yup.object().shape({}),

  handleSubmit: (values, { props }) => {
    const { dispatch, onConfirm, getNextSequence, codetable } = props
    const supplier = codetable?.ctsupplier?.find(
      ct => ct.id === values.supplierFK,
    )?.displayValue
    const frameType = codetable?.ctframetype?.find(
      ct => ct.id === values.frameTypeFK,
    )?.displayValue
    const polish = codetable?.ctpolish?.find(ct => ct.id === values.polishFK)
      ?.displayValue
    const rightLens = codetable?.inventoryconsumable?.find(
      ct => ct.id === values.rightLensProductFK,
    )?.displayValue
    const leftLens = codetable?.inventoryconsumable?.find(
      ct => ct.id === values.leftLensProductFK,
    )?.displayValue
    const nextSequence = getNextSequence()
    dispatch({
      type: 'consultationDocument/upsertRow',
      payload: {
        sequence: nextSequence,
        subject: 'Spectacle Order Form',
        supplier: supplier,
        rightLens: rightLens,
        leftLens: leftLens,
        frameType: frameType,
        polish: polish,
        ...values,
      },
    })
    if (onConfirm) onConfirm()
  },
  displayName: 'SpectacleOrderForm',
})
class SpectacleOrderForm extends PureComponent {
  render() {
    const { footer, handleSubmit } = this.props

    return (
      <div style={{ height: '800px', overflowY: 'auto' }}>
        <div style={{ paddingBottom: 60 }}>
          <GridContainer>
            <GridItem xs={6}>
              <FastField
                name='jobReferenceNumber'
                render={args => {
                  return (
                    <TextField disabled label='Job Reference Numer' {...args} />
                  )
                }}
              />
            </GridItem>
            <GridItem xs={6}>
              <FastField
                name='dateOrdered'
                render={args => {
                  return <DatePicker label='Date Ordered' {...args} />
                }}
              />
            </GridItem>
            <GridItem xs={6}>
              <FastField
                name='supplierFK'
                render={args => (
                  <CodeSelect
                    {...args}
                    code='ctsupplier'
                    renderDropdown={option => {
                      return (
                        <CopayerDropdownOption
                          option={option}
                        ></CopayerDropdownOption>
                      )
                    }}
                    labelField='displayValue'
                    label='Supplier'
                  />
                )}
              />
            </GridItem>
            <GridItem xs={6}>
              <FastField
                name='dateRequired'
                render={args => {
                  return <DatePicker label='Date Required' {...args} />
                }}
              />
            </GridItem>
          </GridContainer>
          <div style={{ margin: '0px 8px' }}>
            <CommonSpectacleOrderForm />
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            backgroundColor: 'white',
          }}
        >
          {footer &&
            footer({
              onConfirm: handleSubmit,
              confirmBtnText: 'Save',
            })}
        </div>
      </div>
    )
  }
}
export default SpectacleOrderForm
