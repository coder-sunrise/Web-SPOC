import React, { memo, useEffect, useState } from 'react'
import { withStyles } from '@material-ui/core'
// formik
import { Field } from 'formik'
// umi
import { formatMessage } from 'umi/locale'
// custom components
import {
  TextField,
  NumberInput,
  GridContainer,
  CommonCard,
  GridItem,
  CodeSelect,
  Select,
} from '@/components'
// medisys components
import {
  DoctorLabel,
  DoctorProfileSelect,
  Attachment,
  AttachmentWithThumbnail,
} from '@/components/_medisys'
import { VISIT_TYPE } from '@/utils/constants'
import { visitOrderTemplateItemTypes } from '@/utils/codes'
import { roundTo } from '@/utils/utils'
import numeral from 'numeral'
import FormField from './formField'

const styles = (theme) => ({
  verticalSpacing: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  attachmentLabel: {
    fontSize: '0.9rem',
    fontWeight: 300,
  },
  attachmentItem: {
    marginLeft: theme.spacing(0.5),
    marginRight: theme.spacing(0.5),
  },
  notUploaded: {
    '& > a': {
      color: '#999',
    },
  },
})

const amountProps = {
  style: { margin: 0 },
  noUnderline: true,
  currency: true,
  disabled: true,
  normalText: true,
  showZero: true, 
  fullWidth: false,
}

