import React, { PureComponent } from 'react'
import Yup from '@/utils/yup'
import { connect } from 'dva'
import { FastField } from 'formik'

import { withStyles, Divider } from '@material-ui/core'
import basicStyle from 'mui-pro-jss/material-dashboard-pro-react/layouts/basicLayout'
import { Add } from '@material-ui/icons'
import {
  GridContainer,
  GridItem,
  CardContainer,
  TextField,
  Button,
  CommonTableGrid,
  DatePicker,
  NumberInput,
  CodeSelect,
  withFormikExtend,
  FieldArray,
  notification,
  Field,
  Select,
} from '@/components'
import { DoctorLabel } from '@/components/_medisys'
import Address from '@/pages/PatientDatabase/Detail/Demographics/Address'

const styles = (theme) => ({
  ...basicStyle(theme),
})

@connect(({ clinicInfo }) => ({
  clinicInfo,
}))
@withFormikExtend({
  enableReinitialize: true,
  mapPropsToValues: ({ clinicInfo }) => {
    return clinicInfo
  },
  // validationSchema: Yup.object().shape({
  //   clinicName: Yup.string().required(),
  //   contact: Yup.object().shape({
  //     contactAddress: Yup.array().of(
  //       Yup.object().shape({
  //         postcode: Yup.number().required(),
  //         countryFK: Yup.string().required(),
  //       }),
  //     ),
  //   }),
  // }),

  handleSubmit: (values, { props }) => {
    const { dispatch, onConfirm, history } = props
    const { contact } = values
    console.log('values', values)
    dispatch({
      type: 'clinicInfo/upsert',
      payload: {
        ...values,
        contact: {
          ...contact,
          contactAddress: [
            contact.contactAddress[0],
          ],
        },
      },
    }).then((r) => {
      console.log('r', r)
      if (r && r.id) {
        notification.success({ message: 'Saved' })
        history.push('/setting')
        dispatch({
          type: 'clinicInfo/query',
          payload: 'Tenant_000',
          // payload: localStorage.getItem('clinicCode'),
        })
      }
    })
  },
  displayName: 'ClinicInfo',
})
class ClinicInfo extends PureComponent {
  state = {
    doctorProfile: [],
    primaryClinician: [],
  }

  componentDidMount () {
    this.props.dispatch({
      type: 'clinicInfo/query',
      payload: 'Tenant_000',
      // payload: localStorage.getItem('clinicCode'),
    })

    this.props
      .dispatch({
        type: 'codetable/fetchCodes',
        payload: 'doctorProfile',
      })
      .then((v) => {
        this.setState({ doctorProfile: v })
        const clinicianOptions = v.map((o) => {
          return {
            value: o.id,
            name: o.clinicianProfile.name,
          }
        })
        this.setState({ primaryClinician: clinicianOptions })
      })
  }

  render () {
    const {
      classes,
      clinicInfo,
      dispatch,
      theme,
      handleSubmit,
      values,
      setFieldValue,
      ...restProps
    } = this.props
    const { primaryClinician, doctorProfile } = this.state
    console.log(values)
    return (
      <CardContainer hideHeader>
        <GridContainer>
          <GridItem md={6}>
            <FastField
              name='clinicName'
              render={(args) => <TextField label='Clinic Name' {...args} />}
            />
          </GridItem>
          <GridItem md={3}>
            <FastField
              name='clinicId'
              render={(args) => (
                <TextField label='Clinic ID (HCI Code)' disabled {...args} />
              )}
              disabled
            />
          </GridItem>
          <GridItem md={3}>
            <FastField
              name='hospitalCode'
              render={(args) => (
                <TextField label='Hospital Code' disabled {...args} />
              )}
              disabled
            />
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem md={6}>
            <Field
              name='primaryRegisteredDoctorFK'
              render={(args) => (
                <Select
                  {...args}
                  label='Primary Clinician'
                  options={primaryClinician}
                  onChange={(option) =>
                    setFieldValue(
                      'primaryMCRNO',
                      doctorProfile.find((o) => o.id === option).doctorMCRNo,
                    )}
                />
              )}
            />
            {/* <Field
              name='primaryRegisteredDoctorFK'
              render={(args) => (
                <CodeSelect
                  {...args}
                  allowClear
                  label='Primary Clinician'
                  code='doctorprofile'
                  labelField='clinicianProfile.name'
                  valueField='clinicianProfile.userProfileFK'
                  onChange={(e) => console.log('e', e)}
                  // renderDropdown={(option) => <DoctorLabel doctor={option} />}
                />
              )}
            /> */}
          </GridItem>
          <GridItem md={3}>
            <Field
              name='primaryMCRNO'
              render={(args) => (
                <TextField
                  label='Primary Clinician MCR Number'
                  disabled
                  {...args}
                />
              )}
            />
          </GridItem>
        </GridContainer>
        <div
          style={{
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
            marginTop: theme.spacing(3),
          }}
        >
          {/* <h5>Address</h5>
          <Divider /> */}
        </div>
        <GridContainer>
          <GridItem xs={12}>
            <FieldArray
              name='contact.contactAddress'
              render={(arrayHelpers) => {
                // this.arrayHelpers = arrayHelpers
                // if (!values || !values.contact) return null
                return (
                  <div>
                    {/* {values.contact.contactAddress.map((val, i) => {
                      return ( */}
                    <Address
                      // key={val.id}
                      addressIndex={0}
                      theme={theme}
                      arrayHelpers={arrayHelpers}
                      propName='contact.contactAddress'
                      style={{
                        padding: theme.spacing.unit,
                        marginTop: theme.spacing.unit,
                        marginBottom: theme.spacing.unit,
                      }}
                      classes={classes}
                      values={values}
                      handleSubmit={handleSubmit}
                      setFieldValue={setFieldValue}
                      {...restProps}
                    />
                    {/* ) */}
                    {/* })} */}
                  </div>
                )
              }}
            />
          </GridItem>
          {/* <GridItem xs={12}>
            <Button
              link
              href=''
              key='addAddress'
              aria-label='Reset'
              color='danger'
              onClick={this.addAddress}
            >
              <Add />
              Add Address
            </Button>
          </GridItem> */}
        </GridContainer>
        {/* <Address propName='address' {...this.props} /> */}
        <div className={classes.actionBtn}>
          <Button
            color='danger'
            onClick={() => {
              this.props.history.push('/setting')
            }}
          >
            Cancel
          </Button>

          <Button color='primary' onClick={handleSubmit}>
            Save
          </Button>
        </div>
      </CardContainer>
    )
  }
}

export default withStyles(styles, { withTheme: true })(ClinicInfo)
