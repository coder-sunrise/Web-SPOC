import React, { PureComponent, useEffect } from 'react'
import Yup from '@/utils/yup'
import { connect } from 'dva'
import { withStyles, Divider, InputAdornment } from '@material-ui/core'
import { getActiveSession } from '@/pages/Reception/Queue/services'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'
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

// import Address from '@/pages/PatientDatabase/Detail/Demographics/Address'

const styles = (theme) => ({
  ...basicStyle(theme),
})

@connect(({ settingGeneral }) => ({
  settingGeneral,
}))
@withFormikExtend({
  mapPropsToValues: ({ settingGeneral }) => {
    console.log(settingGeneral)
    return settingGeneral.entity
      ? settingGeneral.entity
      : settingGeneral.default
  },
  // validationSchema: Yup.object().shape({
  //   name: Yup.string().required(),
  //   address: Yup.object().shape({
  //     postcode: Yup.number().required(),
  //     countryFK: Yup.string().required(),
  //   }),
  // }),

  handleSubmit: () => {},
  displayName: 'GeneralSettingInfo',
})
class GeneralSetting extends PureComponent {
  state = {
    hasActiveSession: true,
  }

  componentDidMount () {
    this.checkHasActiveSession()
  }

  checkHasActiveSession = async () => {
    const result = await getActiveSession()
    const { data } = result.data

    this.setState({
      hasActiveSession: data ? true : false,
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
                  disabled={hasActiveSession ? true : false}
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
                  disabled={hasActiveSession ? true : false}
                />
              )}
            />
          </GridItem>

          <GridItem md={3}>
            <Field
              name='toTheClosest'
              render={(args) => (
                <Select
                  label='To The Closest'
                  options={currencyRoundingToTheClosest}
                  {...args}
                  disabled={hasActiveSession ? true : false}
                />
              )}
            />
          </GridItem>
        </GridContainer>

        <div className={classes.actionBtn}>
          <Button
            color='danger'
            onClick={() => {
              this.props.history.push('/setting')
            }}
          >
            Cancel
          </Button>

          <Button
            color='primary'
            onClick={() => {
              this.props.handleSubmit
            }}
          >
            Save
          </Button>
        </div>
      </CardContainer>
    )
  }
}

export default withStyles(styles, { withTheme: true })(GeneralSetting)
