import React, { Component, PureComponent } from 'react'
import { connect } from 'dva'
import classnames from 'classnames'
import { withFormik, Formik, Form, Field, FastField, FieldArray } from 'formik'
import Yup from '@/utils/yup'
import { orderTypes } from '@/utils/codes'
import { Divider, CircularProgress, Paper, withStyles } from '@material-ui/core'

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

import Medication from './Medication'
// import Memo from './Memo'
// import MedicalCertificate from './MedicalCertificate'
// import CertificateAttendance from './CertificateAttendance'
// import Others from './Others'

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
  detail: {
    margin: `${theme.spacing(1)}px 0px`,
    border: '1px solid #ccc',
    borderRadius: 3,
    padding: `${theme.spacing(1)}px 0px`,
  },
  footer: {
    textAlign: 'right',
    padding: theme.spacing(1),
    paddingBottom: 0,
  },
})

@connect(({ orders }) => ({
  orders,
}))
@withFormik({
  mapPropsToValues: ({ orders }) => {
    // console.log(diagnosis)
    return orders.default
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

    // 3->MC

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
  displayName: 'Details',
})
class Details extends PureComponent {
  toggleModal = () => {
    const { orders } = this.props
    const { showModal } = orders

    this.props.dispatch({
      type: 'orders/updateState',
      payload: {
        showModal: !showModal,
      },
    })
  }

  render () {
    const { props } = this
    const { theme, classes, orders, values, rowHeight, footer } = props
    console.log(props)
    const cfg = props
    const { type } = values
    console.log(type)
    return (
      <div>
        <div className={classes.detail}>
          <GridContainer>
            <GridItem xs={6}>
              <FastField
                name='type'
                render={(args) => {
                  return (
                    <Select
                      label='Type'
                      options={orderTypes}
                      allowClear={false}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
          </GridContainer>
          <div style={{ marginBottom: theme.spacing(1) }}>
            {type === '1' && <Medication {...cfg} />}
            {/* {type === '2' && <Memo {...cfg} />}
          {type === '3' && <MedicalCertificate {...cfg} />}
          {type === '4' && <CertificateAttendance {...cfg} />}
          {type === '5' && <Others {...cfg} />} */}
          </div>

          <Divider />
          <div className={classnames(classes.footer)}>
            <Button link style={{ float: 'left' }}>
              $ Adjustment
            </Button>
            <Button color='danger'>Cancel</Button>

            <Button color='primary'>Save</Button>
          </div>
        </div>
      </div>
    )
  }
}
export default withStyles(styles, { withTheme: true })(Details)
