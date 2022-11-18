import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'

import { getBizSession } from '@/services/queue'
import Yup from '@/utils/yup'

import {
  currenciesList,
  currencyRoundingList,
  currencyRoundingToTheClosestList,
  labelPrinterList,
  ReportsOnSignOff,
  ReportsOnCompletePayment,
} from '@/utils/codes'

import {
  withFormikExtend,
  Field,
  GridContainer,
  GridItem,
  CardContainer,
  Select,
  Button,
  Switch,
  Checkbox,
  CheckboxGroup,
  WarningSnackbar,
  NumberInput,
  CodeSelect,
  TextField,
} from '@/components'
import { navigateDirtyCheck, getMappedVisitType } from '@/utils/utils'
import {
  hourOptions,
  minuteOptions,
} from '@/pages/Reception/Appointment/components/form/ApptDuration'
import { bool } from 'prop-types'

const styles = theme => ({
  ...basicStyle(theme),
  boldText: {
    fontWeight: '700',
    marginTop: theme.spacing(1),
  },
  marginTop: {
    marginTop: theme.spacing(1),
  },
})

@connect(({ clinicSettings, codetable }) => ({
  clinicSettings,
  codetable: codetable,
}))
@withFormikExtend({
  enableReinitialize: true,

  mapPropsToValues: ({ clinicSettings }) => {
    if (
      clinicSettings.entity &&
      clinicSettings.entity.showConsultationVersioning
    ) {
      const {
        showConsultationVersioning,
        isVisitReferralSourceMandatory,
        autoPrintOnSignOff,
        autoPrintOnCompletePayment,
        autoRefresh,
        defaultVisitType,
        showTotalInvoiceAmtInConsultation,
        autoPrintReportsOnCompletePayment,
        autoPrintReportsOnSignOff,
        isBackdatedClinicalNotesEntry,
      } = clinicSettings.entity

      return {
        ...clinicSettings.entity,
        defaultVisitType: {
          ...defaultVisitType,
          settingValue: Number(defaultVisitType.settingValue),
        },
        autoRefresh: {
          ...autoRefresh,
          settingValue: autoRefresh.settingValue === 'true',
        },
        showConsultationVersioning: {
          ...showConsultationVersioning,
          settingValue: showConsultationVersioning.settingValue === 'true',
        },
        isVisitReferralSourceMandatory: {
          ...isVisitReferralSourceMandatory,
          settingValue: isVisitReferralSourceMandatory.settingValue === 'true',
        },
        autoPrintOnSignOff: {
          ...autoPrintOnSignOff,
          settingValue:
            autoPrintOnSignOff && autoPrintOnSignOff.settingValue === 'true',
        },
        autoPrintOnCompletePayment: {
          ...autoPrintOnCompletePayment,
          settingValue:
            autoPrintOnCompletePayment &&
            autoPrintOnCompletePayment.settingValue === 'true',
        },
        showTotalInvoiceAmtInConsultation: {
          ...showTotalInvoiceAmtInConsultation,
          settingValue:
            showTotalInvoiceAmtInConsultation.settingValue === 'true',
        },
        autoPrintReportsOnCompletePayment: {
          ...autoPrintReportsOnCompletePayment,
          settingValue: autoPrintReportsOnCompletePayment.settingValue.split(
            ',',
          ),
        },
        autoPrintReportsOnSignOff: {
          ...autoPrintReportsOnSignOff,
          settingValue: autoPrintReportsOnSignOff.settingValue.split(','),
        },
        isBackdatedClinicalNotesEntry: {
          ...isBackdatedClinicalNotesEntry,
          settingValue:
            isBackdatedClinicalNotesEntry &&
            isBackdatedClinicalNotesEntry.settingValue === 'true',
        },
      }
    }
    return clinicSettings.entity
  },

  handleSubmit: (values, { props }) => {
    const { dispatch, history } = props
    const payload = Object.keys(values).map(o => {
      if (
        o === 'autoPrintReportsOnCompletePayment' ||
        o === 'autoPrintReportsOnSignOff'
      ) {
        return {
          ...values[o],
          settingValue: values[o].settingValue.join(','),
        }
      }
      return values[o]
    })

    dispatch({
      type: 'clinicSettings/upsert',
      payload,
    }).then(r => {
      if (r) {
        history.push('/setting')
        dispatch({
          type: 'clinicSettings/query',
        })
      }
    })
  },
  displayName: 'clinicSettings',
})
class GeneralSetting extends PureComponent {
  state = {
    hasActiveSession: false,
    autoPrintOnSignOff: false,
    autoPrintOnCompletePayment: false,
    isBackdatedClinicalNotesEntry: false,
  }

