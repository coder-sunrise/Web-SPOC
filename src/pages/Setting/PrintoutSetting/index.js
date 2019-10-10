import React, { PureComponent, useEffect } from 'react'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core'
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
  CodeSelect,
} from '@/components'
import BrowseImage from './BrowseImage'

const styles = (theme) => ({
  container: {
    marginBottom: theme.spacing(2),
  },
  verticalSpacing: {
    marginTop: theme.spacing(3),
  },
  indent: {
    paddingLeft: theme.spacing(2),
  },
})

@connect(({ printoutSetting }) => ({
  printoutSetting,
}))
@withFormikExtend({
  enableReinitialize: true,
  mapPropsToValues: ({ printoutSetting }) => {
    console.log({ printoutSetting })
    return {
      ...printoutSetting,
      letterHead: true,
      headerInfo: true,
      footerInfo: true,
      letterHeadHeight: 0,
      headerInfoHeight: 0,
      footerInfoHeight: 0,
      footerDisclaimerHeight: 0,
    }
  },

  validationSchema: Yup.object().shape({
    letterHeadHeight: Yup.number().required(),
    headerInfoHeight: Yup.number().required(),
    footerInfoHeight: Yup.number().required(),
    footerDisclaimerHeight: Yup.number().required(),
  }),

  handleSubmit: (values, { props }) => {
    // const { isEnableGST, GSTRegistrationNumber, gSTPercentage } = values
    // const payload = [
    //   {
    //     settingKey: 'isEnableGST',
    //     settingValue: isEnableGST,
    //   },
    //   {
    //     settingKey: 'GSTRegistrationNumber',
    //     settingValue: GSTRegistrationNumber,
    //   },
    //   {
    //     settingKey: 'gSTPercentage',
    //     settingValue: gSTPercentage,
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

  componentDidMount = () => {
    this.props.dispatch({
      type: 'printoutSetting/query',
    })
  }

  setImageBase64 = (type, v) => {
    this.props.setFieldValue(
      [
        type,
      ],
      v,
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
    console.log('state', this.state, this.props.values)
    return (
      <React.Fragment>
        <CardContainer hideHeader>
          <GridContainer>
            <GridItem md={3}>
              <FastField
                name='printoutReport'
                render={(args) => (
                  <CodeSelect
                    label='Select Printout'
                    code='ctPrinterType'
                    {...args}
                  />
                )}
              />
            </GridItem>
          </GridContainer>

          <GridContainer
            alignItems='center'
            justify='space-between'
            className={classes.container}
          >
            <GridContainer className={classes.verticalSpacing}>
              <GridItem md={1}>
                <h4>
                  <b>Letter Head</b>
                </h4>
              </GridItem>
              <GridItem md={3}>
                <FastField
                  name='letterHead'
                  render={(args) => (
                    <Switch style={{ marginTop: 0 }} {...args} />
                  )}
                />
              </GridItem>
            </GridContainer>

            <GridContainer className={classes.indent} direction='column'>
              <GridItem md={3}>
                <Field
                  name='letterHeadHeight'
                  render={(args) => (
                    <NumberInput
                      label='Letter Head Height'
                      suffix='cm'
                      format='0.0'
                      {...args}
                    />
                  )}
                />
              </GridItem>
              <GridItem md={3}>
                <FastField
                  name='letterHeadImage'
                  render={(args) => (
                    <BrowseImage
                      title='Letter Head Image'
                      setImageBase64={this.setImageBase64}
                      fieldName='letterHeadImage'
                      {...args}
                    />
                  )}
                />
              </GridItem>
            </GridContainer>

            <GridContainer className={classes.verticalSpacing}>
              <GridItem md={1}>
                <h4>
                  <b>Header Info</b>
                </h4>
              </GridItem>
              <GridItem md={3}>
                <FastField
                  name='headerInfo'
                  render={(args) => (
                    <Switch style={{ marginTop: 0 }} {...args} />
                  )}
                />
              </GridItem>
            </GridContainer>

            <GridContainer className={classes.indent} direction='column'>
              <GridItem md={3}>
                <FastField
                  name='headerInfoHeight'
                  render={(args) => (
                    <NumberInput
                      label='Header Info Height'
                      suffix='cm'
                      format='0.0'
                      {...args}
                    />
                  )}
                />
              </GridItem>
            </GridContainer>
            <GridContainer className={classes.verticalSpacing}>
              <GridItem md={1}>
                <h4>
                  <b>Footer Info</b>
                </h4>
              </GridItem>
              <GridItem md={3}>
                <FastField
                  name='footerInfo'
                  render={(args) => (
                    <Switch style={{ marginTop: 0 }} {...args} />
                  )}
                />
              </GridItem>
            </GridContainer>

            <GridContainer className={classes.indent} direction='column'>
              <GridItem md={3}>
                <FastField
                  name='footerInfoHeight'
                  render={(args) => (
                    <NumberInput
                      label='Footer Info Height'
                      suffix='cm'
                      format='0.0'
                      {...args}
                    />
                  )}
                />
              </GridItem>
              <GridItem md={3}>
                <FastField
                  name='footerDisclaimerHeight'
                  render={(args) => (
                    <NumberInput
                      label='Footer Disclaimer Height'
                      suffix='cm'
                      format='0.0'
                      {...args}
                    />
                  )}
                />
              </GridItem>
              <GridItem md={3}>
                <FastField
                  name='footerDisclaimerImage'
                  render={(args) => (
                    <BrowseImage
                      title='Footer Disclaimer Image'
                      setImageBase64={this.setImageBase64}
                      fieldName='footerDisclaimerImage'
                      {...args}
                    />
                  )}
                />
              </GridItem>
            </GridContainer>
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
