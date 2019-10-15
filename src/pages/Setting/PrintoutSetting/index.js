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
  notification,
  ProgressButton,
} from '@/components'
import { navigateDirtyCheck } from '@/utils/utils'
import BrowseImage from './BrowseImage'
import AuthorizedContext from '@/components/Context/Authorized'

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

  errorMsg: {
    color: '#cf1322',
    margin: 0,
    fontSize: '0.75rem',
    marginTop: 8,
    minHeight: '1em',
    textAlign: 'left',
    fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
    fontWeight: 400,
    lineHeight: '1em',
    letterSpacing: '0.03333em',
  },
})

@connect(({ printoutSetting }) => ({
  printoutSetting,
}))
@withFormikExtend({
  enableReinitialize: true,
  mapPropsToValues: ({ printoutSetting }) =>
    printoutSetting.entity || printoutSetting.default,

  validationSchema: Yup.object().shape({
    customLetterHeadHeight: Yup.number().when('isDisplayCustomLetterHead', {
      is: (v) => v === true,
      then: Yup.number().required(),
    }),
    standardHeaderInfoHeight: Yup.number().when('isDisplayStandardHeader', {
      is: (v) => v === true,
      then: Yup.number().required(),
    }),
    footerInfoHeight: Yup.number().when('isDisplayFooterInfo', {
      is: (v) => v === true,
      then: Yup.number().required(),
    }),
    footerDisclaimerHeight: Yup.number().when('isDisplayFooterInfo', {
      is: (v) => v === true,
      then: Yup.number().required(),
    }),
    customLetterHeadImage: Yup.string().required(),
  }),
  handleSubmit: (values, { props }) => {
    const { dispatch, history } = props
    const { customLetterHeadImage, footerDisclaimerImage } = values
    const noHeaderBase64 = (v) => {
      if (v) return v.split(',')[1] || v
      return undefined
    }

    dispatch({
      type: 'printoutSetting/upsert',
      payload: {
        ...values,
        customLetterHeadImage: noHeaderBase64(customLetterHeadImage),
        footerDisclaimerImage: noHeaderBase64(footerDisclaimerImage),
      },
    })
  },
  displayName: 'printoutSettingInfo',
})
class printoutSetting extends PureComponent {
  state = { selected: !!this.props.values.reportFK }

  componentDidMount = () => {
    this.props.dispatch({
      type: 'printoutSetting/updateState',
      payload: {
        entity: undefined,
      },
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

  getSelectedReportSetting = (e) => {
    if (e) {
      this.props
        .dispatch({
          type: 'printoutSetting/query',
          payload: {
            id: e,
          },
        })
        .then((v) => {
          if (v) {
            this.setState(() => {
              return {
                selected: true,
              }
            })
          } else {
            notification.warn({
              message: 'No default setting for the selected report in database',
            })
          }
        })
    } else {
      this.setState(() => {
        return {
          selected: false,
        }
      })
    }
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
    const letterHeadImgRequired = this.props.errors.customLetterHeadImage
    return (
      <React.Fragment>
        <CardContainer hideHeader>
          <GridContainer>
            <GridItem md={3}>
              <FastField
                name='reportFK'
                render={(args) => (
                  <CodeSelect
                    label='Select Printout'
                    code='report'
                    {...args}
                    onChange={(e) => this.getSelectedReportSetting(e)}
                  />
                )}
              />
            </GridItem>
          </GridContainer>
          <AuthorizedContext.Provider
            value={{
              rights: this.state.selected ? 'enable' : 'disable',
            }}
          >
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
                    name='isDisplayCustomLetterHead'
                    render={(args) => (
                      <Switch style={{ marginTop: 0 }} {...args} />
                    )}
                  />
                </GridItem>
              </GridContainer>

              <GridContainer className={classes.indent}>
                <GridItem direction='column' md={6}>
                  <GridItem md={6}>
                    <Field
                      name='customLetterHeadHeight'
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
                  <GridItem md={6}>
                    {letterHeadImgRequired && (
                      <span className={classes.errorMsg}>
                        Letter Head Image is required.
                      </span>
                    )}
                    <Field
                      name='customLetterHeadImage'
                      render={(args) => {
                        return (
                          <BrowseImage
                            title='Letter Head Image'
                            setImageBase64={this.setImageBase64}
                            fieldName='customLetterHeadImage'
                            selected={this.state.selected}
                            {...args}
                          />
                        )
                      }}
                    />
                  </GridItem>
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
                    name='isDisplayStandardHeader'
                    render={(args) => (
                      <Switch style={{ marginTop: 0 }} {...args} />
                    )}
                  />
                </GridItem>
              </GridContainer>

              <GridContainer className={classes.indent}>
                <GridItem direction='column' md={6}>
                  <GridItem md={6}>
                    <FastField
                      name='standardHeaderInfoHeight'
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
                    name='isDisplayFooterInfo'
                    render={(args) => (
                      <Switch style={{ marginTop: 0 }} {...args} />
                    )}
                  />
                </GridItem>
              </GridContainer>

              <GridContainer className={classes.indent}>
                <GridItem direction='column' md={6}>
                  <GridItem md={6}>
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
                  <GridItem md={6}>
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
                  <GridItem md={6}>
                    <Field
                      name='footerDisclaimerImage'
                      render={(args) => (
                        <BrowseImage
                          title='Footer Disclaimer Image'
                          setImageBase64={this.setImageBase64}
                          fieldName='footerDisclaimerImage'
                          selected={this.state.selected}
                          {...args}
                        />
                      )}
                    />
                  </GridItem>
                </GridItem>
              </GridContainer>
            </GridContainer>

            <div
              className={classes.actionBtn}
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              <Button
                color='danger'
                authority='none'
                onClick={navigateDirtyCheck('/setting')}
              >
                Cancel
              </Button>

              <ProgressButton color='primary' onClick={handleSubmit}>
                Save
              </ProgressButton>
            </div>
          </AuthorizedContext.Provider>
        </CardContainer>
      </React.Fragment>
    )
  }
}

export default withStyles(styles, { withTheme: true })(printoutSetting)
