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
        autoRefresh,
        defaultVisitType,
        autoPrintDrugLabelOnFinalize,
        autoPrintDrugLabelOnSignOff,
        autoPrintDrugLabelOnCompletePayment,
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

  render() {
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
              <span>Auto Print Drug Label</span>
            </GridItem>
            <GridItem md={2}>
              <Field
                name='autoPrintDrugLabelOnFinalize.settingValue'
                render={(args) => (
                  <Checkbox
                    label='Finalize'
                    {...args}
                    disabled={!!hasActiveSession}
                  />
                )}
              />
            </GridItem>
            <GridItem md={2}>
              <Field
                name='autoPrintDrugLabelOnSignOff.settingValue'
                render={(args) => (
                  <Checkbox
                    label='Sign Off'
                    {...args}
                    disabled={!!hasActiveSession}
                  />
                )}
              />
            </GridItem>

            <GridItem md={2}>
              <Field
                name='autoPrintDrugLabelOnCompletePayment.settingValue'
                render={(args) => (
                  <Checkbox
                    label='Complete Payment'
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
