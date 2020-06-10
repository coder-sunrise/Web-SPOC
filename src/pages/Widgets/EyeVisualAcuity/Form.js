import React, { Component } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import { connect } from 'dva'
import { withStyles, Divider, Paper } from '@material-ui/core'
import { AttachmentWithThumbnail } from '@/components/_medisys'
import Authorized from '@/utils/Authorized'

import Yup from '@/utils/yup'

import {
  Button,
  CommonHeader,
  CommonModal,
  NavPills,
  PictureUpload,
  GridContainer,
  GridItem,
  Card,
  CardAvatar,
  CardBody,
  TextField,
  notification,
  Select,
  CodeSelect,
  DatePicker,
  RadioGroup,
  ProgressButton,
  CardContainer,
  confirm,
  Switch,
  Checkbox,
  OutlinedTextField,
  withFormikExtend,
  Field,
  FieldArray,
  FastField,
} from '@/components'
import model from './models'

window.g_app.replaceModel(model)

const styles = (theme) => ({
  table: {
    '& th': {
      textAlign: 'center',
    },
    '& td,th': {
      border: '1px solid rgba(0, 0, 0, 0.42)',
      // verticalAlign: 'top',
    },
  },
  inputRoot: {
    paddingLeft: 2,
    paddingRight: 5,
    '&:before': {
      // right: 30,
      // left: 10,
      left: 2,
      right: 16,
    },
    '&:after': {
      // right: 30,
      // left: 10,
      left: 2,
      right: 16,
    },
    '& > input': {
      textAlign: 'center',
    },
  },
  inputSpecs: {
    '&:before': {
      right: 30,
      left: 74,
    },
    '&:after': {
      right: 30,
      left: 74,
    },
  },
})
// @connect(({ visualAcuity }) => ({
//   visualAcuity,
// }))
class Form extends React.PureComponent {
  componentDidMount () {}

  handleUpdateAttachments = ({ added, deleted }) => {
    const { values: { visitAttachment = [] }, setFieldValue } = this.props
    let updated = [
      ...visitAttachment,
    ]

    if (added)
      updated = [
        ...updated,
        ...added,
      ]

    if (deleted)
      updated = updated.reduce((attachments, item) => {
        if (
          (item.fileIndexFK !== undefined && item.fileIndexFK === deleted) ||
          (item.fileIndexFK === undefined && item.id === deleted)
        )
          return [
            ...attachments,
            { ...item, isDeleted: true },
          ]

        return [
          ...attachments,
          { ...item },
        ]
      }, [])
    setFieldValue('visitAttachment', updated)
  }

  addForm = () => {
    this.arrayHelpers.push({
      isNew: true,
    })
  }

