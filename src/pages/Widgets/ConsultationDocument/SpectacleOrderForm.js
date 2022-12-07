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
import { PRODUCT_CATEGORY } from './utils'

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
          <div style={{ border: '0.5px solid #CCCCCC', margin: 8, padding: 8 }}>
            <div style={{ fontWeight: 'bold' }}>Lens Product</div>
            <GridContainer>
              <GridItem xs={6}>
                <FastField
                  name='leftLensProductFK'
                  render={args => (
                    <CodeSelect
                      {...args}
                      code='inventoryconsumable'
                      labelField='displayValue'
                      localFilter={item =>
                        item.consumableCategory.id ===
                        PRODUCT_CATEGORY.OPHTHALMIC_LENS
                      }
                      label='Left Lens'
                    />
                  )}
                />
              </GridItem>
              <GridItem xs={6}>
                <FastField
                  name='rightLensProductFK'
                  render={args => (
                    <CodeSelect
                      {...args}
                      code='inventoryconsumable'
                      labelField='displayValue'
                      localFilter={item =>
                        item.consumableCategory.id ===
                        PRODUCT_CATEGORY.OPHTHALMIC_LENS
                      }
                      label='Right Lens'
                    />
                  )}
                />
              </GridItem>
            </GridContainer>
          </div>

          <div style={{ border: '0.5px solid #CCCCCC', margin: 8, padding: 8 }}>
            <div style={{ fontWeight: 'bold' }}>Prescription</div>
            <div
              style={{
                lineHeight: '16px',
                position: 'relative',
                bottom: -5,
                right: -7,
                fontWeight: 500,
              }}
            >
              Left Eye (LE)
            </div>
            <GridContainer>
              <GridItem xs={2}>
                <FastField
                  name='prescription_LE_SPH'
                  render={args => {
                    return <TextField label='SPH' {...args} />
                  }}
                />
              </GridItem>
              <GridItem xs={2}>
                <FastField
                  name='prescription_LE_CYL'
                  render={args => {
                    return <TextField label='CYL' {...args} />
                  }}
                />
              </GridItem>
              <GridItem xs={2}>
                <FastField
                  name='prescription_LE_AXIS'
                  render={args => {
                    return <TextField label='AXIS' {...args} />
                  }}
                />
              </GridItem>
              <GridItem xs={2}>
                <FastField
                  name='prescription_LE_ADD'
                  render={args => {
                    return <TextField label='ADD' {...args} />
                  }}
                />
              </GridItem>
              <GridItem xs={2}>
                <FastField
                  name='prescription_LE_VA'
                  render={args => {
                    return <TextField label='VA' {...args} />
                  }}
                />
              </GridItem>
              <GridItem xs={2}>
                <FastField
                  name='prescription_LE_PH'
                  render={args => {
                    return <TextField label='PH' {...args} />
                  }}
                />
              </GridItem>
            </GridContainer>
            <div
              style={{
                marginTop: 8,
                lineHeight: '16px',
                position: 'relative',
                bottom: -5,
                right: -7,
                fontWeight: 500,
              }}
            >
              Right Eye (RE)
            </div>
            <GridContainer>
              <GridItem xs={2}>
                <FastField
                  name='prescription_RE_SPH'
                  render={args => {
                    return <TextField label='SPH' {...args} />
                  }}
                />
              </GridItem>
              <GridItem xs={2}>
                <FastField
                  name='prescription_RE_CYL'
                  render={args => {
                    return <TextField label='CYL' {...args} />
                  }}
                />
              </GridItem>
              <GridItem xs={2}>
                <FastField
                  name='prescription_RE_AXIS'
                  render={args => {
                    return <TextField label='AXIS' {...args} />
                  }}
                />
              </GridItem>
              <GridItem xs={2}>
                <FastField
                  name='prescription_RE_ADD'
                  render={args => {
                    return <TextField label='ADD' {...args} />
                  }}
                />
              </GridItem>
              <GridItem xs={2}>
                <FastField
                  name='prescription_RE_VA'
                  render={args => {
                    return <TextField label='VA' {...args} />
                  }}
                />
              </GridItem>
              <GridItem xs={2}>
                <FastField
                  name='prescription_RE_PH'
                  render={args => {
                    return <TextField label='PH' {...args} />
                  }}
                />
              </GridItem>
            </GridContainer>
          </div>
          <div style={{ border: '0.5px solid #CCCCCC', margin: 8, padding: 8 }}>
            <div style={{ fontWeight: 'bold' }}>Frame Measurement</div>
            <div
              style={{
                lineHeight: '16px',
                position: 'relative',
                bottom: -5,
                right: -7,
                fontWeight: 500,
              }}
            >
              Left Eye (LE)
            </div>
            <GridContainer>
              <GridItem xs={4}>
                <FastField
                  name='frameMeasurement_LE_Binocular_PD'
                  render={args => {
                    return (
                      <TextField
                        label='Binocular PD'
                        {...args}
                        onChange={e => {
                          this.props.setFieldValue(
                            'frameMeasurement_RE_Binocular_PD',
                            e.target.value,
                          )
                        }}
                      />
                    )
                  }}
                />
              </GridItem>
              <GridItem xs={4}>
                <FastField
                  name='frameMeasurement_LE_Monocular_PD'
                  render={args => {
                    return <TextField label='Monocular PD' {...args} />
                  }}
                />
              </GridItem>
              <GridItem xs={4}>
                <FastField
                  name='frameMeasurement_LE_SegmentHeight'
                  render={args => {
                    return <TextField label='Segment Height' {...args} />
                  }}
                />
              </GridItem>
            </GridContainer>
            <div
              style={{
                marginTop: 8,
                lineHeight: '16px',
                position: 'relative',
                bottom: -5,
                right: -7,
                fontWeight: 500,
              }}
            >
              Right Eye (RE)
            </div>
            <GridContainer>
              <GridItem xs={4}>
                <FastField
                  name='frameMeasurement_RE_Binocular_PD'
                  render={args => {
                    return (
                      <TextField
                        label='Binocular PD'
                        {...args}
                        onChange={e => {
                          this.props.setFieldValue(
                            'frameMeasurement_LE_Binocular_PD',
                            e.target.value,
                          )
                        }}
                      />
                    )
                  }}
                />
              </GridItem>
              <GridItem xs={4}>
                <FastField
                  name='frameMeasurement_RE_Monocular_PD'
                  render={args => {
                    return <TextField label='Monocular PD' {...args} />
                  }}
                />
              </GridItem>
              <GridItem xs={4}>
                <FastField
                  name='frameMeasurement_RE_SegmentHeight'
                  render={args => {
                    return <TextField label='Segment Height' {...args} />
                  }}
                />
              </GridItem>
            </GridContainer>
          </div>
          <div style={{ border: '0.5px solid #CCCCCC', margin: 8, padding: 8 }}>
            <GridContainer>
              <GridItem xs={6}>
                <FastField
                  name='frameTypeFK'
                  render={args => {
                    return (
                      <CodeSelect
                        code='ctframetype'
                        {...args}
                        labelField='displayValue'
                        label='Frame Type'
                      />
                    )
                  }}
                />
              </GridItem>
              <GridItem xs={6}>
                <FastField
                  name='polishFK'
                  render={args => {
                    return (
                      <CodeSelect
                        code='ctpolish'
                        {...args}
                        labelField='displayValue'
                        label='Polish'
                      />
                    )
                  }}
                />
              </GridItem>
            </GridContainer>
          </div>
          <div style={{ border: '0.5px solid #CCCCCC', margin: 8, padding: 8 }}>
            <div style={{ fontWeight: 'bold' }}>
              Frame Details (Fill in details below for Customer's Own Frame)
            </div>
            <GridContainer>
              <GridItem xs={2}>
                <FastField
                  name='frame'
                  render={args => {
                    return <TextField label='Frame' {...args} />
                  }}
                />
              </GridItem>
              <GridItem xs={2}>
                <FastField
                  name='brand'
                  render={args => {
                    return <TextField label='Brand' {...args} />
                  }}
                />
              </GridItem>
              <GridItem xs={2}>
                <FastField
                  name='model'
                  render={args => {
                    return <TextField label='Model' {...args} />
                  }}
                />
              </GridItem>
              <GridItem xs={2}>
                <FastField
                  name='size'
                  render={args => {
                    return <TextField label='Size' {...args} />
                  }}
                />
              </GridItem>
              <GridItem xs={2}>
                <FastField
                  name='color'
                  render={args => {
                    return <TextField label='Color' {...args} />
                  }}
                />
              </GridItem>
              <GridItem xs={12}>
                <FastField
                  name='remarks'
                  render={args => {
                    return <TextField label='Remarks' {...args} />
                  }}
                />
              </GridItem>
            </GridContainer>
          </div>
          <div style={{ border: '0.5px solid #CCCCCC', margin: 8, padding: 8 }}>
            <div style={{ fontWeight: 'bold' }}>SRP For</div>
            <GridContainer>
              <GridItem xs={6}>
                <FastField
                  name='sRPFor_FullName'
                  render={args => {
                    return <TextField label='Full Name' {...args} />
                  }}
                />
              </GridItem>
              <GridItem xs={6}>
                <FastField
                  name='sRPFor_YrOrClass'
                  render={args => {
                    return <TextField label='Yr/Class' {...args} />
                  }}
                />
              </GridItem>
            </GridContainer>
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
