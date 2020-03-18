import React, { Component } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import { connect } from 'dva'
import { withStyles, Divider, Paper } from '@material-ui/core'
import { AttachmentWithThumbnail } from '@/components/_medisys'

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

@connect(({ visualAcuity }) => ({
  visualAcuity,
}))
@withFormikExtend({
  mapPropsToValues: ({ visualAcuity, ps }) => {
    // console.log(visualAcuity, ps)
    return visualAcuity.entity ? visualAcuity.entity : visualAcuity.default
  },
  validationSchema: Yup.object().shape({
    name: Yup.string().required(),
    dob: Yup.date().required(),
    patientAccountNo: Yup.string().required(),
    genderFK: Yup.string().required(),
    dialect: Yup.string().required(),
    contact: Yup.object().shape({
      contactAddress: Yup.array().of(
        Yup.object().shape({
          postcode: Yup.number().required(),
          countryFK: Yup.string().required(),
        }),
      ),
    }),
  }),

  handleSubmit: () => {},
  displayName: 'EyeVisualAcuity',
})
class Form extends Component {
  handleUpdateAttachments = ({ added, deleted }) => {
    console.log(added, deleted)
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

  render () {
    const { state, props } = this
    const { theme, classes, values, ...restProps } = props
    const cfg = {
      extraClasses: {
        root: classes.inputRoot,
      },
      simple: true,
    }
    return (
      <div style={{ minWidth: 700 }}>
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
                    name='type'
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
                    name='name'
                    render={(args) => {
                      return <Checkbox label='Own Specs' {...args} />
                    }}
                  />
                  <div style={{ position: 'relative' }}>
                    <FastField
                      name='description'
                      render={(args) => {
                        return <Checkbox label='Refraction On' {...args} />
                      }}
                    />
                    <FastField
                      name='description2'
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
                    name='nearVADsOD'
                    render={(args) => {
                      return <TextField suffix='/N' {...cfg} {...args} />
                    }}
                  />
                </GridItem>
                <GridItem xs={3}>
                  <FastField
                    name='nearVANOD'
                    render={(args) => {
                      return <TextField suffix='@' {...cfg} {...args} />
                    }}
                  />
                </GridItem>
                <GridItem xs={3}>
                  <FastField
                    name='nearVAcmOD'
                    render={(args) => {
                      return <TextField suffix='cm' {...cfg} {...args} />
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
                    name='nearVADsOS'
                    render={(args) => {
                      return <TextField suffix='/N' {...cfg} {...args} />
                    }}
                  />
                </GridItem>
                <GridItem xs={3}>
                  <FastField
                    name='nearVANOS'
                    render={(args) => {
                      return <TextField suffix='@' {...cfg} {...args} />
                    }}
                  />
                </GridItem>
                <GridItem xs={3}>
                  <FastField
                    name='nearVAcmOS'
                    render={(args) => {
                      return <TextField suffix='cm' {...cfg} {...args} />
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
                    name='isNoSpec'
                    render={(args) => {
                      return <Checkbox label='No Specs' {...args} />
                    }}
                  />
                  <TextField value='Specs Rx' text />
                  <FastField
                    name='specsAge'
                    render={(args) => {
                      return (
                        <TextField
                          extraClasses={{ root: classes.inputSpecs }}
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
                    name='specSphereOD'
                    render={(args) => {
                      return <TextField suffix='/' {...cfg} {...args} />
                    }}
                  />
                </GridItem>
                <GridItem xs={3}>
                  <FastField
                    name='specCylinderOD'
                    render={(args) => {
                      return <TextField suffix='X' {...cfg} {...args} />
                    }}
                  />
                </GridItem>
                <GridItem xs={3}>
                  <FastField
                    name='specAxisOD'
                    render={(args) => {
                      return <TextField suffix='(' {...cfg} {...args} />
                    }}
                  />
                </GridItem>
                <GridItem xs={3}>
                  <FastField
                    name='specVaOD'
                    render={(args) => {
                      return <TextField suffix=')' {...cfg} {...args} />
                    }}
                  />
                </GridItem>
              </GridContainer>
            </td>
            <td>
              <GridContainer gutter={0}>
                <GridItem xs={3}>
                  <FastField
                    name='specSphereOS'
                    render={(args) => {
                      return <TextField suffix='/' {...cfg} {...args} />
                    }}
                  />
                </GridItem>
                <GridItem xs={3}>
                  <FastField
                    name='specCylinderOS'
                    render={(args) => {
                      return <TextField suffix='X' {...cfg} {...args} />
                    }}
                  />
                </GridItem>
                <GridItem xs={3}>
                  <FastField
                    name='specAxisOS'
                    render={(args) => {
                      return <TextField suffix='(' {...cfg} {...args} />
                    }}
                  />
                </GridItem>
                <GridItem xs={3}>
                  <FastField
                    name='specVaOS'
                    render={(args) => {
                      return <TextField suffix=')' {...cfg} {...args} />
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
              name='chiefComplain'
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
              name='remark'
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
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Form)
