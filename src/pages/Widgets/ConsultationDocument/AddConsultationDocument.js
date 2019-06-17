import React, { Component, PureComponent } from 'react'
import { connect } from 'dva'
import { withFormik, Formik, Form, Field, FastField, FieldArray } from 'formik'
import Yup from '@/utils/yup'
import withStyles from '@material-ui/core/styles/withStyles'

import {
  Button,
  CommonHeader,
  CommonModal,
  NavPills,
  PictureUpload,
  GridContainer,
  GridItem,
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
  SizeContainer,
  RichEditor,
} from '@/components'

import ReferralLetter from './ReferralLetter'
import Memo from './Memo'
import MedicalCertificate from './MedicalCertificate'
import CertificateAttendance from './CertificateAttendance'

const styles = (theme) => ({
  editor: {
    marginTop: theme.spacing(1),
    position: 'relative',
  },
  editorBtn: {
    position: 'absolute',
    right: 0,
    top: 4,
  },
})
const types = [
  {
    value: '1',
    name: 'Referral Letter',
  },
  {
    value: '2',
    name: 'Memo',
  },
  {
    value: '3',
    name: 'Medical Certificate',
  },
  {
    value: '4',
    name: 'Certificate of Attendance',
  },
  {
    value: '5',
    name: 'Others',
  },
]
@connect(({ consultationDocument }) => ({
  consultationDocument,
}))
@withFormik({
  mapPropsToValues: ({ consultationDocument }) => {
    // console.log(diagnosis)
    return consultationDocument.default
  },
  validationSchema: Yup.object().shape({
    type: Yup.string().required(),
    to: Yup.string().when('type', {
      is: (val) => val !== '2',
      then: Yup.string().required(),
    }),
    from: Yup.string().required(),
    date: Yup.date().required(),
    subject: Yup.string().required(),

    //3->MC

    days: Yup.number().when('type', {
      is: (val) => val === '3',
      then: Yup.number().required(),
    }),
    fromto: Yup.array().when('type', {
      is: (val) => val === '3',
      then: Yup.array().of(Yup.date().min(2)).required(),
    }),
  }),

  handleSubmit: () => {},
  displayName: 'AddConsultationDocument',
})
class AddConsultationDocument extends PureComponent {
  toggleModal = () => {
    const { consultationDocument } = this.props
    const { showModal } = consultationDocument

    this.props.dispatch({
      type: 'consultationDocument/updateState',
      payload: {
        showModal: !showModal,
      },
    })
  }

  render () {
    const { props } = this
    const {
      theme,
      classes,
      consultationDocument,
      values,
      rowHeight,
      footer,
    } = props
    console.log(props)
    const cfg = props
    const { type } = values
    console.log(type)
    return (
      <div>
        <div style={{ margin: theme.spacing(1) }}>
          <GridContainer>
            <GridItem xs={6}>
              <FastField
                name='type'
                render={(args) => {
                  return (
                    <Select
                      label='Type'
                      options={types}
                      allowClear={false}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
          </GridContainer>
          {type === '1' && <ReferralLetter {...cfg} />}
          {type === '2' && <Memo {...cfg} />}
          {type === '3' && <MedicalCertificate {...cfg} />}
          {type === '4' && <CertificateAttendance {...cfg} />}
        </div>
        {footer &&
          footer({
            onConfirm: props.handleSubmit,
            confirmBtnText: 'Save',
            confirmProps: {
              disabled: false,
            },
          })}
      </div>
    )
  }
}
export default withStyles(styles, { withTheme: true })((props) => (
  <SizeContainer size='md'>
    {(extraProps) => {
      return <AddConsultationDocument {...props} {...extraProps} />
    }}
  </SizeContainer>
))
