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
  Checkbox,
  withFormikExtend,
  FastField,
  Field,
  PictureUpload,
  GridContainer,
  GridItem,
  CardContainer,
  Transition,
  TextField,
  AntdInput,
  Select,
  Accordion,
  Button,
  CommonTableGrid,
  DatePicker,
  NumberInput,
} from '@/components'
import WarningSnackbar from './WarningSnackbar'

const styles = (theme) => ({
  ...basicStyle(theme),
})

@connect(({ settingGeneral }) => ({
  settingGeneral,
}))
@withFormikExtend({
  // mapPropsToValues: ({ settingGeneral }) => {
  //   console.log(settingGeneral)
  //   return settingGeneral.entity
  //     ? settingGeneral.entity
  //     : settingGeneral.default
  // },

  handleSubmit: () => {},
  displayName: 'GeneralSettingInfo',
})
class GeneralSetting extends PureComponent {
  state = {
    hasActiveSession: true,
  }

  componentDidMount = () => {
    this.checkHasActiveSession()
    this.props
      .dispatch({
        type: 'settingGeneral/query',
      })
      .then((v) => {
        const { setFieldValue } = this.props
        if (v) {
          v.map((o, i) => {
            switch (i) {
              case 0: {
                return setFieldValue('systemCurrency', o.settingValue)
              }
              case 1: {
                return setFieldValue('currencyRounding', o.settingValue)
              }
              case 2: {
                return setFieldValue('roundingToTheClosest', o.settingValue)
              }
              default: {
                return undefined
              }
            }
          })
        }
      })
  }

  checkHasActiveSession = async () => {
    const result = await getActiveSession()
    const { data } = result.data
    // data = false
    this.setState({
      hasActiveSession: !!data,
    })
  }

  render () {
    const {
      classes,
      generalSettingInfo,
      dispatch,
      theme,
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
                name='systemCurrency'
                render={(args) => (
                  <Select
                    label='System Currency'
                    {...args}
                    options={currencies}
                    disabled={!!hasActiveSession}
                  />
                )}
              />
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem md={3}>
              <Field
                name='currencyRounding'
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
                name='roundingToTheClosest'
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
              onClick={() => {
                this.props.handleSubmit
              }}
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
