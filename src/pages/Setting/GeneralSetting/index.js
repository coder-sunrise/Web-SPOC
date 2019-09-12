import React, { PureComponent, useEffect } from 'react'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'

import { getActiveSession } from '@/pages/Reception/Queue/services'
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
} from '@/components'
import WarningSnackbar from './WarningSnackbar'

const styles = (theme) => ({
  ...basicStyle(theme),
})

@connect(({ generalSetting }) => ({
  generalSetting,
}))
@withFormikExtend({
  enableReinitialize: true,

  mapPropsToValues: ({ generalSetting }) => {
    return generalSetting.setting
  },

  handleSubmit: (values, { props }) => {
    const {
      SystemCurrency,
      CurrencyRounding,
      CurrencyRoundingToTheClosest,
    } = values

    const payload = [
      {
        settingKey: 'SystemCurrency',
        settingValue: SystemCurrency,
      },
      {
        settingKey: 'CurrencyRounding',
        settingValue: CurrencyRounding,
      },
      {
        settingKey: 'CurrencyRoundingToTheClosest',
        settingValue: CurrencyRoundingToTheClosest,
      },
    ]
    const { dispatch, onConfirm, history } = props

    dispatch({
      type: 'generalSetting/upsert',
      payload,
    }).then(history.push('/setting'))
  },
  displayName: 'GeneralSettingInfo',
})
class GeneralSetting extends PureComponent {
  state = {
    hasActiveSession: true,
  }

  componentDidMount = () => {
    this.checkHasActiveSession()
    this.props.dispatch({
      type: 'generalSetting/getGeneralSetting',
    })
  }

  checkHasActiveSession = async () => {
    const result = await getActiveSession()
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
      generalSettingInfo,
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
                name='SystemCurrency'
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
                name='CurrencyRounding'
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
                name='CurrencyRoundingToTheClosest'
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

          <div
            className={classes.actionBtn}
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <Button
              color='danger'
              onClick={() => {
                this.props.history.push('/setting')
              }}
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
