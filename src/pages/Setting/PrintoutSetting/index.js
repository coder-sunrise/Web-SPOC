import React, { PureComponent } from 'react'
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
  Button,
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

  indentDisclaimer: {
    paddingLeft: theme.spacing(3),
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

@connect(({ printoutSetting, formik, global }) => ({
  printoutSetting,
  formik,
  global,
}))
@withFormikExtend({
  enableReinitialize: true,
  notDirtyDuration: 0.3,
  mapPropsToValues: ({ printoutSetting }) => {
    const returnValue = printoutSetting.entity || printoutSetting.default
    return {
      ...returnValue,
    }
  },

  // markupMargin: Yup.number()
  // .min(0, 'Markup Margin must between 0 and 999,999.9')
  // .max(999999.9, 'Markup Margin must between 0 and 999,999.9'),

  validationSchema: Yup.object().shape({
    customLetterHeadHeight: Yup.number()
      .min(0, 'The value must between 0 and 5')
      .max(5, 'The value must between 0 and 5')
      .when('isDisplayCustomLetterHead', {
        is: (v) => v === true,
        then: Yup.number().required(),
      }),
    standardHeaderInfoHeight: Yup.number()
      .min(0, 'The value must between 0 and 5')
      .max(5, 'The value must between 0 and 5')
      .when('isDisplayStandardHeader', {
        is: (v) => v === true,
        then: Yup.number().required(),
      }),
    footerInfoHeight: Yup.number()
      .min(0, 'The value must between 0 and 5')
      .max(5, 'The value must between 0 and 5')
      .when('isDisplayFooterInfo', {
        is: (v) => v === true,
        then: Yup.number().required(),
      }),
    footerDisclaimerHeight: Yup.number()
      .min(0, 'The value must between 0 and 5')
      .max(5, 'The value must between 0 and 5')
      .when('isDisplayFooterInfoDisclaimer', {
        is: (v) => v === true,
        then: Yup.number().required(),
      }),
    customLetterHeadImage: Yup.string().when('isDisplayCustomLetterHead', {
      is: (v) => v === true,
      then: Yup.string().required('Letter Head Image is required.'),
    }),

    footerDisclaimerImage: Yup.string().when('isDisplayFooterInfoDisclaimer', {
      is: (v) => v === true,
      then: Yup.string().required('Footer Disclaimer Image is required.'),
    }),
  }),
  handleSubmit: (values, { props }) => {
    const { dispatch } = props
    const { customLetterHeadImage, footerDisclaimerImage, reportFK } = values
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
    }).then((r) => {
      if (r) {
        dispatch({
          type: 'printoutSetting/query',
          payload: {
            id: reportFK,
          },
        })
      }
    })
  },
  displayName: 'printoutSettingInfo',
})
class printoutSetting extends PureComponent {
  state = { selected: !!this.props.values.reportFK, prevSelectedIndex: 0 }

  componentDidMount = () => {
    this.props.dispatch({
      type: 'printoutSetting/updateState',
      payload: {
        entity: undefined,
      },
    })

    this.getSelectedReportSetting(1)
  }

  setImageBase64 = (type, v) => {
    this.props.setFieldValue(
      [
        type,
      ],
      v,
    )
  }

  checkFormIsDirty = (e) => {
    const { formik, dispatch, setFieldValue } = this.props
    if (this.setState.prevSelectedIndex === 0) {
      return
    }

    if (formik.printoutSettingInfo && formik.printoutSettingInfo.dirty) {
      dispatch({
        type: 'global/updateAppState',
        payload: {
          openConfirm: true,
          openConfirmContent: 'Are you sure want to discard the changes?',
          onConfirmDiscard: () => {
            this.getSelectedReportSetting(e)
          },
          onConfirmClose: () => {
            setFieldValue('reportFK', this.state.prevSelectedIndex)
          },

          openConfirmText: 'Discard Changes',
        },
      })
    } else {
      this.getSelectedReportSetting(e)
    }
  }

  getSelectedReportSetting = (e) => {
    const { dispatch } = this.props

    if (e) {
      dispatch({
        type: 'printoutSetting/query',
        payload: {
          id: e,
        },
      }).then((v) => {
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

      this.setState({ prevSelectedIndex: e })
    } else {
      this.setState(() => {
        return {
          selected: false,
        }
      })
    }

    // dispatch({
    //   type: 'formik/updateState',
    //   payload: {
    //     printoutSettingInfo: {
    //       ...formik.printoutSettingInfo,
    //       dirty: false,
    //     },
    //   },
    // })
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
    const footerDisclaimerImgRequired = this.props.errors.footerDisclaimerImage
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
                    allowClear={false}
                    {...args}
                    onChange={(e) => this.checkFormIsDirty(e)}
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
                        {letterHeadImgRequired}
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
                </GridItem>
              </GridContainer>

              <GridContainer className={classes.verticalSpacing} />

              <GridContainer className={classes.indentDisclaimer}>
                <GridItem md={1}>
                  <h4>Disclaimer</h4>
                </GridItem>
                <GridItem md={3}>
                  <FastField
                    name='isDisplayFooterInfoDisclaimer'
                    render={(args) => (
                      <Switch style={{ marginTop: 0, left: -22 }} {...args} />
                    )}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer className={classes.indent}>
                <GridItem direction='column' md={6}>
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
                    {footerDisclaimerImgRequired && (
                      <span className={classes.errorMsg}>
                        {footerDisclaimerImgRequired}
                      </span>
                    )}
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
