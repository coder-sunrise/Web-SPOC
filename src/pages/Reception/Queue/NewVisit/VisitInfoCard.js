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
import { roundTo, getMappedVisitType } from '@/utils/utils'
import numeral from 'numeral'
import FormField from './formField'
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
  setFieldValue,
  ctinvoiceadjustment,
  copaymentScheme,
  patientInfo,
  clinicSettings,
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

  const handleDoctorChange = (v, op) => {
    if (op.clinicianProfile) {
      if (!op.clinicianProfile.specialtyFK) {
        setFieldValue(FormField['visit.isDoctorInCharge'], true)
      }
    } else {
      setFieldValue(FormField['visit.isDoctorInCharge'], true)
    }
  }

  const handleVisitTypeChange = (v, op) => {
    const { values, dispatch } = restProps
    setFieldValue(FormField['visit.visitType'], v)
    if (v === VISIT_TYPE.OTC) {
      setFieldValue(FormField['visit.consReady'], false)
    }
    setFieldValue(FormField['visit.isDoctorInCharge'], true)
  }

  const handleIsForInvoiceReplacementChange = v => {
    const { values } = restProps
  }

  const { values, dispatch } = restProps
  const { visitTypeSetting, isQueueNoDecimal } = clinicSettings.settings
  const notWaiting =
    (values.visitStatus !== VISIT_STATUS.WAITING &&
      values.visitStatus !== VISIT_STATUS.UPCOMING_APPT) ||
    visitMode === 'view'

  const roomDisabled =
    values.visitStatus === VISIT_STATUS.IN_CONS || visitMode === 'view'
  const hasCOR = values.clinicalObjectRecordFK
  const activeCORCreatedBy = values.activeCORCreatedBy
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
                disabled={roomDisabled || isReadOnly}
                label={formatMessage({
                  id: 'reception.queue.visitRegistration.room',
                })}
                code='ctRoom'
                {...args}
              />
            )}
          />
        </GridItem>
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
        <GridItem xs md={10}>
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
                bottom: 5,
                right: -10,
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
