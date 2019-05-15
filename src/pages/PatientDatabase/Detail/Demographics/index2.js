import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { withFormik, FastField } from 'formik'
import * as Yup from 'yup'
import { Clear, Add, Remove } from '@material-ui/icons'
import { withStyles, Paper } from '@material-ui/core'
import { standardRowHeight } from 'mui-pro-jss'

import Address from './Address'

import {
  Button,
  GridContainer,
  GridItem,
  TextField,
  notification,
  Select,
  DatePicker,
  RadioGroup,
  ProgressButton,
  CardContainer,
} from '@/components'

import model from '../models/demographic'
import {
  titles,
  finTypes,
  gender,
  maritalStatus,
  nationality,
  race,
  religion,
  language,
  preferredContactMode,
} from '@/utils/codes'

window.g_app.replaceModel(model)

const styles = () => ({
  btnContainer: {
    lineHeight: standardRowHeight,
    textAlign: 'right',
  },
  collectPaymentBtn: { float: 'right', marginTop: '22px', marginRight: '10px' },
})

@connect(({ demographic, global }) => ({
  demographic, global,
}))

@withFormik({
  enableReinitialize: true,
  mapPropsToValues: ({ demographic }) => {
    return { ...demographic.entity.items[0] }
  },
  mapPropsToStatus: ({ showPatientInfoPanel }) => {
    return { showPatientInfoPanel }
  },
  validationSchema: Yup.object().shape({
    accountType: Yup.string().required('Required'),
    accountNo: Yup.string().required('Required'),
    title: Yup.string().required('Required'),
    fullName: Yup.string().required('Required'),
    mobile: Yup.string().required('Required'),
  }),
  handleSubmit: (values, { props }) => {
    const { showPatientInfoPanel } = props.global
    const { props: { historyProps } } = props

    props
      .dispatch({
        type: 'demographic/submit',
        payload: values,
      })
      .then((r) => {
        if (r.message === 'Ok') {
          notification.success({
            message: 'Done',
          })
          if (props.onConfirm) props.onConfirm()

          if (showPatientInfoPanel === true) {
            props.dispatch({
              type: 'patient/updateAppState',
              payload: {
                showPatientInfoPanel: false,
              },
            })
          } else {
            historyProps.push('/patientdb/search')
          }
        }
      })
  },
  displayName: 'Demographic',
})

class Demographic extends PureComponent {
  state = {
    displayMoreAddress: false,
  }

  addressTypeHandler = () => {
    const { displayMoreAddress } = this.state
    this.setState({ displayMoreAddress: !displayMoreAddress })
  }

