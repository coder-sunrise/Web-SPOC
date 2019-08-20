import React, { PureComponent, useEffect } from 'react'
import Yup from '@/utils/yup'
import { connect } from 'dva'
import clsx from 'clsx'
import { withStyles, Divider, Tooltip } from '@material-ui/core'
import { getActiveSession } from '@/pages/Reception/Queue/services'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'

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

// import Address from '@/pages/PatientDatabase/Detail/Demographics/Address'

const styles = (theme) => ({
  ...basicStyle(theme),
})

@connect(({ settingGst }) => ({
  settingGst,
}))
@withFormikExtend({
  mapPropsToValues: ({ settingGst }) => {
    console.log(settingGst)
    return settingGst.entity ? settingGst.entity : settingGst.default
  },
  // validationSchema: Yup.object().shape({
  //   name: Yup.string().required(),
  //   address: Yup.object().shape({
  //     postcode: Yup.number().required(),
  //     countryFK: Yup.string().required(),
  //   }),
  // }),

  handleSubmit: () => {},
  displayName: 'GstSetupInfo',
})
class GstSetup extends PureComponent {
  state = {
    enableGst: false,
    inclusiveGst: false,
    hasActiveSession: true,
  }

  componentDidMount () {
    this.checkHasActiveSession()
  }

  checkHasActiveSession = async () => {
    const result = await getActiveSession()
    let { data } = result.data
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
      ...restProps
    } = this.props
    const { enableGst, hasActiveSession } = this.state
    const tooltipMsg = `Active session detected.`

    // const tooltipStyle = {
    //   fontSize: '20px',
    // }

    console.log('inclusiveGst', this.props.values)
    return (
      <CardContainer hideHeader>
        <GridContainer>
          <GridItem md={3}>
            <Field
              name='enableGst'
              render={(args) => (
                <div>
                  {hasActiveSession ? (
                    <Tooltip
                      title={tooltipMsg}
                      placement='right'
                      // style={tooltipStyle}
                    >
                      <span>
                        <Checkbox
                          label='Enable GST'
                          onChange={this.handleOnChange}
                          disabled={!!hasActiveSession}
                          {...args}
                        />
                      </span>
                    </Tooltip>
                  ) : (
                    <Checkbox
                      label='Enable GST'
                      onChange={this.handleOnChange}
                      disabled={!!hasActiveSession}
                      {...args}
                    />
                  )}
                </div>
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

export default withStyles(styles, { withTheme: true })(GstSetup)