  render () {
    const { state, props } = this
    const {
      theme,
      classes,
      rights,
      prefix,
      fromPatientHistory,
      ...restProps
    } = props
    const cfg = {
      extraClasses: {
        root: classes.inputRoot,
      },
      simple: true,
    }

    return (
      <div style={{ minWidth: 700 }}>
        <FieldArray
          name={prefix}
          render={(arrayHelpers) => {
            const { form } = arrayHelpers
            const { values } = form
            const ary = Object.byString(values, prefix)
            this.arrayHelpers = arrayHelpers
            // if (!values || !values.corDiagnosis) return null

            // if (values.corDiagnosis.length <= 0) {
            //   this.addDiagnosis()
            // }

            // console.log(values)
            if (!ary || ary.length === 0) {
              // const accessRight = Authorized.check(
              //   'queue.consultation.widgets.eyevisualacuity',
              // )
              // if (rights === 'enable' || accessRight.rights === 'enable') {
              this.addForm()
              return null
              // }
              // return null
            }

            return (
              <div>
                {ary.map((val, i) => {
                  const _prefix = `${prefix}[${i}].`
                  const noSpecsCfg = {
                    simple: true,
                    disabled:
                      Object.byString(form.values, `${_prefix}isNoSpec`) ===
                      true,
                  }
                  return (
                    <React.Fragment>
                      <table className={classes.table}>
                        <colgroup>
                          <col width='20%' />
                          <col width='40%' />
                          <col width='40%' />
                        </colgroup>
                        <tr>
                          <th />
                          <th>OD</th>
                          <th>OS</th>
                        </tr>
                        <tr>
                          <td>
                            <GridContainer>
                              <GridItem
                                xs={12}
                                direction='column'
                                justify='flex-start'
                                alignItems='flex-start'
                                style={{ minWidth: 235 }}
                              >
                                <FastField
                                  name={`${_prefix}isAided`}
                                  render={(args) => {
                                    return (
                                      <Switch
                                        onOffMode={false}
                                        prefix='Distance / Near VA'
                                        unCheckedChildren='Unaided'
                                        checkedChildren='Aided'
                                        {...args}
                                      />
                                    )
                                  }}
                                />
                                <FastField
                                  name={`${_prefix}isOwnSpecs`}
                                  render={(args) => {
                                    return (
                                      <Checkbox label='Own Specs' {...args} />
                                    )
                                  }}
                                />
                                <div
                                  style={{
                                    position: 'relative',
                                  }}
                                >
                                  <FastField
                                    name={`${_prefix}isRefractionOn`}
                                    render={(args) => {
                                      return (
                                        <Checkbox
                                          label='Refraction On'
                                          onChange={(e) => {
                                            if (e.target.value === false) {
                                              args.form.setFieldValue(
                                                `${_prefix}refractionOnRemarks`,
                                                '',
                                              )
                                            }
                                          }}
                                          {...args}
                                        />
                                      )
                                    }}
                                  />
                                  <Field
                                    name={`${_prefix}refractionOnRemarks`}
                                    render={(args) => {
                                      return (
                                        <TextField
                                          disabled={
                                            Object.byString(
                                              args.form.values,
                                              `${_prefix}isRefractionOn`,
                                            ) !== true
                                          }
                                          style={{
                                            position: 'absolute',
                                            bottom: 8,
                                            left: fromPatientHistory
                                              ? 130
                                              : 115,
                                          }}
                                          simple
                                          {...args}
                                        />
                                      )
                                    }}
                                  />
                                </div>
                              </GridItem>
                            </GridContainer>
                          </td>
                          <td>
                            <GridContainer gutter={0}>
                              <GridItem xs={3}>
                                <div style={{ display: 'flex' }}>
                                  <span style={{ marginTop: 5 }}>D</span>
                                  <FastField
                                    name={`${_prefix}nearVADOD`}
                                    render={(args) => {
                                      return <TextField {...cfg} {...args} />
                                    }}
                                  />
                                </div>
                              </GridItem>
                              <GridItem xs={3}>
                                <div style={{ display: 'flex' }}>
                                  <span style={{ marginTop: 5 }}>PH</span>
                                  <FastField
                                    name={`${_prefix}nearVAPHOD`}
                                    render={(args) => {
                                      return <TextField {...cfg} {...args} />
                                    }}
                                  />
                                </div>
                              </GridItem>
                              <GridItem xs={6} />
                              <GridItem xs={3}>
                                <div style={{ display: 'flex' }}>
                                  <span style={{ marginTop: 5 }}>N</span>
                                  <FastField
                                    name={`${_prefix}nearVANOD`}
                                    render={(args) => {
                                      return (
                                        <TextField
                                          suffix='@'
                                          suffixProps={{ style: { right: -5 } }}
                                          {...cfg}
                                          {...args}
                                        />
                                      )
                                    }}
                                  />
                                </div>
                              </GridItem>
                              <GridItem xs={3}>
                                <FastField
                                  name={`${_prefix}nearVAcmOD`}
                                  render={(args) => {
                                    return (
                                      <TextField
                                        suffix='cm'
                                        suffixProps={{ style: { right: -10 } }}
                                        {...cfg}
                                        {...args}
                                      />
                                    )
                                  }}
                                />
                              </GridItem>
                              <GridItem xs={6} />
                            </GridContainer>
                          </td>
                          <td>
                            <GridContainer gutter={0}>
                              <GridItem xs={3}>
                                <div style={{ display: 'flex' }}>
                                  <span style={{ marginTop: 5 }}>D</span>
                                  <FastField
                                    name={`${_prefix}nearVADOS`}
                                    render={(args) => {
                                      return <TextField {...cfg} {...args} />
                                    }}
                                  />
                                </div>
                              </GridItem>
                              <GridItem xs={3}>
                                <div style={{ display: 'flex' }}>
                                  <span style={{ marginTop: 5 }}>PH</span>
                                  <FastField
                                    name={`${_prefix}nearVAPHOS`}
                                    render={(args) => {
                                      return <TextField {...cfg} {...args} />
                                    }}
                                  />
                                </div>
                              </GridItem>
                              <GridItem xs={6} />
                              <GridItem xs={3}>
                                <div style={{ display: 'flex' }}>
                                  <span style={{ marginTop: 5 }}>N</span>
                                  <FastField
                                    name={`${_prefix}nearVANOS`}
                                    render={(args) => {
                                      return (
                                        <TextField
                                          suffix='@'
                                          suffixProps={{ style: { right: -5 } }}
                                          {...cfg}
                                          {...args}
                                        />
                                      )
                                    }}
                                  />
                                </div>
                              </GridItem>
                              <GridItem xs={3}>
                                <FastField
                                  name={`${_prefix}nearVAcmOS`}
                                  render={(args) => {
                                    return (
                                      <TextField
                                        suffix='cm'
                                        suffixProps={{ style: { right: -10 } }}
                                        {...cfg}
                                        {...args}
                                      />
                                    )
                                  }}
                                />
                              </GridItem>
                              <GridItem xs={6} />
                            </GridContainer>
                          </td>
                        </tr>

                        <tr>
                          <td style={{ paddingBottom: theme.spacing(1) }}>
                            <GridContainer>
                              <GridItem
                                xs={12}
                                direction='column'
                                justify='flex-start'
                                alignItems='flex-start'
                              >
                                <FastField
                                  name={`${_prefix}isNoSpec`}
                                  render={(args) => {
                                    return (
                                      <Checkbox
                                        label='No Specs'
                                        onChange={(e) => {
                                          if (e.target.value === true) {
                                            args.form.setFieldValue(
                                              `${_prefix}specsAge`,
                                              '',
                                            )
                                            args.form.setFieldValue(
                                              `${_prefix}specSphereOD`,
                                              '',
                                            )
                                            args.form.setFieldValue(
                                              `${_prefix}specCylinderOS`,
                                              '',
                                            )
                                            args.form.setFieldValue(
                                              `${_prefix}specCylinderOD`,
                                              '',
                                            )
                                            args.form.setFieldValue(
                                              `${_prefix}specAxisOD`,
                                              '',
                                            )
                                            args.form.setFieldValue(
                                              `${_prefix}specAxisOS`,
                                              '',
                                            )
                                            args.form.setFieldValue(
                                              `${_prefix}specVaOS`,
                                              '',
                                            )
                                            args.form.setFieldValue(
                                              `${_prefix}specSphereOS`,
                                              '',
                                            )
                                            args.form.setFieldValue(
                                              `${_prefix}specVaOD`,
                                              '',
                                            )
                                          }
                                        }}
                                        {...args}
                                      />
                                    )
                                  }}
                                />
                                <TextField value='Specs Rx' text />
                                <Field
                                  name={`${_prefix}specsAge`}
                                  render={(args) => {
                                    return (
                                      <TextField
                                        extraClasses={{
                                          root: classes.inputSpecs,
                                        }}
                                        prefix='Specs Age'
                                        suffix='yrs'
                                        simple
                                        {...noSpecsCfg}
                                        {...args}
                                      />
                                    )
                                  }}
                                />
                              </GridItem>
                            </GridContainer>
                          </td>
                          <td>
                            <GridContainer gutter={0}>
                              <GridItem xs={3}>
                                <Field
                                  name={`${_prefix}specSphereOD`}
                                  render={(args) => {
                                    return (
                                      <TextField
                                        suffix='/'
                                        {...cfg}
                                        {...noSpecsCfg}
                                        {...args}
                                      />
                                    )
                                  }}
                                />
                              </GridItem>
                              <GridItem xs={3}>
                                <Field
                                  name={`${_prefix}specCylinderOD`}
                                  render={(args) => {
                                    return (
                                      <TextField
                                        suffix='X'
                                        {...cfg}
                                        {...noSpecsCfg}
                                        {...args}
                                      />
                                    )
                                  }}
                                />
                              </GridItem>
                              <GridItem xs={3}>
                                <Field
                                  name={`${_prefix}specAxisOD`}
                                  render={(args) => {
                                    return (
                                      <TextField
                                        suffix='('
                                        {...cfg}
                                        {...noSpecsCfg}
                                        {...args}
                                      />
                                    )
                                  }}
                                />
                              </GridItem>
                              <GridItem xs={3}>
                                <Field
                                  name={`${_prefix}specVaOD`}
                                  render={(args) => {
                                    return (
                                      <TextField
                                        suffix=')'
                                        {...cfg}
                                        {...noSpecsCfg}
                                        {...args}
                                      />
                                    )
                                  }}
                                />
                              </GridItem>
                            </GridContainer>
                          </td>
                          <td>
                            <GridContainer gutter={0}>
                              <GridItem xs={3}>
                                <Field
                                  name={`${_prefix}specSphereOS`}
                                  render={(args) => {
                                    return (
                                      <TextField
                                        suffix='/'
                                        {...cfg}
                                        {...noSpecsCfg}
                                        {...args}
                                      />
                                    )
                                  }}
                                />
                              </GridItem>
                              <GridItem xs={3}>
                                <Field
                                  name={`${_prefix}specCylinderOS`}
                                  render={(args) => {
                                    return (
                                      <TextField
                                        suffix='X'
                                        {...cfg}
                                        {...noSpecsCfg}
                                        {...args}
                                      />
                                    )
                                  }}
                                />
                              </GridItem>
                              <GridItem xs={3}>
                                <Field
                                  name={`${_prefix}specAxisOS`}
                                  render={(args) => {
                                    return (
                                      <TextField
                                        suffix='('
                                        {...cfg}
                                        {...noSpecsCfg}
                                        {...args}
                                      />
                                    )
                                  }}
                                />
                              </GridItem>
                              <GridItem xs={3}>
                                <Field
                                  name={`${_prefix}specVaOS`}
                                  render={(args) => {
                                    return (
                                      <TextField
                                        suffix=')'
                                        {...cfg}
                                        {...noSpecsCfg}
                                        {...args}
                                      />
                                    )
                                  }}
                                />
                              </GridItem>
                            </GridContainer>
                          </td>
                        </tr>
                      </table>
                      <GridContainer
                        gutter={0}
                        style={{ marginTop: theme.spacing(1) }}
                      >
                        <GridItem xs={12}>
                          <FastField
                            name={`${_prefix}remark`}
                            render={(args) => {
                              return (
                                <OutlinedTextField
                                  label='Remarks'
                                  rows={3}
                                  multiline
                                  {...args}
                                />
                              )
                            }}
                          />
                        </GridItem>
                      </GridContainer>
                    </React.Fragment>
                  )
                })}
              </div>
            )
          }}
        />
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Form)