  componentDidMount = () => {
    this.checkHasActiveSession()
    this.props
      .dispatch({
        type: 'clinicSettings/query',
      })
      .then(r => {
        this.setState({
          autoPrintOnSignOff:
            r?.find(setting => setting.settingKey === 'AutoPrintOnSignOff')
              .settingValue === 'true',
          isBackdatedClinicalNotesEntry:
            r?.find(
              setting => setting.settingKey === 'IsBackdatedClinicalNotesEntry',
            ).settingValue === 'true',
          autoPrintOnCompletePayment:
            r?.find(
              setting => setting.settingKey === 'AutoPrintOnCompletePayment',
            ).settingValue === 'true',
        })
      })
  }

  checkHasActiveSession = async () => {
    const bizSessionPayload = {
      IsClinicSessionClosed: false,
    }
    const result = await getBizSession(bizSessionPayload)
    const { data } = result.data

    this.setState(() => {
      return {
        hasActiveSession: data.length > 0,
      }
    })
  }

  autoPrintOnSignOffChanged = (checked, e) => {
    const { values } = this.props
    if (!checked) {
      const { autoPrintReportsOnSignOff } = values
      autoPrintReportsOnSignOff.settingValue = []
    }
    this.setState(() => {
      return {
        autoPrintOnSignOff: checked,
      }
    })
  }
  isBackdatedClinicalNotesEntryChanged = (checked, e) => {
    this.setState(() => {
      return {
        isBackdatedClinicalNotesEntry: checked,
      }
    })
  }

  autoPrintOnCompletePaymentChanged = (checked, e) => {
    const { values } = this.props
    if (!checked) {
      const { autoPrintReportsOnCompletePayment } = values
      autoPrintReportsOnCompletePayment.settingValue = []
    }
    this.setState(() => {
      return {
        autoPrintOnCompletePayment: checked,
      }
    })
  }

  calcApptDuration = durationMinutes => {
    const apptDurationHour = Math.floor(durationMinutes / 60)
    const apptDurationMinute = durationMinutes % 60
    return { apptDurationHour, apptDurationMinute }
  }

  setApptDurationH = (setFieldValue, durationMinutes, hour) => {
    const { apptDurationHour, apptDurationMinute } = this.calcApptDuration(
      durationMinutes,
    )
    const newValue = apptDurationMinute + hour * 60
    setFieldValue('apptTimeSlotDuration.settingValue', newValue)
  }

  setApptDurationM = (setFieldValue, durationMinutes, minute) => {
    const { apptDurationHour, apptDurationMinute } = this.calcApptDuration(
      durationMinutes,
    )
    const newValue = apptDurationHour * 60 + minute
    setFieldValue('apptTimeSlotDuration.settingValue', newValue)
  }

  appointmentTimeslotSetupPropsChange = () => {
    const apptTimeRulerExtent =
      this.props.values?.apptTimeRulerExtent?.settingValue || 1400
    const apptTimeIntervel =
      this.props.values?.apptTimeIntervel?.settingValue || 15
    const apptTimeSlotDuration =
      this.props.values?.apptTimeSlotDuration?.settingValue || 15

    const isDefaultSetting = !(
      apptTimeRulerExtent != 1400 ||
      apptTimeIntervel != 15 ||
      apptTimeSlotDuration != 15
    )
    return isDefaultSetting
  }

  setApptTimeslotSettingsDefault = e => {
    const { setFieldValue } = this.props
    if (e.target.value) {
      setFieldValue('apptTimeRulerExtent.settingValue', 1400)
      setFieldValue('apptTimeIntervel.settingValue', 15)
      setFieldValue('apptTimeSlotDuration.settingValue', 15)
    }
  }