  render () {
    const { props, state, addressTypeHandler } = this
    const { theme, classes } = props
    const { displayMoreAddress } = state
    const marginBottom = { marginBottom: 10 }

    return (
      <CardContainer title='Demographic'>
        <GridContainer gutter={0} style={marginBottom}>
          <GridItem xs={12} md={5}>
            <GridContainer>
              <GridItem xs={6} md={4}>
                <FastField
                  name='accountType'
                  render={args => <Select label='Account Type' options={finTypes} {...args} />}
                />
              </GridItem>
              <GridItem xs={6} md={8}>
                <FastField
                  name='accountNo'
                  render={args => <TextField label='Account No.' {...args} />}
                />
              </GridItem>
              <GridItem xs={6} md={4}>
                <FastField
                  name='title'
                  render={args => <Select label='Title' options={titles} {...args} />}
                />
              </GridItem>
              <GridItem xs={6} md={8}>
                <FastField
                  name='fullName'
                  render={args => <TextField label='Full Name' {...args} />}
                />
              </GridItem>
              <GridItem xs={6}>
                <FastField
                  name='birthday'
                  render={args => <DatePicker label='Date of Birth' {...args} />}
                />
              </GridItem>
              <GridItem xs={6}>
                <FastField
                  name='gender'
                  render={args => <Select label='Gender' options={gender} {...args} />}
                />
              </GridItem>
              <GridItem xs={6}>
                <FastField
                  name='maritialStatus'
                  render={args => <Select label='Maritial Status' options={maritalStatus} {...args} />}
                />
              </GridItem>
              <GridItem xs={6}>
                <FastField
                  name='nationality'
                  render={args => <Select label='Nationality' options={nationality} {...args} />}
                />
              </GridItem>
              <GridItem xs={6}>
                <FastField
                  name='race'
                  render={args => <Select label='Race' options={race} {...args} />}
                />
              </GridItem>
              <GridItem xs={6}>
                <FastField
                  name='religion'
                  render={args => <Select label='Religion' options={religion} {...args} />}
                />
              </GridItem>
              <GridItem xs={6}>
                <FastField
                  name='language'
                  render={args => <Select label='Language' options={language} {...args} />}
                />
              </GridItem>
              <GridItem xs={6}>
                <FastField
                  name='dialect'
                  render={args => <TextField label='Dialect' {...args} />}
                />
              </GridItem>
              <GridItem xs={12}>
                <FastField
                  name='occupation'
                  render={args => <TextField label='Occupation' {...args} />}
                />
              </GridItem>
            </GridContainer>
          </GridItem>
          <GridItem xs={12} md={2} />
          <GridItem xs={12} md={5}>
            <GridContainer>
              <GridItem xs={4}>
                <FastField
                  name='mobile'
                  render={args => <TextField label='Mobile' {...args} />}
                />
              </GridItem>
              <GridItem xs={4}>
                <FastField
                  name='home'
                  render={args => <TextField label='Home' {...args} />}
                />
              </GridItem>
              <GridItem xs={4}>
                <FastField
                  name='office'
                  render={args => <TextField label='Office' {...args} />}
                />
              </GridItem>
              <GridItem xs={6}>
                <FastField
                  name='fax'
                  render={args => <TextField label='Fax' {...args} />}
                />
              </GridItem>
              <GridItem xs={6}>
                <FastField
                  name='email'
                  render={args => <TextField label='Email' {...args} />}
                />
              </GridItem>
              <GridItem xs={12}>
                <FastField
                  name='preferredContactMode'
                  render={args => <Select label='Preferred Contact Mode' options={preferredContactMode} {...args} />}
                />
              </GridItem>
              <GridItem xs={12}>
                <FastField
                  name='referral'
                  render={args => (
                    <RadioGroup
                      prefix='Referral'
                      label=' '
                      options={[
                        {
                          value: '1',
                          label: 'Company',
                        },
                        {
                          value: '2',
                          label: 'Patient',
                        },
                      ]}
                      {...args}
                    />
                  )}
                />
              </GridItem>
              <GridItem xs={12}>
                <FastField
                  name='remarks'
                  render={args => (<TextField label='Remarks' multiline rowsMax={6} {...args} />)}
                />
              </GridItem>
            </GridContainer>
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={12} style={marginBottom}>
            <Paper style={marginBottom}>
              <Address
                address='address1'
                formikProps={props}
                classes={classes}
              />
            </Paper>
            {displayMoreAddress ? (
              <Paper style={marginBottom}>
                <Address
                  address='address2'
                  formikProps={props}
                  classes={classes}
                />
              </Paper>
            ) : null}
          </GridItem>
        </GridContainer>
        <div
          style={{
            position: 'relative',
            textAlign: 'center',
            marginTop: theme.spacing.unit,
          }}
        >
          <Button
            key='reset'
            color='danger'
            style={{ left: 0, position: 'absolute' }}
            onClick={() => this.props.resetForm()}
          >
            <Clear />
            Reset
          </Button>
          <ProgressButton onClick={props.handleSubmit} />
          <Button
            key='addAddress'
            color='primary'
            onClick={addressTypeHandler}
            style={{ right: 0, position: 'absolute' }}
          >
            {displayMoreAddress
              ? (<div><Remove />Remove Address</div>)
              : (<div><Add />Add Address</div>)}
          </Button>
        </div>
      </CardContainer>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Demographic)
