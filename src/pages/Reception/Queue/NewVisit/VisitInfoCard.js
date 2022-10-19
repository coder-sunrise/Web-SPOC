import React, { memo, useEffect, useState, Fragment } from 'react'
import { withStyles } from '@material-ui/core'
// antd
import InfoCircleOutlined from '@ant-design/icons/InfoCircleOutlined'
// formik
import { Field, FastField } from 'formik'
// umi
import { formatMessage } from 'umi'
// custom components
import _ from 'lodash'
import { Alert } from 'antd'
import {
  TextField,
  NumberInput,
  GridContainer,
  CommonCard,
  GridItem,
  CodeSelect,
  Select,
  ClinicianSelect,
  Checkbox,
  Tooltip,
  Switch,
  Popover,
  IconButton,
  Icon,
  EditableTableGrid,
  Popconfirm,
  Button,
} from '@/components'
// medisys components
import {
  DoctorProfileSelect,
  Attachment,
  AttachmentWithThumbnail,
} from '@/components/_medisys'
import { VISIT_TYPE, CANNED_TEXT_TYPE } from '@/utils/constants'
import { VISIT_STATUS } from '@/pages/Reception/Queue/variables'
import { visitOrderTemplateItemTypes } from '@/utils/codes'
import { roundTo, getMappedVisitType } from '@/utils/utils'
import numeral from 'numeral'
import FormField from './formField'
import { getMCReportLanguage } from './miscUtils'
import Authorized from '@/utils/Authorized'
import CannedTextButton from '@/pages/Widgets/Orders/Detail/CannedTextButton'

