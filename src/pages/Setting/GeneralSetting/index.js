import React, { PureComponent, useEffect } from 'react'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'

import { getBizSession } from '@/services/queue'

import Yup from '@/utils/yup'
import {
  currencies,
  currencyRounding,
  currencyRoundingToTheClosest,
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
} from '@/components'
import WarningSnackbar from './WarningSnackbar'
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
      clinicSettings.entity.ShowConsultationVersioning
    ) {
      const { ShowConsultationVersioning } = clinicSettings.entity
      return {
        ...clinicSettings.entity,
        ShowConsultationVersioning: {
          ...ShowConsultationVersioning,
          settingValue: ShowConsultationVersioning.settingValue === 'true',
        },
      }
    }
    return clinicSettings.entity
  },

  handleSubmit: (values, { props }) => {
    const {
      SystemCurrency,
      CurrencyRounding,
      CurrencyRoundingToTheClosest,
      ShowConsultationVersioning,
    } = values

    const payload = [
      {
        ...SystemCurrency,
      },
      {
        ...CurrencyRounding,
      },
      {
        ...CurrencyRoundingToTheClosest,
      },
      {
        ...ShowConsultationVersioning,
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
    hasActiveSession: true,
  }

  componentDidMount = () => {
    this.checkHasActiveSession()
    this.props.dispatch({
      type: 'clinicSettings/query',
    })
  }

  checkHasActiveSession = async () => {
    const result = await getBizSession()
    const { data } = result.data
    // let data = []
    if (!data || data.length === 0) {
      this.setState((prevState) => {
        return {
          hasActiveSession: !prevState.hasActiveSession,
        }
      })
    }
  }

  render () {
    const {
      classes,
      clinicSettings,
      dispatch,
      theme,
      handleSubmit,
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
                name='SystemCurrency.settingValue'
                render={(args) => (
                  <Select
                    label='System Currency'
                    {...args}
                    options={currencies}
                    disabled
                  />
                )}
              />
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem md={3}>
              <Field
                name='CurrencyRounding.settingValue'
                render={(args) => (
                  <Select
                    label='Currency Rounding'
                    options={currencyRounding}
                    {...args}
                    disabled={!!hasActiveSession}
                  />
                )}
              />
            </GridItem>

            <GridItem md={3}>
              <Field
                name='CurrencyRoundingToTheClosest.settingValue'
                render={(args) => (
                  <Select
                    label='To The Closest'
                    options={currencyRoundingToTheClosest}
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
                name='ShowConsultationVersioning.settingValue'
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

          <div
            className={classes.actionBtn}
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <Button
              color='danger'
              onClick={navigateDirtyCheck('/setting')}
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