  render() {
    const {
      classes,
      clinicSettings,
      dispatch,
      theme,
      handleSubmit,
      values,
      codetable,
      ...restProps
    } = this.props

    const { visitTypeSetting } = clinicSettings.settings
    const { ctvisitpurpose = [] } = codetable
    const {
      hasActiveSession,
      autoPrintOnSignOff,
      autoPrintOnCompletePayment,
      isBackdatedClinicalNotesEntry,
    } = this.state
    const durationMinutes = values?.apptTimeSlotDuration?.settingValue || 15
    const { apptDurationHour, apptDurationMinute } = this.calcApptDuration(
      durationMinutes,
    )
    const isApptDefaultSetting = this.appointmentTimeslotSetupPropsChange()
    return (
      <React.Fragment>
        {hasActiveSession && (
          <div style={{ paddingTop: 5 }}>
            <WarningSnackbar
              variant='warning'
              className={classes.margin}
              message='Active Session detected!'
            />
          </div>
        )}
        <CardContainer hideHeader>
          <GridContainer>
            <GridItem md={3}>
              <Field
                name='locale.settingValue'
                render={args => (
                  <Select
                    label='System Currency'
                    {...args}
                    options={currenciesList}
                    disabled
                  />
                )}
              />
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem md={3}>
              <Field
                name='currencyRounding.settingValue'
                render={args => (
                  <Select
                    label='Currency Rounding'
                    options={currencyRoundingList}
                    {...args}
                    disabled={!!hasActiveSession}
                  />
                )}
              />
            </GridItem>

            <GridItem md={3}>
              <Field
                name='currencyRoundingToTheClosest.settingValue'
                render={args => (
                  <Select
                    label='To The Closest'
                    options={currencyRoundingToTheClosestList}
                    {...args}
                    disabled={!!hasActiveSession}
                  />
                )}
              />
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem md={3} sm={6} xs={12}>
              <Field
                name='showConsultationVersioning.settingValue'
                render={args => (
                  <Switch
                    label='Show Consultation Versioning'
                    {...args}
                    disabled={!!hasActiveSession}
                  />
                )}
              />
            </GridItem>
            {false && (
              <GridItem md={3} sm={6} xs={12}>
                <Field
                  name='autoRefresh.settingValue'
                  render={args => (
                    <Switch
                      label='Queue Listing Auto Refresh'
                      {...args}
                      disabled={!!hasActiveSession}
                    />
                  )}
                />
              </GridItem>
            )}
            <GridItem md={3} sm={6} xs={12}>
              <Field
                name='isVisitReferralSourceMandatory.settingValue'
                render={args => (
                  <Switch
                    label='Referral Source Mandatory'
                    {...args}
                    disabled={!!hasActiveSession}
                  />
                )}
              />
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem md={2} style={{ margin: 0 }}>
              <Field
                name='defaultVisitType.settingValue'
                render={args => (
                  <CodeSelect
                    label='Default Visit Type'
                    {...args}
                    options={ctvisitpurpose || []}
                    disabled={!!hasActiveSession}
                    allowClear={false}
                  />
                )}
              />
            </GridItem>
            <GridItem md={2} style={{ margin: 0 }}>
              <Field
                name='labelPrinterSize.settingValue'
                render={args => (
                  <Select
                    label='Label Printer Size'
                    options={labelPrinterList}
                    {...args}
                    disabled={!!hasActiveSession}
                    allowClear={false}
                  />
                )}
              />
            </GridItem>
            <GridItem md={2} style={{ margin: 0 }}>
              <Field
                name='showTotalInvoiceAmtInConsultation.settingValue'
                render={args => (
                  <Switch
                    label='Show Total Invoice Amount In Consultation'
                    {...args}
                    disabled={!!hasActiveSession}
                  />
                )}
              />
            </GridItem>
          </GridContainer>
          <GridContainer className={classes.marginTop}>
            <GridItem md={3}>
              <h5 className={classes.boldText}>Auto Print</h5>
            </GridItem>
          </GridContainer>
          <GridContainer style={{ display: 'none' }}>
            <GridItem md={3}>
              <h5> Finalize Order </h5>
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem md={3}>
              <h5> Consultation Sign Off</h5>
            </GridItem>
            <GridItem md={3}>
              <Field
                name='autoPrintOnSignOff.settingValue'
                render={args => (
                  <Switch
                    {...args}
                    style={{ marginTop: 0 }}
                    disabled={!!hasActiveSession}
                    onChange={this.autoPrintOnSignOffChanged}
                  />
                )}
              />
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem md={12}>
              <Field
                name='autoPrintReportsOnSignOff.settingValue'
                render={args => {
                  return (
                    <CheckboxGroup
                      valueField='code'
                      textField='description'
                      disabled={!!hasActiveSession || !autoPrintOnSignOff}
                      options={ReportsOnSignOff}
                      noUnderline
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem md={3}>
              <h5>Complete Payment</h5>
            </GridItem>
            <GridItem md={3}>
              <Field
                name='autoPrintOnCompletePayment.settingValue'
                render={args => (
                  <Switch
                    {...args}
                    style={{ marginTop: 0 }}
                    disabled={!!hasActiveSession}
                    onChange={this.autoPrintOnCompletePaymentChanged}
                  />
                )}
              />
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem md={12}>
              <Field
                name='autoPrintReportsOnCompletePayment.settingValue'
                render={args => {
                  return (
                    <CheckboxGroup
                      disabled={
                        !!hasActiveSession || !autoPrintOnCompletePayment
                      }
                      valueField='code'
                      textField='description'
                      options={ReportsOnCompletePayment}
                      noUnderline
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem md={3}>
              <h5>Appointment Timeslot setup</h5>
              <Field
                name='apptDefaultSettingsCheckbox'
                render={args => {
                  return (
                    <Checkbox
                      label='Use System Default Setting'
                      mode='default'
                      disabled={!!hasActiveSession}
                      checked={isApptDefaultSetting}
                      onChange={this.setApptTimeslotSettingsDefault}
                    />
                  )
                }}
              />
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem md={2}>
              <Field
                name='apptTimeRulerExtent.settingValue'
                render={args => (
                  <TextField
                    label='Appointment Time Grid Height (PIXELS)'
                    {...args}
                    disabled={!!hasActiveSession}
                  />
                )}
              />
            </GridItem>
            <GridItem md={2}>
              <Field
                name='apptTimeIntervel.settingValue'
                render={args => (
                  <TextField
                    label='Appointment Time Grid Interval (MINS)'
                    {...args}
                    disabled={!!hasActiveSession}
                  />
                )}
              />
            </GridItem>
            <GridContainer>
              <GridItem md={2}>
                <h5 style={{ color: '#AAA' }}>Appointment Duration</h5>
              </GridItem>
              <GridContainer>
                <GridItem md={1}>
                  <Field
                    name='apptTimeSlotDuration.settingValue'
                    render={args => (
                      <Select
                        allowClear={false}
                        label='Hours'
                        options={hourOptions}
                        value={apptDurationHour}
                        onChange={value =>
                          this.setApptDurationH(
                            this.props.setFieldValue,
                            durationMinutes,
                            value,
                          )
                        }
                        disabled={!!hasActiveSession}
                      />
                    )}
                  />
                </GridItem>
                <GridItem md={1}>
                  <Field
                    name='apptTimeSlotDuration.settingValue'
                    render={args => (
                      <Select
                        allowClear={false}
                        label='Minutes'
                        options={minuteOptions}
                        value={apptDurationMinute}
                        onChange={value =>
                          this.setApptDurationM(
                            this.props.setFieldValue,
                            durationMinutes,
                            value,
                          )
                        }
                        disabled={!!hasActiveSession}
                      />
                    )}
                  />
                </GridItem>
              </GridContainer>
            </GridContainer>
          </GridContainer>
          <GridContainer style={{ marginTop: 20 }}>
            <GridItem md={3}>
              <h5> Backdated Clinical Notes Entry</h5>
            </GridItem>
            <GridItem md={3}>
              <Field
                name='isBackdatedClinicalNotesEntry.settingValue'
                render={args => (
                  <Switch
                    {...args}
                    style={{ marginTop: 0 }}
                    disabled={!!hasActiveSession}
                    onChange={this.isBackdatedClinicalNotesEntryChanged}
                  />
                )}
              />
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem md={2}>
              <Field
                name='backdatedClinicalNotesEntryStudent.settingValue'
                render={args => (
                  <NumberInput
                    label='Maximum Backdated Days(s) for Student'
                    {...args}
                    step={1}
                    min={0}
                    precision={0}
                    max={9999}
                    disabled={
                      !!hasActiveSession || !isBackdatedClinicalNotesEntry
                    }
                  />
                )}
              />
            </GridItem>
            <GridItem md={2}>
              <Field
                name='backdatedClinicalNotesEntryOptometrist.settingValue'
                render={args => (
                  <NumberInput
                    step={1}
                    precision={0}
                    min={0}
                    max={9999}
                    label='Maximum Backdated Days(s) for Optometrist'
                    {...args}
                    disabled={
                      !!hasActiveSession || !isBackdatedClinicalNotesEntry
                    }
                  />
                )}
              />
            </GridItem>
          </GridContainer>
          <div
            className={classes.actionBtn}
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <Button
              color='danger'
              onClick={navigateDirtyCheck({
                redirectUrl: '/setting',
              })}
              disabled={hasActiveSession}
            >
              Cancel
            </Button>

            <Button
              color='primary'
              onClick={handleSubmit}
              disabled={hasActiveSession}
            >
              Save
            </Button>
          </div>
        </CardContainer>
      </React.Fragment>
    )
  }
}

export default withStyles(styles, { withTheme: true })(GeneralSetting)