const styles = theme => ({
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
  switchContainer: {
    lineHeight: '1em',
    borderRadius: 3,
    height: 24,
    margin: 0,
    color: 'currentColor',
    overflow: 'visible',
    top: -2,
    '& .ant-switch-handle': {
      width: 20,
      height: 20,
      '&::before': {
        borderRadius: 3,
        right: 2,
      },
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
  classes,
  isReadOnly = false,
  isVisitReadonlyAfterSigned = false,
  isDoctorConsulted = false,
  attachments,
  handleUpdateAttachments,
  existingQNo,
  visitType,
  // visitOrderTemplateOptions = [],
  setFieldValue,
  ctinvoiceadjustment,
  copaymentScheme,
  patientInfo,
  clinicSettings,
  currentVisitTemplate,
  queueLog,
  visitMode,
  ctvisitpurpose,
  doctorProfiles,
  ...restProps
}) => {
  const disableConsReady = Authorized.check('queue.modifyconsultationready')

  const validateQNo = value => {
    const qNo = parseFloat(value).toFixed(
      clinicSettings.settings.isQueueNoDecimal ? 1 : 0,
    )
    if (existingQNo.includes(qNo))
      return 'Queue No. already existed in current queue list'
    return ''
  }

  const isPrimaryDoctorConsultated =
    restProps.values?.visitPrimaryDoctor &&
    restProps.values?.visitPrimaryDoctor?.consultationStatus !== 'Waiting'
  // const getVisitOrderTemplateTotal = (vType, template) => {
  //   let activeItemTotal = 0
  //   visitOrderTemplateItemTypes.forEach(type => {
  //     // type.id === 3 means vaccination
  //     if (vType === VISIT_TYPE.OTC && type.id === 3) return
  //     const currentTypeItems = template.visitOrderTemplateItemDtos.filter(
  //       itemType => itemType.inventoryItemTypeFK === type.id,
  //     )
  //     currentTypeItems.map(item => {
  //       if (item[type.dtoName].isActive === true) {
  //         activeItemTotal += item.totalAftAdj || 0
  //       }
  //     })
  //   })
  //   return activeItemTotal
  // }

  // const validateTotalCharges = async value => {
  //   const { values, dispatch } = restProps
  //   let totalTempCharge = 0
  //   if ((values.visitOrderTemplateFK || 0) > 0) {
  //     if (currentVisitTemplate) {
  //       totalTempCharge = getVisitOrderTemplateTotal(
  //         visitType,
  //         currentVisitTemplate,
  //       )
  //     } else {
  //       await dispatch({
  //         type: 'settingVisitOrderTemplate/queryOne',
  //         payload: {
  //           id: values.visitOrderTemplateFK,
  //         },
  //       }).then(template => {
  //         if (template) {
  //           totalTempCharge = getVisitOrderTemplateTotal(visitType, template)
  //         }
  //       })
  //     }
  //   }
  //   if ((value || 0) > totalTempCharge) {
  //     return `Cannot more than default charges(${totalTempCharge}).`
  //   }
  //   return ''
  // }

  const handleDoctorChange = (v, op) => {
    if (op.clinicianProfile) {
      const { roomAssignment = {} } = op.clinicianProfile
      setFieldValue(FormField['visit.roomFK'], roomAssignment.roomFK)
      if (!op.clinicianProfile.specialtyFK) {
        setFieldValue(FormField['visit.isDoctorInCharge'], true)
      }
    } else {
      setFieldValue(FormField['visit.isDoctorInCharge'], true)
    }
  }

  // const handleVisitOrderTemplateChange = (vType, opts) => {
  //   const { dispatch, getVisitOrderTemplateDetails } = restProps
  //   if (opts) {
  //     getVisitOrderTemplateDetails(opts.id)
  //   } else {
  //     getVisitOrderTemplateDetails(undefined)
  //     setFieldValue(FormField['visit.VisitOrderTemplateTotal'], undefined)
  //   }
  // }

  const handleVisitTypeChange = (v, op) => {
    const { values, dispatch, getVisitOrderTemplateDetails } = restProps
    setFieldValue(FormField['visit.visitType'], v)
    if (v !== 1) {
      setFieldValue(FormField['visit.consReady'], false)
    }
    setFieldValue(FormField['visit.isDoctorInCharge'], true)
    setFieldValue('visitBasicExaminations[0].visitPurposeFK', v)
    if (currentVisitTemplate) {
      handleVisitOrderTemplateChange(v, currentVisitTemplate)
    }
  }

  const handleIsForInvoiceReplacementChange = v => {
    const { values } = restProps
  }

  const { values, dispatch } = restProps
  // let totalTempCharge = 0
  // if ((values.visitOrderTemplateFK || 0) > 0 && currentVisitTemplate) {
  //   totalTempCharge = getVisitOrderTemplateTotal(
  //     visitType,
  //     currentVisitTemplate,
  //   )
  // }
  const { visitTypeSetting, isQueueNoDecimal } = clinicSettings.settings
  // let visitTypeSettingsObj = undefined
  // let visitPurpose = undefined
  // if (visitTypeSetting) {
  //   try {
  //     visitTypeSettingsObj = JSON.parse(visitTypeSetting)
  //   } catch {}
  // }
  // if ((ctvisitpurpose || []).length > 0) {
  //   visitPurpose = getMappedVisitType(
  //     ctvisitpurpose,
  //     visitTypeSettingsObj,
  //   ).filter(vstType => vstType['isEnabled'] === 'true')
  // }

  // const getAvailableOrderTemplate = () => {
  //   let availableVisitOrderTemplate = []
  //   var patientCopayers = patientInfo?.patientScheme
  //     ?.filter(x => !x.isExpired && x.isSchemeActive && x.isCopayerActive)
  //     ?.map(x => x.copayerFK)
  //   if (patientInfo) {
  //     visitOrderTemplateOptions
  //       .filter(x => x.isActive)
  //       .forEach(template => {
  //         if ((template.visitOrderTemplate_Copayers || []).length === 0) {
  //           availableVisitOrderTemplate.push({
  //             ...template,
  //             type: 'general',
  //             value: template.id,
  //             name: template.displayValue,
  //           })
  //         } else {
  //           if (
  //             _.intersection(
  //               template.visitOrderTemplate_Copayers.map(x => x.copayerFK),
  //               patientCopayers,
  //             ).length > 0
  //           ) {
  //             availableVisitOrderTemplate.push({
  //               ...template,
  //               type: 'copayer',
  //               value: template.id,
  //               name: template.displayValue,
  //             })
  //           }
  //         }
  //       })
  //   } else {
  //     visitOrderTemplateOptions
  //       .fitler(x => x.isActive)
  //       .forEach(template => {
  //         // if haven't select patient profile, then only show general package
  //         if ((template.visitOrderTemplate_Copayers || []).length === 0) {
  //           availableVisitOrderTemplate.push({
  //             ...template,
  //             value: template.id,
  //             name: template.displayValue,
  //           })
  //         }
  //       })
  //   }
  //   availableVisitOrderTemplate = _.orderBy(
  //     availableVisitOrderTemplate,
  //     [data => data?.type?.toLowerCase(), data => data?.name?.toLowerCase()],
  //     ['asc', 'asc'],
  //   )
  //   return availableVisitOrderTemplate
  // }
  const notWaiting =
    (values.visitStatus !== VISIT_STATUS.WAITING &&
      values.visitStatus !== VISIT_STATUS.UPCOMING_APPT) ||
    visitMode === 'view'

  const hasCOR = values.clinicalObjectRecordFK
  const activeCORCreatedBy = values.activeCORCreatedBy
  // const isSpecialtyDoctor = () => {
  //   var primaryDoctor = doctorProfiles.find(
  //     x => x.id === values?.doctorProfileFK,
  //   )
  //   if (primaryDoctor?.clinicianProfile?.specialtyFK) {
  //     return true
  //   }
  //   return false
  // }
  return (
    <CommonCard title='Visit Information'>
      <GridContainer alignItems='center'>
        <GridItem xs md={2}>
          <Field
            name={FormField['visit.visitType']}
            render={args => (
              <CodeSelect
                disabled={notWaiting || isReadOnly || hasCOR}
                label={formatMessage({
                  id: 'reception.queue.visitRegistration.visitType',
                })}
                onChange={(v, op = {}) => handleVisitTypeChange(v, op)}
                options={ctvisitpurpose || []}
                allowClear={false}
                {...args}
              />
            )}
          />
        </GridItem>
        <GridItem xs md={2}>
          <Field
            name={FormField['visit.salesType']}
            render={args => (
              <CodeSelect
                disabled={notWaiting || isReadOnly}
                label={formatMessage({
                  id: 'reception.queue.visitRegistration.salesType',
                })}
                code='ctSalesType'
                {...args}
              />
            )}
          />
        </GridItem>
        <GridItem xs md={2}>
          <Field
            name={FormField['visit.doctorProfileFk']}
            render={args => (
              <DoctorProfileSelect
                disabled={isPrimaryDoctorConsultated || isReadOnly}
                authority='none'
                onChange={(v, op = {}) => handleDoctorChange(v, op)}
                label={formatMessage({
                  id: 'reception.queue.visitRegistration.doctor',
                })}
                {...args}
              />
            )}
          />
        </GridItem>
        <GridItem xs md={2}>
          <div
            style={{
              position: 'relative',
            }}
          >
            <Field
              name={FormField['visit.queueNo']}
              validate={validateQNo}
              render={args => (
                <NumberInput
                  {...args}
                  precision={isQueueNoDecimal ? 1 : 0}
                  disabled={notWaiting || isReadOnly}
                  label={formatMessage({
                    id: 'reception.queue.visitRegistration.queueNo',
                  })}
                  formatter={value => {
                    const isNaN = Number.isNaN(parseFloat(value))
                    return isNaN
                      ? value
                      : parseFloat(value).toFixed(isQueueNoDecimal ? 1 : 0)
                  }}
                />
              )}
            />
          </div>
        </GridItem>
        {/* <Field
              name='isForInvoiceReplacement'
              render={args => (
                <Checkbox
                  style={{ position: 'relative', top: 16 }}
                  {...args}
                  disabled={notWaiting || isReadOnly}
                  tooltip='This visit is created for past invoice replacement.'
                  label='For Invoice Replacement'
                  onChange={handleIsForInvoiceReplacementChange}
                />
              )}
            />
          </GridItem> */}

        <GridItem xs md={2}>
          <Field
            name={FormField['visit.roomFK']}
            render={args => (
              <CodeSelect
                disabled={notWaiting || isReadOnly}
                label={formatMessage({
                  id: 'reception.queue.visitRegistration.room',
                })}
                code='ctRoom'
                {...args}
              />
            )}
          />
        </GridItem>
        {/* <GridItem xs md={3}>
          <Field
            name={FormField['visit.visitOrderTemplateFK']}
            render={args => {
              return (
                <Select
                  options={getAvailableOrderTemplate()}
                  label={formatMessage({
                    id: 'reception.queue.visitRegistration.visitOrderTemplate',
                  })}
                  {...args}
                  dropdownStyle={{ width: 500 }}
                  dropdownMatchSelectWidth={false}
                  authority='none'
                  disabled={notWaiting || isReadOnly}
                  onChange={(e, opts) =>
                    handleVisitOrderTemplateChange(visitType, opts)
                  }
                  renderDropdown={option => {
                    const copayers = _.orderBy(
                      option.visitOrderTemplate_Copayers.map(
                        x => x.copayerName,
                      ),
                      data => data.toLowerCase(),
                      'asc',
                    ).join(', ')
                    const tooltip = (
                      <div>
                        <div>{option.name}</div>
                        {(option.visitOrderTemplate_Copayers || []).length >
                          0 && <div>Co-Payer(s): {copayers}</div>}
                        {(option.visitOrderTemplate_Copayers || []).length ===
                          0 && (
                          <div>
                            <i>General</i>
                          </div>
                        )}
                      </div>
                    )
                    return (
                      <Tooltip placement='right' title={tooltip}>
                        <div>
                          <div
                            style={{
                              fontWeight: '550',
                              width: '100%',
                              textOverflow: 'ellipsis',
                              overflow: 'hidden',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {option.name}
                          </div>
                          {(option.visitOrderTemplate_Copayers || []).length >
                            0 && (
                            <div
                              style={{
                                width: '100%',
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              <span>Co-Payer(s): </span>
                              <span style={{ color: '#4255bd' }}>
                                {copayers}
                              </span>
                            </div>
                          )}
                          {(option.visitOrderTemplate_Copayers || []).length ===
                            0 && (
                            <div
                              style={{
                                width: '100%',
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              <span style={{ color: 'green' }}>
                                <i>General</i>
                              </span>
                            </div>
                          )}
                        </div>
                      </Tooltip>
                    )
                  }}
                />
              )
            }}
          />
        </GridItem>
        <GridItem xs md={3}>
          <Field
            name={FormField['visit.VisitOrderTemplateTotal']}
            validate={validateTotalCharges}
            render={args => {
              const { form: fm } = args
              const readOnly = (fm.values.visitOrderTemplateFK || 0) <= 0
              return (
                <NumberInput
                  {...args}
                  currency
                  authority='none'
                  suffix='$'
                  disabled={readOnly || notWaiting || isReadOnly}
                  label={formatMessage({
                    id:
                      'reception.queue.visitRegistration.visitOrderTotalCharge',
                  })}
                />
              )
            }}
          />
        </GridItem> */}
        <GridItem xs md={2}>
          <Authorized authority='queue.modifyconsultationready'>
            <Field
              name={FormField['visit.consReady']}
              render={args => (
                <Switch
                  className={classes.switchContainer}
                  label={formatMessage({
                    id: 'reception.queue.visitRegistration.consReady',
                  })}
                  tooltip='Ready for Consultaton'
                  disabled={
                    (disableConsReady &&
                      disableConsReady.rights === 'Disable') ||
                    isReadOnly
                  }
                  {...args}
                />
              )}
            />
          </Authorized>
        </GridItem>
        <GridItem xs md={6}>
          <div style={{ position: 'relative' }}>
            <Field
              name={FormField['visit.visitRemarks']}
              render={args => (
                <TextField
                  {...args}
                  multiline
                  rowsMax={3}
                  authority='none'
                  disabled={isReadOnly}
                  label={formatMessage({
                    id: 'reception.queue.visitRegistration.visitRemarks',
                  })}
                />
              )}
            />
            <CannedTextButton
              disabled={isReadOnly}
              cannedTextTypeFK={CANNED_TEXT_TYPE.APPOINTMENTREMARKS}
              style={{
                position: 'absolute',
                bottom: 0,
                right: -5,
              }}
              handleSelectCannedText={cannedText => {
                const remarks = values.visitRemarks
                const newRemaks = `${
                  remarks ? remarks + '\n' : ''
                }${cannedText.text || ''}`.substring(0, 2000)
                setFieldValue(FormField['visit.visitRemarks'], newRemaks)
              }}
            />
          </div>
        </GridItem>
        <GridItem xs md={3}></GridItem>
        <GridItem xs md={3}>
          <Fragment></Fragment>
        </GridItem>
        {/* <GridItem xs md={12}>
          <AttachmentWithThumbnail
            label='Attachment'
            attachmentType='Visit'
            handleUpdateAttachments={handleUpdateAttachments}
            attachments={attachments}
            isReadOnly={isReadOnly}
            disableScanner={isReadOnly}
            fieldName='visitAttachment'
          />
        </GridItem> */}
        {values.visitStatus === VISIT_STATUS.WAITING && hasCOR && (
          <GridItem xs md={12}>
            <div style={{ color: 'red', padding: '10px 0' }}>
              <strong>*Information</strong>:{' '}
              {`${activeCORCreatedBy} is
              occupying this visit, Visit Type is not able to change.`}
            </div>
          </GridItem>
        )}
      </GridContainer>
    </CommonCard>
  )
}

export default memo(
  withStyles(styles, { name: 'VisitInfoCard' })(VisitInfoCard),
)