const VisitInfoCard = ({
  isReadOnly = false,
  isVisitReadonlyAfterSigned = false,
  attachments,
  handleUpdateAttachments,
  existingQNo,
  visitType,
  visitOrderTemplateOptions,
  setFieldValue,
  ctinvoiceadjustment,
  copaymentScheme,
  patientInfo,
  ...restProps
}) => {

  const validateQNo = (value) => {
    const qNo = parseFloat(value).toFixed(1)
    if (existingQNo.includes(qNo))
      return 'Queue No. already existed in current queue list'
    return ''
  }

  const getVisitOrderTemplateTotal = (vType, template) => {
    let activeItemTotal = 0
    visitOrderTemplateItemTypes.forEach((type) => {
      // type.id === 3 means vaccination
      if (vType === VISIT_TYPE.RETAIL && type.id === 3) return
      const currentTypeItems = template.visitOrderTemplateItemDtos.filter(
        (itemType) => itemType.inventoryItemTypeFK === type.id,
      )
      currentTypeItems.map((item) => {
        if (item[type.dtoName].isActive === true) {
          activeItemTotal += item.total || 0
        }
      })
    })
    return activeItemTotal
  }

  const validateTotalCharges = (value) => {
    const { values } = restProps
    let totalTempCharge = 0
    if ((values.visitOrderTemplateFK || 0) > 0) {
      const template = visitOrderTemplateOptions.find(
        (i) => i.id === values.visitOrderTemplateFK,
      )
      totalTempCharge = getVisitOrderTemplateTotal(visitType, template)
    }
    if ((value || 0) > totalTempCharge) {
      return `Cannot more than default charges(${totalTempCharge}).`
    }
    return ''
  }

  const handleDoctorChange = (v, op) => {
    const { roomAssignment = {} } = op.clinicianProfile
    setFieldValue(FormField['visit.roomFK'], roomAssignment.roomFK)
  }

  const handleVisitOrderTemplateChange = (vType, opts) => {
    if (opts) {
      let activeItemTotal = getVisitOrderTemplateTotal(vType, opts)

      setFieldValue(FormField['visit.VisitOrderTemplateTotal'], activeItemTotal)
    } else {
      setTimeout(() => {
        setFieldValue(FormField['visit.VisitOrderTemplateTotal'], undefined)
      }, 1)
    }
  }

  const handleVisitTypeChange = (v, op) => {
    const { values } = restProps
    const template = visitOrderTemplateOptions.find(
      (i) => i.id === values.visitOrderTemplateFK,
    )
    setFieldValue(FormField['visit.visitType'], v)
    if (template) {
      handleVisitOrderTemplateChange(v, template)
    }
  }

  const { values } = restProps
  let totalTempCharge = 0
  if ((values.visitOrderTemplateFK || 0) > 0) {
    const template = visitOrderTemplateOptions.find(
      (i) => i.id === values.visitOrderTemplateFK,
    )
    totalTempCharge = getVisitOrderTemplateTotal(visitType, template)
  }
  let showNotApplyAdjustment = totalTempCharge !== (values.visitOrderTemplateTotal || 0)
  let showAdjusment = values.visitStatus === 'WAITING' || values.visitStatus === 'UPCOMING APPT.'
  return (
    <CommonCard title='Visit Information'>
      <GridContainer alignItems='center'>
        <GridItem xs md={4}>
          <Field
            name={FormField['visit.visitType']}
            render={(args) => (
              <CodeSelect
                // disabled={isReadOnly}
                label={formatMessage({
                  id: 'reception.queue.visitRegistration.visitType',
                })}
                onChange={(v, op = {}) => handleVisitTypeChange(v, op)}
                code='ctvisitpurpose'
                allowClear={false}
                {...args}
              />
            )}
          />
        </GridItem>
        <GridItem xs md={4}>
          <Field
            name={FormField['visit.doctorProfileFk']}
            render={(args) => (
              <DoctorProfileSelect
                // disabled={isReadOnly}
                onChange={(v, op = {}) => handleDoctorChange(v, op)}
                label={
                  visitType === VISIT_TYPE.RETAIL ? (
                    formatMessage({
                      id: 'reception.queue.visitRegistration.attendantDoctor',
                    })
                  ) : (
                      formatMessage({
                        id: 'reception.queue.visitRegistration.doctor',
                      })
                    )
                }
                {...args}
              />
            )}
          />
        </GridItem>
        <GridItem xs md={4}>
          <Field
            name={FormField['visit.queueNo']}
            validate={validateQNo}
            render={(args) => (
              <NumberInput
                {...args}
                format='0.0'
                // disabled={isReadOnly}
                label={formatMessage({
                  id: 'reception.queue.visitRegistration.queueNo',
                })}
                formatter={(value) => {
                  const isNaN = Number.isNaN(parseFloat(value))
                  return isNaN ? value : parseFloat(value).toFixed(1)
                }}
              />
            )}
          />
        </GridItem>
        <GridItem xs md={4}>
          <Field
            name={FormField['visit.roomFK']}
            render={(args) => (
              <CodeSelect
                // disabled={isReadOnly}
                label={formatMessage({
                  id: 'reception.queue.visitRegistration.room',
                })}
                code='ctRoom'
                {...args}
              />
            )}
          />
        </GridItem>
        <GridItem xs md={4}>
          <Field
            name={FormField['visit.visitOrderTemplateFK']}
            render={(args) => {
              return (
                <Select
                  // disabled={isReadOnly}
                  options={visitOrderTemplateOptions}
                  label={formatMessage({
                    id: 'reception.queue.visitRegistration.visitOrderTemplate',
                  })}
                  {...args}
                  authority='none'
                  disabled={isVisitReadonlyAfterSigned}
                  onChange={(e, opts) =>
                    handleVisitOrderTemplateChange(visitType, opts)}
                />
              )
            }}
          />
        </GridItem>
        <GridItem xs md={4}>
          <Field
            name={FormField['visit.VisitOrderTemplateTotal']}
            validate={validateTotalCharges}
            render={(args) => {
              const { form: fm } = args
              const readOnly = (fm.values.visitOrderTemplateFK || 0) <= 0
              return (
                <NumberInput
                  {...args}
                  currency
                  authority='none'
                  disabled={readOnly || isVisitReadonlyAfterSigned}
                  label={formatMessage({
                    id:
                      'reception.queue.visitRegistration.visitOrderTotalCharge',
                  })}
                />)
            }}
          />
        </GridItem>
        {
          (showAdjusment && ((ctinvoiceadjustment || []).length > 0 || (copaymentScheme || []).length > 0)) ?
            <GridItem xs md={12}>
              <div style={{ marginTop: '5px' }}>
                <p>Below invoice adjustment(s) will {showNotApplyAdjustment ? <span style={{ fontWeight: 500, color: 'red' }}>NOT</span> : undefined} be applied to the total bill:</p>
                {(ctinvoiceadjustment || []).map((t => {
                  if (t.adjType === 'ExactAmount') {
                    return <span style={{ display: 'inline-block', marginRight: '20px' }}><span style={{ fontWeight: '500' }}>{t.displayValue}:</span> <NumberInput text {...amountProps} style={{ display: 'inline-block' }} value={t.adjValue} />; </span>
                  }

                  if (t.adjValue > 0) {
                    return (
                      <span style={{ display: 'inline-block', marginRight: '20px' }}>
                        <span style={{ fontWeight: '500', fontSize: '14px' }}>{t.displayValue}: <span style={{ color: 'darkblue' }}>{numeral(t.adjValue).format('0.00')}%;</span></span>
                      </span>)
                  }

                  return (
                    <span style={{ display: 'inline-block', marginRight: '20px' }}>
                      <span style={{ fontWeight: '500' }}>{t.displayValue}: </span>
                      <span style={{
                        color: 'red', display: 'inline-block', fontWeight: '500',
                      }}
                      >
                        <span>({numeral(Math.abs(t.adjValue)).format('0.00')}%)</span>
                      </span>;
                    </span>) 
                }))}
                {(copaymentScheme || []).filter((t) => t.copayerInvoiceAdjustmentValue !== 0).length > 0 ?
                  <p>
                    {(copaymentScheme || []).filter((t) => t.copayerInvoiceAdjustmentValue !== 0).map((t => {
                      if (t.copayerInvoiceAdjustmentType === 'ExactAmount') {
                        return <span style={{ display: 'inline-block', marginRight: '20px' }}><span style={{ fontWeight: '500' }}>{t.coPayerName}</span>: <NumberInput text {...amountProps} style={{ display: 'inline-block' }} value={t.copayerInvoiceAdjustmentValue} />; </span>
                      }

                      if (t.copayerInvoiceAdjustmentValue > 0) {
                        return (
                          <span style={{ display: 'inline-block', marginRight: '20px' }}>
                            <span style={{ fontWeight: '500' }}>{t.coPayerName}: <span style={{ color: 'darkblue' }}>{numeral(t.copayerInvoiceAdjustmentValue).format('0.00')}%;</span></span>
                          </span>)
                      }

                      return (
                        <span style={{ display: 'inline-block', marginRight: '20px' }}>
                          <span style={{ fontWeight: '500' }}>{t.coPayerName}: </span>
                          <span style={{
                            color: 'red', display: 'inline-block', fontWeight: '500',
                          }}
                          >
                            <span>({numeral(Math.abs(t.copayerInvoiceAdjustmentValue)).format('0.00')}%)</span>
                          </span>;
                        </span>) 
                    }))}
                  </p> : undefined
                }
              </div>
            </GridItem>
            : undefined
        }
        <GridItem xs md={12}>
          <Field
            name={FormField['visit.visitRemarks']}
            render={(args) => (
              <TextField
                {...args}
                // disabled={isReadOnly}
                multiline
                rowsMax={3}
                authority='none'
                disabled={isVisitReadonlyAfterSigned}
                label={formatMessage({
                  id: 'reception.queue.visitRegistration.visitRemarks',
                })}
              />
            )}
          />
        </GridItem>
        <GridItem xs md={12}>
          <AttachmentWithThumbnail
            label='Attachment'
            attachmentType='Visit'
            handleUpdateAttachments={handleUpdateAttachments}
            attachments={attachments}
            isReadOnly={isReadOnly}
            disableScanner={isReadOnly}
            fieldName='visitAttachment'
          />
        </GridItem>
      </GridContainer>
    </CommonCard>
  )
}

export default memo(
  withStyles(styles, { name: 'VisitInfoCard' })(VisitInfoCard),
)
