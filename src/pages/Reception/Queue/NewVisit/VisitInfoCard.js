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
import FormField from './formField'
import { VISIT_TYPE } from '@/utils/constants'
import { visitOrderTemplateItemTypes } from '@/utils/codes'

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

const VisitInfoCard = ({
  isReadOnly = false,
  attachments,
  handleUpdateAttachments,
  existingQNo,
  visitType,
  visitOrderTemplateOptions,
  ...restProps
}) => {
  console.log({ restProps })
  const validateQNo = (value) => {
    const qNo = parseFloat(value).toFixed(1)
    if (existingQNo.includes(qNo))
      return 'Queue No. already existed in current queue list'
    return ''
  }

  const getVisitOrderTemplateTotal = (template) => {
    let activeItemTotal = 0
    visitOrderTemplateItemTypes.forEach((type) => {
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
    console.log(visitOrderTemplateOptions, values.visitOrderTemplateFK)
    if ((values.visitOrderTemplateFK || 0) > 0) {
      const template = visitOrderTemplateOptions.find(
        (i) => i.id === values.visitOrderTemplateFK,
      )
      totalTempCharge = getVisitOrderTemplateTotal(template)
    }
    if ((value || 0) > totalTempCharge) {
      return `Total Charges can not more than visit template total amount(${totalTempCharge}).`
    }
    return ''
  }

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
              const { form } = args

              return (
                <Select
                  // disabled={isReadOnly}
                  options={visitOrderTemplateOptions}
                  label={formatMessage({
                    id: 'reception.queue.visitRegistration.visitOrderTemplate',
                  })}
                  {...args}
                  onChange={(e, opts) => {
                    if (opts) {
                      let activeItemTotal = getVisitOrderTemplateTotal(opts)

                      form.setFieldValue(
                        FormField['visit.VisitOrderTemplateTotal'],
                        activeItemTotal,
                      )
                    } else {
                      setTimeout(() => {
                        form.setFieldValue(
                          FormField['visit.VisitOrderTemplateTotal'],
                          undefined,
                        )
                      }, 1)
                    }
                  }}
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
                  disabled={readOnly}
                  label={formatMessage({
                    id:
                      'reception.queue.visitRegistration.visitOrderTotalCharge',
                  })}
                />
              )
            }}
          />
        </GridItem>
        <GridItem xs md={12}>
          <Field
            name={FormField['visit.visitRemarks']}
            render={(args) => (
              <TextField
                {...args}
                // disabled={isReadOnly}
                multiline
                rowsMax={3}
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
