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
import BrowseImage from '../PrintoutSetting/BrowseImage'

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

const errorMessage = (v) => {
  return `The value must between ${v} and 5.0`
}

@connect(({ masterPrintoutSetting, formik, global }) => ({
  masterPrintoutSetting,
  formik,
  global,
}))
@withFormikExtend({
  enableReinitialize: true,
  notDirtyDuration: 0.3,
  mapPropsToValues: ({ masterPrintoutSetting, id }) => {
    const returnValue =
      masterPrintoutSetting.entity || masterPrintoutSetting.default
    return {
      id,
      ...returnValue,
    }
  },

  validationSchema: Yup.object().shape({
    customLetterHeadHeight: Yup.number().when('isDisplayCustomLetterHead', {
      is: (v) => v === true,
      then: Yup.number()
        .required()
        .min(0.1, errorMessage(0.1))
        .max(5, errorMessage(0.1)),
    }),
    standardHeaderInfoHeight: Yup.number().when('isDisplayStandardHeader', {
      is: (v) => v === true,
      then: Yup.number()
        .required()
        .min(0.1, errorMessage(0.1))
        .max(5, errorMessage(0.1)),
    }),
    footerInfoHeight: Yup.number().when('isDisplayFooterInfo', {
      is: (v) => v === true,
      then: Yup.number()
        .required()
        .min(0.1, errorMessage(0.1))
        .max(5, errorMessage(0.1)),
    }),
    footerDisclaimerHeight: Yup.number().when('isDisplayFooterInfoDisclaimer', {
      is: (v) => v === true,
      then: Yup.number()
        .required()
        .min(0.1, errorMessage(0.1))
        .max(5, errorMessage(0.1)),
    }),
    customLetterHeadImage: Yup.string().when('isDisplayCustomLetterHead', {
      is: (v) => v === true,
      then: Yup.string().required('Letter Head Image is required.'),
    }),

    footerDisclaimerImage: Yup.string().when('isDisplayFooterInfoDisclaimer', {
      is: (v) => v === true,
      then: Yup.string().required('Footer Image is required.'),
    }),
  }),
  handleSubmit: (values, { props }) => {
    const { dispatch } = props
    const { customLetterHeadImage, footerDisclaimerImage, id } = values
    console.log(customLetterHeadImage)
    const noHeaderBase64 = (v) => {
      if (v === '') return v
      if (v) return v.split(',')[1] || v
      return undefined
    }

    dispatch({
      type: 'masterPrintoutSetting/upsert',
      payload: {
        ...values,
        customLetterHeadImage: noHeaderBase64(customLetterHeadImage),
        footerDisclaimerImage: noHeaderBase64(footerDisclaimerImage),
      },
    }).then((r) => {
      if (r) {
        dispatch({
          type: 'masterPrintoutSetting/query',
          payload: {
            id,
          },
        })
      }
    })
  },
  displayName: 'masterPrintoutSettingInfo',
})
class MasterPrintoutSetting extends PureComponent {
  state = { selected: !!this.props.values.id, prevSelectedId: 0 }

  componentDidMount = () => {
    this.props.dispatch({
      type: 'masterPrintoutSetting/updateState',
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
    if (this.setState.prevSelectedId === 0) {
      return
    }

    if (
      formik.masterPrintoutSettingInfo &&
      formik.masterPrintoutSettingInfo.dirty
    ) {
      dispatch({
        type: 'global/updateAppState',
        payload: {
          openConfirm: true,
          openConfirmContent: 'Discard the changes?',
          onConfirmSave: () => {
            this.setState({ prevSelectedId: e })
            this.getSelectedReportSetting(e)
          },
          onConfirmClose: () => {
            console.log(this.state.prevSelectedId)
            setFieldValue('id', this.state.prevSelectedId)
          },

          // openConfirmText: 'Discard Changes',
        },
      })
    } else {
      this.getSelectedReportSetting(e)
    }
  }

  getSelectedReportSetting = (e) => {
    const { dispatch, setFieldValue, resetForm } = this.props
    resetForm()
    if (e) {
      dispatch({
        type: 'masterPrintoutSetting/query',
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
          this.setState({ prevSelectedId: e })
          setFieldValue('id', e)
        }
      })

      this.setState({ prevSelectedId: e })
      setFieldValue('id', e)
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
      masterPrintoutSettingInfo,
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
                name='id'
                render={(args) => (
                  <CodeSelect
                    label='Select Printout'
                    code='report'
                    allowClear={false}
                    {...args}
                    onChange={(e) => this.checkFormIsDirty(e)}
                    orderBy={[['name'],['asc']]}
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
                  name='isDisplayCustomLetterHead'
                  render={(args) => (
                    <Switch style={{ marginTop: 0 }} {...args} />
                  )}
                />
              </GridItem>
            </GridContainer>
            {values.isDisplayCustomLetterHead === true ? (
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
                          min='0'
                          max='5'
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
            ) : (
              ''
            )}
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
            {values.isDisplayStandardHeader === true ? (
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
                          min='0'
                          max='5'
                          disabled={values.isDisplayStandardHeader === false}
                          {...args}
                        />
                      )}
                    />
                  </GridItem>
                </GridItem>
              </GridContainer>
            ) : (
              ''
            )}

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
            {values.isDisplayFooterInfo === true ? (
              <GridContainer className={classes.indent}>
                <GridItem direction='column' md={6}>
                  <GridItem md={6}>
                    <Field
                      name='footerInfoHeight'
                      render={(args) => (
                        <NumberInput
                          label='Footer Info Height'
                          suffix='cm'
                          format='0.0'
                          min='0'
                          max='5'
                          {...args}
                        />
                      )}
                    />
                  </GridItem>
                </GridItem>
              </GridContainer>
            ) : (
              ''
            )}

            <GridContainer className={classes.verticalSpacing}>
              <GridItem md={1}>
                <h4>
                  <b>Footer Image</b>
                </h4>
              </GridItem>
              <GridItem md={3}>
                <FastField
                  name='isDisplayFooterInfoDisclaimer'
                  render={(args) => (
                    <Switch style={{ marginTop: 0 }} {...args} />
                  )}
                />
              </GridItem>
            </GridContainer>

            <GridContainer className={classes.indentDisclaimer} />
            {values.isDisplayFooterInfoDisclaimer === true ? (
              <GridContainer className={classes.indent}>
                <GridItem direction='column' md={6}>
                  <GridItem md={6}>
                    <FastField
                      name='footerDisclaimerHeight'
                      render={(args) => (
                        <NumberInput
                          label='Footer Image Height'
                          suffix='cm'
                          format='0.0'
                          min='0'
                          max='5'
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
                          title='Footer Image'
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
            ) : (
              ''
            )}
          </GridContainer>

          <div
            className={classes.actionBtn}
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <Button
              color='danger'
              authority='none'
              onClick={navigateDirtyCheck({
                redirectUrl: '/setting',
              })}
            >
              Cancel
            </Button>

            <ProgressButton color='primary' onClick={handleSubmit}>
              Save
            </ProgressButton>
          </div>
        </CardContainer>
      </React.Fragment>
    )
  }
}

export default withStyles(styles, { withTheme: true })(MasterPrintoutSetting)
