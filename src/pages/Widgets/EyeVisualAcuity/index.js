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
import Attachment from './Attachment'
import Form from './Form'

class EyeVisualAcuity extends Component {
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
    return (
      <div style={{ minWidth: 700 }}>
        <Form />
        <Attachment />
      </div>
    )
  }
}

export default EyeVisualAcuity
