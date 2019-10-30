import React, { PureComponent, useEffect } from 'react'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'
import Yup from '@/utils/yup'
import { getBizSession } from '@/services/queue'

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
  WarningSnackbar,
} from '@/components'

import { navigateDirtyCheck } from '@/utils/utils'

const styles = (theme) => ({
  ...basicStyle(theme),
})

@connect(({ clinicSettings, formik }) => ({
  clinicSettings,
  formik,
}))
@withFormikExtend({
  enableReinitialize: true,
  mapPropsToValues: ({ clinicSettings }) => {
    if (clinicSettings.entity && clinicSettings.entity.isEnableGST) {
      const { isEnableGST } = clinicSettings.entity
      return {
        ...clinicSettings.entity,
        isEnableGST: {
          ...isEnableGST,
          settingValue: isEnableGST.settingValue === 'true',
        },
      }
    }
    return clinicSettings.entity
  },
  handleSubmit: (values, { props }) => {
    const { isEnableGST, gSTRegistrationNumber, gSTPercentage } = values

    const payload = [
      {
        ...isEnableGST,
        settingValue: isEnableGST.settingValue.toString(),
      },
      {
        ...gSTRegistrationNumber,
      },
      {
        ...gSTPercentage,
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
    hasActiveSession: false,
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
    const bizSessionPayload = {
      IsClinicSessionClosed: false,
    }
    const result = await getBizSession(bizSessionPayload)
    const { data } = result.data

    this.setState({
      hasActiveSession: data.length > 0,
    })
  }

  setInitialValue = (param) => {
    this.setState({
      enableGst: param.isEnableGST
        ? param.isEnableGST.settingValue.toString() === 'true'
        : false,
    })
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
    // this.props.setFieldValue('isEnableGST.settingvalue', event.target.value)
    // this.props.setValues({
    //   ...this.props.values,
    //   isEnableGST: {
    //     ...this.props.values.isEnableGST,
    //     settingValue: event.target.value,
    //   },
    // })
  }

  handleOnSubmit = () => {
    const {
      isEnableGST,
      gSTRegistrationNumber,
      gSTPercentage,
    } = this.props.values
    // console.log(this.props.values)
    const payload = [
      {
        ...isEnableGST,
        settingValue: isEnableGST.settingValue.toString(),
      },
      {
        ...gSTRegistrationNumber,
      },
      {
        ...gSTPercentage,
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
                name='isEnableGST.settingValue'
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
                name='gSTRegistrationNumber.settingValue'
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
                name='gSTPercentage.settingValue'
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
              onClick={navigateDirtyCheck({
                redirectUrl: '/setting',
              })}
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
