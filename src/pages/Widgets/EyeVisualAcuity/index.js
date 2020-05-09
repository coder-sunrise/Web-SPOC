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
  EditableTableGrid,
} from '@/components'
import Attachment from './Attachment'
import Form from './Form'

class EyeVisualAcuity extends React.PureComponent {
  render () {
    const { fromConsultation } = this.props
    return (
      <div style={{ minWidth: 700 }}>
        <Form {...this.props} />
        {!fromConsultation && <Attachment {...this.props} />}
      </div>
    )
  }
}

export default EyeVisualAcuity
