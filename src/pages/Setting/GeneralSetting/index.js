import React, { PureComponent, useEffect } from 'react'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'

import { getBizSession } from '@/services/queue'

import Yup from '@/utils/yup'
import {
  currenciesList,
  currencyRoundingList,
  currencyRoundingToTheClosestList,
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
  WarningSnackbar,
  Checkbox,
} from '@/components'
import { navigateDirtyCheck } from '@/utils/utils'

const styles = (theme) => ({
  ...basicStyle(theme),
  boldText: {
    fontWeight: '700',
    marginTop: theme.spacing(1),
  },
  marginTop: {
    marginTop: theme.spacing(3),
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
        autoPrintReceiptOnCompletePayment } = clinicSettings.entity
      return {
        ...clinicSettings.entity,
        showConsultationVersioning: {
          ...showConsultationVersioning,
          settingValue: showConsultationVersioning.settingValue === 'true',
        },
        autoPrintDrugLabel: {
          ...autoPrintDrugLabel,
          settingValue: autoPrintDrugLabel.settingValue === 'true',
        },
        autoPrintOnSignOff: {
          ...autoPrintOnSignOff,
          settingValue: autoPrintOnSignOff.settingValue === 'true',
        },
        autoPrintDrugLabelOnSignOff: {
          ...autoPrintDrugLabelOnSignOff,
          settingValue: autoPrintDrugLabelOnSignOff.settingValue === 'true',
        },
        autoPrintMedicalCertificateOnSignOff: {
          ...autoPrintMedicalCertificateOnSignOff,
          settingValue: autoPrintMedicalCertificateOnSignOff.settingValue === 'true',
        },
        autoPrintCertificateOfAttendanceOnSignOff: {
          ...autoPrintCertificateOfAttendanceOnSignOff,
          settingValue: autoPrintCertificateOfAttendanceOnSignOff.settingValue === 'true',
        },
        autoPrintReferralLetterOnSignOff: {
          ...autoPrintReferralLetterOnSignOff,
          settingValue: autoPrintReferralLetterOnSignOff.settingValue === 'true',
        },
        autoPrintMemoOnSignOff: {
          ...autoPrintMemoOnSignOff,
          settingValue: autoPrintMemoOnSignOff.settingValue === 'true',
        },
        autoPrintVaccinationCertificateOnSignOff: {
          ...autoPrintVaccinationCertificateOnSignOff,
          settingValue: autoPrintVaccinationCertificateOnSignOff.settingValue === 'true',
        },
        autoPrintOtherDocumentsOnSignOff: {
          ...autoPrintOtherDocumentsOnSignOff,
          settingValue: autoPrintOtherDocumentsOnSignOff.settingValue === 'true',
        },
        autoPrintOnCompletePayment: {
          ...autoPrintOnCompletePayment,
          settingValue: autoPrintOnCompletePayment.settingValue === 'true',
        },
        autoPrintDrugLabelOnCompletePayment: {
          ...autoPrintDrugLabelOnCompletePayment,
          settingValue: autoPrintDrugLabelOnCompletePayment.settingValue === 'true',
        },
        autoPrintInvoiceOnCompletePayment: {
          ...autoPrintInvoiceOnCompletePayment,
          settingValue: autoPrintInvoiceOnCompletePayment.settingValue === 'true',
        },
        autoPrintReceiptOnCompletePayment: {
          ...autoPrintReceiptOnCompletePayment,
          settingValue: autoPrintReceiptOnCompletePayment.settingValue === 'true',
        },
      }
    }
    return clinicSettings.entity
  },

  handleSubmit: (values, { props }) => {
    const {
      systemCurrency,
      currencyRounding,
      currencyRoundingToTheClosest,
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
    } = values

    const payload = [
      {
        ...systemCurrency,
      },
      {
        ...currencyRounding,
      },
      {
        ...currencyRoundingToTheClosest,
      },
      {
        ...showConsultationVersioning,
      },
      {
        ...autoPrintDrugLabel,
      },
      {
        ...autoPrintOnSignOff,
      },
      {
        ...autoPrintDrugLabelOnSignOff,
      },
      {
        ...autoPrintMedicalCertificateOnSignOff,
      },
      {
        ...autoPrintCertificateOfAttendanceOnSignOff,
      },
      {
        ...autoPrintReferralLetterOnSignOff,
      },
      {
        ...autoPrintMemoOnSignOff,
      },
      {
        ...autoPrintVaccinationCertificateOnSignOff,
      },
      {
        ...autoPrintOtherDocumentsOnSignOff,
      },
      {
        ...autoPrintOnCompletePayment,
      },
      {
        ...autoPrintDrugLabelOnCompletePayment,
      },
      {
        ...autoPrintInvoiceOnCompletePayment,
      },
      {
        ...autoPrintReceiptOnCompletePayment,
      },
    ]
    const { dispatch, onConfirm, history } = props

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
    // const { hasActiveSession } = this.state
    let hasActiveSession = false
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
            {/* <GridItem md={3}>
              <Field
                name='.settingValue'
                render={(args) => (
                  <Select
                    label='To The Closest'
                    options={currencyRoundingToTheClosest}
                    {...args}
                    disabled={!!hasActiveSession}
                  />
                )}
              />
            </GridItem> */}
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
              <h5 className={classes.boldText}>Auto Print</h5>
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem md={3} className={classes.marginTop}>
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
          <GridContainer className={classes.marginTop}>
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
