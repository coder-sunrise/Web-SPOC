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

@connect(({ gstSetup }) => ({
  gstSetup,
}))
@withFormikExtend({
  enableReinitialize: true,
  mapPropsToValues: ({ gstSetup }) => gstSetup.gst,

  handleSubmit: (values, { props }) => {
    const { IsEnableGST, GSTRegistrationNumber, GSTPercentage } = values

    const payload = [
      {
        settingKey: 'IsEnableGST',
        settingValue: IsEnableGST,
      },
      {
        settingKey: 'GSTRegistrationNumber',
        settingValue: GSTRegistrationNumber,
      },
      {
        settingKey: 'GSTPercentage',
        settingValue: GSTPercentage,
      },
    ]
    const { dispatch, onConfirm, history } = props

    dispatch({
      type: 'gstSetup/upsert',

      payload,
    }).then(history.push('/setting'))
  },
  displayName: 'GstSetupInfo',
})
class GstSetup extends PureComponent {
  state = {
    enableGst: false,
    inclusiveGst: false,
    hasActiveSession: true,
  }

  componentDidMount = async () => {
    this.checkHasActiveSession()
    await this.props.dispatch({
      type: 'gstSetup/query',
    })

    const { IsEnableGST } = this.props.values
    this.setState({ enableGst: IsEnableGST })
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

  handleOnChange = () => {
    this.setState(
      (prevState) => {
        return {
          enableGst: !prevState.enableGst,
        }
      },
      // (v) => {
      //   if (!this.state.enableGst) {
      //     this.props.setFieldValue('inclusiveGst', false)
      //   }
      // },
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
      values,
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
                name='IsEnableGST'
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
                name='GSTRegistrationNumber'
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
                name='GSTPercentage'
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

export default withStyles(styles, { withTheme: true })(GstSetup)
