import React, { Component, PureComponent, useState } from 'react'
import { withFormik, Formik, Form, Field, FastField, FieldArray } from 'formik'
import { connect } from 'dva'
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
  Checkbox,
  Popover,
  Switch,
  NumberInput,
} from '@/components'
import { Attachment } from '@/components/_medisys'
import { withStyles, Divider, Paper } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'

const styles = (theme) => ({})

class UploadAttachment extends PureComponent {
  render () {
    const {
      theme,
      footer,
      values,
      attachments,
      updateAttachments,
      ...props
    } = this.props

    return (
      <div>
        <div style={{ margin: theme.spacing(1) }}>
          <FastField
            name='corAttachment'
            render={(args) => {
              // console.log(args)
              return (
                <Attachment
                  attachmentType='ClinicalNotes'
                  filterTypes={[
                    'ClinicalNotes',
                    'Visit',
                  ]}
                  handleUpdateAttachments={updateAttachments(args)}
                  attachments={args.field.value}
                  // isReadOnly={isReadOnly}
                />
              )
            }}
          />
        </div>
        {footer &&
          footer({
            onConfirm: props.handleSubmit,
            confirmProps: {
              disabled: false,
            },
          })}
      </div>
    )
  }
}
export default withStyles(styles, { withTheme: true })(UploadAttachment)
