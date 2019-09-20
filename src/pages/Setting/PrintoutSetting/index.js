import React, { PureComponent, useEffect } from 'react'
import { connect } from 'dva'
import { withStyles, Divider, Tooltip } from '@material-ui/core'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'
// import NumberFormat from 'react-number-format'
import Yup from '@/utils/yup'
import {
  withFormikExtend,
  FastField,
  Field,
  GridContainer,
  GridItem,
  CardContainer,
  TextField,
  Button,
  Select,
  Switch,
  NumberInput,
} from '@/components'
import BrowseImage from './BrowseImage'

const styles = (theme) => ({
  ...basicStyle(theme),
})

@connect(({ printoutSetting }) => ({
  printoutSetting,
}))
@withFormikExtend({
  enableReinitialize: true,
  mapPropsToValues: ({ printoutSetting }) => {
    return {
      ...printoutSetting,
      letterHead: true,
      headerInfo: true,
      footerInfo: true,
    }
  },

  validationSchema: Yup.object().shape({
    letterHeadHeight: Yup.number().required(),
    headerInfoHeight: Yup.number().required(),
    footerInfoHeight: Yup.number().required(),
    footerDisclaimerHeight: Yup.number().required(),
  }),

  handleSubmit: (values, { props }) => {
    // const { IsEnableGST, GSTRegistrationNumber, GSTPercentage } = values
    // const payload = [
    //   {
    //     settingKey: 'IsEnableGST',
    //     settingValue: IsEnableGST,
    //   },
    //   {
    //     settingKey: 'GSTRegistrationNumber',
    //     settingValue: GSTRegistrationNumber,
    //   },
    //   {
    //     settingKey: 'GSTPercentage',
    //     settingValue: GSTPercentage,
    //   },
    // ]
    // const { dispatch, onConfirm, history } = props
    // dispatch({
    //   type: 'printoutSetting/upsert',
    //   payload,
    // }).then(history.push('/setting'))
  },
  displayName: 'printoutSettingInfo',
})
class printoutSetting extends PureComponent {
  state = {}

  // componentDidMount =  () => {
  //    this.props.dispatch({
  //     type: 'printoutSetting/query',
  //   })
  // }

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
      printoutSettingInfo,
      dispatch,
      theme,
      handleSubmit,
      values,
      setFieldValue,
      ...restProps
    } = this.props
    // const { } = this.state

    // console.log('inclusiveGst', this.props.values)
    return (
      <React.Fragment>
        <CardContainer hideHeader>
          <GridContainer>
            <GridItem md={3}>
              <FastField
                name='printoutReport'
                render={(args) => (
                  <Select
                    label='Select Printout'
                    options={[
                      {
                        value: 'patientListingReport',
                        name: 'Patient Listing Report',
                      },
                      {
                        value: 'generalReport',
                        name: 'General Report',
                      },
                    ]}
                    // onChange={this.handleOnChange}
                    {...args}
                  />
                )}
              />
            </GridItem>
          </GridContainer>
          <hr />
          <GridContainer>
            <GridItem md={3}>
              <h3>
                <b>Letter Head</b>
              </h3>
            </GridItem>
            <GridItem md={3}>
              <FastField
                name='letterHead'
                render={(args) => <Switch label='' {...args} />}
              />
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem md={3}>
              <Field
                name='letterHeadHeight'
                render={(args) => (
                  <NumberInput
                    label='Letter Head Height'
                    suffix='cm'
                    onChange={(e) => {
                      if (e.target.value) {
                        setFieldValue(
                          'letterHeadHeight',
                          e.target.value.toFixed(1),
                        )
                      }
                    }}
                    {...args}
                  />
                )}
              />
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem md={3}>
              <FastField
                name='letterHeadImage'
                render={(args) => (
                  <BrowseImage title='Letter Head Image' {...args} />
                )}
              />
            </GridItem>
          </GridContainer>
          <hr />
          <GridContainer>
            <GridItem md={3}>
              <h3>
                <b>Header Info</b>
              </h3>
            </GridItem>
            <GridItem md={3}>
              <FastField
                name='headerInfo'
                render={(args) => <Switch label='' {...args} />}
              />
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem md={3}>
              <FastField
                name='headerInfoHeight'
                render={(args) => (
                  <NumberInput
                    label='Header Info Height'
                    suffix='cm'
                    onChange={(e) => {
                      if (e.target.value) {
                        setFieldValue(
                          'headerInfoHeight',
                          e.target.value.toFixed(1),
                        )
                      }
                    }}
                    {...args}
                  />
                )}
              />
            </GridItem>
          </GridContainer>
          <hr />
          <GridContainer>
            <GridItem md={3}>
              <h3>
                <b>Footer Info</b>
              </h3>
            </GridItem>
            <GridItem md={3}>
              <FastField
                name='footerInfo'
                render={(args) => <Switch label='' {...args} />}
              />
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem md={3}>
              <FastField
                name='footerInfoHeight'
                render={(args) => (
                  <NumberInput
                    label='Footer Info Height'
                    suffix='cm'
                    onChange={(e) => {
                      if (e.target.value) {
                        setFieldValue(
                          'footerInfoHeight',
                          e.target.value.toFixed(1),
                        )
                      }
                    }}
                    {...args}
                  />
                )}
              />
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem md={3}>
              <FastField
                name='footerDisclaimerHeight'
                render={(args) => (
                  <NumberInput
                    label='Footer Disclaimer Height'
                    suffix='cm'
                    onChange={(e) => {
                      if (e.target.value) {
                        setFieldValue(
                          'footerDisclaimerHeight',
                          e.target.value.toFixed(1),
                        )
                      }
                    }}
                    {...args}
                  />
                )}
              />
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem md={3}>
              <FastField
                name='footerDisclaimerImage'
                render={(args) => (
                  <BrowseImage title='Footer Disclaimer Image' {...args} />
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
            >
              Cancel
            </Button>

            <Button color='primary' onClick={handleSubmit}>
              Save
            </Button>
          </div>
        </CardContainer>
      </React.Fragment>
    )
  }
}

export default withStyles(styles, { withTheme: true })(printoutSetting)
