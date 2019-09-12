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
} from '@/components'

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
    console.log('ehllo', props)
    dispatch({
      type: 'clinicInfo/upsert',
      payload: {
        ...values,
        contact: undefined,
      },
    }).then((r) => {
      if (r && r.id) {
        notification.success({ message: 'Saved' })
        history.push('/setting')
      }
    })
  },
  displayName: 'ClinicInfo',
})
class ClinicInfo extends PureComponent {
  state = {}

  componentDidMount () {
    this.props.dispatch({
      type: 'clinicInfo/query',
      payload: 'Tenant_000',
      // payload: localStorage.getItem('clinicCode'),
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
      ...restProps
    } = this.props
    console.log('ads', this.props)
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
            />
          </GridItem>
          <GridItem md={3}>
            <FastField
              name='hospitalCode'
              render={(args) => (
                <TextField label='Hospital Code' disabled {...args} />
              )}
            />
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem md={6}>
            <FastField
              name='primaryRegisteredDoctorFK'
              render={(args) => (
                <CodeSelect label='Primary Clinician' code='' {...args} />
              )}
            />
          </GridItem>
          <GridItem md={3}>
            <FastField
              name='primaryMCRNO'
              render={(args) => (
                <TextField label='Primary Clinician MCR Number' {...args} />
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
          <h5>Address</h5>
          <Divider />
        </div>
        <GridContainer>
          <GridItem xs={12}>
            <FieldArray
              name='contact.contactAddress'
              render={(arrayHelpers) => {
                this.arrayHelpers = arrayHelpers
                if (!values || !values.contact) return null
                return (
                  <div>
                    {values.contact.contactAddress.map((val, i) => {
                      return (
                        <Address
                          key={val.id}
                          addressIndex={i}
                          theme={theme}
                          arrayHelpers={arrayHelpers}
                          propName='contact.contactAddress'
                          style={{
                            padding: theme.spacing.unit,
                            marginTop: theme.spacing.unit,
                            marginBottom: theme.spacing.unit,
                          }}
                          {...restProps}
                        />
                      )
                    })}
                  </div>
                )
              }}
            />
          </GridItem>
          <GridItem xs={12}>
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
          </GridItem>
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

          <Button color='danger' onClick={handleSubmit}>
            Save
          </Button>
        </div>
      </CardContainer>
    )
  }
}

export default withStyles(styles, { withTheme: true })(ClinicInfo)
