import React, { PureComponent, useEffect } from 'react'
import { connect } from 'dva'
import { withStyles, Divider, Tooltip } from '@material-ui/core'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'
import Yup from '@/utils/yup'
import { getActiveSession } from '@/pages/Reception/Queue/services'

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

const styles = (theme) => ({
  ...basicStyle(theme),
})

@connect(({ settingGst }) => ({
  settingGst,
}))
@withFormikExtend({
  // mapPropsToValues: ({ settingGst }) => {
  //   return settingGst.entity ? settingGst.entity : settingGst.default
  // },

  handleSubmit: (values, { props }) => {
    console.log('abc', values, props)
    const { enableGst, gstRate, gstRegNum } = values
    const { dispatch, onConfirm } = props
    const payload = [
      {
        settingKey: 'IsEnableGST',
        settingValue: enableGst,
      },
      {
        settingKey: 'GSTPercentage',
        settingValue: gstRate,
      },
      {
        settingKey: 'GSTRegistrationNumber',
        settingValue: gstRegNum,
      },
    ]
    dispatch({
      type: 'settingGst/upsert',

      payload,
    })
    //   .then((r) => {
    //     if (r) {
    //       if (onConfirm) onConfirm()
    //       dispatch({
    //         type: 'settingRoom/query',
    //       })
    //     }
    // })
  },
  displayName: 'GstSetupInfo',
})
class GstSetup extends PureComponent {
  state = {
    enableGst: false,
    inclusiveGst: false,
    hasActiveSession: true,
  }

  componentDidMount = () => {
    this.checkHasActiveSession()
    this.props
      .dispatch({
        type: 'settingGst/query',
      })
      .then((v) => {
        const { setFieldValue } = this.props
        if (v) {
          v.map((o, i) => {
            switch (i) {
              case 0: {
                return setFieldValue('enableGst', o.settingValue)
              }
              case 1: {
                return setFieldValue('gstRegNum', o.settingValue)
              }
              case 2: {
                return setFieldValue('gstRate', o.settingValue)
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

  handleOnChange = () => {
    this.setState(
      (prevState) => {
        return {
          enableGst: !prevState.enableGst,
        }
      },
      (v) => {
        if (!this.state.enableGst) {
          this.props.setFieldValue('inclusiveGst', false)
        }
      },
    )
  }

  render () {
    const {
      form,
      classes,
      gstSetupInfo,
      dispatch,
      theme,
      handleSubmit,
      ...restProps
    } = this.props
    const { enableGst, hasActiveSession } = this.state

    // console.log('inclusiveGst', this.props.values)
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
                name='enableGst'
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
                name='gstRegNum'
                render={(args) => (
                  <TextField
                    label='GST Registration Number'
                    {...args}
                    disabled={!enableGst}
                  />
                )}
              />
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem md={3}>
              <Field
                name='gstRate'
                render={(args) => (
                  <TextField
                    label='GST Rate'
                    {...args}
                    disabled={!enableGst}
                    suffix='%'
                  />
                )}
              />
            </GridItem>
          </GridContainer>
          <GridContainer>
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
              // disabled={hasActiveSession}
            >
              Save
            </Button>
          </div>
        </CardContainer>
      </React.Fragment>
    )
  }
}

export default withStyles(styles, { withTheme: true })(GstSetup)
