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
    paddingLeft: 10,
    paddingRight: 5,
    '&:before': {
      right: 30,
      left: 10,
    },
    '&:after': {
      right: 30,
      left: 10,
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
    const { theme, classes, rights, prefix, ...restProps } = props
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

            console.log(values)
            if (!ary || ary.length === 0) {
              const accessRight = Authorized.check(
                'queue.consultation.widgets.attachment',
              )
              if (rights === 'enable' || accessRight.rights === 'enable') {
                this.addForm()
                return null
              }
              return null
            }

            return (
              <div>
                {ary.map((val, i) => {
                  const _prefix = `${prefix}[${i}].`

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
                              >
                                <FastField
                                  name={`${_prefix}type`}
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
                                  name={`${_prefix}name`}
                                  render={(args) => {
                                    return (
                                      <Checkbox label='Own Specs' {...args} />
                                    )
                                  }}
                                />
                                <div style={{ position: 'relative' }}>
                                  <FastField
                                    name={`${_prefix}description`}
                                    render={(args) => {
                                      return (
                                        <Checkbox
                                          label='Refraction On'
                                          {...args}
                                        />
                                      )
                                    }}
                                  />
                                  <FastField
                                    name={`${_prefix}description2`}
                                    render={(args) => {
                                      return (
                                        <TextField
                                          style={{
                                            position: 'absolute',
                                            bottom: 8,
                                            left: 150,
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
                                <FastField
                                  name={`${_prefix}nearVADsOD`}
                                  render={(args) => {
                                    return (
                                      <TextField
                                        suffix='/N'
                                        {...cfg}
                                        {...args}
                                      />
                                    )
                                  }}
                                />
                              </GridItem>
                              <GridItem xs={3}>
                                <FastField
                                  name={`${_prefix}nearVANOD`}
                                  render={(args) => {
                                    return (
                                      <TextField
                                        suffix='@'
                                        {...cfg}
                                        {...args}
                                      />
                                    )
                                  }}
                                />
                              </GridItem>
                              <GridItem xs={3}>
                                <FastField
                                  name={`${_prefix}nearVAcmOD`}
                                  render={(args) => {
                                    return (
                                      <TextField
                                        suffix='cm'
                                        {...cfg}
                                        {...args}
                                      />
                                    )
                                  }}
                                />
                              </GridItem>
                              <GridItem xs={3} />
                            </GridContainer>
                          </td>
                          <td>
                            <GridContainer gutter={0}>
                              <GridItem xs={3}>
                                <FastField
                                  name={`${_prefix}nearVADsOS`}
                                  render={(args) => {
                                    return (
                                      <TextField
                                        suffix='/N'
                                        {...cfg}
                                        {...args}
                                      />
                                    )
                                  }}
                                />
                              </GridItem>
                              <GridItem xs={3}>
                                <FastField
                                  name={`${_prefix}nearVANOS`}
                                  render={(args) => {
                                    return (
                                      <TextField
                                        suffix='@'
                                        {...cfg}
                                        {...args}
                                      />
                                    )
                                  }}
                                />
                              </GridItem>
                              <GridItem xs={3}>
                                <FastField
                                  name={`${_prefix}nearVAcmOS`}
                                  render={(args) => {
                                    return (
                                      <TextField
                                        suffix='cm'
                                        {...cfg}
                                        {...args}
                                      />
                                    )
                                  }}
                                />
                              </GridItem>
                              <GridItem xs={3} />
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
                                      <Checkbox label='No Specs' {...args} />
                                    )
                                  }}
                                />
                                <TextField value='Specs Rx' text />
                                <FastField
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
                                <FastField
                                  name={`${_prefix}specSphereOD`}
                                  render={(args) => {
                                    return (
                                      <TextField
                                        suffix='/'
                                        {...cfg}
                                        {...args}
                                      />
                                    )
                                  }}
                                />
                              </GridItem>
                              <GridItem xs={3}>
                                <FastField
                                  name={`${_prefix}specCylinderOD`}
                                  render={(args) => {
                                    return (
                                      <TextField
                                        suffix='X'
                                        {...cfg}
                                        {...args}
                                      />
                                    )
                                  }}
                                />
                              </GridItem>
                              <GridItem xs={3}>
                                <FastField
                                  name={`${_prefix}specAxisOD`}
                                  render={(args) => {
                                    return (
                                      <TextField
                                        suffix='('
                                        {...cfg}
                                        {...args}
                                      />
                                    )
                                  }}
                                />
                              </GridItem>
                              <GridItem xs={3}>
                                <FastField
                                  name={`${_prefix}specVaOD`}
                                  render={(args) => {
                                    return (
                                      <TextField
                                        suffix=')'
                                        {...cfg}
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
                                <FastField
                                  name={`${_prefix}specSphereOS`}
                                  render={(args) => {
                                    return (
                                      <TextField
                                        suffix='/'
                                        {...cfg}
                                        {...args}
                                      />
                                    )
                                  }}
                                />
                              </GridItem>
                              <GridItem xs={3}>
                                <FastField
                                  name={`${_prefix}specCylinderOS`}
                                  render={(args) => {
                                    return (
                                      <TextField
                                        suffix='X'
                                        {...cfg}
                                        {...args}
                                      />
                                    )
                                  }}
                                />
                              </GridItem>
                              <GridItem xs={3}>
                                <FastField
                                  name={`${_prefix}specAxisOS`}
                                  render={(args) => {
                                    return (
                                      <TextField
                                        suffix='('
                                        {...cfg}
                                        {...args}
                                      />
                                    )
                                  }}
                                />
                              </GridItem>
                              <GridItem xs={3}>
                                <FastField
                                  name={`${_prefix}specVaOS`}
                                  render={(args) => {
                                    return (
                                      <TextField
                                        suffix=')'
                                        {...cfg}
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
                      <GridContainer gutter={0}>
                        <GridItem xs={12}>
                          <FastField
                            name={`${_prefix}chiefComplain`}
                            render={(args) => {
                              return (
                                <OutlinedTextField
                                  label='Chief Complaints'
                                  rows={3}
                                  multiline
                                  {...args}
                                />
                              )
                            }}
                          />
                        </GridItem>
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
