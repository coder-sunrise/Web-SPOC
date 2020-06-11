import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'

import { getBizSession } from '@/services/queue'

import {
  currenciesList,
  currencyRoundingList,
  currencyRoundingToTheClosestList,
  labelPrinterList,
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
  WarningSnackbar,
  CodeSelect,
} from '@/components'
import { navigateDirtyCheck } from '@/utils/utils'

const styles = (theme) => ({
  ...basicStyle(theme),
  boldText: {
    fontWeight: '700',
    marginTop: theme.spacing(1),
  },
  marginTop: {
    marginTop: theme.spacing(1),
  },
})

@connect(({ clinicSettings }) => ({
  clinicSettings,
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
        autoPrintDrugLabel,
        autoPrintOnSignOff,
        autoPrintDrugLabelOnSignOff,
        autoPrintMedicalCertificateOnSignOff,
        autoPrintCertificateOfAttendanceOnSignOff,
        autoPrintReferralLetterOnSignOff,
        autoPrintMemoOnSignOff,
        autoPrintVaccinationCertificateOnSignOff,
        autoPrintOtherDocumentsOnSignOff,
        autoPrintOnCompletePayment,
        autoPrintDrugLabelOnCompletePayment,
        autoPrintInvoiceOnCompletePayment,
        autoPrintReceiptOnCompletePayment,
        autoRefresh,
        defaultVisitType,
        showTotalInvoiceAmtInConsultation,
        autoPrintDrugLabelOnFinalize,
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
        autoPrintDrugLabelOnFinalize: {
          ...autoPrintDrugLabelOnFinalize,
          settingValue:
            autoPrintDrugLabelOnFinalize && autoPrintDrugLabelOnFinalize.settingValue === 'true',
        },
        autoPrintDrugLabelOnCompletePayment: {
          ...autoPrintDrugLabelOnCompletePayment,
          settingValue:
            autoPrintDrugLabelOnCompletePayment && autoPrintDrugLabelOnCompletePayment.settingValue === 'true',
        },
        autoPrintDrugLabelOnSignOff: {
          ...autoPrintDrugLabelOnSignOff,
          settingValue:
            autoPrintDrugLabelOnSignOff && autoPrintDrugLabelOnSignOff.settingValue === 'true',
        },
        showConsultationVersioning: {
          ...showConsultationVersioning,
          settingValue: showConsultationVersioning.settingValue === 'true',
        },
        autoPrintOnSignOff: {
          ...autoPrintOnSignOff,
          settingValue: autoPrintOnSignOff && autoPrintOnSignOff.settingValue === 'true',
        },
        autoPrintDrugLabelOnSignOff: {
          ...autoPrintDrugLabelOnSignOff,
          settingValue: autoPrintDrugLabelOnSignOff && autoPrintDrugLabelOnSignOff.settingValue === 'true',
        },
        autoPrintMedicalCertificateOnSignOff: {
          ...autoPrintMedicalCertificateOnSignOff,
          settingValue: autoPrintMedicalCertificateOnSignOff && autoPrintMedicalCertificateOnSignOff.settingValue === 'true',
        },
        autoPrintCertificateOfAttendanceOnSignOff: {
          ...autoPrintCertificateOfAttendanceOnSignOff,
          settingValue: autoPrintCertificateOfAttendanceOnSignOff && autoPrintCertificateOfAttendanceOnSignOff.settingValue === 'true',
        },
        autoPrintReferralLetterOnSignOff: {
          ...autoPrintReferralLetterOnSignOff,
          settingValue: autoPrintReferralLetterOnSignOff && autoPrintReferralLetterOnSignOff.settingValue === 'true',
        },
        autoPrintMemoOnSignOff: {
          ...autoPrintMemoOnSignOff,
          settingValue: autoPrintMemoOnSignOff && autoPrintMemoOnSignOff.settingValue === 'true',
        },
        autoPrintVaccinationCertificateOnSignOff: {
          ...autoPrintVaccinationCertificateOnSignOff,
          settingValue: autoPrintVaccinationCertificateOnSignOff && autoPrintVaccinationCertificateOnSignOff.settingValue === 'true',
        },
        autoPrintOtherDocumentsOnSignOff: {
          ...autoPrintOtherDocumentsOnSignOff,
          settingValue: autoPrintOtherDocumentsOnSignOff && autoPrintOtherDocumentsOnSignOff.settingValue === 'true',
        },
        autoPrintOnCompletePayment: {
          ...autoPrintOnCompletePayment,
          settingValue: autoPrintOnCompletePayment && autoPrintOnCompletePayment.settingValue === 'true',
        },
        autoPrintDrugLabelOnCompletePayment: {
          ...autoPrintDrugLabelOnCompletePayment,
          settingValue: autoPrintDrugLabelOnCompletePayment && autoPrintDrugLabelOnCompletePayment.settingValue === 'true',
        },
        autoPrintInvoiceOnCompletePayment: {
          ...autoPrintInvoiceOnCompletePayment,
          settingValue: autoPrintInvoiceOnCompletePayment && autoPrintInvoiceOnCompletePayment.settingValue === 'true',
        },
        autoPrintReceiptOnCompletePayment: {
          ...autoPrintReceiptOnCompletePayment,
          settingValue: autoPrintReceiptOnCompletePayment && autoPrintReceiptOnCompletePayment.settingValue === 'true',
        },
        showTotalInvoiceAmtInConsultation: {
          ...showTotalInvoiceAmtInConsultation,
          settingValue: showTotalInvoiceAmtInConsultation.settingValue === 'true',
        },
      }
    }
    return clinicSettings.entity
  },

  handleSubmit: (values, { props }) => {
    const { dispatch, history } = props
    const payload = Object.keys(values).map((o) => values[o])

    dispatch({
      type: 'clinicSettings/upsert',
      payload,
    }).then((r) => {
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
  }

  componentDidMount = () => {
    this.checkHasActiveSession()
    this.props.dispatch({
      type: 'clinicSettings/query',
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

  render () {
    const {
      classes,
      clinicSettings,
      dispatch,
      theme,
      handleSubmit,
      values,
      ...restProps
    } = this.props
    const { hasActiveSession } = this.state
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
                render={(args) => (
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
                render={(args) => (
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
                render={(args) => (
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
            <GridItem md={3}>
              <Field
                name='showConsultationVersioning.settingValue'
                render={(args) => (
                  <Switch
                    label='Show Consultation Versioning'
                    {...args}
                    disabled={!!hasActiveSession}
                  />
                )}
              />
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem md={3}>
              <Field
                name='autoRefresh.settingValue'
                render={(args) => (
                  <Switch
                    label='Queue Listing Auto Refresh'
                    {...args}
                    disabled={!!hasActiveSession}
                  />
                )}
              />
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem md={12}>
              <span style={{ position: 'relative', color: 'rgba(0, 0, 0, 0.5)', display: 'inline-block', marginTop: 8 }}>Auto Print Drug Label</span>
            </GridItem>
            <GridItem md={2} style={{ margin: 0, marginTop: -10 }}>
              <Field
                name='defaultVisitType.settingValue'
                render={(args) => (
                  <CodeSelect
                    label='Default Visit Type'
                    {...args}
                    code='ctvisitpurpose'
                    disabled={!!hasActiveSession}
                    allowClear={false}
                  />
                )}
              />
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem md={3}>
              <Field
                name='labelPrinterSize.settingValue'
                render={(args) => (
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
          </GridContainer>
          <GridContainer>
            <GridItem md={3}>
              <Field
                name='showTotalInvoiceAmtInConsultation.settingValue'
                render={(args) => (
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
          <GridContainer>
            <GridItem md={3}>
              <h5> Finalize Order </h5>
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem md={3}>
              <Field
                name='autoPrintDrugLabel.settingValue'
                render={(args) => {
                  return (
                    <Checkbox
                      label='Drug Label'
                      labelPlacement='end'
                      mode='default'
                      disabled={!!hasActiveSession}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem md={3}>
              <h5> Consultation Sign Off</h5>
            </GridItem>
            <GridItem md={3}>
              <Field
                name='autoPrintOnSignOff.settingValue'
                render={(args) => (
                  <Switch
                    {...args}
                    style={{ marginTop: 0 }}
                    disabled={!!hasActiveSession}
                  />
                )}
              />
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem md={3}>
              <Field
                name='autoPrintDrugLabelOnSignOff.settingValue'
                render={(args) => {
                  return (
                    <Checkbox
                      label='Drug Label'
                      labelPlacement='end'
                      mode='default'
                      disabled={!!hasActiveSession}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem md={3}>
              <Field
                name='autoPrintMedicalCertificateOnSignOff.settingValue'
                render={(args) => {
                  return (
                    <Checkbox
                      label='Medical Certificate'
                      labelPlacement='end'
                      mode='default'
                      disabled={!!hasActiveSession}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem md={3}>
              <Field
                name='autoPrintCertificateOfAttendanceOnSignOff.settingValue'
                render={(args) => {
                  return (
                    <Checkbox
                      label='Certificate of Attendance'
                      labelPlacement='end'
                      mode='default'
                      disabled={!!hasActiveSession}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem md={3}>
              <Field
                name='autoPrintReferralLetterOnSignOff.settingValue'
                render={(args) => {
                  return (
                    <Checkbox
                      label='Referral Letter'
                      labelPlacement='end'
                      mode='default'
                      disabled={!!hasActiveSession}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem md={3}>
              <Field
                name='autoPrintMemoOnSignOff.settingValue'
                render={(args) => {
                  return (
                    <Checkbox
                      label='Memo'
                      labelPlacement='end'
                      mode='default'
                      disabled={!!hasActiveSession}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem md={3}>
              <Field
                name='autoPrintVaccinationCertificateOnSignOff.settingValue'
                render={(args) => {
                  return (
                    <Checkbox
                      label='Vaccination Certificate'
                      labelPlacement='end'
                      mode='default'
                      disabled={!!hasActiveSession}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem md={3}>
              <Field
                name='autoPrintOtherDocumentsOnSignOff.settingValue'
                render={(args) => {
                  return (
                    <Checkbox
                      label='Other Documents'
                      labelPlacement='end'
                      mode='default'
                      disabled={!!hasActiveSession}
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
                render={(args) => (
                  <Switch
                    {...args}
                    style={{ marginTop: 0 }}
                    disabled={!!hasActiveSession}
                  />
                )}
              />
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem md={3}>
              <Field
                name='autoPrintDrugLabelOnCompletePayment.settingValue'
                render={(args) => {
                  return (
                    <Checkbox
                      label='Drug Label'
                      labelPlacement='end'
                      mode='default'
                      disabled={!!hasActiveSession}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem md={3}>
              <Field
                name='autoPrintInvoiceOnCompletePayment.settingValue'
                render={(args) => {
                  return (
                    <Checkbox
                      label='Invoice'
                      labelPlacement='end'
                      mode='default'
                      disabled={!!hasActiveSession}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem md={3}>
              <Field
                name='autoPrintReceiptOnCompletePayment.settingValue'
                render={(args) => {
                  return (
                    <Checkbox
                      label='Receipt'
                      labelPlacement='end'
                      mode='default'
                      disabled={!!hasActiveSession}
                      {...args}
                    />
                  )
                }}
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
