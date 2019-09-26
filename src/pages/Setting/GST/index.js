import React, { PureComponent, useEffect } from 'react'
import { connect } from 'dva'
import { withStyles, Divider, Tooltip } from '@material-ui/core'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'
import Yup from '@/utils/yup'
import { getBizSession } from '@/services/query'

import {
  Checkbox,
  withFormikExtend,
  FastField,
  Field,
  GridContainer,
  GridItem,
  CardContainer,
  TextField,
  Button,
} from '@/components'
import WarningSnackbar from '../GeneralSetting/WarningSnackbar'
import { navigateDirtyCheck } from '@/utils/utils'

const styles = (theme) => ({
  ...basicStyle(theme),
})

@connect(({ clinicSettings }) => ({
  clinicSettings,
}))
@withFormikExtend({
  enableReinitialize: true,
  mapPropsToValues: ({ clinicSettings }) => clinicSettings.entity,

  handleSubmit: (values, { props }) => {
    const { IsEnableGST, GSTRegistrationNumber, GSTPercentage } = values

    const payload = [
      {
        ...IsEnableGST,
        settingValue: IsEnableGST.settingValue.toString(),
      },
      {
        ...GSTRegistrationNumber,
      },
      {
        ...GSTPercentage,
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
  displayName: 'clinicSettingsInfo',
})
class clinicSettings extends PureComponent {
  state = {
    enableGst: true,
    inclusiveGst: false,
    hasActiveSession: true,
  }

  componentDidMount = () => {
    this.checkHasActiveSession()
    this.props.dispatch({
      type: 'clinicSettings/query',
    })
    this.setInitialValue(this.props.values)
  }

  componentDidUpdate = (prevProps) => {
    this.setInitialValue(this.props.values)
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

  setInitialValue = (param) => {
    this.setState({
      enableGst: param.IsEnableGST
        ? param.IsEnableGST.settingValue.toString() === 'true'
        : false,
    })
    this.props.setFieldValue(
      'IsEnableGST.settingValue',
      param.IsEnableGST
        ? param.IsEnableGST.settingValue.toString() === 'true'
        : false,
    )
    // this.props.setValues({
    //   ...this.props.values,
    //   IsEnableGST: {
    //     ...this.props.values.IsEnableGST,
    //     settingValue: this.props.values.IsEnableGST
    //       ? this.props.values.IsEnableGST.settingValue.toString() === 'true'
    //       : false,
    //   },
    // })
  }

  handleOnChange = (event) => {
    // console.log({ event })
    // const { values } = this.props
    // console.log('hello')
    // this.setState(
    //   (prevState) => {
    //     return {
    //       enableGst: !prevState.enableGst,
    //     }
    //   },

    // (v) => {
    //   if (!this.state.enableGst) {
    //     this.props.setFieldValue('inclusiveGst', false)
    //   }
    // },
    // )
    this.setState({ enableGst: event.target.value })
    // this.props.setFieldValue('IsEnableGST.settingvalue', event.target.value)
    // this.props.setValues({
    //   ...this.props.values,
    //   IsEnableGST: {
    //     ...this.props.values.IsEnableGST,
    //     settingValue: event.target.value,
    //   },
    // })
  }

  handleOnSubmit = () => {
    const {
      IsEnableGST,
      GSTRegistrationNumber,
      GSTPercentage,
    } = this.props.values
    console.log(this.props.values)
    const payload = [
      {
        ...IsEnableGST,
        settingValue: IsEnableGST.settingValue.toString(),
      },
      {
        ...GSTRegistrationNumber,
      },
      {
        ...GSTPercentage,
      },
    ]
    const { dispatch, onConfirm, history } = this.props

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
  }

  render () {
    const {
      form,
      classes,
      dispatch,
      theme,
      handleSubmit,
      clinicSettingsInfo,
      values,
      ...restProps
    } = this.props
    const { enableGst, hasActiveSession } = this.state
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
                name='IsEnableGST.settingValue'
                render={(args) => (
                  <Checkbox
                    label='Enable GST'
                    onChange={this.handleOnChange}
                    disabled={!!hasActiveSession}
                    {...args}
                  />
                )}
              />
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem md={3}>
              <Field
                name='GSTRegistrationNumber.settingValue'
                render={(args) => (
                  <TextField
                    label='GST Registration Number'
                    {...args}
                    disabled={!enableGst || !!hasActiveSession}
                  />
                )}
              />
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem md={3}>
              <Field
                name='GSTPercentage.settingValue'
                render={(args) => (
                  <TextField
                    label='GST Rate'
                    {...args}
                    disabled={!enableGst || !!hasActiveSession}
                    suffix='%'
                  />
                )}
              />
            </GridItem>
          </GridContainer>
          {/* <GridContainer>
            <GridItem md={3}>
              <Field
                name='inclusiveGst'
                render={(args) => (
                  <Checkbox
                    label='Inclusive GST'
                    disabled={!enableGst}
                    {...args}
                  />
                )}
              />
            </GridItem>
          </GridContainer> */}
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
              onClick={this.handleOnSubmit}
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

export default withStyles(styles, { withTheme: true })(clinicSettings)
